import urllib.request
import json

url = "https://sheet.zoho.in/help/api/v2/"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    html = response.read().decode('utf-8')
    with open('zoho_api_docs.html', 'w') as f:
        f.write(html)
