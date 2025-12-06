/**
 * 标题编号组件
 * 可自定义样式和容器类型
 */

import React from 'react';

interface HeadingNumberProps {
  number: string;
  level?: 2 | 3 | 4; // 标题级别，用于区分颜色
  as?: 'span' | 'div'; // 容器类型
  className?: string; // 自定义样式
}

const HeadingNumber: React.FC<HeadingNumberProps> = ({ 
  number, 
  level,
  as: Component = 'span',
  className = '' 
}) => {
  if (!number) return null;

  // 根据标题级别设置不同的背景色和文字颜色
  const bgColorClass = level === 2 
    ? 'bg-blue-500 dark:bg-blue-600 text-blue-50' 
    : level === 3 
    ? 'bg-green-500 dark:bg-green-600 text-green-50' 
    : level === 4
    ? 'bg-cyan-600 dark:bg-cyan-700 text-cyan-50'
    : 'bg-gray-500 dark:bg-gray-600 text-gray-50';

  return (
    <Component 
      className={`heading-number inline-block ${bgColorClass} rounded px-2 py-0.5 align-middle ${className}`}
      style={{ 
        fontSize: '0.8em',
        marginRight: '0.5em',
        lineHeight: '1.2',
        fontFamily: 'minsans-v !important'
      }}
    >
      {number}
    </Component>
  );
};

export default HeadingNumber;

