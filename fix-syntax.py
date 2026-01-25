
import os

filepath = r"c:\Users\mahendra.singh\myark\src\components\modules\StudentProfile.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_next = False

for i, line in enumerate(lines):
    # Fix corrupted toasts - substring matching is safer
    if 'title: "+50 XP x"' in line and 'School saved' in line:
        line = line.replace('"+50 XP x"', '"+50 XP 🏫"')
    if 'title: "+25 XP x "' in line and 'City saved' in line:
        line = line.replace('"+25 XP x "', '"+25 XP 🌍"')
    
    # Remove the invalid div line in handleSaveGender
    # Context check: preceded by `const isFirstTime = !student?.gender;` ?
    # We look at the line content itself.
    if 'div className="text-xs text-success mt-1">🔓 Unlocked!</div>' in line:
        # Check context: if we are not in the badges render section (around line 800+)
        # Valid usage is deep in the file. Invalid usage is around line 406.
        if i < 600: # Heuristic: The invalid one is early in the file
             continue # Skip this line
    
    new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed syntax and strings in StudentProfile.tsx")
