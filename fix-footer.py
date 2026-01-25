import os

def fix_file(file_path):
    try:
        # Read the file with a robust encoding setting
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()

        if not lines:
            return

        modified = False
        
        # Clean up line 1 from BOM or garbage
        if lines[0].startswith('\ufeff'):
            lines[0] = lines[0][1:]
            modified = True
        
        # Aggressively target the leading garbage if it exists
        # Often it looks like '\ufffd'
        if lines[0] and ord(lines[0][0]) > 127 and not lines[0].startswith('/**'):
             # If it's not a comment or valid code char, strip it
             if lines[0][0] in 'ÿ':
                 lines[0] = lines[0][1:]
                 modified = True

        # Fix Footer specific emoji if it's the footer
        if 'Footer.tsx' in file_path:
            for i in range(len(lines)):
                if 'x' in lines[i]:
                    lines[i] = lines[i].replace('x', '🐧')
                    modified = True
                if '' in lines[i] and '"use client"' in lines[i]:
                    lines[i] = lines[i].replace('', '')
                    modified = True
        
        # General clean for any residual mojibake markers
        # but be careful not to break valid code.
        # We focus on the known markers.
        for i in range(len(lines)):
            if 'x' in lines[i]: # competition marker usually
                 # We don't want to blindly guess here, but for MyArk we know the patterns
                 # Actually let's just target Footer specifically for now to be safe.
                 pass

        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print(f"Fixed: {file_path}")
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")

# Fix Footer.tsx specifically
fix_file('src/components/Footer.tsx')

# Sweep components for the leading garbage
for root, dirs, files in os.walk('src/components'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

print("Cleanup complete.")
