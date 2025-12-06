/**
 * MDX 表格单元格组件
 * 支持深色模式适配
 */

import React from 'react';

interface TdProps extends React.HTMLProps<HTMLTableCellElement> {
  children?: React.ReactNode;
}

const Td: React.FC<TdProps> = ({ children, ...props }) => {
  return (
    <td 
      className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300 min-w-[100px] whitespace-nowrap" 
      {...props}
    >
      {children}
    </td>
  );
};

export default Td;
