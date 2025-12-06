/**
 * MDX 行内代码组件
 * 支持深色模式适配
 */

import useGlobalSettings from '../../../../store/useGlobalSettings';
import React from 'react';

interface CodeProps extends React.HTMLProps<HTMLElement> {
  children?: React.ReactNode;
}

const Code: React.FC<CodeProps> = ({ children, ...props }) => {
  const { articleLineHeight } = useGlobalSettings();
  return (
    <code
      className="bg-pink-100 dark:bg-pink-950 dark:text-pink-300 mx-0.5 text-pink-600 px-1.5 rounded-sm !text-sm"
      style={{
        fontFamily: 'var(--guohub-code-font-family) !important',
        display: 'inline-block',
        lineHeight: `${articleLineHeight}px !important`,
        verticalAlign: 'middle',
        transform: 'translateY(-0.15em)'
      }}
      {...props}
    >
      {children}
    </code>
  );
};

export default Code;
