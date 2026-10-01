from bs4 import BeautifulSoup

with open('zoho_api_docs2.html', 'r') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
for method in soup.find_all('div', class_='api-method-container'):
    print(method.text)
