import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type circleOfFifthsConfig = {
  circleID: number
  setCircleID: (newStatus: number) => void
  translateX: number
  translateY: number
  setTranslateX: (newStatus: number) => void
  setTranslateY: (newStatus: number) => void
  zoomValue: number
  setZoomValue: (newStatus: number) => void
  zoomLocation: string
  setZoomLocation: (newStatus: string) => void
  isZoomIn: boolean
  setIsZoomIn: (newStatus: boolean) => void
  rotateLength: number
  setRotateLength: (newStatus: number) => void
  resetCircle: () => void
  isRotateLengthConfigOpen: boolean
  setRotateLengthConfigOpen: (newStatus: boolean) => void
  isCursorShow: boolean
  setIsCursorShow: (newStatus: boolean) => void
  cursorID: number
  setCursorID: (newStatus: number) => void
  isCursorMoveMode: boolean
  setIsCursorMoveMode: (newStatus: boolean) => void
  resetStore: () => void
}
const storeKey = "circleOfFifthsConfig"
const defaultZoomValue = 0.95
const defaultStore = {
  circleID: 0,
  translateX: 0,
  translateY: 0,
  zoomValue: defaultZoomValue,
  zoomLocation: "top",
  isZoomIn: false,
  isRotateLengthConfigOpen: false,
  rotateLength: 1,
  isCursorShow: true,
  cursorID: 0,
  isCursorMoveMode: true,
}
const useCircleOfFifthsConfig = create<circleOfFifthsConfig>()(immer(persist(
  (set) => ({
    ...defaultStore,
    setCircleID: (newStatus: number) => {
      set((state) => {
        state.circleID = newStatus
      })
    },
    setIsCursorMoveMode: (newStatus: boolean) => {
      set((state) => {
        state.isCursorMoveMode = newStatus
      })
    },
    setCursorID: (newStatus: number) => {
      set((state) => {
        state.cursorID = newStatus
      })
    },
    setIsCursorShow: (newStatus: boolean) => {
      set((state) => {
        state.isCursorShow = newStatus
      })
    },
    setTranslateX: (newStatus: number) => {
      set((state) => {
        state.translateX = newStatus
      })
    },
    setTranslateY: (newStatus: number) => {
      set((state) => {
        state.translateY = newStatus
      })
    },
    setZoomValue: (newStatus: number) => {
      set((state) => {
        state.zoomValue = newStatus
      })
    },
    setZoomLocation: (newStatus: string) => {
      set((state) => {
        state.zoomLocation = newStatus
      })
    },
    setIsZoomIn: (newStatus: boolean) => {
      set((state) => {
        state.isZoomIn = newStatus
      })
    },
    setRotateLength: (newStatus: number) => {
      set((state) => {
        state.rotateLength = newStatus
      })
    },
    resetCircle: () => {
      set((state) => {
        state.isZoomIn = false
        state.zoomValue = defaultZoomValue
        state.translateX = 0
        state.translateY = 0
        state.circleID = 0
        state.cursorID = 0
        state.isCursorMoveMode = true
        state.isCursorShow = true
      })
    },
    setRotateLengthConfigOpen: (newStatus: boolean) => {
      set((state) => {
        state.isRotateLengthConfigOpen = newStatus
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

export default useCircleOfFifthsConfig
