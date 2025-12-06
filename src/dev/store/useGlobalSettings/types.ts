// 基础主题类型（可扩展）
export type BaseTheme = 'light' | 'dark' | 'blue' | 'green' | 'purple';

// 主题模式：具体主题 或 跟随系统
export type ThemeMode = BaseTheme | 'system';

// 背景样式类型
export type BackgroundMode = 'gradient' | 'none' | 'aurora';

/**
 * 全局设置类型定义
 * 统一管理所有全局设置：主题、字体、导航栏等
 */
export interface GlobalSettingsState {
  // 主题相关
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  // 背景相关
  mainDynamicBackround: BackgroundMode;
  setMainDynamicBackround: (bg: BackgroundMode) => void;
  
  // 导航栏高度相关
  navigationHeight: number;
  setNavigationHeight: (height: number) => void;

  // 字体相关，中文字体
  chineseFontFamily: string | null;
  setChineseFontFamily: (font: string | null) => void;

  // 字体相关，英文字体
  englishFontFamily: string | null;
  setEnglishFontFamily: (font: string | null) => void;

  // 字体相关，代码字体
  codeFontFamily: string | null;
  setCodeFontFamily: (font: string | null) => void;

  // 字体相关，日文字体（其他东亚字体）
  japaneseFontFamily: string | null;
  setJapaneseFontFamily: (font: string | null) => void;

  // 字体权重相关 - 全局设置，不区分中文、英文、代码
  // Tailwind 字重类的具体数值（body 默认使用 font-normal）
  fontWeightLight: number;
  setFontWeightLight: (weight: number) => void;
  
  fontWeightNormal: number;
  setFontWeightNormal: (weight: number) => void;
  
  fontWeightMedium: number;
  setFontWeightMedium: (weight: number) => void;
  
  fontWeightSemibold: number;
  setFontWeightSemibold: (weight: number) => void;
  
  fontWeightBold: number;
  setFontWeightBold: (weight: number) => void;
  
  // 文章行高相关
  articleLineHeight: number;
  setArticleLineHeight: (height: number) => void;
  
  // 书籍布局相关
  bookSideWidth: number;
  setBookSideWidth: (width: number) => void;
  
  bookContentWidth: number;
  setBookContentWidth: (width: number) => void;
  
  bookContentPadding: number;
  setBookContentPadding: (padding: number) => void;
  
  bookSideContentGap: number;
  setBookSideContentGap: (gap: number) => void;
  
  // 书籍目录显示控制
  isBookTocShow: boolean;
  setIsBookTocShow: (show: boolean) => void;
  toggleBookTocShow: () => void;
  
  // 页面类型管理 - 由 loader 设置
  // 当前是否为书籍页面
  isBookPage: boolean;
  setIsBookPage: (isBook: boolean) => void;
  
  // 最后访问的 URL（从 # 开始）
  lastVisitedUrl: string;
  setLastVisitedUrl: (url: string) => void;
  
  // 导航面板显示控制
  isNavigationPanelOpen: boolean;
  setIsNavigationPanelOpen: (open: boolean) => void;
  toggleNavigationPanel: () => void;
  
  resetStore: () => void;
  resetFontSettings: () => void;
}
