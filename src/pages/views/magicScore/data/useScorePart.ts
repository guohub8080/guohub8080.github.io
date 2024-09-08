import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import * as ramda from "ramda"
import {t_scoreMeta, t_scorePartObj} from "@views/magicScore/data/types.ts";

type scorePart = {
	isOpen: boolean
	switchOpen: () => void
	// setClef: (newClef: string) => void
	// setTitle: (newTitle: string) => void
	// setSubtitle: (newSubtitle: string) => void
	// setLeft: (i: string) => void
	// setRight: (i: string) => void
	// setBpm: (i: number) => void
	// setFifth: (i: number) => void
	// setBeat: (i: string) => void
	// setMode: (i: string) => void
	partList: [] | t_scorePartObj[] | object[] | any[]
	addNewPart: (i: any) => void
	movePart: (needMoveIndex: number, isForwardDirection: boolean) => void
	updatePartMeta: (i: object, index: number) => void
}
const useBaseScoreConfig = create<scorePart>()(immer(
	(set) => ({

			partList: [],
			addNewPart: (i: object) => set(state => {
				state.partList = [...state.partList, i]
			}),
			movePart: (needMoveIndex: number, isForwardDirection: boolean) => set(state => {
				if (isForwardDirection) {
					state.partList = ramda.swap(needMoveIndex, needMoveIndex - 1, state.partList)
				} else {
					state.partList = ramda.swap(needMoveIndex, needMoveIndex + 1, state.partList)
				}
			}),
			updatePartMeta: (newPartMeta: object, index: number) => set(state => {
				state.partList[index].partMeta = newPartMeta
			}),


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