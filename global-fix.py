import os

def fix_file(file_path):
    try:
        # Read with binary first to detect the start
        with open(file_path, 'rb') as f:
            raw = f.read()
        
        if not raw:
            return

        modified = False
        content = raw
        
        # Check for BOM (EF BB BF)
        if content.startswith(b'\xef\xbb\xbf'):
            content = content[3:]
            modified = True
            print(f"Removed BOM: {file_path}")
            
        # Check for the replacement character (FD = 191/253 mixed, usually hex EF BF BD in UTF8)
        # But here checking specifically for the '' char which is \ufffd
        # In utf-8 bytes: \xef\xbf\xbd
        if content.startswith(b'\xef\xbf\xbd'):
            content = content[3:]
            modified = True
            print(f"Removed Replacement Char: {file_path}")

        # Also check for '?' if it's somehow just a ? 
        # (Unlikely to be the cause of 'Parsing ecmascript', but good to be clean)
        
        # Now convert to string to check for other garbage
        try:
            text = content.decode('utf-8')
        except:
             # If it fails to decode, try latin1, fix, then save as utf8
             text = content.decode('latin1')
             # Logic to fix mojibake could go here, but let's stick to the header fix first.
        
        if len(text) > 0:
             # Check if the first char is not ASCII and not expected
             first_char = text[0]
             if ord(first_char) > 127: # non-ascii start
                 # Is it a comment? /** is standard.
                 # If it is '' (65533)
                 if ord(first_char) == 65533:
                     text = text[1:]
                     modified = True
                     print(f"Removed leading U+FFFD: {file_path}")
        
        if modified:
             with open(file_path, 'w', encoding='utf-8') as f:
                 f.write(text)
             print(f"Saved: {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

# Walk
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css') or file.endswith('.js'):
            fix_file(os.path.join(root, file))

print("Global cleanup complete.")
