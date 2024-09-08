import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {t_alterValue, t_noteStep} from "@/music96/note/static/types.ts";
import {isNumber} from "lodash";

type addNoteBar = {
	rootNoteStep: t_noteStep
	rootNoteAlter: t_alterValue
	rootNoteOctave: number
	setRootNote: (i: { step?: t_noteStep, alter?: t_alterValue, octave?: number }) => void
	mode: string,
	setMode: (mode: string) => void
	isFreeMode: boolean
	setIsFreeMode: (i: boolean) => void
}
const useBaseScoreConfig = create<addNoteBar>()(immer(
	(set) => ({
			rootNoteStep: "C",
			rootNoteAlter: 0,
			rootNoteOctave: 4,
			setRootNote: (newValue: { step?: t_noteStep, alter?: t_alterValue, octave?: number }) => set(state => {
				if (newValue.step) state.rootNoteStep = newValue.step;
				if (isNumber(newValue.alter)) state.rootNoteAlter = newValue.alter;
				if (isNumber(newValue.octave)) state.rootNoteOctave = newValue.octave;
			}),
			mode: "MAJ",
			setMode: (mode: string) => set(state => {
				state.mode = mode
			}),
			isFreeMode: false,
			setIsFreeMode: (i: boolean) => set(state => {
				state.isFreeMode = i
			}),
		}
	),
))

export default useBaseScoreConfig