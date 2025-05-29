import {isUndefined, range} from "lodash";
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type scaleConfigType = {
	chordKey: string
	setChordKey: (chordKey: string) => void
	isChordSelectorOpen: boolean
	setIsChordSelectorOpen: (isChordSelectorOpen: boolean) => void
	isChordStaveConfigOpen: boolean
	setIsChordStaveConfigOpen: (isChordStaveConfigOpen: boolean) => void
	isChordOctaveShiftOpen: boolean
	setIsChordOctaveShiftOpen: (isChordOctaveShiftOpen: boolean) => void,
	setChordVoicing: (chordVoicing: { step: string, alter: number, octave: number }[]) => void
	resetStore: () => void,
	n1_step: chordNoteStep
	n1_alter: number
	n1_octave: number
	n2_step: chordNoteStep
	n2_alter: number
	n2_octave: number
	n3_step: chordNoteStep
	n3_alter: number
	n3_octave: number
	n4_step: chordNoteStep
	n4_alter: number
	n4_octave: number
	n5_step: chordNoteStep
	n5_alter: number
	n5_octave: number
	n6_step: chordNoteStep
	n6_alter: number
	n6_octave: number
	n7_step: chordNoteStep
	n7_alter: number
	n7_octave: number
	setNoteOctave: (noteIndex: number, octave: number) => void
	chordSelectorRefHeight: number
	setChordSelectorRefHeight: (height: number) => void
}

type chordNoteStep = "C" | "D" | "E" | "F" | "G" | "A" | "B" | "none" | string
const storeKey = "chordConfig"
const defaultStore = {
	chordKey: "maj3",
	isChordSelectorOpen: false,
	isChordStaveConfigOpen: false,
	isChordOctaveShiftOpen: false,
	n1_step: "C",
	n1_alter: 0,
	n1_octave: 4,
	n2_step: "E",
	n2_alter: 0,
	n2_octave: 4,
	n3_step: "G",
	n3_alter: 0,
	n3_octave: 4,
	n4_step: "none",
	n4_alter: 0,
	n4_octave: 4,
	n5_step: "none",
	n5_alter: 0,
	n5_octave: 4,
	n6_step: "none",
	n6_alter: 0,
	n6_octave: 4,
	n7_step: "none",
	n7_alter: 0,
	n7_octave: 4,
	chordSelectorRefHeight: 0,

}
const useChordConfig = create<scaleConfigType>()(immer(persist(
	(set) => ({
		...defaultStore,
		setChordKey: (newStatus: string) => {
			set((state) => {
					state.chordKey = newStatus
				}
			)
		},
		setChordSelectorRefHeight: (height: number) => {
			set((state) => {
				state.chordSelectorRefHeight = height
			})
		},
		setNoteOctave: (noteIndex: number, octave: number) => {
			set((state) => {
				state[`n${noteIndex}_octave`] = octave
			})
		},
		setIsChordOctaveShiftOpen: (isChordOctaveShiftOpen: boolean) => {
			set((state) => {
				state.isChordOctaveShiftOpen = isChordOctaveShiftOpen
			})
		},
		setChordVoicing: (chordVoicing: { step: string, alter: number, octave: number }[]) => {
			set((state) => {
				if (chordVoicing.length === 0) return;
				range(7).forEach((i) => {
					if (i <= chordVoicing.length - 1) {
						if (!isUndefined(chordVoicing[i].step)) state[`n${i + 1}_step`] = chordVoicing[i].step
						if (!isUndefined(chordVoicing[i].alter)) state[`n${i + 1}_alter`] = chordVoicing[i].alter
						if (!isUndefined(chordVoicing[i].octave)) state[`n${i + 1}_octave`] = chordVoicing[i].octave
					} else {
						state[`n${i + 1}_step`] = "none"
						state[`n${i + 1}_alter`] = 0
					}
				})
			})
		},
		setIsChordStaveConfigOpen: (isChordStaveConfigOpen: boolean) => {
			set((state) => {
				state.isChordStaveConfigOpen = isChordStaveConfigOpen
			})
		},
		setIsChordSelectorOpen: (isChordSelectorOpen: boolean) => {
			set((state) => {
				state.isChordSelectorOpen = isChordSelectorOpen
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
