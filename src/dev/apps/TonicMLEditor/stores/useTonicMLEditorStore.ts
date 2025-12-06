import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TonicMLCompiler } from '../../../tonicml';

/**
 * Monaco 编辑器主题与字体类型（迁移自 useEditorThemeStore）
 */
export type EditorTheme =
  | 'vs-dark'
  | 'vs-light'
  | 'hc-black'
  | 'dark'
  | 'light'
  | 'monokai'
  | 'github-dark'
  | 'github-light'
  | 'solarized-dark'
  | 'solarized-light';

export interface EditorFont {
  family: string;
  size: number;
  weight: 'normal' | 'bold' | '300' | '400' | '500' | '600' | '700';
}

/**
 * TonicML 编辑器状态接口
 */
interface TonicMLEditorState {
  // 编辑器内容
  codeContent: string;
  setCodeContent: (content: string) => void;
  clearCodeContent: () => void;
  
  // 编译器实例（包含所有编译结果和方法）
  compiler: TonicMLCompiler | null;
  setCompiler: (compiler: TonicMLCompiler) => void;
  clearCompiler: () => void;
  
  // 布局相关
  panelHeadHeight: number; // Panel 头部高度
  setPanelHeadHeight: (height: number) => void;
  
  // 编辑器容器的 padding（用于计算总高度）
  containerPaddingTop: number; // 容器上边距
  setContainerPaddingTop: (padding: number) => void;
  
  containerPaddingBottom: number; // 容器下边距
  setContainerPaddingBottom: (padding: number) => void;
  
  containerPaddingLeft: number; // 容器左边距
  setContainerPaddingLeft: (padding: number) => void;
  
  containerPaddingRight: number; // 容器右边距
  setContainerPaddingRight: (padding: number) => void;
  
  // 主题与字体（全面替代缩放）
  theme: EditorTheme;
  setTonicMLEditorTheme: (theme: EditorTheme) => void;
  font: EditorFont;
  setTonicMLEditorFont: (font: EditorFont) => void;
  setTonicMLEditorFontFamily: (family: string) => void;
  setTonicMLEditorFontSize: (size: number) => void;
  setTonicMLEditorFontWeight: (weight: EditorFont['weight']) => void;
  
  // 重置所有状态
  reset: () => void;
}

/**
 * 默认配置
 */
const DEFAULT_VALUES = {
  codeContent: '',
  compiler: null as TonicMLCompiler | null,
  panelHeadHeight: 60, // Panel 头部高度
  containerPaddingTop: 5, // 容器上边距 5px
  containerPaddingBottom: 15, // 容器下边距 15px
  containerPaddingLeft: 15, // 容器左边距 15px
  containerPaddingRight: 15, // 容器右边距 15px
  theme: 'vs-dark' as EditorTheme,
  font: {
    family: 'Consolas, "Courier New", monospace',
    size: 16,
    weight: 'normal' as const,
  } as EditorFont,
};

/**
 * TonicML 编辑器状态管理 Store
 */
const useTonicMLEditorStore = create<TonicMLEditorState>()(
  persist(
    (set) => ({
      // 使用默认值
      ...DEFAULT_VALUES,
      
      // 内容管理
      setCodeContent: (content) => set({ codeContent: content }),
      clearCodeContent: () => set({ codeContent: '' }),
      
      // 编译器实例管理
      setCompiler: (compiler) => set({ compiler }),
      clearCompiler: () => set({ compiler: null }),
      
      // 布局管理
      setPanelHeadHeight: (height) => set({ panelHeadHeight: height }),
      setContainerPaddingTop: (padding) => set({ containerPaddingTop: padding }),
      setContainerPaddingBottom: (padding) => set({ containerPaddingBottom: padding }),
      setContainerPaddingLeft: (padding) => set({ containerPaddingLeft: padding }),
      setContainerPaddingRight: (padding) => set({ containerPaddingRight: padding }),
      
      // 主题与字体管理
      setTonicMLEditorTheme: (theme) => set({ theme }),
      setTonicMLEditorFont: (font) => set({ font }),
      setTonicMLEditorFontFamily: (family) => set((state) => ({ font: { ...state.font, family } })),
      setTonicMLEditorFontSize: (size) => set((state) => ({ font: { ...state.font, size } })),
      setTonicMLEditorFontWeight: (weight) => set((state) => ({ font: { ...state.font, weight } })),
      
      // 重置
      reset: () => set(DEFAULT_VALUES),
    }),
    {
      name: 'tonicml-editor-storage',
      version: 1,
      // 排除 compiler 字段，因为类实例无法序列化
      partialize: (state) => {
        const { compiler, ...rest } = state;
        return rest;
      },
    }
  )
);

export default useTonicMLEditorStore;

