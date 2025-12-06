import React, { ReactNode, CSSProperties } from 'react';

interface ControlRowProps {
  label?: string;
  children: ReactNode;
  style?: CSSProperties;
  labelWidth?: string | number;
}

/**
 * 控制项行组件
 * 用于参数控制器中的单行控件
 */
const ControlRow: React.FC<ControlRowProps> = ({ 
  label, 
  children, 
  style,
  labelWidth = '100px'
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
        fontSize: '14px',
        ...style,
      }}
    >
      {label && (
        <span style={{ minWidth: typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth }}>
          {label}
        </span>
      )}
      {children}
    </div>
  );
};

export default ControlRow;


