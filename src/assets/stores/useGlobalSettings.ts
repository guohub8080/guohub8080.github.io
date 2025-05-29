import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'
import googleColors from "@/assets/colors/googleColors.ts";

type GlobalSettingsType = {
	isNaviWindowOpen: boolean,
	setNaviWindowOpen: (newStatus: boolean) => void,
	naviBarHeight: number
	phoneWidth: number,
	isNotePickerOpen: boolean,
	setNotePickerOpen: (newStatus: boolean) => void,
	isProModeOn: boolean,
	setProModeOn: (newStatus: boolean) => void,
	resetStore: () => void,
	isWideScreen: boolean,
	setIsWideScreen: (newStatus: boolean) => void,
	lastViewURL: string,
	setLastViewURL: (newURL: string) => void,
	mainVolume: number,
	setMainVolume: (newVolume: number) => void,
	isNaviBarHidden: boolean,
	setIsNaviBarHidden: (newStatus: boolean) => void,
	pageMargin: number,
	setPageMargin: (newMargin: number) => void,
}
const storeKey = 'globalSettings'
const defaultStore = {
	isNaviWindowOpen: false,
	naviBarHeight: 50,
	phoneWidth: 550,
	isNotePickerOpen: false,
	isProModeOn: false,
	isNaviBarHidden: false,//导航栏是否隐藏
	isWideScreen: false,
	lastViewURL: "", //上次访问过的地址，可以用来保存
	pageMargin: 10,
	mainVolume: 0,// 主音量
}
const useGlobalSettings = create<GlobalSettingsType>()(immer(persist(
		(set) => ({
			...defaultStore,
			setNaviWindowOpen: (newStatus: boolean) => {
				set((state) => {
					state.isNaviWindowOpen = newStatus
				})
			},
			setPageMargin: (newMargin: number) => {
				set((state) => {
					state.pageMargin = newMargin
				})
			},
			setIsNaviBarHidden: (newStatus: boolean) => {
				set((state) => {
					state.isNaviBarHidden = newStatus
				})
			},


			setMainVolume: (newVolume: number) => {
				set((state) => {
					state.mainVolume = newVolume
				})
			},
			setLastViewURL: (newURL: string) => {
				set((state) => {
					state.lastViewURL = newURL
				})
			},

			setNotePickerOpen: (newStatus: boolean) => {
				set((state) => {
					state.isNotePickerOpen = newStatus
				})
			},
			setIsWideScreen: (newStatus: boolean) => {
				set((state) => {
					state.isWideScreen = newStatus
				})
			},
			setProModeOn: (newStatus: boolean) => {
				set((state) => {
					state.isProModeOn = newStatus
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
	),
))

export default useGlobalSettings
