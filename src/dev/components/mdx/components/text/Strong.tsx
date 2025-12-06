/**
 * MDX 粗体组件
 * 支持深色模式适配
 */

import React from 'react';

interface StrongProps extends React.HTMLProps<HTMLElement> {
  children?: React.ReactNode;
}

const Strong: React.FC<StrongProps> = ({ children, ...props }) => {
  return (
    <strong 
      className="font-semibold text-primary-600  dark:text-violet-200" 
      {...props}
    >
      {children}
    </strong>
  );
};

export default Strong;
