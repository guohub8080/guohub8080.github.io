import React, { ReactNode, CSSProperties } from 'react';

interface SectionProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: boolean;
}

/**
 * 内容区域组件
 * 用于包裹文档内容区域，提供统一的左右内边距
 */
const Section: React.FC<SectionProps> = ({ children, style, padding = true }) => {
  return (
    <section
      style={{
        ...(padding && { padding: '0 16px' }),
        ...style,
      }}
    >
      {children}
    </section>
  );
};

export default Section;


