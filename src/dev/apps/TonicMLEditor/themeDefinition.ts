import type { editor } from 'monaco-editor';
import type { EditorTheme } from './stores/useTonicMLEditorStore.ts';

/**
 * Monaco 编辑器主题定义
 */
export interface ThemeDefinition {
  base: 'vs' | 'vs-dark' | 'hc-black';
  inherit: boolean;
  rules: editor.ITokenThemeRule[];
  colors: { [key: string]: string };
}

/**
 * TonicML 语法高亮规则
 */
const getTonicMLRules = (isDark: boolean): editor.ITokenThemeRule[] => {
  return [
    // 元数据命令 ($title, $author, $key 等)
    { token: 'keyword.command.meta', foreground: isDark ? 'C586C0' : '811F3F', fontStyle: 'bold' },
    
    // @ 命令 (@M, @section, @phrase 等)
    { token: 'keyword.command.at', foreground: isDark ? '569CD6' : '0000FF', fontStyle: 'bold' },
    
    // @ 语法糖 (@~intro, @~verse 等)
    { token: 'keyword.command.sugar', foreground: isDark ? '4EC9B0' : '008080', fontStyle: 'bold' },
    
    // 音符 (C, D, E, F, G, A, B 及其变音)
    { token: 'constant.note', foreground: isDark? 'DCDCAA' : '795E26' },
    
    // 和弦 ([Cmaj7], [Am] 等)
    { token: 'entity.chord', foreground: isDark ? '4FC1FF' : '0070C1', fontStyle: 'bold' },
    
    // 数字 (时值、八度等)
    { token: 'constant.numeric', foreground: isDark ? 'B5CEA8' : '09885A' },
    
    // 字符串 (在 {} 中的内容)
    { token: 'string', foreground: isDark ? 'CE9178' : 'A31515' },
    
    // 注释 (# 开头)
    { token: 'comment', foreground: isDark ? '6A9955' : '008000', fontStyle: 'italic' },
    
    // 特殊符号 (|, ||, :, :: 等)
    { token: 'keyword.operator', foreground: isDark ? 'D4D4D4' : '000000' },
    
    // 修饰符 (#, b, ~ 等)
    { token: 'keyword.modifier', foreground: isDark ? 'FFC66D' : 'FF8C00' },
    
    // 休止符 (0, rest)
    { token: 'constant.rest', foreground: isDark ? '808080' : '808080', fontStyle: 'italic' },
  ];
};

/**
 * 暗色主题配置
 */
const getDarkThemeColors = (): { [key: string]: string } => ({
  'editor.background': '#1e1e1e',
  'editor.foreground': '#d4d4d4',
  'editorLineNumber.foreground': '#858585',
  'editorLineNumber.activeForeground': '#c6c6c6',
  'editor.selectionBackground': '#264f78',
  'editor.inactiveSelectionBackground': '#3a3d41',
  'editorCursor.foreground': '#aeafad',
  'editor.lineHighlightBackground': '#2a2d2e',
  'editorWhitespace.foreground': '#3b3b3b',
  'editorIndentGuide.background': '#404040',
  'editorIndentGuide.activeBackground': '#707070',
  'editor.selectionHighlightBackground': '#add6ff26',
  'editorBracketMatch.background': '#0064001a',
  'editorBracketMatch.border': '#888888',
});

/**
 * 亮色主题配置
 */
const getLightThemeColors = (): { [key: string]: string } => ({
  'editor.background': '#ffffff',
  'editor.foreground': '#000000',
  'editorLineNumber.foreground': '#237893',
  'editorLineNumber.activeForeground': '#0B216F',
  'editor.selectionBackground': '#add6ff',
  'editor.inactiveSelectionBackground': '#e5ebf1',
  'editorCursor.foreground': '#000000',
  'editor.lineHighlightBackground': '#f0f0f0',
  'editorWhitespace.foreground': '#d3d3d3',
  'editorIndentGuide.background': '#d3d3d3',
  'editorIndentGuide.activeBackground': '#939393',
  'editor.selectionHighlightBackground': '#add6ff4d',
  'editorBracketMatch.background': '#0064001a',
  'editorBracketMatch.border': '#b9b9b9',
});

/**
 * 高对比度主题配置
 */
const getHCBlackThemeColors = (): { [key: string]: string } => ({
  'editor.background': '#000000',
  'editor.foreground': '#ffffff',
  'editorLineNumber.foreground': '#ffffff',
  'editorLineNumber.activeForeground': '#ffffff',
  'editor.selectionBackground': '#ffffff40',
  'editor.inactiveSelectionBackground': '#ffffff20',
  'editorCursor.foreground': '#ffffff',
  'editor.lineHighlightBackground': '#ffffff10',
  'editorWhitespace.foreground': '#ffffff40',
  'editorIndentGuide.background': '#ffffff20',
  'editorIndentGuide.activeBackground': '#ffffff60',
  'editor.selectionHighlightBackground': '#ffffff30',
  'editorBracketMatch.background': '#ffffff20',
  'editorBracketMatch.border': '#ffffff',
});

/**
 * 获取主题定义
 */
export const getThemeDefinition = (theme: EditorTheme): ThemeDefinition => {
  switch (theme) {
    case 'vs-dark':
    case 'dark':
    case 'monokai':
    case 'github-dark':
    case 'solarized-dark':
      return {
        base: 'vs-dark',
        inherit: true,
        rules: getTonicMLRules(true),
        colors: getDarkThemeColors(),
      };
    
    case 'vs-light':
    case 'light':
    case 'github-light':
    case 'solarized-light':
      return {
        base: 'vs',
        inherit: true,
        rules: getTonicMLRules(false),
        colors: getLightThemeColors(),
      };
    
    case 'hc-black':
      return {
        base: 'hc-black',
        inherit: true,
        rules: getTonicMLRules(true),
        colors: getHCBlackThemeColors(),
      };
    
    default:
      return {
        base: 'vs-dark',
        inherit: true,
        rules: getTonicMLRules(true),
        colors: getDarkThemeColors(),
      };
  }
};

/**
 * 获取所有主题定义（用于批量注册）
 */
export const getAllThemeDefinitions = (): Map<string, ThemeDefinition> => {
  const themes: EditorTheme[] = [
    'dark', 'light', 'vs-dark', 'vs-light', 'hc-black',
    'monokai', 'github-dark', 'github-light', 'solarized-dark', 'solarized-light'
  ];
  
  const themeMap = new Map<string, ThemeDefinition>();
  
  themes.forEach((theme) => {
    themeMap.set(`tonicml-${theme}`, getThemeDefinition(theme));
  });
  
  return themeMap;
};

