import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type scoreHelperConfigType = {
  isStaveQueryReverse: boolean,
  setIsStaveQueryReverse: (newStatus: boolean) => void,
  staveAlters: number,
  setStaveAlters: (newStatus: number) => void,
  isStaveConfigOpen: boolean,
  setIsStaveConfigOpen: (newStatus: boolean) => void,
  clef: string,
  setClef: (newStatus: string) => void,
  isStaveSharp: boolean,
  setIsStaveSharp: (newStatus: boolean) => void,
  resetStore: () => void,
  changeClef: () => void,
}
const storeKey = "scoreHelperConfig"
const defaultStore = {
  isStaveQueryReverse: false,
  staveAlters: 0,
  isStaveSharp: true,
  isStaveConfigOpen: false,
  clef: "G",
}
const useScoreHelperConfig = create<scoreHelperConfigType>()(immer(persist(
  (set) => ({
    ...defaultStore,
    setIsStaveQueryReverse: (newStatus: boolean) => {
      set((state) => {
        state.isStaveQueryReverse = newStatus
      })
    },
    setIsStaveSharp: (newStatus: boolean) => {
      set((state) => {
        state.isStaveSharp = newStatus
      })
    },
    setStaveAlters: (newStatus: number) => {
      set((state) => {
        state.staveAlters = newStatus
      })
    },
    setIsStaveConfigOpen: (newStatus: boolean) => {
      set((state) => {
        state.isStaveConfigOpen = newStatus
      })
    },
    setClef: (newStatus: string) => {
      set((state) => {
        state.clef = newStatus
      })
    },
    changeClef: () => {
      set((state) => {
        switch (state.clef) {
          case "F":
            state.clef = "G"
            break
          case "G":
            state.clef = "C"
            break
          case "C":
            state.clef = "F"
            break
          default:
            state.clef = "G"
            break
        }
      })
    },
    resetStore: () => {
      set(defaultStore)
      localStorage.removeItem(storeKey)
    },
  }),
  {
    name: storeKey, // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
),))

export default useScoreHelperConfig
