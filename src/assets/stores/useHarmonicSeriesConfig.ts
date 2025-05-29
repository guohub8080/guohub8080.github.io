import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type harmonicSeriesType = {
  notesList: [] | { step: string, alter: number }[],
  clearNotesList: () => void,
  addNotesList: (i: { step: string, alter: number }) => void,
  scrollLeft: number,
  setScrollLeft: (i: number) => void,
  resetStore: () => void,
}
const storeKey = "harmonicSeriesConfig"
const defaultStore = {
  notesList: [],
  scrollLeft: 0
}
const useChordConfig = create<harmonicSeriesType>()(immer(persist(
  (set) => ({
    ...defaultStore,
    clearNotesList: () => {
      set((state) => {
        state.notesList = []
      })
    },
    addNotesList: (i: { step: string, alter: number }) => {
      set((state) => {
        state.notesList = [...state.notesList, i]
      })
    },
    setScrollLeft: (i: number) => {
      set((state) => {
        state.scrollLeft = i
      })
    },
    resetStore: () => {
      set(defaultStore)
      localStorage.removeItem(storeKey)
    }

  }),
  {
    name: storeKey, // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
),))

export default useChordConfig
