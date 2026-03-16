import os
import re

base_dir = r"c:\Users\Hana\Desktop\1493\1493_v10"
base_url = "https://www.1493.com.tw"

updated_files = []

for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, base_dir).replace('\\', '/')
            
            if rel_path == 'index.html':
                canonical_path = '/'
            elif rel_path.endswith('/index.html'):
                canonical_path = '/' + rel_path[:-10]
            else:
                canonical_path = '/' + rel_path
            
            canonical_url = base_url + canonical_path
            canonical_tag = f'<link rel="canonical" href="{canonical_url}">'
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Step 1: Remove any existing canonical
            content = re.sub(r'\n?\s*<link\s+rel=["\']canonical["\'][^>]*>', '', content, flags=re.IGNORECASE)
            
            # Step 2: Insert the new canonical right after description
            match = re.search(r'(<meta\s+name=["\']description["\'][^>]*>)', content, re.IGNORECASE)
            if match:
                desc_tag = match.group(1)
                ws_match = re.search(r'(\n[ \t]*)(<meta\s+name=["\']description["\'][^>]*>)', content, re.IGNORECASE)
                indent = '\n    '
                if ws_match:
                    indent = ws_match.group(1)
                
                content = content.replace(desc_tag, desc_tag + indent + canonical_tag, 1)
            else:
                match_css = re.search(r'(\n[ \t]*)(<link[^>]*rel=["\']stylesheet["\'][^>]*>)', content, re.IGNORECASE)
                if match_css:
                    indent = match_css.group(1)
                    css_tag = match_css.group(2)
                    content = content.replace(css_tag, canonical_tag + indent + css_tag, 1)
                else:
                    content = content.replace('</head>', f'    {canonical_tag}\n</head>')
                    
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                updated_files.append(rel_path)

print("Updated files:")
for f in sorted(updated_files):
    print("- " + f)
