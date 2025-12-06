/**
 * MDX 链接组件
 * 支持深色模式适配
 */

import React from 'react';

interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  children?: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  // 默认在新标签页打开外部链接
  const defaultProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
    ...props
  };
  
  return (
    <a 
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline" 
      {...defaultProps}
    >
      {children}
    </a>
  );
};

export default Link;
