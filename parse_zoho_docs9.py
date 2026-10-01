import urllib.request
import json
url = "https://static.zohocdn.com/sheet/cdn_static/appsheet/apihelp/json/apiv2.b4973612fed918374ddf119d8806fa7a.json"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    print("WORKSHEET APIs:")
    for api_name in data['worksheet']['sub_list']:
         print(api_name)
    print("\nCONTENT APIs:")
    for api_name in data['content']['sub_list']:
         print(api_name)
