/**
 * MDX H4 标题组件
 * 支持深色模式适配
 */

import React, { useState } from 'react';
import { useHeadingNumber } from '../../contexts/HeadingNumberContext.tsx';
import HeadingNumber from './HeadingNumber.tsx';

interface H4Props extends React.HTMLProps<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const H4: React.FC<H4Props> = ({ children, ...props }) => {
  const context = useHeadingNumber();
  // 使用 useState 的 lazy initializer 确保只在挂载时注册一次
  const [number] = useState(() => context?.registerH4() || '');

  return (
    <h4 
      className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 mt-3 flex items-center" 
      {...props}
    >
      <HeadingNumber number={number} level={4} className="flex-shrink-0" />
      <span className="flex-1 min-w-0 break-words">{children}</span>
    </h4>
  );
};

export default H4;
