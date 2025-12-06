/**
 * 全局设置默认值
 * 集中管理所有设置的初始值
 */
export const DEFAULT_VALUES = {
  theme: 'light' as const,
  mainDynamicBackround: 'gradient' as const,
  navigationHeight: 56,
  
  // 字体默认值
  chineseFontFamily: 'minsans-v',
  englishFontFamily: null, // 跟随中文
  codeFontFamily: 'jb-mono', // JetBrains Mono
  japaneseFontFamily: 'syht-jp-v', // 思源黑体（其他东亚字体）
  
  // 字体权重默认值 - 全局设置（body 使用 font-normal）
  // Tailwind 字重类默认值
  fontWeightLight: 300,
  fontWeightNormal: 350,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  
  // 文章行高默认值
  articleLineHeight: 30,
  
  // 书籍布局相关
  bookSideWidth: 280,
  bookContentWidth: 850,
  bookContentPadding: 40,
  bookSideContentGap: 10,
  
  // 书籍目录显示控制
  isBookTocShow: true,
  
  // 页面类型管理
  // 当前是否为书籍页面
  isBookPage: false,
  
  // 最后访问的 URL
  lastVisitedUrl: '',
  
  // 导航面板显示控制
  isNavigationPanelOpen: false,
} as const;

export type DefaultValues = typeof DEFAULT_VALUES;
