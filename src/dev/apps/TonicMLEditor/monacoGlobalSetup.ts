import type * as Monaco from 'monaco-editor';
import { getAllThemeDefinitions } from './themeDefinition.ts';

/**
 * 标记：Monaco 全局配置是否已经完成
 */
let isMonacoSetupDone = false;

/**
 * TonicML 语言语法规则
 */
const getTonicMLLanguageConfig = (): Monaco.languages.LanguageConfiguration => ({
  comments: {
    lineComment: '#',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
});

/**
 * TonicML 语言 Token 规则
 */
const getTonicMLTokensProvider = (): Monaco.languages.IMonarchLanguage => ({
  defaultToken: '',
  tokenPostfix: '.tonicml',
  
  // 关键字定义 - 使用字符串模式
  metaCommandsPattern: '(?:title|author|style|genre|date|key|K|k|octave|O|o|clef|bpm|tempo|beat|time|part|P|p)',
  atCommandsPattern: '(?:M|m|phrase|ph|f|section|sec|s|S|C|c|part)',
  sugarCommandsPattern: '(?:intro|verse|chorus|bridge|solo|outro|prechorus|interlude|coda)',
  
  tokenizer: {
    root: [
      // 注释 (# 开头)
      [/^#.*$/, 'comment'],
      [/#.*$/, 'comment'],
      
      // 元数据命令 ($title{...}, $key{C} 等)
      [/\$(title|author|style|genre|date|key|K|k|octave|O|o|clef|bpm|tempo|beat|time|part|P|p)\{/, { token: 'keyword.command.meta', next: '@metaContent' }],
      
      // @~ 语法糖 (@~intro, @~verse 等)
      [/@~(intro|verse|chorus|bridge|solo|outro|prechorus|interlude|coda)\b/, 'keyword.command.sugar'],
      
      // @ 命令 (@M{1}, @section{intro} 等)
      [/@(M|m|phrase|ph|f|section|sec|s|S|C|c|part)(?:\{|(?=\s|$))/, { token: 'keyword.command.at', next: '@atContent' }],
      
      // 普通 @ 注释 (@{...})
      [/@\{/, { token: 'comment', next: '@commentContent' }],
      
      // 和弦 ([Cmaj7], [Am] 等)
      [/\[([A-G][#b]?(?:maj|min|m|sus|dim|aug|add)?[0-9]*)\]/, 'entity.chord'],
      
      // 音符 (带修饰符)
      [/[A-Ga-g][#b~^_]*/, 'constant.note'],
      
      // 休止符
      [/\b(?:0|rest)\b/, 'constant.rest'],
      
      // 数字 (时值、八度)
      [/\d+/, 'constant.numeric'],
      
      // 小节线和特殊符号
      [/\|\|/, 'keyword.operator'],
      [/\|/, 'keyword.operator'],
      [/::/, 'keyword.operator'],
      [/:/, 'keyword.operator'],
      [/\./, 'keyword.operator'],
      [/,/, 'keyword.operator'],
      
      // 空白字符
      [/\s+/, 'white'],
    ],
    
    // 元数据命令内容
    metaContent: [
      [/[^}]+/, 'string'],
      [/}/, { token: 'keyword.command.meta', next: '@pop' }],
    ],
    
    // @ 命令内容
    atContent: [
      [/\{/, { token: 'keyword.command.at', next: '@atBraceContent' }],
      [/$/, { token: '', next: '@pop' }],
      [/\s/, { token: 'white', next: '@pop' }],
    ],
    
    atBraceContent: [
      [/[^}]+/, 'string'],
      [/}/, { token: 'keyword.command.at', next: '@pop' }],
    ],
    
    // 注释内容
    commentContent: [
      [/[^}]+/, 'comment'],
      [/}/, { token: 'comment', next: '@pop' }],
    ],
  },
});

/**
 * 设置 Monaco 编辑器的全局配置
 * 包括：语言注册、主题注册等
 * 
 * 注意：这个函数只会执行一次，避免重复注册
 */
export const setupMonacoGlobal = (monaco: typeof Monaco): void => {
  // 如果已经设置过，直接返回
  if (isMonacoSetupDone) {
    return;
  }
  
  try {
    // 1. 注册 TonicML 语言
    monaco.languages.register({
      id: 'tonicml',
      extensions: ['.tml', '.tonicml'],
      aliases: ['TonicML', 'tonicml'],
      mimetypes: ['text/x-tonicml'],
    });
    
    // 2. 设置语言配置
    monaco.languages.setLanguageConfiguration('tonicml', getTonicMLLanguageConfig());
    
    // 3. 设置语法高亮规则
    monaco.languages.setMonarchTokensProvider('tonicml', getTonicMLTokensProvider());
    
    // 4. 注册所有主题
    const themes = getAllThemeDefinitions();
    themes.forEach((definition, themeName) => {
      monaco.editor.defineTheme(themeName, definition);
    });
    
    // 标记为已完成
    isMonacoSetupDone = true;
    
    console.log('✅ Monaco 全局配置完成 - TonicML 语言已注册，主题已加载');
  } catch (error) {
    console.error('❌ Monaco 全局配置失败:', error);
  }
};

/**
 * 重置 Monaco 设置状态（主要用于测试）
 */
export const resetMonacoSetup = (): void => {
  isMonacoSetupDone = false;
};

/**
 * 检查 Monaco 是否已设置
 */
export const isMonacoSetup = (): boolean => {
  return isMonacoSetupDone;
};

