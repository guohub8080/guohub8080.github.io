/** @jsxImportSource react */
import React from 'react';
import { FileCode2, XCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'empty' | 'error';
  title?: string;
  description?: string;
  centered?: boolean;
}

/**
 * 空状态组件
 * 
 * 用于显示无数据或错误状态的统一占位符
 */
export default function EmptyState({ 
  type = 'empty',
  title,
  description,
  centered = true
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-muted-foreground">
      {type === 'empty' ? (
        <>
          <FileCode2 className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">{title || '暂无编译结果'}</p>
          {description && <p className="text-sm mt-2">{description}</p>}
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-base font-medium">{title || '编译失败，请查看编译日志'}</p>
          {description && <p className="text-sm mt-2">{description}</p>}
        </>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="h-full flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

