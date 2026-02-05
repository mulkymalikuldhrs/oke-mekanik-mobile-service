#!/usr/bin/env python3
import os
import re

def clean_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove all merge conflict markers and their content
        cleaned = re.sub(r'<<<<<<<[^\n]*\n.*?\n=======\n.*?\n>>>>>>>[^\n]*\n', '', content, flags=re.DOTALL)
        cleaned = re.sub(r'^(<<<<<<<|=======|>>>>>>>)[^\n]*\n', '', cleaned, flags=re.MULTILINE)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        return True
    except Exception as e:
        print(f"Error cleaning {filepath}: {e}")
        return False

# Clean all .tsx files in pages directory
pages_dir = '/workspace/oke-mekanik-working/src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.tsx'):
        filepath = os.path.join(pages_dir, filename)
        if clean_file(filepath):
            print(f"Cleaned: {filename}")

# Clean setupTests.ts
setup_tests = '/workspace/oke-mekanik-working/src/setupTests.ts'
if clean_file(setup_tests):
    print("Cleaned: setupTests.ts")

print("\nCleanup complete!")
