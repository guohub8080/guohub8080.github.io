/**
 * MDX 组件统一导出
 * 包含组件映射、提供者和工具函数
 */

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import {
  H1, H2, H3, H4,
  Paragraph, Strong, Em, Link,
  Ul, Ol, Li,
  Code, Pre,
  Img,
  Blockquote, Hr,
  Table, Thead, Tbody, Tr, Th, Td
} from './components';

// 自定义的 MDX 组件，使用 Tailwind 样式，支持深色模式
export const MDXComponents = {
  // 标题组件
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,

  // 文本组件
  p: Paragraph,
  strong: Strong,
  em: Em,
  a: Link,

  // 列表组件
  ul: Ul,
  ol: Ol,
  li: Li,

  // 代码组件
  code: Code,
  pre: Pre,

  // 布局组件
  blockquote: Blockquote,
  hr: Hr,

  // 媒体组件
  img: Img,

  // 表格组件
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
};

// MDX 提供者包装器组件
interface MDXProviderWrapperProps {
  children: React.ReactNode;
}

export const MDXProviderWrapper: React.FC<MDXProviderWrapperProps> = ({ children }) => {
  return (
    <MDXProvider components={MDXComponents}>
      <div className="max-w-none">
        {children}
      </div>
    </MDXProvider>
  );
};

// 导出工具函数
export { extractTitleFromMDX, detectFileType, processDocumentContent, useMDXTitle } from './utils';

// 导出所有组件（按需使用）
export * from './components';

// 默认导出组件映射
export default MDXComponents;