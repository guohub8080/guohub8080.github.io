// noinspection ES6PreferShortImport
import instrumentsObj from "@/apps/Settings/datas/instrumentsObj.ts";
import useEPianoSampler from "@/assets/instruments/samplers/useEPianoSampler.ts";
import useFluteSampler from "@/assets/instruments/samplers/useFluteSampler.ts";
import useGuitarSampler from "@/assets/instruments/samplers/useGuitarSampler.ts";
import useHarpSampler from "@/assets/instruments/samplers/useHarpSampler.ts";
import usePianoSampler from "@/assets/instruments/samplers/usePianoSampler.ts";
import useStringsSampler from "@/assets/instruments/samplers/useStringsSampler.ts";
import useDingDongSynth from "@/assets/instruments/synths/useDingDongSynth.ts";
import useSineSynth from "@/assets/instruments/synths/useSineSynth.ts";
import useWarmSynth from "@/assets/instruments/synths/useWarmSynth.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import warningToast from "@/utils/warningToast.tsx";
import collect from "collect.js";
import {isNull, isUndefined, reverse} from "lodash";
import {useEffect, useMemo} from "react";
import * as Tone from "tone";

const useInstrument = () => {
	const {instrument, playMode, playModeByTurnIndex, chordPlayStyle, setPlayModeByTurnIndex} = useGlobalSettings()
	const guitarSampler = useGuitarSampler()
	const pianoSampler = usePianoSampler()
	const ePianoSampler = useEPianoSampler()
	const stringsSampler = useStringsSampler()
	const fluteSampler = useFluteSampler()
	const harpSampler = useHarpSampler()
	const warmSynth = useWarmSynth()
	const sineSynth = useSineSynth()
	const dingDongSynth = useDingDongSynth()
	useEffect(() => {
		Tone.start().then(() => {
		})
	}, []);
	const currentInstrument = useMemo(() => {
		switch (instrument) {
			case instrumentsObj.piano:
				return pianoSampler
			case instrumentsObj.ePiano:
				return ePianoSampler
			case instrumentsObj.guitar:
				return guitarSampler
			case instrumentsObj.harp:
				return harpSampler
			case instrumentsObj.strings:
				return stringsSampler
			case instrumentsObj.flute:
				return fluteSampler
			case instrumentsObj.sineSynth:
				return sineSynth
			case instrumentsObj.dingDongSynth:
				return dingDongSynth
			case instrumentsObj.warmSynth:
				return warmSynth
			default:
				return dingDongSynth
		}
	}, [instrument,
		dingDongSynth,
		ePianoSampler, fluteSampler, guitarSampler, harpSampler, pianoSampler, sineSynth, stringsSampler, warmSynth])
	const play = (playList: number[], duration: {
		column: string,
		split_up: string,
		split_down: string
	}, timeDelta: number) => {
		if(isUndefined(currentInstrument) || isNull(currentInstrument)){
			warningToast("乐器尚未加载成功，请等待或切换合成器音色")
			return;
		}
		if (currentInstrument && !currentInstrument.isLoaded) {
			warningToast("乐器尚未加载成功，请等待或切换合成器音色")
			return;
		}
		const toneList = playList.map(n => Tone.Frequency(n, "midi").toNote())
		//确定播放模式
		let finalPlayStyle: string
		if (playMode === "random") {
			finalPlayStyle = collect(chordPlayStyle).random().toString()
		} else if (playMode === "byTurn") {
			if (chordPlayStyle.length === 1) {
				finalPlayStyle = chordPlayStyle[0]
			} else {
				finalPlayStyle = chordPlayStyle[playModeByTurnIndex]
			}
		}
		try {
			if (finalPlayStyle === "column") {
				currentInstrument.player.triggerAttackRelease(toneList, duration.column)
			} else if (finalPlayStyle === "split_up") {
				toneList.forEach((note, index) => {
					const timeAlter = "+" + index / timeDelta
					currentInstrument.player.triggerAttackRelease(note, duration.split_up, timeAlter)
				})
			} else if (finalPlayStyle === "split_down") {
				reverse(toneList).forEach((note, index) => {
					const timeAlter = "+" + index / timeDelta
					currentInstrument.player.triggerAttackRelease(note, duration.split_down, timeAlter)
				})
			} else {
				throw new Error("播放模式错误")
			}
		} catch (e) {
			warningToast("播放出错，请刷新或更换合成器音色")
		}


		//如果播放模式是轮换的话，播放完毕要更新顺序
		if (playMode === "byTurn") {
			if (playModeByTurnIndex < 0) return setPlayModeByTurnIndex(0)
			const newIndex = playModeByTurnIndex + 1
			if (newIndex >= chordPlayStyle.length) return setPlayModeByTurnIndex(0)
			setPlayModeByTurnIndex(newIndex)
		}
	}

	const player = useMemo(()=>{
		if(currentInstrument)return currentInstrument.player
		return null
	},[currentInstrument])

	const isLoaded = useMemo(()=>{
		if(currentInstrument)return currentInstrument.isLoaded
		return false
	},[currentInstrument])
	return {
		player,
		isLoaded,
		play
	}
}

export default useInstrument
