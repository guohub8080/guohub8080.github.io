/** @jsxImportSource react */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import ActionPanel from './components/ActionPanel.tsx';

/**
 * PubEditor 主布局组件
 * 三列布局：左侧目录 + 中间内容（Outlet） + 右侧操作区域
 * 整体居中，最大宽度 1400px
 */
export default function PubEditor() {
  return (
    <div className="w-full min-h-screen flex justify-center">
      {/* 外层容器：居中，最大宽度 1400px */}
      <div className="w-full max-w-[1400px] flex">
        {/* 左侧目录 - 固定宽度 */}
        <Sidebar />

        {/* 中间内容区域 - 自适应宽度，包含 Outlet */}
        <div className="flex-1 min-w-0 bg-background">
          <div className="p-6">
            <Outlet />
          </div>
        </div>

        {/* 右侧操作区域 - 固定宽度 */}
        <ActionPanel />
      </div>
    </div>
  );
}

