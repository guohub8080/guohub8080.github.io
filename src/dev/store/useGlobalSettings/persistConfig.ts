/**
 * 持久化配置
 * 使用排除法：默认持久化所有字段，只排除临时状态字段
 */

// 不需要持久化的字段（临时状态、运行时状态）
const EXCLUDED_FIELDS = new Set([
  'isBookPage',              // 运行时状态：当前是否为书籍页面
  'lastVisitedUrl',          // 运行时状态：最后访问的 URL
  'isNavigationPanelOpen',   // UI 临时状态：导航面板是否打开
  // 所有 setter 函数
  'setTheme',
  'toggleTheme',
  'setMainDynamicBackround',
  'setNavigationHeight',
  'setChineseFontFamily',
  'setEnglishFontFamily',
  'setCodeFontFamily',
  'setJapaneseFontFamily',
  'setFontWeightLight',
  'setFontWeightNormal',
  'setFontWeightMedium',
  'setFontWeightSemibold',
  'setFontWeightBold',
  'setArticleLineHeight',
  'setBookSideWidth',
  'setBookContentWidth',
  'setBookContentPadding',
  'setBookSideContentGap',
  'setIsBookTocShow',
  'toggleBookTocShow',
  'setIsBookPage',
  'setLastVisitedUrl',
  'setIsNavigationPanelOpen',
  'toggleNavigationPanel',
  'resetStore',
  'resetFontSettings',
]);

export const PERSIST_CONFIG = {
  name: 'global-settings', // localStorage 中的 key
  partialize: (state: any) => {
    // 使用排除法：过滤掉不需要持久化的字段
    const persistedState: any = {};
    for (const key in state) {
      if (!EXCLUDED_FIELDS.has(key)) {
        persistedState[key] = state[key];
      }
    }
    return persistedState;
  },
} as const;
