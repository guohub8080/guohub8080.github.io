/**
 * MDX 斜体组件
 * 支持深色模式适配
 */

import React from 'react';

interface EmProps extends React.HTMLProps<HTMLElement> {
  children?: React.ReactNode;
}

const Em: React.FC<EmProps> = ({ children, ...props }) => {
  return (
    <em 
      className="italic text-gray-800 dark:text-gray-200" 
      {...props}
    >
      {children}
    </em>
  );
};

export default Em;
