import os
import re

# Mapping of corrupted patterns to correct emojis/unicode escapes
REPLACEMENTS = {
    "â­ ": "⭐",
    "x ": "🏆",
    "x} ": "🎓",
    "=": "✨",
    " ": "🏆",
    "🐧": "🐧", # Ensure these are correct
    "🚀": "🚀",
    "🎮": "🎮",
    "🔥": "🔥",
    "✨": "✨",
    "âœ¨": "✨",
    "â­ ": "⭐",
    "âœ…": "✅",
    "âž¡ï¸": "➡️",
    "ðŸš€": "🚀",
    "ðŸŽ¯": "🎯",
    "ðŸ’¡": "💡",
    "ðŸ“ˆ": "📈",
    "ðŸ”¥": "🔥",
    "â³": "⏳",
    "âœ‰ï¸": "✉️",
    "ðŸ“ž": "📞",
    "ðŸ“": "📍",
}

# More robust regex-based replacements for common Mojibake
MOJIBAKE_PATTERNS = [
    (re.compile(r'â­ '), '⭐'),
    (re.compile(r'âœ¨'), '✨'),
    (re.compile(r'âœ…'), '✅'),
    (re.compile(r'ðŸš€'), '🚀'),
    (re.compile(r'ðŸ”¥'), '🔥'),
    (re.compile(r'x '), '🏆'),
    (re.compile(r'x} '), '🎓'),
    (re.compile(r' '), '🏆'),
    (re.compile(r'='), '✨'),
]

def fix_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        
        for pattern, replacement in MOJIBAKE_PATTERNS:
            content = pattern.sub(replacement, content)
            
        # Literal replacements for direct matches
        for corrupted, fixed in REPLACEMENTS.items():
            if corrupted in content:
                content = content.replace(corrupted, fixed)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {file_path}")
            return True
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
    return False

def main():
    base_dir = r"c:\Users\mahendra.singh\myark\src"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.css')):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
