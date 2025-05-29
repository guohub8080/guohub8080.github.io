import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type findInScaleType = {
  isFindChordConfigWindowOpen: boolean
  setIsFindInScaleConfigWindowOpen: (isFindInScaleConfigWindowOpen: boolean) => void
  isFindSelectorOfPiano: boolean
  setIsFindSelectorOfPiano: (isFindSelectorOfPiano: boolean) => void
  pianoKeyList: [] | number[]
  setPianoKeyList: (pianoKeyList: [] | number[]) => void
  isNoteStrictIn: boolean
  setIsNoteStrictIn: (isNoteStrictIn: boolean) => void
  detailChordKeyAndLocation: void | [number, string],
  setDetailChordKeyAndLocation: (i: [number, string]) => void,
  isFindChordInScale: boolean,
  setIsFindChordInScale: (isFindChordInScale: boolean) => void,
  detailModeKeyAndLocation: void | [number, string],
  setDetailModeKeyAndLocation: (i: [number, string]) => void,
  isFindNotesConfigWindowOpen: boolean,
  setIsFindNotesConfigWindowOpen: (isFindNotesConfigWindowOpen: boolean) => void,
  selectOnePianoLocation: number,
  setSelectOnePianoLocation: (selectOnePianoLocation: number) => void,
  pianoKeyIntervalList: Array<void | number>,
  setPianoKeyIntervalList: (pianoKeyIntervalList: Array<void | number>) => void,
  resetStore: () => void,
}
const storeKey = "findChordConfig"
const defaultStore = {
  isFindChordConfigWindowOpen: false,
  isFindSelectorOfPiano: false,
  pianoKeyList: [],
  isNoteStrictIn: false,
  detailChordKeyAndLocation: void 0,  //例如 [0, "maj3"]
  detailModeKeyAndLocation: void 0,   //例如 [0, "MAJ"]
  isFindChordInScale: false,//是否是调内和弦
  isFindNotesConfigWindowOpen: false,//是否是音符查找配置窗口
  selectOnePianoLocation: 0, //点击了哪个钢琴键位
  pianoKeyIntervalList: Array.from({length: 12}, () => 0), //每个键位都是承担了哪个音程
}
const useFindChordConfig = create<findInScaleType>()(immer(persist(
  (set) => ({
    ...defaultStore,
    setIsFindInScaleConfigWindowOpen: (isFindInScaleConfigWindowOpen: boolean) => {
      set((state) => {
        state.isFindChordConfigWindowOpen = isFindInScaleConfigWindowOpen
      })
    },
    setPianoKeyIntervalList: (pianoKeyIntervalList: Array<void | number>) => {
      set((state) => {
        state.pianoKeyIntervalList = pianoKeyIntervalList
      })
    },
    setSelectOnePianoLocation: (selectOnePianoLocation: number) => {
      set((state) => {
        state.selectOnePianoLocation = selectOnePianoLocation
      })
    },
    setIsFindNotesConfigWindowOpen: (isFindNotesConfigWindowOpen: boolean) => {
      set((state) => {
        state.isFindNotesConfigWindowOpen = isFindNotesConfigWindowOpen
      })
    },
    setDetailModeKeyAndLocation: (i: [number, string]) => {
      set((state) => {
        state.detailModeKeyAndLocation = i as any
      })
    },
    setIsFindChordInScale: (isFindChordInScale: boolean) => {
      set((state) => {
        state.isFindChordInScale = isFindChordInScale
      })
    },
    setDetailChordKeyAndLocation: (i: [number, string]) => {
      set((state) => {
        state.detailChordKeyAndLocation = i as any
      })
    },
    setIsNoteStrictIn: (isNoteStrictIn: boolean) => {
      set((state) => {
        state.isNoteStrictIn = isNoteStrictIn
      })
    },
    setPianoKeyList: (pianoKeyList: [] | number[]) => {
      set((state) => {
        state.pianoKeyList = pianoKeyList
      })
    },
    setIsFindSelectorOfPiano: (isFindSelectorOfPiano: boolean) => {
      set((state) => {
        state.isFindSelectorOfPiano = isFindSelectorOfPiano
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

export default useFindChordConfig
