import os

file_path = r'c:\Users\mahendra.singh\myark\src\components\modules\admin\OpportunityForm.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('₹ ₹', '₹')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
