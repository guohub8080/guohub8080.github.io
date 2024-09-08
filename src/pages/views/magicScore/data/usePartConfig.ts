import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'

type partConfig = {
  clef: string
  partName: string
  setPartName: (i: string) => void
  instrument: string
  setInstrument: (i: string) => void
  midiChannel: number
  setMIDI_Channel: (i: number) => void
  midiProgram: number
  setMIDI_Program: (i: number) => void
  isOpen: boolean
  switchOpen: () => void
  isNewAdd: boolean
  switchIsNewAdd: () => void
  setClef: (newClef: string) => void

  partOrder: number
  setPartOrder: (i: number) => void
  isBefore: boolean
  switchIsBefore: () => void
  setIsBefore: (i: boolean) => void

}
const useBaseScoreConfig = create<partConfig>()(immer(
  (set) => ({
      clef: "G",
      setClef: (newValue: string) => set(state => {
        state.clef = newValue
      }),
      partName: "",
      setPartName: (newValue: string) => set(state => {
        state.partName = newValue
      }),
      instrument: "keyboard.piano",
      setInstrument: (newValue: string) => set(state => {
        state.instrument = newValue
      }),
      midiChannel: 1,
      setMIDI_Channel: (newValue: number) => set(state => {
        state.midiChannel = newValue
      }),
      midiProgram: 1,
      setMIDI_Program: (newValue: number) => set(state => {
        state.midiProgram = newValue
      }),
      partOrder: 0,
      setPartOrder: (newValue: number) => set(state => {
        state.partOrder = newValue
      }),
      isBefore: false,
      switchIsBefore: () => {
        set((state) => {
          state.isBefore = !state.isBefore
        })
      },
      setIsBefore: (newValue: boolean) => set(state => {
        state.isBefore = newValue
      }),
      isNewAdd: true,
      switchIsNewAdd: () => {
        set((state) => {
          state.isNewAdd = !state.isNewAdd
        })
      },
      isOpen: false,
      switchOpen: () => {
        set((state) => {
          state.isOpen = !state.isOpen
        })
      },
    }
  ),
))

export default useBaseScoreConfig