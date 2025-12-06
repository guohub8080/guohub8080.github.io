/**
 * MDX 无序列表组件
 * 支持深色模式适配
 */

import useGlobalSettings from '../../../../store/useGlobalSettings';
import React from 'react';

interface UlProps extends React.HTMLProps<HTMLUListElement> {
  children?: React.ReactNode;
}

const Ul: React.FC<UlProps> = ({ children, ...props }) => {
  const { articleLineHeight } = useGlobalSettings();
  return (
    <ul 
      // [&:not(li_>_&)] 表示：只有不是 li 直接子元素的 ul 才应用 marginTop
      // 这样顶层列表有间距，嵌套在 li 里的列表没有额外间距
      className="list-disc list-inside text-base text-foreground mb-4 [&:not(li_>_&)]:mt-[--ul-spacing]" 
      style={{ 
        lineHeight: `${articleLineHeight}px`,
        '--ul-spacing': `calc(${articleLineHeight}px - 1rem)`
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </ul>
  );
};

export default Ul;
