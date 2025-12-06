/**
 * MDX 表格主体组件
 * 支持深色模式适配
 */

import React from 'react';

interface TbodyProps extends React.HTMLProps<HTMLTableSectionElement> {
  children?: React.ReactNode;
}

const Tbody: React.FC<TbodyProps> = ({ children, ...props }) => {
  return (
    <tbody {...props}>
      {children}
    </tbody>
  );
};

export default Tbody;

