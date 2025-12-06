/**
 * 文件类型检测工具函数
 */

/**
 * 检测文件类型
 * @param fileName 文件名
 * @returns 文件类型：'tsx' | 'md' | 'mdx'
 */
export function detectFileType(fileName: string): 'tsx' | 'md' | 'mdx' {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  return fileExtension === 'md' ? 'md' : fileExtension === 'mdx' ? 'mdx' : 'tsx';
}
