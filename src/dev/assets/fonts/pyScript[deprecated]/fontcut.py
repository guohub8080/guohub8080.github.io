# 安装字体处理工具
# !pip install fonttools

import sys
import re
from fontTools.subset import main as subset_main
import os
import shutil

def parse_md_content(md_content):
    """
    解析 Markdown 文件，按章节提取字符列表。
    """
    sections = {}
    current_section = None
    
    for line in md_content.split('\n'):
        line = line.strip()
        if not line:
            continue
        
        heading_match = re.match(r'#\s*(.*?)(?:\s*（.*?）)?$', line)
        if heading_match:
            section_name = heading_match.group(1).strip()
            sections[section_name] = []
            current_section = section_name
        elif current_section:
            unicode_match = re.search(r'U\+[0-9A-F]{4,5}-U\+[0-9A-F]{4,5}', line, re.IGNORECASE)
            if unicode_match:
                sections[current_section].append(unicode_match.group(0))
            else:
                sections[current_section].extend(list(line))
    return sections

def subset_font_in_colab(source_font_path, sections):
    """
    在 Colab 中执行字体切割，并生成压缩包。
    """
    if not sections:
        print("未找到任何切割章节。请检查 Markdown 文件格式。")
        return

    original_font_name = os.path.splitext(os.path.basename(source_font_path))[0]
    
    # 创建一个新文件夹来存放切割后的文件
    output_dir = f"{original_font_name}-vf-subsets"
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir) # 如果文件夹存在，先删除
    os.makedirs(output_dir)
    print(f"✓ 已创建新文件夹：{output_dir}")

    output_files = []
    
    for i, (section_name, chars_or_ranges) in enumerate(sections.items()):
        if not chars_or_ranges:
            print(f"警告：章节 '{section_name}' 中没有字符或范围，跳过。")
            continue
        
        if all(re.match(r'U\+[0-9A-F]{4,5}-U\+[0-9A-F]{4,5}', item, re.IGNORECASE) for item in chars_or_ranges):
            subset_args = [f"--unicodes={','.join(chars_or_ranges)}"]
        else:
            subset_args = [f"--text={''.join(chars_or_ranges)}"]

        output_file = f"{output_dir}/{original_font_name}-range{i}.woff2"
        output_files.append(output_file)
        
        command_args = [
            source_font_path,
            *subset_args,
            f"--output-file={output_file}",
            "--flavor=woff2"
        ]
        
        print(f"\n正在切割 '{section_name}'...")
        try:
            subset_main(command_args)
            print(f"✓ '{section_name}' 切割成功！文件已保存到：{output_file}")
        except Exception as e:
            print(f"✗ 切割 '{section_name}' 失败：{e}")

    print("\n所有字体切割已完成。")

# --- 主程序入口 ---
if __name__ == '__main__':
    # 请在这里指定你的字体文件和 Markdown 文件名
    source_font_path = "syht.ttf"  # <--- 替换为你的字体文件名
    md_file_path = "汉字切割指南.md"         # <--- 替换为你的 Markdown 文件名
    
    if not os.path.exists(source_font_path):
        print(f"错误：字体文件 '{source_font_path}' 不存在。请手动上传到 Colab 并检查文件名。")
        sys.exit(1)
    if not os.path.exists(md_file_path):
        print(f"错误：Markdown 文件 '{md_file_path}' 不存在。请手动上传到 Colab 并检查文件名。")
        sys.exit(1)

    with open(md_file_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    sections_to_cut = parse_md_content(md_content)
    
    subset_font_in_colab(source_font_path, sections_to_cut)
