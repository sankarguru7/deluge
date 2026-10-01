import unittest
import json
from unittest.mock import patch, MagicMock
from zoho_sheet_uploader import ZohoSheetUploader

class TestZohoSheetUploader(unittest.TestCase):
    def setUp(self):
        self.uploader = ZohoSheetUploader("dummy_token")

    def test_chunk_list(self):
        lst = list(range(1, 105))
        chunks = list(self.uploader.chunk_list(lst, 50))
        self.assertEqual(len(chunks), 3)
        self.assertEqual(len(chunks[0]), 50)
        self.assertEqual(len(chunks[1]), 50)
        self.assertEqual(len(chunks[2]), 4)

    def test_parse_column(self):
        self.assertEqual(self.uploader._parse_column("col_1"), 1)
        self.assertEqual(self.uploader._parse_column("col_12"), 12)
        self.assertIsNone(self.uploader._parse_column("row_index"))
        self.assertIsNone(self.uploader._parse_column("col_abc"))

    @patch('zoho_sheet_uploader.requests.post')
    def test_create_workbook(self, mock_post):
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"resource_id": "test_123"}
        mock_post.return_value = mock_resp

        res = self.uploader.create_workbook("Test")
        self.assertEqual(res["resource_id"], "test_123")
        mock_post.assert_called_once_with(
            "https://sheet.zoho.in/api/v2/create",
            headers={"Authorization": "Zoho-oauthtoken dummy_token"},
            data={"method": "workbook.create", "workbook_name": "Test"}
        )

    @patch('zoho_sheet_uploader.requests.post')
    def test_upload_data(self, mock_post):
        # We need multiple mocked responses because upload_data makes several post calls
        # 1. create_workbook
        # 2. rename_worksheet
        # 3. insert_worksheet
        # 4. set_cells_content (in chunks)

        def mock_post_side_effect(url, headers, data):
            mock_resp = MagicMock()
            if data["method"] == "workbook.create":
                mock_resp.json.return_value = {"resource_id": "test_123", "worksheet_name": "Sheet1"}
            else:
                mock_resp.json.return_value = {"status": "success"}
            return mock_resp

        mock_post.side_effect = mock_post_side_effect

        test_data = {
            "Cat 1": [
                {"row_index": 1, "col_1": "Test 1"},
                {"row_index": 2, "col_2": "Test 2", "col_3": "Test 3"}
            ],
            "Cat 2": [
                {"row_index": 5, "col_5": "Test 5"}
            ]
        }

        resource_id = self.uploader.upload_data("Test WB", test_data)

        self.assertEqual(resource_id, "test_123")
        self.assertEqual(mock_post.call_count, 5) # 1 create, 1 rename, 1 insert, 1 set (Cat1), 1 set (Cat2)

        # Verify the cell updates for Cat 1
        set_call = mock_post.call_args_list[3]
        args, kwargs = set_call
        self.assertEqual(args[0], "https://sheet.zoho.in/api/v2/test_123")
        self.assertEqual(kwargs['data']['method'], "cells.content.set")

        cells = json.loads(kwargs['data']['data'])
        self.assertEqual(len(cells), 3)
        self.assertEqual(cells[0], {"worksheet_name": "Cat 1", "content": "Test 1", "row": 1, "column": 1})
        self.assertEqual(cells[1], {"worksheet_name": "Cat 1", "content": "Test 2", "row": 2, "column": 2})

if __name__ == '__main__':
    unittest.main()
