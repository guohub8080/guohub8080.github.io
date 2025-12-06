import React, { CSSProperties, ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  style?: CSSProperties;
}

/**
 * 标准 H1 标题组件
 * 用于页面主标题
 */
export const H1: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <h1 style={{
      padding: '0 16px',
      fontSize: '24px',
      fontWeight: 600,
      marginBottom: '8px',
      ...style
    }}>
      {children}
    </h1>
  );
};

/**
 * 标准 H2 标题组件
 * 用于主要章节标题
 */
export const H2: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <h2 style={{
      padding: '0 16px',
      fontSize: '18px',
      marginBottom: '12px',
      fontWeight: 600,
      ...style
    }}>
      {children}
    </h2>
  );
};

/**
 * 标准 H3 标题组件
 * 用于次级章节标题
 */
export const H3: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <h3 style={{
      padding: '0 16px',
      fontSize: '16px',
      marginBottom: '8px',
      fontWeight: 600,
      ...style
    }}>
      {children}
    </h3>
  );
};

/**
 * 标准 H4 标题组件
 * 用于小节标题
 */
export const H4: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <h4 style={{
      padding: '0 16px',
      fontSize: '15px',
      marginBottom: '8px',
      fontWeight: 600,
      ...style
    }}>
      {children}
    </h4>
  );
};

/**
 * 标准段落组件
 * 用于正文段落
 */
export const P: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <p style={{
      fontSize: '14px',
      color: '#333',
      marginBottom: '12px',
      lineHeight: '1.6',
      ...style
    }}>
      {children}
    </p>
  );
};

/**
 * 描述文字组件
 * 用于次要说明文字
 */
export const Description: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <p style={{
      fontSize: '14px',
      color: '#666',
      marginBottom: '8px',
      lineHeight: '1.6',
      ...style
    }}>
      {children}
    </p>
  );
};


