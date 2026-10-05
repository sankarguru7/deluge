import json

jsonDataStr = '{"VRF System":[{"row_index":7,"col_1":"1","col_2":"VRF SYSTEM - Heat pump system","col_9":"VRF System"},{"row_index":8,"col_1":"1.1","col_2":"VRF Heat pump system...","col_9":"VRF System"}]}'
jsonMap = json.loads(jsonDataStr)

for sheetName, sheetRows in jsonMap.items():
    dataJsonStr = "["
    cellCount = 0
    for rowData in sheetRows:
        if "row_index" in rowData:
            rowIndex = rowData["row_index"]
            for colNum in range(1, 10):
                colKey = f"col_{colNum}"
                valStr = "-"
                if colKey in rowData:
                    valStr = str(rowData[colKey])

                if cellCount > 0:
                    dataJsonStr += ","

                valStr = valStr.replace("\\", "\\\\").replace("\n", "\\n").replace("\r", "\\r").replace("\"", "\\\"")
                dataJsonStr += "{\"row\":" + str(rowIndex) + ",\"column\":" + str(colNum) + ",\"worksheet_name\":\"" + sheetName + "\",\"content\":\"" + valStr + "\"}"
                cellCount += 1
    dataJsonStr += "]"

    try:
        parsed = json.loads(dataJsonStr)
        print("Valid JSON:", len(parsed), "cells")
    except Exception as e:
        print("INVALID JSON:", e)
