import urllib.request
import json
url = "https://static.zohocdn.com/sheet/cdn_static/appsheet/apihelp/json/apiv2.b4973612fed918374ddf119d8806fa7a.json"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    print("\nCREATE WORKSHEET API:")
    print(json.dumps(data['worksheet']['Create worksheet'], indent=2))
    print("\nINSERT ROW API:")
    print(json.dumps(data['worksheet']['Insert row'], indent=2))
    print("\nRECORDS API:")
    print(json.dumps(data['tabular']['Add records'], indent=2))
