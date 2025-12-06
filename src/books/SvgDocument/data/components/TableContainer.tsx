import React, { ReactNode, CSSProperties } from 'react';

interface TableContainerProps {
  children: ReactNode;
  style?: CSSProperties;
}

/**
 * 表格容器组件
 * 用于包裹表格，提供横向滚动能力
 */
const TableContainer: React.FC<TableContainerProps> = ({ children, style }) => {
  return (
    <div
      style={{
        overflowX: 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default TableContainer;


