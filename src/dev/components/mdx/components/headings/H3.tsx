/**
 * MDX H3 标题组件
 * 支持深色模式适配
 */

import React, { useState } from 'react';
import { useHeadingNumber } from '../../contexts/HeadingNumberContext.tsx';
import HeadingNumber from './HeadingNumber.tsx';

interface H3Props extends React.HTMLProps<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const H3: React.FC<H3Props> = ({ children, ...props }) => {
  const context = useHeadingNumber();
  // 使用 useState 的 lazy initializer 确保只在挂载时注册一次
  const [number] = useState(() => context?.registerH3() || '');

  return (
    <h3 
      className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-4 flex items-center" 
      {...props}
    >
      <HeadingNumber number={number} level={3} className="flex-shrink-0" />
      <span className="flex-1 min-w-0 break-words">{children}</span>
    </h3>
  );
};

export default H3;
