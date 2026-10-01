from bs4 import BeautifulSoup
import re

with open('zoho_api_docs.html', 'r') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

print(soup.find_all(string=re.compile('workbook.create', re.IGNORECASE)))
