/** @jsxImportSource react */
import React from 'react';
import { cn } from '../../../shadcn/lib/utils.ts';
import CompileResultCard from './CompileResultCard.tsx';
import EmptyState from './EmptyState.tsx';
import type { TonicMLCompiler } from '../../../tonicml';
import { Copy, Check, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../../shadcn/components/ui/button.tsx';
import toast from 'react-hot-toast';
import useGlobalSettings from '../../../store/useGlobalSettings';
import { buildThemeFontStack, buildCodeFontStack } from '../../../store/useGlobalSettings/fontStackBuilder.ts';
import stageIdentifier from '../../../tonicml/types/stageIdentifier.ts';
import JsonView from '@uiw/react-json-view';

interface CompileResultsProps {
  compiler: TonicMLCompiler | null;
}

// Stage ID 到名称的映射
const STAGE_NAMES: Record<string, string> = {
  'S1': stageIdentifier.s1,
  'S2': stageIdentifier.s2,
  'S3': stageIdentifier.s3,
  'S4': stageIdentifier.s4,
  'S5': stageIdentifier.s5,
  'S6': stageIdentifier.s6,
  'S7': stageIdentifier.s7,
  'S8': stageIdentifier.s8,
  'S9': stageIdentifier.s9,
  'S10': stageIdentifier.s10,
};

/**
 * 编译结果展示组件
 * 
 * 显示所有编译阶段的消息卡片
 * 包含总体状态、耗时统计和详细的消息列表
 */
export default function CompileResults({ compiler }: CompileResultsProps) {
  // 获取全局字体设置
  const { codeFontFamily, chineseFontFamily, englishFontFamily } = useGlobalSettings() as any;
  
  // 构建字体栈
  const themeStack = buildThemeFontStack(chineseFontFamily ?? null, englishFontFamily ?? null);
  const codeStack = buildCodeFontStack(codeFontFamily ?? null, themeStack, chineseFontFamily ?? null, englishFontFamily ?? null);

  // 复制状态 - 必须在任何条件返回之前调用所有 hooks
  const [copied, setCopied] = React.useState(false);
  
  // JSON 展开状态 - 每个 stage 独立控制
  const [expandedStages, setExpandedStages] = React.useState<Record<string, boolean>>({});

  // 检查编译器是否有效
  const isCompilerValid = compiler && typeof compiler.getInfo === 'function';

  // 从 compiler 实例获取所有信息（仅当编译器有效时）
  const messages = React.useMemo(() => {
    if (!isCompilerValid) return [];
    return [
      ...compiler.getInfo(),
      ...compiler.getWarnings(),
      ...compiler.getErrors(),
    ];
  }, [compiler, isCompilerValid]);

  const isValid = isCompilerValid ? compiler.isValid() : false;
  const totalDuration = isCompilerValid ? compiler.getTotalDuration() : null;

  // 统计各类型消息数量
  const errorCount = isCompilerValid ? compiler.getErrors().length : 0;
  const warningCount = isCompilerValid ? compiler.getWarnings().length : 0;
  const infoCount = isCompilerValid ? compiler.getInfo().length : 0;

  // 按stage分组消息
  const groupedByStage = React.useMemo(() => {
    const groups = new Map<string, { stageName: string; stageId: number; messages: typeof messages }>();
    
    messages.forEach(msg => {
      // 从tag中提取stage信息，例如 "S1_STAGE_START"
      const stageMatch = msg.tag?.match(/^(S\d+)_(.+)$/);
      if (stageMatch) {
        const stageKey = stageMatch[1]; // S1, S2, etc.
        const stageNumId = parseInt(stageKey.substring(1)); // 1, 2, etc.
        
        if (!groups.has(stageKey)) {
          // 使用预定义的stage名称
          const stageName = STAGE_NAMES[stageKey] || `Stage ${stageNumId}`;
          
          groups.set(stageKey, {
            stageName,
            stageId: stageNumId,
            messages: []
          });
        }
        groups.get(stageKey)!.messages.push(msg);
      } else {
        // 没有stage信息的消息放入"其他"分组
        if (!groups.has('OTHER')) {
          groups.set('OTHER', {
            stageName: 'Other',
            stageId: 999,
            messages: []
          });
        }
        groups.get('OTHER')!.messages.push(msg);
      }
    });

    // 按stage ID排序
    return Array.from(groups.entries())
      .sort(([, a], [, b]) => a.stageId - b.stageId)
      .map(([key, value]) => ({ key, ...value }));
  }, [messages]);

  // 如果没有编译器实例，或编译器方法不存在（可能由于序列化问题），显示空状态
  // 注意：这个条件返回必须在所有 hooks 之后
  if (!isCompilerValid) {
    return <EmptyState description="点击「编译」按钮开始编译" />;
  }

  // 复制全部信息
  const handleCopyAll = async () => {
    try {
      // 按stage分组格式化消息
      const formattedStages = groupedByStage.map((group) => {
        const stageHeader = `\n========================================\n${group.key} - ${group.stageName}\n${group.messages.length} ${group.messages.length === 1 ? 'message' : 'messages'}\n========================================`;
        
        const stageMessages = group.messages.map((msg, idx) => {
          const msgNum = `[${idx + 1}]`;
          const msgType = msg.type;
          const msgTag = msg.tag?.match(/^S\d+_(.+)$/)?.[1] || msg.tag || 'N/A';
          const header = `${msgNum} ${msgType} - ${msgTag}`;
          const content = msg.message;
          const position = msg.source 
            ? `位置: line ${msg.source.line || '?'}, column ${msg.source.column || '?'}, offset ${msg.source.offset || '?'}`
            : '';
          return [header, content, position].filter(Boolean).join('\n');
        }).join('\n\n');
        
        return [stageHeader, stageMessages].join('\n\n');
      }).join('\n\n');

      const summary = `编译${isValid ? '成功' : '失败'} | 耗时: ${totalDuration?.toFixed(2) || '?'}ms | 错误: ${errorCount} | 警告: ${warningCount} | 信息: ${infoCount}${formattedStages}`;
      
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success('已复制编译日志');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('复制失败');
    }
  };

  return (
    <div className="space-y-4" style={{ fontFamily: codeStack }}>
      {/* 编译总览 */}
      <div className={cn(
        'rounded-lg border p-4',
        isValid 
          ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
      )}>
        <div className="space-y-3">
          {/* 标题和耗时 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className={cn(
                'flex items-center gap-2 text-lg font-bold',
                isValid 
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              )}>
                {isValid ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>编译成功</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>编译失败</span>
                  </>
                )}
              </div>
              {totalDuration !== undefined && totalDuration !== null && (
                <span className="text-sm text-muted-foreground">
                  耗时: {totalDuration.toFixed(2)}ms
                </span>
              )}
            </div>

            {/* 复制按钮 - 在大屏显示在右上角，小屏在标题下方 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              className="gap-2 w-full sm:w-auto"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制编译日志
                </>
              )}
            </Button>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
            {errorCount > 0 && (
              <span className="text-red-600 dark:text-red-400 font-semibold">
                错误: {errorCount}
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                警告: {warningCount}
              </span>
            )}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              信息: {infoCount}
            </span>
            <span className="text-muted-foreground">
              总计: {messages.length}
            </span>
          </div>
        </div>
      </div>

      {/* 按Stage分组的消息列表 */}
      <div className="space-y-6">
        {groupedByStage.map((group) => (
          <div key={group.key} className="space-y-3">
            {/* Stage 标题 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pb-2 border-b border-border">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Stage 编号徽章 */}
                <span className="text-sm font-mono px-2.5 py-1 rounded bg-muted text-foreground border border-border shrink-0">
                  {group.key}
                </span>
                
                {/* Stage 名称 */}
                <h3 className="text-base font-semibold text-foreground truncate">
                  {group.stageName}
                </h3>
              </div>
              
              {/* 消息统计 */}
              <span className="text-xs text-muted-foreground shrink-0 sm:ml-auto">
                {group.messages.length} {group.messages.length === 1 ? 'message' : 'messages'}
              </span>
            </div>

            {/* 该Stage的消息卡片 */}
            <div className="space-y-1.5 pl-2">
              {group.messages.map((message, index) => (
                <CompileResultCard
                  key={index}
                  message={message}
                  index={index + 1}
                  fontFamily={codeStack}
                />
              ))}
            </div>

            {/* Stage 结果预览 */}
            {group.key !== 'OTHER' && (
              <div className="pl-2 mt-3">
                <div className="border border-border/40 rounded-md overflow-hidden bg-card/50">
                  <div className="px-3 py-2 bg-muted border-b border-border/40 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {group.key} - {group.stageName} Result
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedStages(prev => ({
                        ...prev,
                        [group.key]: !prev[group.key]
                      }))}
                      className="h-6 px-2 gap-1"
                    >
                      {expandedStages[group.key] ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          <span className="text-xs">折叠</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          <span className="text-xs">展开</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="p-3">
                    <JsonView
                      value={compiler.getStageResult(group.stageId)?.result || {}}
                      collapsed={expandedStages[group.key] ? false : 2}
                      displayDataTypes={false}
                      enableClipboard={false}
                      style={{
                        fontSize: '12px',
                        fontFamily: codeStack,
                        backgroundColor: 'transparent',
                        '--w-rjv-background-color': 'transparent',
                        '--w-rjv-border-left-color': 'var(--border)',
                      } as React.CSSProperties}
                    >
                      <JsonView.String
                        render={(props, ctx) => {
                          const { type, value } = ctx;
                          if (type === 'value' && typeof value === 'string') {
                            // 将实际换行替换为字面量 \n，同时处理其他转义字符
                            const escaped = value
                              .replace(/\\/g, '\\\\')  // 先转义反斜杠
                              .replace(/\n/g, '\\n')   // 换行
                              .replace(/\r/g, '\\r')   // 回车
                              .replace(/\t/g, '\\t');  // 制表符
                            return <span {...props}>{escaped}</span>;
                          }
                          return <span {...props} />;
                        }}
                      />
                    </JsonView>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

