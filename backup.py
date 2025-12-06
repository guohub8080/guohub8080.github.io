#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GuoHub 项目备份脚本
自动打包整个项目，支持 Windows、macOS 和 Linux
- Windows: 优先备份到 D 盘，否则备份到桌面
- macOS: 备份到桌面
- Linux: 备份到 Documents 目录
排除不必要的文件和目录（如 node_modules、.git 等）
"""

import os
import sys
import zipfile
import platform
from datetime import datetime
from pathlib import Path


def get_project_root():
    """获取项目根目录（脚本所在目录）"""
    return Path(__file__).resolve().parent


def get_backup_directory():
    """根据操作系统获取备份目录"""
    system = platform.system()
    
    if system == "Windows":
        # Windows: 优先使用 D 盘，如果不存在则使用桌面
        d_drive = Path("D:/")
        if d_drive.exists():
            return d_drive
        else:
            desktop = Path.home() / "Desktop"
            if desktop.exists():
                return desktop
            return Path.home() / "Documents"
    
    elif system == "Darwin":  # macOS
        # macOS: 使用桌面目录
        desktop = Path.home() / "Desktop"
        if desktop.exists():
            return desktop
        return Path.home() / "Documents"
    
    else:  # Linux 和其他系统
        # Linux: 使用家目录下的 Documents 或直接家目录
        documents = Path.home() / "Documents"
        if documents.exists():
            return documents
        return Path.home()


def format_size(size_bytes):
    """格式化文件大小"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def should_exclude_file(filename):
    """判断文件是否应该被排除"""
    exclude_extensions = {
        '.pyc', '.pyo', '.pyd',  # Python 编译文件
        '.log', '.tmp', '.temp',  # 临时文件
        '.DS_Store', '.env.local', '.env.production.local'  # 系统/环境文件
    }
    return any(filename.endswith(ext) for ext in exclude_extensions)


def backup_project():
    """备份项目到指定目录（根据操作系统自动选择）"""
    try:
        # 获取项目根目录
        project_root = get_project_root()
        project_name = project_root.name
        print(f"📂 项目根目录: {project_root}")
        print(f"📝 项目名称: {project_name}")
        
        # 获取备份目录
        backup_dir = get_backup_directory()
        system_name = platform.system()
        print(f"💻 操作系统: {system_name}")
        print(f"📁 备份目录: {backup_dir}")
        
        # 检查备份目录是否存在
        if not backup_dir.exists():
            print(f"\n❌ 错误: 备份目录不存在: {backup_dir}")
            return
        
        # 生成带时间戳的文件名
        timestamp = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
        backup_filename = f"{timestamp}_{project_name}.zip"
        backup_path = backup_dir / backup_filename
        
        print(f"💾 备份文件: {backup_path}")
        print("\n开始备份...\n")
        
        # 需要排除的目录（完全匹配）
        exclude_dirs = {
            'node_modules',
            '.git',
            '__pycache__',
            'build',
            '.idea',
            '.vscode',
            '.next',
            'coverage',
            '.cache',
            '.parcel-cache',
            '.turbo',
            'out',
            '.vercel',
            '.netlify',
            'docs'  # 如果是构建产物
        }
        root_only_exclude_dirs = {'dist'}
        
        # 统计信息
        file_count = 0
        dir_count = 0
        skipped_files = 0
        
        # 创建压缩包
        with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
            # 遍历项目目录
            for root, dirs, files in os.walk(project_root):
                # 计算相对路径，根目录与其他目录的过滤策略不同
                relative_root = os.path.relpath(root, project_root)
                if relative_root == '.':
                    dirs[:] = [d for d in dirs if d not in root_only_exclude_dirs]
                dirs[:] = [d for d in dirs if d not in exclude_dirs]
                
                # 根目录本身不用写入 zip 条目，但子目录需要
                if relative_root != '.':
                    # 添加目录（包括空目录）
                    dir_arcname = relative_root.replace('\\', '/') + '/'
                    try:
                        zipf.write(root, dir_arcname)
                        dir_count += 1
                    except Exception:
                        pass
                
                # 添加文件
                for filename in files:
                    # 跳过不需要的文件
                    if should_exclude_file(filename):
                        skipped_files += 1
                        continue
                    
                    file_path = os.path.join(root, filename)
                    arcname = os.path.relpath(file_path, project_root).replace('\\', '/')
                    
                    try:
                        zipf.write(file_path, arcname)
                        file_count += 1
                        
                        # 每 50 个文件打印一次进度
                        if file_count % 50 == 0:
                            print(f"  ⏳ 已处理 {file_count} 个文件, {dir_count} 个目录...")
                    except Exception as e:
                        print(f"  ⚠️  跳过文件 {arcname}: {e}")
                        skipped_files += 1
        
        # 获取压缩包大小
        backup_size = backup_path.stat().st_size
        
        # 显示结果
        print("\n" + "="*60)
        print("✅ 备份完成!")
        print("="*60)
        print(f"📦 压缩包位置: {backup_path}")
        print(f"📁 目录数量:   {dir_count:,}")
        print(f"📄 文件数量:   {file_count:,}")
        if skipped_files > 0:
            print(f"⏭️  跳过文件:   {skipped_files:,}")
        print(f"💾 压缩包大小: {format_size(backup_size)}")
        print("="*60 + "\n")
        
    except KeyboardInterrupt:
        print("\n\n⚠️  用户中断备份！")
        sys.exit(1)
    except Exception as e:
        print("\n" + "="*60)
        print("❌ 备份失败!")
        print("="*60)
        print(f"错误信息: {e}")
        print("="*60 + "\n")
        import traceback
        traceback.print_exc()


def main():
    """主函数"""
    print("\n" + "="*60)
    print("🚀 GuoHub 项目备份工具")
    print("="*60 + "\n")
    
    backup_project()
    
    # 等待用户按键，防止窗口关闭
    input("\n按 Enter 键退出...")


if __name__ == "__main__":
    main()

