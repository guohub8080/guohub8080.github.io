/** @jsxImportSource react */
import React from 'react';

/**
 * 左侧目录组件
 * 固定宽度，用于显示文章目录/导航
 */
export default function Sidebar() {
  return (
    <div className="flex-shrink-0 w-[280px] bg-card border-r border-border">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">目录</h2>
        <div className="space-y-2">
          {/* 目录内容将在这里动态渲染 */}
          <div className="text-sm text-muted-foreground">目录加载中...</div>
        </div>
      </div>
    </div>
  );
}

