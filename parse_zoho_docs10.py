import urllib.request
import json
url = "https://static.zohocdn.com/sheet/cdn_static/appsheet/apihelp/json/apiv2.b4973612fed918374ddf119d8806fa7a.json"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    print("\nAPPEND JSON DATA API:")
    print(json.dumps(data['content']['Append rows with JSON data'], indent=2))
    print("\nSET RANGE DATA API:")
    print(json.dumps(data['content']['Set content to range'], indent=2))
