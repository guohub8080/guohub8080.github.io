import { create } from 'zustand';

interface DrawerState {
  isOpen: boolean;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

/**
 * 抽屉状态管理 Store
 * 用于控制侧边栏抽屉的显示/隐藏
 */
export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: true, // 默认打开
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
}));

