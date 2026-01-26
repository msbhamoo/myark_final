import os

file_path = r'c:\Users\mahendra.singh\myark\src\components\modules\admin\OpportunityForm.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip():
        new_lines.append(line.rstrip() + '\n')
    else:
        # Keep single empty lines if the next line is not empty
        if len(new_lines) > 0 and new_lines[-1] != '\n':
            new_lines.append('\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
