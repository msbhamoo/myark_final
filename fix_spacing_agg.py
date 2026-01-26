import os

file_path = r'c:\Users\mahendra.singh\myark\src\components\modules\admin\OpportunityForm.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace multiple newlines with a single newline
import re
# Handles \r\n and \n
# This will replace sequence of whitespace that includes multiple newlines with just one newline
# However, we might want to keep single blank lines for readability.
# So \n\n is okay, but \n\n\n+ is not. 
# Actually, looking at the file, it seems every line is followed by an empty line.

# Strategy: Remove all empty lines, then we can add them back where appropriate if we want.
# But for now, let's just remove all truly empty lines.
lines = text.splitlines()
fixed_lines = [line for line in lines if line.strip()]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(fixed_lines))
