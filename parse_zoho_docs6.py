import urllib.request
import json
url = "https://static.zohocdn.com/sheet/cdn_static/appsheet/apihelp/json/apiv2.b4973612fed918374ddf119d8806fa7a.json"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    print("CREATE WORKBOOK API:")
    print(json.dumps(data['workbook']['Create workbook'], indent=2))

    print("\nINSERT DATA / WORKSHEET API:")
    for api_name in data['worksheet']['sub_list']:
        if 'create' in api_name.lower() or 'insert' in api_name.lower():
            print(json.dumps(data['worksheet'][api_name], indent=2))

    for api_name in data['tabular']['sub_list']:
         print(json.dumps(data['tabular'][api_name], indent=2))

    for api_name in data['content']['sub_list']:
        if 'set' in api_name.lower():
             print(json.dumps(data['content'][api_name], indent=2))
