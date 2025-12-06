import type { editor } from 'monaco-editor';
import type { EditorFont } from './stores/useTonicMLEditorStore.ts';

export const getEditorOptions = (
  readOnly: boolean = false,
  font?: EditorFont
): editor.IStandaloneEditorConstructionOptions => {
  // 使用传入的字体配置或默认值
  const fontSize = font?.size || 16;
  const fontFamily = font?.family || 'Consolas, "Courier New", monospace';
  const fontWeight = font?.weight || 'normal';

  return {
    // 基础配置
    fontSize,
    fontFamily,
    fontWeight,
    lineHeight: 1.5,
    // 代码区域上下内边距，避免贴边
    padding: {
      top: 10,
      bottom: 10,
    },
    
    // 行号配置
    lineNumbers: 'on',
    lineNumbersMinChars: 3,
    
    // 滚动配置
    scrollBeyondLastLine: false,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 14, // 滚动条宽度（垂直）
      horizontalScrollbarSize: 14, // 滚动条宽度（水平）
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      handleMouseWheel: true
    },
    
    // 编辑配置
    readOnly: readOnly,
    wordWrap: 'on',
    wordWrapColumn: 80,
    wrappingIndent: 'indent',
    
    // 缩进配置
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    
    // 渲染配置
    renderWhitespace: 'selection',
    renderControlCharacters: false,
    renderLineHighlight: 'line',
    
    // 括号配置
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true,
      highlightActiveIndentation: true
    },
    
    // 选择配置
    selectOnLineNumbers: true,
    selectionHighlight: true,
    occurrencesHighlight: 'singleFile',
    
    // 光标配置
    cursorBlinking: 'blink',
    cursorStyle: 'line',
    cursorWidth: 0,
    cursorSmoothCaretAnimation: 'on',
    
    // 自动布局
    automaticLayout: true,
    
    // 小地图配置
    minimap: {
      enabled: false
    },
    
    // 建议配置
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showFunctions: true,
      showConstructors: true,
      showFields: true,
      showVariables: true,
      showClasses: true,
      showStructs: true,
      showInterfaces: true,
      showModules: true,
      showProperties: true,
      showEvents: true,
      showOperators: true,
      showUnits: true,
      showValues: true,
      showConstants: true,
      showEnums: true,
      showEnumMembers: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showFolders: true,
      showTypeParameters: true,
      showIssues: true,
      showUsers: true,
      showWords: true
    },
    
    // 快速建议
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    
    // 参数提示
    parameterHints: {
      enabled: true,
      cycle: true
    },
    
    // 悬停提示
    hover: {
      enabled: true,
      delay: 300,
      sticky: true
    },
    
    // 代码折叠
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    unfoldOnClickAfterEndOfLine: false,
    
    // 链接检测
    links: true,
    
    // 颜色装饰器
    colorDecorators: true,
    
    // 代码镜头
    codeLens: false,
    
    // 粘性滚动
    stickyScroll: {
      enabled: false
    },
    
    // 内联建议
    inlineSuggest: {
      enabled: false
    },
    
    // 无障碍
    accessibilitySupport: 'off', // 禁用虚拟键盘图标，避免点击报错
    
    // 其他配置
    contextmenu: true,
    mouseWheelZoom: false, // 禁用鼠标滚轮缩放
    smoothScrolling: true, // 平滑滚动
    cursorSurroundingLines: 0, // 光标周围行数
    cursorSurroundingLinesStyle: 'default', // 光标周围行数样式
    multiCursorModifier: 'ctrlCmd', // 多光标修饰符
    accessibilityPageSize: 10, // 辅助功能页面大小
    fixedOverflowWidgets: false, // 固定溢出小部件
    overviewRulerBorder: false, // 概览边框（禁用）
  };
};
