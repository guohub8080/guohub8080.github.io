/** @jsxImportSource react */
import React from 'react';

/**
 * 文章列表/详情页面
 * 这个页面会通过 Outlet 渲染在中间区域
 */
export default function Articles() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">文章管理</h1>
      <div className="bg-card rounded-lg border p-6">
        <p className="text-muted-foreground">
          文章内容将在这里显示
        </p>
      </div>
    </div>
  );
}

