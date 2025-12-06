/**
 * MDX标题提取Hook
 * 在React组件中提取MDX标题的Hook
 * 这个hook可以在组件渲染时安全地提取MDX标题
 */

import React from 'react';
import { findFirstH1 } from '../title';

/**
 * 在React组件中提取MDX标题的Hook
 * 这个hook可以在组件渲染时安全地提取MDX标题
 * @param mdxComponent MDX组件
 * @returns 提取到的标题
 */
export function useMDXTitle(mdxComponent: any): string {
  const [title, setTitle] = React.useState('未命名文档');
  
  React.useEffect(() => {
    if (typeof mdxComponent === 'function') {
      try {
        // 在React上下文中安全地渲染MDX组件
        const renderedElement = mdxComponent();
        if (renderedElement && renderedElement.props) {
          const firstH1 = findFirstH1(renderedElement.props.children);
          if (firstH1) {
            setTitle(firstH1);
          }
        }
      } catch (error) {
        console.warn('提取MDX标题失败:', error);
      }
    }
  }, [mdxComponent]);
  
  return title;
}
