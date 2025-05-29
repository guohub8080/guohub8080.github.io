import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import byDefault from "@/utils/byDefault.ts";
import {useState, useEffect, useRef} from 'react';
import * as Tone from 'tone';

const defaultParams = {
	volume: 0,
	release: 0.5
};

const useWarmSynth = (initialParams?: {
	volume?: number,
	release?: number
}) => {
	const {mainVolume, setMainVolume} = useGlobalSettings();
	const [isLoaded, setLoaded] = useState(false);
	const [volume, setVolume] = useState(byDefault(initialParams?.volume, defaultParams.volume));
	const [release, setRelease] = useState(byDefault(initialParams?.release, defaultParams.release));

	const synth = useRef<Tone.PolySynth | null>(null);

	// 初始化复音合成器
	useEffect(() => {
		synth.current = new Tone.PolySynth(Tone.Synth, {
			oscillator: {
				// 使用正弦波和方波组合，正弦波提供纯净基音，方波增加谐波
				type: 'fatcustom',
				partials: [1, 0, 0.6, 0, 0.4],
				spread: 25,
				count: 3
			},
			envelope: {
				attack: 0.0005, // 极快起音，模拟敲击瞬间爆发
				decay: 0.6,     // 适当衰减时间，让声音有延续感
				sustain: 0.0,   // 零持续音量，符合叮咚声特点
				release: 1.6    // 较长释音时间，增强余音叮咚效果
			},
			volume: volume + mainVolume
		});

// 滤波器设置
// 低通滤波器，提高截止频率，让高频通过增强明亮感
		const lowpassFilter = new Tone.Filter(9000, 'lowpass', -24);
// 高通滤波器，适当提高截止频率，去除更多低频杂音
		const highpassFilter = new Tone.Filter(400, 'highpass', -12);
		// 信号路由
		synth.current.chain(highpassFilter, lowpassFilter, Tone.getDestination());

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


	return {isLoaded, volume, setVolume, release, setRelease, player: synth.current};
};

export default useWarmSynth;
