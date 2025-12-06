import os
import sys
from fontTools.ttLib import TTFont
from fontTools.subset import main as subset_main


def _resolve_output_path(source_font_path: str, explicit_output: str | None) -> str:
    original_font_name = os.path.splitext(os.path.basename(source_font_path))[0]
    return explicit_output or f"{original_font_name}.woff2"


def convert_to_woff2_passthrough(source_font_path: str, output_font_path: str | None = None) -> None:
    """
    不做子集裁剪，直接把字体完整转换为 WOFF2。
    优先使用 TTFont 保存（需要安装 brotli/brotlicffi）。
    若失败，则回退到子集工具的 --no-subset 方式，确保不丢字形。
    """
    if not os.path.exists(source_font_path):
        print(f"错误：字体文件 '{source_font_path}' 不存在。")
        sys.exit(1)

    output_font_path = _resolve_output_path(source_font_path, output_font_path)

    print(f"正在将 '{source_font_path}' 以完整保留方式转换为 WOFF2 → '{output_font_path}' ...")

    # 方案一：直接用 TTFont 保存为 WOFF2（不裁剪）
    try:
        font = TTFont(source_font_path)
        font.flavor = "woff2"  # 正确的设置方式
        font.save(output_font_path)
        print(f"✓ 转换成功（TTFont 直通式）。已保存：{output_font_path}")
        return
    except Exception as e:
        print(f"TTFont 直通式保存失败，尝试使用子集工具的无裁剪回退方案。原因：{e}")

    # 方案二（回退）：使用 pyftsubset 保留所有字形，仅做封装为 woff2
    command_args = [
        source_font_path,
        f"--output-file={output_font_path}",
        "--flavor=woff2",
        "--unicodes=*",  # 保留所有 Unicode 字符
        "--glyph-names",
        "--name-IDs=*",
        "--name-languages=*",
    ]

    try:
        subset_main(command_args)
        print(f"✓ 转换成功（pyftsubset --unicodes=* 回退）。已保存：{output_font_path}")
    except Exception as e:
        print("✗ 转换失败：两种方式均未成功。")
        print("- 请确保已安装依赖：'fonttools[woff]' 与 'brotli' 或 'brotlicffi'")
        print("- 若在 Colab，请先执行：pip install 'fonttools[woff]' brotli")
        print(f"错误详情：{e}")
        sys.exit(1)


if __name__ == "__main__":
    # 可修改为你的字体文件路径（支持 TTF/OTF/Variable Font）
    source_font_path = "jb-mono.ttf"
    convert_to_woff2_passthrough(source_font_path)