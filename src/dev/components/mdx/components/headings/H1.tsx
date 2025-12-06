/**
 * MDX H1 标题组件
 * 支持深色模式适配
 */

import React from 'react';

interface H1Props extends React.HTMLProps<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const H1: React.FC<H1Props> = ({ children, ...props }) => {
  return (
    <h1 
      className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-8 break-words" 
      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
      {...props}
    >
      {children}
    </h1>
  );
};

export default H1;
