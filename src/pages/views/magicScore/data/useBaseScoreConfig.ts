import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'

type baseScoreConfig = {
	clef: string
	title: string,
	left: string
	right: string
	subTitle: string,
	bpm: number,
	beat: string,
	fifth: number
	mode: string
	isOpen: boolean
	switchOpen: () => void
	setClef: (newClef: string) => void
	setTitle: (newTitle: string) => void
	setSubtitle: (newSubtitle: string) => void
	setLeft: (i: string) => void
	setRight: (i: string) => void
	setBpm: (i: number) => void
	setFifth: (i: number) => void
	setBeat: (i: string) => void
	setMode: (i: string) => void
	isLocked: boolean
	switchLock: () => void
	setLock: (i: boolean) => void
}
const useBaseScoreConfig = create<baseScoreConfig>()(immer(
	(set) => ({
			clef: "G",
			title: "默认标题",
			subTitle: "默认副标题",
			left: "",
			right: "",
			bpm: 100,
			beat: "4/4",
			fifth: 0,
			mode: "major",
			isLocked: false,
			setClef: (newValue: string) => set(state => {
				state.clef = newValue
			}),
			setTitle: (newValue: string) => set(state => {
				state.title = newValue
			}),
			setSubtitle: (newValue: string) => set(state => {
				state.subTitle = newValue
			}),
			setLeft: (newValue: string) => set(state => {
				state.left = newValue
			}),
			setRight: (newValue: string) => set(state => {
				state.right = newValue
			}),
			setBeat: (newValue: string) => set(state => {
				state.beat = newValue
			}),
			setMode: (newValue: string) => set(state => {
				state.mode = newValue
			}),
			setBpm: (newValue: number) => set(state => {
				state.bpm = newValue
			}),
			setFifth: (newValue: number) => set(state => {
				state.fifth = newValue
			}),
			setLock: (newValue: boolean) => set(state => {
				state.isLocked = newValue
			}),

			isOpen: false,
			switchOpen: () => {
				set((state) => {
					state.isOpen = !state.isOpen
				})
			}, switchLock: () => {
				set((state) => {
					state.isLocked = !state.isLocked
				})
			},
		}
	),
))

export default useBaseScoreConfig