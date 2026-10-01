import json

jsonDataStr = """{"Uncategorized":[{"row_index":1,"col_1":"Description: HVAC Bill of Materials"},{"row_index":2,"col_1":"* This BOQ is for preliminary estimation only..."}], "VRF System":[{"row_index":7,"col_1":"1","col_2":"VRF SYSTEM - Heat pump system","col_9":"VRF System"}]}"""
jsonMap = json.loads(jsonDataStr)

colMap = {
    "1": "S. No",
    "2": "Description",
    "3": "Checklist",
    "4": "Unit ",
    "5": "QTY",
    "6": "Supply Rate",
    "7": "Installation Rate",
    "8": "Amount",
    "9": "Remarks"
}

for sheetName, sheetRows in jsonMap.items():
    rowUpdates = []
    for rowData in sheetRows:
        if "row_index" in rowData:
            rowObj = {}
            for key in rowData.keys():
                if key.startswith("col_"):
                    colIndexStr = key.replace("col_", "")
                    if colIndexStr in colMap:
                        rowObj[colMap[colIndexStr]] = str(rowData[key])
            if rowObj:
                rowUpdates.append(rowObj)

    currentChunkStr = "["
    for i, rowObj in enumerate(rowUpdates):
        if i > 0:
            currentChunkStr += ","
        rowJsonStr = "{"
        keyCount = 0
        for headerKey, val in rowObj.items():
            if keyCount > 0:
                rowJsonStr += ","
            valStr = str(val)
            valStr = valStr.replace("\\", "\\\\").replace("\n", "\\n").replace("\r", "\\r").replace("\"", "\\\"")
            rowJsonStr += f'"{headerKey}":"{valStr}"'
            keyCount += 1
        rowJsonStr += "}"
        currentChunkStr += rowJsonStr
    currentChunkStr += "]"
    print(f"Sheet {sheetName}: {currentChunkStr}")
    try:
        json.loads(currentChunkStr)
        print("Valid JSON")
    except Exception as e:
        print("INVALID JSON:", e)
