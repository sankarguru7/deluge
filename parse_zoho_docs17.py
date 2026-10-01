import json

new_format = {"row_index":6,"row_details":[{"column_index":1,"content":"S. No"},{"column_index":2,"content":"Description"},{"column_index":3,"content":"Checklist"},{"column_index":4,"content":"Unit "},{"column_index":5,"content":"QTY"},{"column_index":6,"content":"Supply Rate"},{"column_index":7,"content":"Installation Rate"},{"column_index":8,"content":"Amount"},{"column_index":9,"content":"Remarks"}]}

# The tabular API wants an array of objects where keys are header names.
# So if we use `worksheet.records.add`, we provide json_data=[{"S. No": "...", "Description": "..."}, ...]

print(json.dumps(new_format))
