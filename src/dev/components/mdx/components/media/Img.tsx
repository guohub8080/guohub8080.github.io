/**
 * MDX 图片组件
 * 支持深色模式适配
 */

import React from 'react';

const Img: React.FC<React.HTMLProps<HTMLImageElement>> = ({ ...props }) => {
  return (
    <img 
      className="max-w-full h-auto rounded-lg mb-4" 
      {...props}
    />
  );
};

export default Img;
