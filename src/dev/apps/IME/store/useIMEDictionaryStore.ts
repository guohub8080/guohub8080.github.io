import { create } from 'zustand';
import guoDT from '@utils/utDateTime/guoDT';

interface Word {
  abbr: string;
  order: number;
  content: string;
  tag: string;
}

interface IMEData {
  words: Word[];
  metadata?: {
    exportDate?: string;
    version?: string;
    lastModifiedDate?: string;
    [key: string]: any;
  };
}

interface IMEDictionaryState {
  // 当前导入的词库数据
  imeData: IMEData | null;
  // 设置词库数据
  setImeData: (data: IMEData | null) => void;
  // 更新词库中的词条
  updateWords: (words: Word[]) => void;
  // 清空词库
  clearDictionary: () => void;
}

/**
 * IME 词库状态管理 Store（非持久化）
 * 用于在"查询词库"和"添加词库"页面之间共享词库数据
 */
export const useIMEDictionaryStore = create<IMEDictionaryState>((set) => ({
  imeData: null,

  setImeData: (data) => set({ imeData: data }),

  updateWords: (words) =>
    set((state) => ({
      imeData: state.imeData
        ? {
            ...state.imeData,
            words,
            metadata: {
              ...state.imeData.metadata,
              lastModifiedDate: guoDT.formatToApiDateTime(new Date()),
            },
          }
        : null,
    })),

  clearDictionary: () => set({ imeData: null }),
}));

export type { Word, IMEData };