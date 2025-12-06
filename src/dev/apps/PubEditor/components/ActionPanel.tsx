/** @jsxImportSource react */
import React from 'react';

/**
 * 右侧操作区域组件
 * 固定宽度，用于显示操作按钮、设置等
 */
export default function ActionPanel() {
  return (
    <div className="flex-shrink-0 w-[320px] bg-card border-l border-border">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">操作区域</h2>
        <div className="space-y-4">
          {/* 操作按钮、设置等将在这里渲染 */}
          <div className="text-sm text-muted-foreground">操作面板内容</div>
        </div>
      </div>
    </div>
  );
}

