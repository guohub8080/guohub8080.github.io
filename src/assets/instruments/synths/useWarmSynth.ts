import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import byDefault from "@/utils/byDefault.ts";
import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const defaultParams = {
	volume: 0,
	release: 0.5
};

const useWarmSynth = (initialParams?: {
	volume?: number,
	release?: number
}) => {
	const { mainVolume, setMainVolume } = useGlobalSettings();
	const [isLoaded, setLoaded] = useState(false);
	const [volume, setVolume] = useState(byDefault(initialParams?.volume, defaultParams.volume));
	const [release, setRelease] = useState(byDefault(initialParams?.release, defaultParams.release));

	const synth = useRef<Tone.PolySynth | null>(null);

	// 初始化复音合成器
	useEffect(() => {
		synth.current = new Tone.PolySynth(Tone.Synth, {
			oscillator: {
				type: "fatcustom",
				partials: [0, 1, 0, 0.5, 0, 0.3, 0, 0.2],
				spread: 20,
				count: 3
			},
			envelope: {
				attack: 0.01,
				decay: 0.2,
				sustain: 0.4,
				release: release
			},
			volume: volume + mainVolume
		});

		// 滤波器
		const lowpassFilter = new Tone.Filter(3500, 'lowpass', -12);
		const highpassFilter = new Tone.Filter(100, 'highpass', -12);

		// 效果器
		const reverb = new Tone.Reverb({
			decay: 1.2,
			preDelay: 0.03
		});
		const chorus = new Tone.Chorus({
			frequency: 1.5,
			delayTime: 3,
			depth: 0.2,
			type: 'sine',
			spread: 180
		});

		// 信号路由
		synth.current.chain(highpassFilter, lowpassFilter, chorus, reverb, Tone.getDestination());

		setLoaded(true);

		return () => {
			if (synth.current) {
				synth.current.dispose();
			}
		};
	}, []); // 依赖项为空，确保只在组件挂载时初始化一次

	// 动态参数更新
	useEffect(() => {
		if (!synth.current) return;
		synth.current.set({
			volume: volume + mainVolume,
			envelope: {
				release: release
			}
		});
	}, [volume, release, mainVolume]);


	return { isLoaded, volume, setVolume, release, setRelease, player: synth.current };
};

export default useWarmSynth;
