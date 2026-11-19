import urllib.request
import re

url = "https://www.q-hjv.com/static/js/main.64005f8e.chunk.js"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8', errors='ignore')

# Search for cursor or follower or mousemove
matches = re.findall(r'(\.cursor[^{]*\{[^}]*\})', content)
for m in matches:
    print(m)

# Search for mousemove logic in js
idx = content.find('cursor')
while idx != -1:
    print(content[max(0, idx-100):min(len(content), idx+300)])
    print("-" * 50)
    idx = content.find('cursor', idx+300)
    if idx > 15000: break
