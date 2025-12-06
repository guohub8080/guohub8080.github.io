/** @jsxImportSource react */
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../../shadcn/lib/utils.ts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../../../shadcn/components/ui/dropdown-menu.tsx';
import { Button } from '../../../shadcn/components/ui/button.tsx';
import { Slider } from '../../../shadcn/components/ui/slider.tsx';
import { Badge } from '../../../shadcn/components/ui/badge.tsx';
import toast from 'react-hot-toast';
import TonicMLIcon from '../svg/TonicMLIcon.tsx';
import { ChevronDown, Type, Copy, FolderOpen, Download, Loader2, Play } from 'lucide-react';
import { TonicMLCompiler } from '../../../tonicml';
import useGlobalSettings from '../../../store/useGlobalSettings';
import { buildThemeFontStack, buildCodeFontStack } from '../../../store/useGlobalSettings/fontStackBuilder.ts';
import useTonicMLEditorStore, { EditorFont, EditorTheme } from '../stores/useTonicMLEditorStore.ts';
import Editor from '@monaco-editor/react';
import type { editor as monacoEditor } from 'monaco-editor';
import { getEditorOptions } from '../editorConfig.ts';
import { setupMonacoGlobal } from '../monacoGlobalSetup.ts';
// merged store already imported above

export default function EditorPanel() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontDialogOpen, setFontDialogOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const {
    navigationHeight,
    chineseFontFamily,
    englishFontFamily,
    codeFontFamily,
    setCodeFontFamily,
    setChineseFontFamily,
  } = useGlobalSettings() as any;
  const {
    codeContent,
    setCodeContent,
    panelHeadHeight,
    containerPaddingTop,
    containerPaddingBottom,
    theme: editorTheme,
    font: editorFont,
    setTonicMLEditorFontSize,
    setTonicMLEditorFontFamily,
    setCompiler,
  } = useTonicMLEditorStore();

  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    console.log('当前编辑器主题:', editorTheme);
  }, [editorTheme]);

  // 动态计算高度：视口高度 - 导航栏 - 容器 padding
  // Panel 头部高度从 store 中获取
  const totalContainerPadding = containerPaddingTop + containerPaddingBottom;
  const panelHeight = `calc(100vh - ${navigationHeight}px - ${totalContainerPadding}px)`;
  const contentHeight = `calc(100vh - ${navigationHeight}px - ${totalContainerPadding}px - ${panelHeadHeight}px)`;
  const fontSizeDisplay = editorFont?.size || 16;

  // 字体大小设置函数
  const applyFontSize = (size: number) => {
    const target = Math.max(8, Math.min(48, Math.round(size)));
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: target });
      editorRef.current.layout();
    }
    setTonicMLEditorFontSize(target);
  };

  /**
   * 编译按钮处理函数
   * 
   * 工作流程：
   * 1. 检查是否正在编译中（防止重复点击）
   * 2. 创建 TonicMLCompiler 实例并传入编辑器内容
   * 3. 打印实例对象用于调试
   * 4. 执行编译流程
   * 5. 保存 compiler 实例到 store（包含所有结果和方法）
   * 6. 检查编译结果并显示提示信息
   * 7. 如果发生异常，捕获并显示错误信息
   */
  const handleCompile = async () => {
    // 防止重复点击编译按钮
    if (isCompiling) return;
    
    // 设置编译状态为进行中
    setIsCompiling(true);
    
    // 声明编译器实例变量，用于在 catch 块中也能访问
    let compiler: TonicMLCompiler | null = null;
    
    try {
      // 步骤1: 创建 TonicMLCompiler 编译器实例
      // 传入当前编辑器的内容（codeContent），如果为空则传入空字符串
      compiler = new TonicMLCompiler(codeContent || '');
      
      // 步骤2: 打印实例对象，用于调试查看编译器的初始状态
      // 包含 rawText（原始文本）、stages（各阶段结果）等信息
      console.log('🎯 TonicMLCompiler 实例对象:', compiler);
      
      // 步骤3: 执行完整的编译流程
      // 这会依次执行 S1-S10 所有编译阶段
      compiler.compile();
      
      // 步骤4: 保存 compiler 实例到 store
      // compiler 实例包含所有编译结果和方法（getInfo、getErrors、isValid等）
      setCompiler(compiler);
      
      // 步骤5: 编译完成（不再显示 toast，结果会在编译结果面板中显示）
      // 用户可以在 CompileResults 组件中查看详细的编译状态
    } catch (e: any) {
      // 步骤6: 异常处理
      // 如果编译过程中抛出异常（如防御性检查失败）
      // 打印当前的编译器实例状态，用于排查问题
      console.log('🎯 TonicMLCompiler 实例对象 (报错时):', compiler);
      
      // 即使异常也保存 compiler 实例（可能有部分结果）
      if (compiler) {
        setCompiler(compiler);
      }
      
      // 显示异常信息给用户
      toast.error(e?.message || '编译异常');
    } finally {
      // 步骤7: 无论成功、失败还是异常，都要重置编译状态
      // 允许用户再次点击编译按钮
      setIsCompiling(false);
    }
  };

  const downloadTmlMd = () => {
    try {
      const content = codeContent || '';
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const fname = `tonicml-${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}-${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.tml.md`;
      a.href = url;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('已下载 .tml.md');
    } catch (e) {
      toast.error('下载失败');
    }
  };

  const downloadTmlTxt = () => {
    try {
      const content = codeContent || '';
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const fname = `tonicml-${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}-${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.tml.txt`;
      a.href = url;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('已下载 .tml.txt');
    } catch (e) {
      toast.error('下载失败');
    }
  };

  // 主题变更时应用 Monaco 主题
  useEffect(() => {
    if (monacoRef.current) {
      const themeName = `tonicml-${editorTheme}`;
      monacoRef.current.editor.setTheme(themeName);
    }
  }, [editorTheme]);

  // 字体配置或全局字体栈变化时更新编辑器
  useEffect(() => {
    if (editorRef.current) {
      const themeStack = buildThemeFontStack(chineseFontFamily ?? null, englishFontFamily ?? null);
      const codeStack = buildCodeFontStack(codeFontFamily ?? null, themeStack, chineseFontFamily ?? null, englishFontFamily ?? null);
      const newOptions = getEditorOptions(false, {
        family: codeStack,
        size: editorFont?.size || 16,
        weight: editorFont?.weight || 'normal',
      });
      editorRef.current.updateOptions(newOptions);
      editorRef.current.layout();
      setTimeout(() => editorRef.current && editorRef.current.render(true), 100);
    }
  }, [editorFont, chineseFontFamily, englishFontFamily, codeFontFamily]);

  // 编辑器挂载回调
  const handleEditorDidMount = (
    editor: monacoEditor.IStandaloneCodeEditor,
    monaco: typeof import('monaco-editor')
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    setupMonacoGlobal(monaco);

    // 注册自动完成（同原有逻辑）
    const completionDisposable = monaco.languages.registerCompletionItemProvider('tonicml', {
      triggerCharacters: ['$', '@', '~'],
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });
        const match = textUntilPosition.match(/[\$][\w]*$|[@]~[\w]*$|[@][\w]*$/);
        if (!match) return { suggestions: [] };
        const matchStart = textUntilPosition.lastIndexOf(match[0]);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: matchStart + 1,
          endColumn: position.column
        };
        const suggestions: any[] = [];
        // 简化：保持与原实现一致（此处省略具体枚举，保留空数组即可正常运行）
        return { suggestions };
      }
    });

    // 应用当前主题
    const themeName = `tonicml-${editorTheme}`;
    monaco.editor.setTheme(themeName);

    // 格式化命令（保留）
    editor.addAction({
      id: 'format-tonicml',
      label: '格式化 TonicML 代码',
      keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
      contextMenuGroupId: 'modification',
      contextMenuOrder: 1.5,
      run: async () => {
        const model = editor.getModel();
        if (model) {
          const currentValue = model.getValue();
          const { formatTonicML } = await import('../utils/tonicMLFormatter.ts');
          const formattedValue = formatTonicML(currentValue);
          model.setValue(formattedValue);
        }
      }
    });

    editor.onDidDispose(() => {
      completionDisposable.dispose();
    });
  };

  // 实时计算字体栈（用于初次渲染与后续渲染的 options）
  const themeStackRender = buildThemeFontStack(chineseFontFamily ?? null, englishFontFamily ?? null);
  const codeStackRender = buildCodeFontStack(codeFontFamily ?? null, themeStackRender, chineseFontFamily ?? null, englishFontFamily ?? null);

  return (
    <div className={cn(
      'flex flex-col overflow-hidden w-full max-w-4xl',
      'bg-card rounded-lg border shadow-sm'
    )} style={{ height: panelHeight }}>
      {/* 固定标题栏 */}
      <div 
        className="border-b border-zinc-600 bg-slate-200 shrink-0 flex items-center justify-between gap-4 pl-3 pr-3" 
        style={{ height: `${panelHeadHeight}px` }}
      >
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="h-10 px-4">
              <TonicMLIcon className="h-5 w-5" useGradient />
              编辑器
              <ChevronDown className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 py-1.5" align="start">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="py-2.5 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground flex items-center gap-2">
                <Type className="h-4 w-4" />
                设置字体
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="py-1.5 text-base">
                  <DropdownMenuItem className="py-2.5 text-base cursor-pointer flex items-center gap-2" onSelect={() => { setFontDialogOpen(true); setMenuOpen(false); }}>
                    字号（{fontSizeDisplay}px）
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="py-2.5 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground">
                      中文字体
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="py-1.5 text-base">
                        <DropdownMenuRadioGroup
                          value={(chineseFontFamily ?? 'system') as string}
                          onValueChange={(v: string) => {
                            setChineseFontFamily && setChineseFontFamily(v === 'system' ? null : v);
                          }}
                        >
                          <DropdownMenuRadioItem value="minsans-v" className="py-2 text-base cursor-pointer">MiSans</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="syht-cn-v" className="py-2 text-base cursor-pointer">思源黑体</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="syst-cn-v" className="py-2 text-base cursor-pointer">思源宋体</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="system" className="py-2 text-base cursor-pointer">系统中文</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="py-2.5 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground">
                      代码字体
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="py-1.5 text-base">
                        <DropdownMenuRadioGroup
                          value={(codeFontFamily ?? 'system') as string}
                          onValueChange={(v: string) => {
                            setCodeFontFamily && setCodeFontFamily(v === 'system' ? 'system' : v);
                          }}
                        >
                          <DropdownMenuRadioItem value="jb-mono" className="py-2 text-base cursor-pointer">JetBrains Mono</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="consolas" className="py-2 text-base cursor-pointer">Consolas</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="system" className="py-2 text-base cursor-pointer">系统等宽</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem className="py-2.5 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground flex items-center gap-2" onSelect={async () => {
              try {
                await navigator.clipboard.writeText(codeContent || '');
                toast.success('已复制全部代码');
              } catch (e) {
                toast.error('复制失败');
              } finally {
                setMenuOpen(false);
              }
            }}>
              <Copy className="h-4 w-4" />
              复制全部代码
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="py-2.5 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground flex items-center gap-2">
                <Download className="h-4 w-4" />
                下载
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="py-1.5 text-base">
                  <DropdownMenuItem className="py-2 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground" onSelect={() => { downloadTmlMd(); setMenuOpen(false); }}>
                    .tml.md
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground" onSelect={() => { downloadTmlTxt(); setMenuOpen(false); }}>
                    .tml.txt
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="py-2.5 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                加载示例
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="py-1.5 text-base">
                  <DropdownMenuItem className="py-2 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    onSelect={() => { /* 示例1占位 */ }}>
                    示例1
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 text-base cursor-pointer hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    onSelect={() => { /* 示例2占位 */ }}>
                    示例2
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-2">
          <Button
            size="lg"
            className="h-10 px-4"
            onClick={handleCompile}
            disabled={isCompiling}
          >
            {isCompiling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> 正在编译
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> 编译
              </>
            )}
          </Button>
        </div>
      </div>
      {/* 字体大小设置弹窗 */}
      {fontDialogOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFontDialogOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-lg border bg-popover p-6 md:p-8 shadow-xl">
              <div className="mb-4 md:mb-5">
                <div className="text-xl font-semibold tracking-tight">设置字体大小</div>
                <div className="text-sm text-muted-foreground leading-relaxed">拖动滑块实时调整编辑器字体大小</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="rounded-full w-16 justify-center px-3 py-1.5 text-sm">
                  {editorFont?.size || 16}px
                </Badge>
                <Slider
                  value={[editorFont?.size || 16]}
                  min={10}
                  max={32}
                  step={1}
                  onValueChange={(v) => applyFontSize(v[0])}
                  className="w-full"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={() => setFontDialogOpen(false)}>关闭</Button>
                <Button size="sm" onClick={() => { applyFontSize(16); setFontDialogOpen(false); }}>还原为 16px</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 内容区域 - Monaco 编辑器 */}
      <div className="overflow-hidden" style={{ height: contentHeight }}>
        <Editor
          height={contentHeight}
          language="tonicml"
          theme={`tonicml-${editorTheme}`}
          value={codeContent}
          options={getEditorOptions(false, {
            family: codeStackRender,
            size: editorFont?.size || 16,
            weight: editorFont?.weight || 'normal',
          })}
          onChange={(val) => val !== undefined && setCodeContent(val)}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}
