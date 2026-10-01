# The user's input from the earlier issue has MORE data. Let's look at it.
import json
json_data = {"Uncategorized":[{"row_index":1,"col_1":"Description: HVAC Bill of Materials"},{"row_index":2,"col_1":"* This BOQ is for preliminary estimation only. Vendor needs to site verify the all necessary requirements for the Installation of system and Quotation needs to updated accordingly"},{"row_index":4,"col_1":"* Billing to be made as per actual installed quantities"},{"row_index":5,"col_1":"HVAC BOQ"},{"row_index":41,"col_1":"1.3","col_2":"M.S Table Top type stand for installing VRF outdoor units duly epoxy coated with vibration isolators considering Fan platform and with MS angle support with axis ladder "},{"row_index":42,"col_1":"a","col_2":"VRF set 1: System design cooling capacity 18TR unit","col_4":"Lot","col_5":"1","col_8":"0"},{"row_index":58,"col_1":"2.2","col_2":"Treated Fresh Air Unit along with Outdoor unit"},{"row_index":59,"col_2":"Supply, installation, testing and commissioning ceiling suspended Treated Fresh air unit along with Outdoor unit of following capacities. The unit shall be suitable for Indoor installation with double skin panel, filters, cooling coil, blower etc.\nUnit shall be provided with forward curved centrifugal fan connected with direct /belt driven motor. Insulated Drain pan shall be provided as part of package."},{"row_index":60,"col_2":"TFA unit shall be provided with Prefilter and Fine filter (F7)"},{"row_index":61,"col_2":"TFAU-01: \nCapacity: Supply / Fresh air Flow rate: 1200 CFM (100% Fresh Air Unit)\nSupply Air temperature: 24 Deg C\nEx. Static Pressure : 200 Pa ","col_4":"Nos.","col_5":"QRO"},{"row_index":62,"col_1":"2.3","col_2":"CASSETTE UNIT ALONG WITH OUTDOOR UNIT"},{"row_index":63,"col_2":"Supply, installation, testing and commissioning INVERTER BASED ceiling suspended 4-way type DX Cassette Indoor Units along with External condensing unit, complete in all respects.\nIndoor Units shall be provided with hangers for fixing. All Cassette Unit shall be having the provision for fresh air Intake, Minimum G2 washable filters shall be part of the unit.\nAll the cassette units shall be having motorized pump for condensate drain."},{"row_index":64,"col_2":"The SITC quote should include copper refrigerant piping (up 3m) & Control wiring (up to 3M) and earthing. Additional Refrigerant pipe shall be quoted extra in relevant sections below.\nThe unit capacities shall be selected after taking deration into account due to copper piping lengths & Ambient temperature. \nThe control cabling and power cabling between IDU to ODU to be consider as per the manufacturer recommendation. \nThe SITC quote shall Include Refrigerant Gas charge\nThe unit shall be of high EER as per latest BEE guidelines and ASHRAE 90.1 standard requirement - meeting minimum 3 star rating.\nDX Cassette units should be selected for 3-phase power supply >/ = 3 TR capacity and 1-phase supply <\/= 2 TR capacity","col_3":"1. Make: Daikin, Mitsubishi, LG, Carrier\n2. Star rating minimum 3\n3. 3 m of each Refrigeration piping (3m liquid line+3m suction line + insulation) + 3 cable cable shall be provided along with DX units\n4. power supply for < / = 2TR : 230V AC (1-phase).\npower supply for > 3TR : 415V AC (3-phase)."}],"VRF System":[{"row_index":7,"col_1":"1","col_2":"VRF SYSTEM - Heat pump system","col_9":"VRF System"}]}
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

for sheetName, sheetRows in json_data.items():
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

    try:
        json.loads(currentChunkStr)
        print(f"Sheet {sheetName}: Valid JSON")
    except Exception as e:
        print(f"Sheet {sheetName}: INVALID JSON:", e)
