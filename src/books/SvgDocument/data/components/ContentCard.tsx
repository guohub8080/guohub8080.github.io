import React, { ReactNode, CSSProperties } from 'react';

interface ContentCardProps {
  children: ReactNode;
  style?: CSSProperties;
}

/**
 * 内容卡片组件
 * 用于包裹展示内容的卡片容器
 */
const ContentCard: React.FC<ContentCardProps> = ({ children, style }) => {
  return (
    <div
      style={{
        marginBottom: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        padding: '12px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ContentCard;


