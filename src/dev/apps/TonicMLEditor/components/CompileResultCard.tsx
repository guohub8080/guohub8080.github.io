/** @jsxImportSource react */
import React from 'react';
import { cn } from '../../../shadcn/lib/utils.ts';
import type { DebugMessage } from '../../../tonicml';
import { XCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface CompileResultCardProps {
  message: DebugMessage;
  index: number;
  fontFamily: string;
}

/**
 * 编译结果卡片组件
 * 
 * 用于展示编译过程中的各种消息（INFO、WARNING、ERROR等）
 * 每个卡片显示消息类型、标签、内容以及可能的位置信息
 */
export default function CompileResultCard({ message, index, fontFamily }: CompileResultCardProps) {
  // 根据消息类型获取样式和图标
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'ERROR':
        return {
          border: 'border-l-red-500 dark:border-l-red-400',
          bg: 'bg-red-50/50 dark:bg-red-950/10',
          text: 'text-red-700 dark:text-red-400',
          tagBg: 'bg-red-600 dark:bg-red-700',
          tagText: 'text-white',
          icon: <XCircle className="w-4 h-4" />,
        };
      case 'WARNING':
        return {
          border: 'border-l-yellow-500 dark:border-l-yellow-400',
          bg: 'bg-yellow-50/50 dark:bg-yellow-950/10',
          text: 'text-yellow-700 dark:text-yellow-400',
          tagBg: 'bg-yellow-600 dark:bg-yellow-700',
          tagText: 'text-white',
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      case 'SUCCESS':
        return {
          border: 'border-l-green-500 dark:border-l-green-400',
          bg: 'bg-green-50/50 dark:bg-green-950/10',
          text: 'text-green-700 dark:text-green-400',
          tagBg: 'bg-green-600 dark:bg-green-700',
          tagText: 'text-white',
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      default: // INFO
        return {
          border: 'border-l-blue-500 dark:border-l-blue-400',
          bg: 'bg-blue-50/50 dark:bg-blue-950/10',
          text: 'text-blue-700 dark:text-blue-400',
          tagBg: 'bg-blue-600 dark:bg-blue-700',
          tagText: 'text-white',
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
    }
  };

  const typeStyle = getTypeStyle(message.type);
  const hasSource = message.source && (message.source.line || message.source.column);

  // 提取tag的详细部分（去掉stage前缀）
  const getTagDetail = (tag: string) => {
    const match = tag.match(/^S\d+_(.+)$/);
    return match ? match[1] : tag;
  };

  return (
    <div
      className={cn(
        'border-y border-r border-border/40 border-l-[6px] rounded-md transition-colors',
        typeStyle.border,
        typeStyle.bg
      )}
      style={{ fontFamily }}
    >
      <div className="px-3 py-2.5 space-y-2">
        {/* 第一行：图标和Tag */}
        <div className="flex items-center gap-2">
          {/* 图标 */}
          <div className={cn('shrink-0', typeStyle.text)}>
            {typeStyle.icon}
          </div>
          
          {/* Tag */}
          {message.tag && (
            <span className={cn(
              'font-mono text-xs px-2 py-0.5 rounded',
              typeStyle.tagBg,
              typeStyle.tagText
            )}>
              {getTagDetail(message.tag)}
            </span>
          )}
        </div>

        {/* 第二行：消息内容 */}
        <div className="text-sm text-foreground pl-6">
          {message.message}
        </div>

        {/* 第三行：位置信息（如果有）- 放在最下面 */}
        {hasSource && (
          <div className="flex items-center gap-2 pl-6 pt-1">
            {message.source.line !== undefined && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                line {message.source.line}
              </span>
            )}
            {message.source.column !== undefined && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                column {message.source.column}
              </span>
            )}
            {message.source.offset !== undefined && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                offset {message.source.offset}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

