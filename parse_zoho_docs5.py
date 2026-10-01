import urllib.request
import json
url = "https://static.zohocdn.com/sheet/cdn_static/appsheet/apihelp/json/apiv2.b4973612fed918374ddf119d8806fa7a.json"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    print(json.dumps(data['workbook'], indent=2)[:1000])
    for item in data['workbook']:
        print(item['name'])
        print(item.get('parameters', []))

    print("\nWorksheet APIs:")
    for item in data['worksheet']:
        print(item['name'])

    print("\nTabular APIs:")
    for item in data['tabular']:
        print(item['name'])
