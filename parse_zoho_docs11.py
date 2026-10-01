import urllib.request
import json
url = "https://static.zohocdn.com/sheet/cdn_static/appsheet/apihelp/json/apiv2.b4973612fed918374ddf119d8806fa7a.json"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    print("ALL API NAMES")
    for category in data:
        if isinstance(data[category], dict) and 'sub_list' in data[category]:
            for api_name in data[category]['sub_list']:
                 print(category, "->", api_name)
