/**
 * MDX 分隔线组件
 * 支持深色模式适配
 */

import React from 'react';

interface HrProps extends React.HTMLProps<HTMLHRElement> {}

const Hr: React.FC<HrProps> = ({ ...props }) => {
  return (
    <hr 
      className="border-gray-300 dark:border-gray-600 my-8" 
      {...props}
    />
  );
};

export default Hr;
