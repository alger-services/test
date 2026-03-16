import os
import re

files_to_update = [
    r"c:\Users\Hana\Desktop\1493\1493_v10\SCHOOL\news\article-04.html",
    r"c:\Users\Hana\Desktop\1493\1493_v10\SCHOOL\news\article-04.5.html",
    r"c:\Users\Hana\Desktop\1493\1493_v10\SCHOOL\news\article-05.html",
    r"c:\Users\Hana\Desktop\1493\1493_v10\SCHOOL\news\article-06.html"
]

link_tag = '    <link rel="stylesheet" href="../../assets/css/article.css">\n'

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace <style>...</style> with the link tag
    # The regex DOTALL is used so it spans across multiple lines
    new_content = re.sub(r'    <style>.*?</style>\n', link_tag, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {filepath}")
