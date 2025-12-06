/**
 * MDX 表格头部组件
 * 支持深色模式适配
 */

import React from 'react';

interface TheadProps extends React.HTMLProps<HTMLTableSectionElement> {
  children?: React.ReactNode;
}

const Thead: React.FC<TheadProps> = ({ children, ...props }) => {
  return (
    <thead 
      className="bg-gray-100 dark:bg-gray-800" 
      {...props}
    >
      {children}
    </thead>
  );
};

export default Thead;

