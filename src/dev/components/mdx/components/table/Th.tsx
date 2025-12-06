/**
 * MDX 表格头组件
 * 支持深色模式适配
 */

import React from 'react';

interface ThProps extends React.HTMLProps<HTMLTableCellElement> {
  children?: React.ReactNode;
}

const Th: React.FC<ThProps> = ({ children, ...props }) => {
  return (
    <th 
      className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold text-gray-800 dark:text-gray-200 min-w-[100px] whitespace-nowrap" 
      {...props}
    >
      {children}
    </th>
  );
};

export default Th;
