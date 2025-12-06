import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewSettingsState {
  bgColor: string;
  viewPadding: number;
  articleScroll: number;
  maxScroll: number; // 文章最大可滚动高度
  setBgColor: (color: string) => void;
  setViewPadding: (padding: number) => void;
  setArticleScroll: (scroll: number) => void;
  setMaxScroll: (maxScroll: number) => void;
}

/**
 * 视图设置状态管理 Store
 * 用于控制背景颜色、内边距、滚动位置等
 * 使用 persist 中间件将设置持久化到 localStorage
 */
export const useViewSettingsStore = create<ViewSettingsState>()(
  persist(
    (set) => ({
      bgColor: "#A8A8A8", // 默认背景色
      viewPadding: 20, // 默认内边距
      articleScroll: 0, // 默认滚动位置
      maxScroll: 0, // 默认最大滚动高度
      setBgColor: (color: string) => set({ bgColor: color }),
      setViewPadding: (padding: number) => set({ viewPadding: padding }),
      setArticleScroll: (scroll: number) => set({ articleScroll: scroll }),
      setMaxScroll: (maxScroll: number) => set({ maxScroll: maxScroll }),
    }),
    {
      name: 'view-settings-storage', // localStorage 中的 key
      partialize: (state) => ({
        // 只持久化这些字段，不持久化 articleScroll 和 maxScroll
        bgColor: state.bgColor,
        viewPadding: state.viewPadding,
      }),
    }
  )
);

