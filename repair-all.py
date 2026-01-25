
import os
import re

def normalize_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        # Remove multiple consecutive blank lines, keep max one
        # Also remove blank lines if the file is suspiciously double spaced (every other line is blank)
        
        # Simple heuristic: if > 40% of lines are blank, condense them.
        blank_count = sum(1 for line in lines if not line.strip())
        if blank_count / len(lines) > 0.4:
            print(f"Normalizing double-spacing in {filepath}...")
            new_lines = []
            for line in lines:
                if line.strip():
                    new_lines.append(line)
            lines = new_lines
        
        return lines
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return []

def apply_replacements(lines, replacements):
    new_lines = []
    for line in lines:
        for bad, good in replacements.items():
            if bad in line:
                line = line.replace(bad, good)
        new_lines.append(line)
    return new_lines

def save_file(filepath, lines):
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"Saved repairs to {filepath}")
    except Exception as e:
        print(f"Error writing {filepath}: {e}")

# QuestMaster.tsx Replacements
qm_replacements = {
    'Miss a day, and the fire goes out! x"️': 'Miss a day, and the fire goes out! 🔥',
    'Level Up Your Real-Life RPG <': 'Level Up Your Real-Life RPG ⚔️',
    'Myark is more than a platform': 'Myark is more than a platform —',
    "it's your RPG for real-life success. <": "it's your RPG for real-life success. 🚀",
    'Collect Rare Loot x }': 'Collect Rare Loot 💎',
    'Win the game of life. x': 'Win the game of life. 🏆',
    'Unexpected character': '', # Cleanup if any error logs pasted
}

# StudentProfile.tsx Replacements
sp_replacements = {
    'title: "+50 XP x} "': 'title: "+50 XP 🎓"',
    'title: "+50 XP x"': 'title: "+50 XP 🏫"',
    'title: "+25 XP ("': 'title: "+25 XP 👤"',
    'title: "+25 XP x "': 'title: "+25 XP 🌍"',
    'title: "+75 XP <"': 'title: "+75 XP ❤️"',
    'All Complete S ': 'All Complete ✅',
    'S  Unlocked!': '🔓 Unlocked!',
    'What class are you in? x} ': 'What class are you in? 🎓',
    'Where do you study? x': 'Where do you study? 🏫',
    'How do you identify? (': 'How do you identify? 👤',
    'Where are you from? x ': 'Where are you from? 🌍',
    "What's your name? S️": "What's your name? ✍️",
    'What excites you? <': 'What excites you? ❤️',
}

# Base paths
base_dir = r"c:\Users\mahendra.singh\myark\src\components\modules"
qm_path = os.path.join(base_dir, "QuestMaster.tsx")
sp_path = os.path.join(base_dir, "StudentProfile.tsx")

# Process QuestMaster
qm_lines = normalize_file(qm_path)
qm_lines = apply_replacements(qm_lines, qm_replacements)
save_file(qm_path, qm_lines)

# Process StudentProfile
sp_lines = normalize_file(sp_path)
sp_lines = apply_replacements(sp_lines, sp_replacements)
save_file(sp_path, sp_lines)
