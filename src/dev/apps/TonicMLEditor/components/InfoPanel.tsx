/** @jsxImportSource react */
import React from 'react';
import { cn } from '../../../shadcn/lib/utils.ts';
import useGlobalSettings from '../../../store/useGlobalSettings';
import useTonicMLEditorStore from '../stores/useTonicMLEditorStore.ts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../shadcn/components/ui/tabs.tsx';
import CompileResults from './CompileResults.tsx';
import EmptyState from './EmptyState.tsx';
import JsonView from '@uiw/react-json-view';
import { buildThemeFontStack, buildCodeFontStack } from '../../../store/useGlobalSettings/fontStackBuilder.ts';

export default function InfoPanel() {
  const { navigationHeight, codeFontFamily, chineseFontFamily, englishFontFamily } = useGlobalSettings() as any;
  const { containerPaddingTop, containerPaddingBottom, panelHeadHeight, compiler } = useTonicMLEditorStore();
  
  // 构建字体栈
  const themeStack = buildThemeFontStack(chineseFontFamily ?? null, englishFontFamily ?? null);
  const codeStack = buildCodeFontStack(codeFontFamily ?? null, themeStack, chineseFontFamily ?? null, englishFontFamily ?? null);

  // 动态计算高度：视口高度 - 导航栏 - 容器 padding
  const totalContainerPadding = containerPaddingTop + containerPaddingBottom;
  const panelHeight = `calc(100vh - ${navigationHeight}px - ${totalContainerPadding}px)`;
  const contentHeight = `calc(100vh - ${navigationHeight}px - ${totalContainerPadding}px - ${panelHeadHeight}px)`;

  const [activeTab, setActiveTab] = React.useState<'compile' | 'json' | 'score'>('compile');

  // 胶囊风格滑动指示器
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const compileRef = React.useRef<HTMLDivElement | null>(null);
  const jsonRef = React.useRef<HTMLDivElement | null>(null);
  const scoreRef = React.useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = React.useState<{ left: number; width: number; top: number; height: number }>({ left: 0, width: 0, top: 0, height: 0 });

  const updateIndicator = React.useCallback(() => {
    const map: Record<string, React.RefObject<HTMLDivElement>> = {
      compile: compileRef,
      json: jsonRef,
      score: scoreRef,
    };
    const target = map[activeTab]?.current;
    const container = listRef.current;
    if (target && container) {
      const insetY = 5; // 顶/底留白
      const left = target.offsetLeft;
      const width = target.offsetWidth;
      const top = target.offsetTop + insetY;
      const height = Math.max(0, target.offsetHeight - insetY * 2);
      setIndicator({ left, width, top, height });
    }
  }, [activeTab]);

  React.useEffect(() => {
    // 初始与切换时更新
    updateIndicator();
  }, [updateIndicator]);

  React.useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateIndicator]);

  return (
    <Tabs className="w-full max-w-4xl" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
      <div
        className={cn(
          'flex flex-col overflow-hidden',
          'bg-card rounded-lg border shadow-sm'
        )}
        style={{ height: panelHeight }}
      >
        {/* 头部标签切换（胶囊+滑动指示器） */}
        <div
          className="border-b border-border bg-card shrink-0 flex items-center justify-start pl-3 pr-3"
          style={{ height: `${panelHeadHeight}px` }}
        >
          <div className="relative">
            <TabsList ref={listRef as any} className="relative h-11 px-2">
              {/* 滑动指示器（扁平化） */}
              <span
                className="pointer-events-none absolute rounded-md bg-primary/20 border border-primary/40 transition-all duration-300 ease-out"
                style={{ left: indicator.left, width: indicator.width, top: indicator.top, height: indicator.height }}
              />
              <TabsTrigger asChild value="compile">
                <div
                  ref={compileRef as any}
                  className="relative z-10 h-10 w-20 px-5 !bg-transparent border-0 shadow-none rounded-none hover:text-foreground transition-colors cursor-pointer flex items-center justify-center data-[state=active]:!bg-transparent data-[state=active]:shadow-none"
                >
                  <span className={cn("transition-colors", activeTab === 'compile' ? 'text-primary font-bold' : 'text-muted-foreground')}>
                    编译结果
                  </span>
                </div>
              </TabsTrigger>
              <TabsTrigger asChild value="json">
                <div
                  ref={jsonRef as any}
                  className="relative z-10 h-10 w-20 px-5 !bg-transparent border-0 shadow-none rounded-none hover:text-foreground transition-colors cursor-pointer flex items-center justify-center data-[state=active]:!bg-transparent data-[state=active]:shadow-none"
                >
                  <span className={cn("transition-colors", activeTab === 'json' ? 'text-primary font-bold' : 'text-muted-foreground')}>
                    JSON
                  </span>
                </div>
              </TabsTrigger>
              <TabsTrigger asChild value="score">
                <div
                  ref={scoreRef as any}
                  className="relative z-10 h-10 w-20 px-5 !bg-transparent border-0 shadow-none rounded-none hover:text-foreground transition-colors cursor-pointer flex items-center justify-center data-[state=active]:!bg-transparent data-[state=active]:shadow-none"
                >
                  <span className={cn("transition-colors", activeTab === 'score' ? 'text-primary font-bold' : 'text-muted-foreground')}>
                    乐谱
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="overflow-auto p-4" style={{ height: contentHeight }}>
          <TabsContent value="compile" className="m-0 h-full">
            <CompileResults compiler={compiler} />
          </TabsContent>
          <TabsContent value="json" className="m-0 h-full flex items-center justify-center">
            {!compiler ? (
              <EmptyState description="点击「编译」按钮开始编译" />
            ) : !compiler.isValid() ? (
              <EmptyState type="error" />
            ) : (
              <div className="w-full">
                <JsonView
                  value={compiler.getResult() || {}}
                  collapsed={2}
                  displayDataTypes={false}
                  enableClipboard={true}
                  style={{
                    fontSize: '13px',
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
            )}
          </TabsContent>
          <TabsContent value="score" className="m-0">
            <div className="text-muted-foreground">乐谱 占位</div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

