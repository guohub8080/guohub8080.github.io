/**
 * MDX 段落组件
 * 支持深色模式适配
 */

import useGlobalSettings from '../../../../store/useGlobalSettings';
import React from 'react';

interface ParagraphProps extends React.HTMLProps<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, style, ...props }) => {
  const { articleLineHeight } = useGlobalSettings();
  return (
    <p 
      className="text-base text-foreground mb-4 text-justify" 
      style={{ 
        ...style,
        lineHeight: `${articleLineHeight}px`
      }}
      {...props}
    >
      {children}
    </p>
  );
};

export default Paragraph;
