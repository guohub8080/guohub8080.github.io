import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isUndefined } from 'lodash';
import type { GlobalSettingsState, ThemeMode, BackgroundMode } from './types.ts';
import { DEFAULT_VALUES } from './defaultValues.ts';
import { PERSIST_CONFIG } from './persistConfig.ts';
import { buildThemeFontStack, buildCodeFontStack, buildJapaneseFontStack } from './fontStackBuilder.ts';

/**
 * 应用主题到 DOM
 * 使用 data-theme 属性，支持无限多主题
 */
const applyTheme = (theme: ThemeMode) => {
  if (isUndefined(document)) return;
  
  const root = document.documentElement;
  
  if (theme === 'system') {
    // 跟随系统：检测系统偏好
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', systemTheme);
  } else {
    // 手动设置主题
    root.setAttribute('data-theme', theme);
  }
};

/**
 * 监听系统主题变化
 */
let systemThemeListener: ((e: MediaQueryListEvent) => void) | null = null;

const setupSystemThemeListener = (theme: ThemeMode) => {
  if (isUndefined(window)) return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // 移除旧的监听器
  if (systemThemeListener) {
    mediaQuery.removeEventListener('change', systemThemeListener);
    systemThemeListener = null;
  }
  
  // 只在 system 模式下添加监听器
  if (theme === 'system') {
    systemThemeListener = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      const newTheme = e.matches ? 'dark' : 'light';
      root.setAttribute('data-theme', newTheme);
    };
    mediaQuery.addEventListener('change', systemThemeListener);
  }
};

/**
 * 全局设置状态管理 Store
 * 用于管理应用的全局设置：主题、字体、导航栏等
 * 使用 persist 中间件将设置持久化到 localStorage
 */
export const globalSettingsStore = create<GlobalSettingsState>()(
  persist(
    (set) => ({
      // 使用默认值
      ...DEFAULT_VALUES,
      
      // 主题相关
      setTheme: (theme: ThemeMode) => {
        applyTheme(theme);
        setupSystemThemeListener(theme);
        set({ theme });
      },
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        setupSystemThemeListener(newTheme);
        return { theme: newTheme };
      }),
      
      // 背景相关
      setMainDynamicBackround: (bg: BackgroundMode) => set({ mainDynamicBackround: bg }),
      
      // 导航栏高度相关
      setNavigationHeight: (height: number) => set({ navigationHeight: height }),
      
      // 字体相关
      setChineseFontFamily: (font: string | null) => set({ chineseFontFamily: font }),
      setEnglishFontFamily: (font: string | null) => set({ englishFontFamily: font }),
      setCodeFontFamily: (font: string | null) => set({ codeFontFamily: font }),
      setJapaneseFontFamily: (font: string | null) => set({ japaneseFontFamily: font }),
      
      // 字体权重相关 - 全局设置（Tailwind 字重类）
      setFontWeightLight: (weight: number) => set({ fontWeightLight: weight }),
      setFontWeightNormal: (weight: number) => set({ fontWeightNormal: weight }),
      setFontWeightMedium: (weight: number) => set({ fontWeightMedium: weight }),
      setFontWeightSemibold: (weight: number) => set({ fontWeightSemibold: weight }),
      setFontWeightBold: (weight: number) => set({ fontWeightBold: weight }),
      
      // 文章行高相关
      setArticleLineHeight: (height: number) => set({ articleLineHeight: height }),
      
      // 书籍布局相关
      setBookSideWidth: (width: number) => set({ bookSideWidth: width }),
      setBookContentWidth: (width: number) => set({ bookContentWidth: width }),
      setBookContentPadding: (padding: number) => set({ bookContentPadding: padding }),
      setBookSideContentGap: (gap: number) => set({ bookSideContentGap: gap }),
      
      // 书籍目录显示控制
      setIsBookTocShow: (show: boolean) => set({ isBookTocShow: show }),
      toggleBookTocShow: () => set((state) => ({ isBookTocShow: !state.isBookTocShow })),
      
      // 页面类型管理 - 由 loader 设置
      // 当前是否为书籍页面
      setIsBookPage: (isBook) => set({ isBookPage: isBook }),
      
      // 最后访问的 URL
      setLastVisitedUrl: (url: string) => set({ lastVisitedUrl: url }),
      
      // 导航面板显示控制
      setIsNavigationPanelOpen: (open: boolean) => set({ isNavigationPanelOpen: open }),
      toggleNavigationPanel: () => set((state) => ({ isNavigationPanelOpen: !state.isNavigationPanelOpen })),
      
      resetStore: () => set(DEFAULT_VALUES),
      resetFontSettings: () => set({
        chineseFontFamily: DEFAULT_VALUES.chineseFontFamily,
        englishFontFamily: DEFAULT_VALUES.englishFontFamily,
        codeFontFamily: DEFAULT_VALUES.codeFontFamily,
        japaneseFontFamily: DEFAULT_VALUES.japaneseFontFamily,
        fontWeightLight: DEFAULT_VALUES.fontWeightLight,
        fontWeightNormal: DEFAULT_VALUES.fontWeightNormal,
        fontWeightMedium: DEFAULT_VALUES.fontWeightMedium,
        fontWeightSemibold: DEFAULT_VALUES.fontWeightSemibold,
        fontWeightBold: DEFAULT_VALUES.fontWeightBold,
        articleLineHeight: DEFAULT_VALUES.articleLineHeight,
      }),
    }),
    {
      ...PERSIST_CONFIG,
      onRehydrateStorage: () => (state) => {
        // 从 localStorage 恢复后立即应用主题
        if (state?.theme) {
          applyTheme(state.theme);
          setupSystemThemeListener(state.theme);
        }
      },
    }
  )
);

export default () => {
  const store = globalSettingsStore();
  
  // 字体管理：根据字体设置动态设置 CSS 变量
  const { 
    chineseFontFamily, 
    englishFontFamily, 
    codeFontFamily,
    japaneseFontFamily,
    fontWeightLight,
    fontWeightNormal,
    fontWeightMedium,
    fontWeightSemibold,
    fontWeightBold,
    articleLineHeight,
  } = store;
  
  useEffect(() => {
    // 构建主题字体堆栈
    const themeFontStack = buildThemeFontStack(chineseFontFamily, englishFontFamily);
    document.documentElement.style.setProperty('--guohub-theme-font-family', themeFontStack);
    
    // 构建代码字体堆栈
    const codeFontStack = buildCodeFontStack(codeFontFamily, themeFontStack, chineseFontFamily, englishFontFamily);
    document.documentElement.style.setProperty('--guohub-code-font-family', codeFontStack);
    
    // 构建日文字体堆栈
    const japaneseFontStack = buildJapaneseFontStack(japaneseFontFamily, chineseFontFamily);
    document.documentElement.style.setProperty('--guohub-jp-font-family', japaneseFontStack);
  }, [chineseFontFamily, englishFontFamily, codeFontFamily, japaneseFontFamily]);
  
  // Tailwind 字重类管理：动态设置字重变量（body 使用 --font-normal）
  useEffect(() => {
    document.documentElement.style.setProperty('--font-light', String(fontWeightLight));
    document.documentElement.style.setProperty('--font-normal', String(fontWeightNormal));
    document.documentElement.style.setProperty('--font-medium', String(fontWeightMedium));
    document.documentElement.style.setProperty('--font-semibold', String(fontWeightSemibold));
    document.documentElement.style.setProperty('--font-bold', String(fontWeightBold));
  }, [fontWeightLight, fontWeightNormal, fontWeightMedium, fontWeightSemibold, fontWeightBold]);
  
  
  return store;
};

