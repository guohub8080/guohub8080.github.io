/**
 * MDX 列表项组件
 * 支持深色模式适配
 */

import useGlobalSettings from '../../../../store/useGlobalSettings';
import React from 'react';

interface LiProps extends React.HTMLProps<HTMLLIElement> {
  children?: React.ReactNode;
}

const Li: React.FC<LiProps> = ({ children, ...props }) => {
  const { articleLineHeight } = useGlobalSettings();
  return (
    <li 
      className="text-base text-foreground [&:not(:first-child)]:mt-[--li-spacing]" 
      style={{ 
        lineHeight: `${articleLineHeight}px`,
        '--li-spacing': `calc((${articleLineHeight}px - 1rem) * 0.5)`
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </li>
  );
};

export default Li;
