import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'
import googleColors from "@/assets/colors/googleColors.ts";

type scaleConfigType = {
	mode: string
	setMode: (mode: string) => void
	configBarHeight: number
	configInnerHeight: number
	screenDividerWidth: number
	isScalePickerOpen: boolean
	setIsScalePickerOpen: (isOpen: boolean) => void
	resetStore: () => void
	majorScaleStrokeColor: string
	majorScaleBgColor: string
	minorScaleStrokeColor: string
	minorScaleBgColor: string
	isClassicScaleModeOn: boolean
	setIsClassicScaleModeOn: (isOn: boolean) => void
	isRomeNumberStyle: boolean
	setIsRomeNumberStyle: (isOn: boolean) => void
	isScaleConfigOpen: boolean
	setIsScaleConfigOpen: (isOpen: boolean) => void
	chordDisplayStyle: string
	setChordDisplayStyle: (style: "number" | "note" | "rome") => void
	staveAlterDisplayBy: "natural" | "alters" | "number" | "none" | any
	setStaveAlterDisplayBy: (by: "natural" | "alters" | "number" | "none") => void
	pianoNodeDisplayBy: string
	setPianoNodeDisplayBy: (by: string) => void
	isMobileScaleConfigWindowOpen: boolean
	setIsMobileScaleConfigWindowOpen: (isOpen: boolean) => void
	isMobileScaleTableColumnReverse: boolean
	setIsMobileScaleTableColumnReverse: (isShow: boolean) => void
	isMobileStaveConfigWindowOpen: boolean
	setIsMobileStaveConfigWindowOpen: (isOpen: boolean) => void
}
const storeKey = "scaleConfig"
const defaultStore = {
	mode: "MAJ",
	configBarHeight: 80,
	configInnerHeight: 55,
	screenDividerWidth: 400,
	isScalePickerOpen: false, //这个是选择调式的开关
	majorScaleStrokeColor: googleColors.deepOrange800,
	majorScaleBgColor: googleColors.deepOrange50,
	minorScaleStrokeColor: googleColors.blue800,
	minorScaleBgColor: googleColors.blue50,
	isClassicScaleModeOn: false,
	isRomeNumberStyle: false,
	isScaleConfigOpen: false,
	chordDisplayStyle: "number",
	staveAlterDisplayBy: "natural",
	pianoNodeDisplayBy: "note",
	isMobileScaleConfigWindowOpen: false,
	isMobileStaveConfigWindowOpen: false,
	isMobileScaleTableColumnReverse: false,
}
const useScaleConfig = create<scaleConfigType>()(immer(persist(
	(set) => ({
		...defaultStore,
		setMode: (newStatus: string) => {
			set((state) => {
					state.mode = newStatus
				}
			)
		},
		setIsMobileStaveConfigWindowOpen: (isOpen: boolean) => {
			set((state) => {
				state.isMobileStaveConfigWindowOpen = isOpen
			})
		},
		setIsMobileScaleTableColumnReverse: (isShow: boolean) => {
			set((state) => {
				state.isMobileScaleTableColumnReverse = isShow
			})
		},
		setIsMobileScaleConfigWindowOpen: (isOpen: boolean) => {
			set((state) => {
				state.isMobileScaleConfigWindowOpen = isOpen
			})
		},
		setStaveAlterDisplayBy: (by: "natural" | "alters" | "number" | "none") => {
			set((state) => {
				state.staveAlterDisplayBy = by
			})
		},
		setPianoNodeDisplayBy: (by: string) => {
			set((state) => {
				state.pianoNodeDisplayBy = by
			})
		},
		setChordDisplayStyle: (style: "number" | "note" | "rome") => {
			set((state) => {
				state.chordDisplayStyle = style
			})
		},
		setIsScaleConfigOpen: (isOpen: boolean) => {
			set((state) => {
				state.isScaleConfigOpen = isOpen
			})
		},
		setIsScalePickerOpen: (isOpen: boolean) => {
			set((state) => {
					state.isScalePickerOpen = isOpen
				}
			)
		},
		setIsClassicScaleModeOn: (isOn: boolean) => {
			set((state) => {
					state.isClassicScaleModeOn = isOn
				}
			)
		},
		setIsRomeNumberStyle: (isOn: boolean) => {
			set((state) => {
				state.isRomeNumberStyle = isOn
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

export default useScaleConfig
