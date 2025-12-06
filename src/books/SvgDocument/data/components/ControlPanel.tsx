import React, { ReactNode, CSSProperties } from 'react';

interface ControlPanelProps {
  children: ReactNode;
  style?: CSSProperties;
}

/**
 * 控制面板容器
 * 用于包裹参数控制器
 */
const ControlPanel: React.FC<ControlPanelProps> = ({ children, style }) => {
  return (
    <div
      style={{
        marginBottom: '12px',
        background: '#f5f5f5',
        padding: '12px',
        borderRadius: '4px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ControlPanel;


