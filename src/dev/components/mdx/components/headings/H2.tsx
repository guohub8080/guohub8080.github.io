/**
 * MDX H2 标题组件
 * 支持深色模式适配
 */

import React, { useState } from 'react';
import { useHeadingNumber } from '../../contexts/HeadingNumberContext.tsx';
import HeadingNumber from './HeadingNumber.tsx';

interface H2Props extends React.HTMLProps<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const H2: React.FC<H2Props> = ({ children, ...props }) => {
  const context = useHeadingNumber();
  // 使用 useState 的 lazy initializer 确保只在挂载时注册一次
  const [number] = useState(() => context?.registerH2() || '');

  return (
    <h2 
      className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-6 flex items-center" 
      {...props}
    >
      <HeadingNumber number={number} level={2} className="flex-shrink-0" />
      <span className="flex-1 min-w-0 break-words">{children}</span>
    </h2>
  );
};

export default H2;
