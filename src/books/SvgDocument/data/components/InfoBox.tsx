import React, { ReactNode, CSSProperties } from 'react';

interface InfoBoxProps {
  children: ReactNode;
  type?: 'info' | 'warning' | 'success' | 'error';
  style?: CSSProperties;
}

/**
 * 信息提示框组件
 * 用于显示提示、警告等信息
 */
const InfoBox: React.FC<InfoBoxProps> = ({ children, type = 'info', style }) => {
  const typeStyles = {
    info: {
      background: '#e3f2fd',
      border: '1px solid #2196f3',
    },
    warning: {
      background: '#fff3cd',
      border: '1px solid #ffc107',
    },
    success: {
      background: '#e8f5e9',
      border: '1px solid #4caf50',
    },
    error: {
      background: '#ffebee',
      border: '1px solid #f44336',
    },
  };

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '12px',
        ...typeStyles[type],
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default InfoBox;


