/**
 * 从MDX组件中提取第一个一级标题作为文档标题
 * MDX组件会被编译成React组件，我们需要从props中提取标题
 */

import { findFirstH1 } from './findFirstH1.ts';

/**
 * 从MDX组件中提取第一个一级标题作为文档标题
 * MDX组件会被编译成React组件，我们需要从props中提取标题
 */
export function extractTitleFromMDX(mdxComponent: any): string {
  try {
    // MDX组件通常会有props，其中可能包含标题信息
    // 如果MDX组件有title属性，直接使用
    if (mdxComponent.title) {
      return mdxComponent.title;
    }
    
    // 如果MDX组件有frontmatter，尝试从中提取标题
    if (mdxComponent.frontmatter?.title) {
      return mdxComponent.frontmatter.title;
    }
    
    // 尝试从MDX组件的静态属性中提取标题
    // MDX组件可能有__mdxMetadata或其他静态属性
    if (mdxComponent.__mdxMetadata?.title) {
      return mdxComponent.__mdxMetadata.title;
    }
    
    // 尝试从MDX组件的displayName或name中提取
    if (mdxComponent.displayName && mdxComponent.displayName !== 'MDXContent') {
      return mdxComponent.displayName;
    }
    
    // 如果MDX组件有children，尝试从第一个h1元素提取标题
    if (mdxComponent.children) {
      const firstH1 = findFirstH1(mdxComponent.children);
      if (firstH1) {
        return firstH1;
      }
    }
    
    // 如果都没有，返回默认标题
    return '未命名文档';
  } catch (error) {
    console.warn('提取MDX标题失败:', error);
    return '未命名文档';
  }
}
