import os

# Mapping of problematic strings to correct emojis
# Note: Using both the literal "broken" strings and potential byte sequences
REPLACEMENTS = {
    "â­ ": "⭐",
    "x ": "🏆",
    "x} ": "🎓",
    "=": "✨",
    " ": "🏆", # From Hero.tsx
    "âœ¨": "✨",
    "âž¡ï¸ ": "➡️",
    "ðŸš€": "🚀",
    "ðŸ”¥": "🔥",
}

def fix_file(file_path):
    try:
        # Read the file as binary to deal with possible encoding issues
        with open(file_path, 'rb') as f:
            raw_data = f.read()
            
        fixed_data = raw_data
        
        # We'll try to replace known byte sequences
        # â­  is often b'\xc3\xa2\xc2\xad\xc2\xa0' in some mangled states
        # but let's try string replacement first on decoded content
        try:
            content = raw_data.decode('utf-8')
            original_content = content
            
            for broken, fixed in REPLACEMENTS.items():
                if broken in content:
                    content = content.replace(broken, fixed)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed (string): {file_path}")
                return True
        except UnicodeDecodeError:
            # If UTF-8 fails, try latin-1 and then save as UTF-8
            content = raw_data.decode('latin-1')
            original_content = content
            # Add specific latin-1 patterns here if needed
            for broken, fixed in REPLACEMENTS.items():
                if broken in content:
                    content = content.replace(broken, fixed)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed (latin-1): {file_path}")
                return True
                
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
    return False

def main():
    base_dir = r"c:\Users\mahendra.singh\myark\src"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.css', '.html')):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
