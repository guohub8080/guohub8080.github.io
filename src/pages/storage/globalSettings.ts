import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type GlobalSettingsType = {
  bears: number,
  language: string,
  isNaviWindowOpen: boolean,
  changeNaviWindowOpen: (newStatus: boolean) => void,
  changeLanguage: (newLanguage: string) => void
  fontFamily: string
}
const useGlobalSettings = create<GlobalSettingsType>()(immer(persist(
    (set) => ({
      bears: 0,
      fontFamily: "misans-m",
      addABear: () => set((state) => {
        state.bears++
      }),
      language: "en",
      isNaviWindowOpen: false,
      changeNaviWindowOpen: (newStatus: boolean) => {
        set((state) => {
          state.isNaviWindowOpen = newStatus
        })
      },
      changeLanguage: (newLanguage: string) => {
        set((state) => {
          if (["cn", "en"].includes(newLanguage)) {
            state.language = newLanguage
          }
        })
      }
    }),

    {
      name: 'globalSettings', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
))

export default useGlobalSettings