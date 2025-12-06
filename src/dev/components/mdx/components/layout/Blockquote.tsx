/**
 * MDX 引用组件
 * 支持深色模式适配
 */

import React from 'react';

interface BlockquoteProps extends React.HTMLProps<HTMLQuoteElement> {
  children?: React.ReactNode;
}

const Blockquote: React.FC<BlockquoteProps> = ({ children, ...props }) => {
  return (
    <blockquote 
      className={`
        border-l-[8px]                    /* 左边框宽度 8px */
        border-slate-400                   /* 浅色模式边框颜色 slate-400 */
        dark:border-slate-400              /* 深色模式边框颜色 slate-400 */
        bg-muted                           /* 背景色使用 muted（shadcn/ui 的柔和背景色） */
        pl-3 pr-7 py-3                     /* 左 12px, 右 28px, 上下 12px */
        mb-4                               /* 底部外边距 16px */
        rounded-r                          /* 右侧圆角 */
        
        [&>p]:mb-0                         /* [&>p] = blockquote > p，所有直接子 p 元素底部边距为 0 */
        [&>p:not(:last-child)]:mb-2        /* [&>p:not(:last-child)] = blockquote > p:not(:last-child)，除最后一个外的 p 元素底部边距为 8px */
        
        [&>p]:!text-gray-600               /* [&>p] = blockquote > p，!表示 important，强制覆盖 p 的文字颜色为 gray-600（浅色模式） */
        [&>p]:dark:!text-gray-400          /* 深色模式下 p 的文字颜色为 gray-400 */
        
        [&_strong]:!text-gray-700          /* [&_strong] = blockquote strong（包括嵌套），强制覆盖所有 strong 的文字颜色为 gray-700（浅色模式） */
        [&_strong]:dark:!text-gray-300     /* 深色模式下 strong 的文字颜色为 gray-300 */
      `}
      {...props}
    >
      {children}
    </blockquote>
  );
};

export default Blockquote;
