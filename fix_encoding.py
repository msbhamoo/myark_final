import os

file_path = r'c:\Users\mahendra.singh\myark\src\components\modules\admin\OpportunityForm.tsx'

with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Replace common broken UTF-8 sequences for Rupee symbol
# Usually ₹ becomes something like ï¿½ï¿½ if misread as Latin-1 then written as UTF-8
# Or ï¿½ if it was already broken.
import re
content = re.sub(r'ï¿½\s*ï¿½', '₹', content)
content = content.replace('ï¿½', '₹') # Generic replacement for any other broken symbols which are likely Rupees

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
