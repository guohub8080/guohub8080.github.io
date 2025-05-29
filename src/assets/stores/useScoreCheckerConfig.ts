import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type scoreCheckerConfigType = {
  isOneNoteCheckerWindowOpen: boolean,
  setIsOneNoteCheckerWindowOpen: (newStatus: boolean) => void,
  oneNoteStaveClef: string,
  setOneNoteStaveClef: (newStatus: string) => void,
  keys: number,
  setKeys: (newStatus: number) => void,

  clef: string,
  setClef: (newStatus: string) => void,
  resetStore: () => void,
}
const defaultStore = {
  isOneNoteCheckerWindowOpen: false,
  oneNoteStaveClef: "G",
  keys: 0,
  clef: "G",
}
const storeKey = "scoreCheckerConfig"
const useScoreCheckerConfig = create<scoreCheckerConfigType>()(immer(persist(
  (set) => ({
    ...defaultStore,
    setIsOneNoteCheckerWindowOpen: (newStatus: boolean) => {
      set((state) => {
        state.isOneNoteCheckerWindowOpen = newStatus
      })
    },
    setClef: (newStatus: string) => {
      set((state) => {
        state.clef = newStatus
      })
    },
    setKeys: (newStatus: number) => {
      set((state) => {
        state.keys = newStatus
      })
    },
    setOneNoteStaveClef: (newStatus: string) => {
      set((state) => {
        state.oneNoteStaveClef = newStatus
      })
    },
    resetStore: () => {
      set(defaultStore)
      localStorage.removeItem(storeKey); // 替换为你定义的 storage key
    },
  }),
  {
    name: storeKey, // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
),))

export default useScoreCheckerConfig
