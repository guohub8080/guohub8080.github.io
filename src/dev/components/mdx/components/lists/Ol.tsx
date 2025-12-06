/**
 * MDX 有序列表组件
 * 支持深色模式适配
 */

import useGlobalSettings from '../../../../store/useGlobalSettings';
import React from 'react';

interface OlProps extends React.OlHTMLAttributes<HTMLOListElement> {
  children?: React.ReactNode;
}

const Ol: React.FC<OlProps> = ({ children, ...props }) => {
  const { articleLineHeight } = useGlobalSettings();
  return (
    <ol 
      // [&:not(li_>_&)] 表示：只有不是 li 直接子元素的 ol 才应用 marginTop
      // 这样顶层列表有间距，嵌套在 li 里的列表没有额外间距
      className="list-decimal list-inside text-base text-foreground mb-4 [&:not(li_>_&)]:mt-[--ol-spacing]" 
      style={{ 
        lineHeight: `${articleLineHeight}px`,
        '--ol-spacing': `calc(${articleLineHeight}px - 1rem)`
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </ol>
  );
};

export default Ol;
