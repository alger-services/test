import re

file_path = r'c:\Users\Hana\Desktop\1493_v8\SCHOOL\news\article-04.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

css_new = """.cluster-tables {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
        padding: 1.5rem;
        background: #fdfaf8;
        border-radius: var(--mag-radius);
    }
    
    @media (min-width: 1200px) {
        .cluster-tables {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    
    @media (min-width: 769px) and (max-width: 1199px) {
        .cluster-tables {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .cluster-card {
        background: #fff;
        border: 1px solid var(--mag-border);
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        overflow: hidden;
    }

    .cluster-card-head {
        background: rgba(232, 98, 26, 0.05);
        padding: 0.8rem 1.2rem;
        border-bottom: 2px solid rgba(232, 98, 26, 0.2);
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }

    .cluster-code {
        background: var(--mag-orange);
        color: #fff;
        font-weight: 700;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
    }

    .cluster-name {
        font-size: 1.15rem;
        font-weight: 700;
        color: #222;
        margin: 0;
    }

    .cluster-table {
        width: 100%;
        border-collapse: collapse;
    }

    .cluster-table th,
    .cluster-table td {
        padding: 0.8rem 1rem;
        text-align: left;
        border-bottom: 1px solid #f2f2f2;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .cluster-table th {
        width: 35%;
        color: #555;
        font-weight: 600;
        background: #fafafa;
    }

    .cluster-table td {
        color: #333;
    }

    .cluster-table tr:last-child th,
    .cluster-table tr:last-child td {
        border-bottom: none;
    }

    @media (max-width: 768px) {
        .cluster-tables {
            grid-template-columns: 1fr;
            padding: 1.2rem;
            gap: 1.2rem;
        }

        .cluster-card-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
            padding: 1rem 1.2rem;
        }

        .cluster-table th,
        .cluster-table td {
            display: block;
            width: 100%;
            padding: 0.6rem 1.2rem;
        }

        .cluster-table th {
            background: transparent;
            padding-bottom: 0.1rem;
            color: var(--mag-orange);
        }

        .cluster-table td {
            padding-top: 0;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }

        .cluster-table tr:last-child td {
            border-bottom: none;
        }
    }"""

# Remove abbr row
content = re.sub(r'[ \t]*<tr>\s*<th>簡稱</th>\s*<td>.*?</td>\s*</tr>\s*', '\n                                        ', content)

# Replace CSS
css_pattern = r'\.cluster-tables\s*\{.*?(?=</style>)'
content = re.sub(css_pattern, css_new + '\n', content, flags=re.DOTALL)

# Adjust container max-width to allow wider grid
content = content.replace('<div class="container" style="max-width:800px">', '<div class="container" style="max-width:1200px">')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully.")
