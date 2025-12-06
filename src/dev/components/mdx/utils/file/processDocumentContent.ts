/**
 * 文档内容处理工具函数
 */

import React from 'react';
import { extractTitleFromMDX } from '../title';

/**
 * 处理不同文件类型的内容和标题
 * @param document 文档对象
 * @param fileType 文件类型
 * @param fileName 文件名（可选）
 * @returns 处理后的标题和JSX内容
 */
export function processDocumentContent(document: any, fileType: 'tsx' | 'md' | 'mdx', fileName?: string): {
  title: string;
  jsxContent: React.ReactNode;
} {
  if (fileType === 'md' || fileType === 'mdx') {
    // MD/MDX文件：从文件名提取title，整个内容作为jsx
    // MDX文件被编译成React组件函数，需要调用它
    const MDXComponent = document;
    const jsxContent = React.createElement(MDXComponent);
    
    // 尝试从MDX组件中提取标题
    let title = extractTitleFromMDX(document);
    
    // 如果无法提取标题，则从文件名提取
    if (title === '未命名文档' && fileName) {
      const nameWithoutExt = fileName.replace(/\.(md|mdx)$/, '');
      const nameWithoutPrefix = nameWithoutExt.replace(/^\[\d+\]/, '');
      title = nameWithoutPrefix || '未命名文档';
    }
    
    return {
      title,
      jsxContent
    };
  } else {
    // TSX文件：使用原有的title和jsx
    return {
      title: document.title,
      jsxContent: document.jsx
    };
  }
}
