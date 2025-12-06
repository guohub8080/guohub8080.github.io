/**
 * MDX 表格行组件
 * 支持深色模式适配
 */

import React from 'react';

interface TrProps extends React.HTMLProps<HTMLTableRowElement> {
  children?: React.ReactNode;
}

const Tr: React.FC<TrProps> = ({ children, ...props }) => {
  return (
    <tr 
      className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50" 
      {...props}
    >
      {children}
    </tr>
  );
};

export default Tr;

