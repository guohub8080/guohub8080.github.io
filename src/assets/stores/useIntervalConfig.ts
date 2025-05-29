import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type intervalConfigType = {
  isUpward: boolean,
  setIsUpward: (newStatus: boolean) => void,
  isReverse: boolean,
  setIsReverse: (newStatus: boolean) => void,
  isDoubleAlterShown: boolean,
  setIsDoubleAlterShown: (newStatus: boolean) => void,
  resetStore: () => void,
}
const defaultStore = {
  isUpward: true,
  isReverse: true,
  isDoubleAlterShown: true,
}
const storeKey = "intervalConfig"
const useIntervalConfig = create<intervalConfigType>()(immer(persist(
  (set) => ({
    ...defaultStore,
    setIsUpward: (newStatus: boolean) => {
      set((state) => {
        state.isUpward = newStatus
      })
    },
    setIsReverse: (newStatus: boolean) => {
      set((state) => {
        state.isReverse = newStatus
      })
    },
    setIsDoubleAlterShown: (newStatus: boolean) => {
      set((state) => {
        state.isDoubleAlterShown = newStatus
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

export default useIntervalConfig
