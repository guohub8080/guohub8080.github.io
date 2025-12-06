/** @jsxImportSource react */
/**
 * 任务清单组件
 * 需搭配后端管理任务
 */
import React from "react";

export default function PlanToDo() {
  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">任务清单</h1>
        <p className="text-muted-foreground">需搭配后端管理任务</p>
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        <p className="text-center text-muted-foreground">
          任务清单功能开发中...
        </p>
      </div>
    </div>
  );
}
