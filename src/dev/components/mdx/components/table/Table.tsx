/**
 * MDX 表格组件
 * 支持深色模式适配
 */

import React from 'react';

interface TableProps extends React.HTMLProps<HTMLTableElement> {
  children?: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children, ...props }) => {
  return (
    <div className="mb-4 max-w-full w-fit rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
      <div className="overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 [&::-webkit-scrollbar-thumb]:dark:hover:bg-gray-500">
        <style>{`
          /* 表头左上角：只圆左上角 */
          .mdx-table tr:first-child th:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0;
          }
          /* 表头右上角：只圆右上角 */
          .mdx-table tr:first-child th:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0;
          }
          /* 数据行左下角：只圆左下角 */
          .mdx-table tr:last-child td:first-child {
            border-bottom-left-radius: 0.5rem;
            border-top-left-radius: 0;
          }
          /* 数据行右下角：只圆右下角 */
          .mdx-table tr:last-child td:last-child {
            border-bottom-right-radius: 0.5rem;
            border-top-right-radius: 0;
          }
          /* 移除左右和底部外侧单元格边框，避免与外层容器边框重叠 */
          /* 表头行顶部线由外层粗边框提供，这里去掉 th 的 top 线 */
          .mdx-table tr:first-child th {
            border-top: none;
          }
          .mdx-table th:first-child,
          .mdx-table td:first-child {
            border-left: none;
          }
          .mdx-table th:last-child,
          .mdx-table td:last-child {
            border-right: none;
          }
          .mdx-table tr:last-child th,
          .mdx-table tr:last-child td {
            border-bottom: none;
          }
        `}</style>
        <table 
          className="mdx-table table-auto border-collapse" 
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  );
};

export default Table;
