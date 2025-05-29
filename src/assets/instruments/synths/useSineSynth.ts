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
			// 振荡器部分，使用纯正弦波
			oscillator: {
				type: "sine",
			},
			// 包络参数（ADSR），精准模拟钢琴发声过程
			envelope: {
				attack: 0.0005,  // 稍微增加起音时间，模拟琴槌敲击
				decay: 0.1,     // 更快衰减，使声音快速变弱
				sustain: 0.2,   // 增加一些延音电平
				release: 0.5,   // 适当释音控制余音
				attackCurve: "exponential",
				decayCurve: "exponential",
				releaseCurve: "exponential"
			},
			volume: volume + mainVolume // 调整音量
		});

// 滤波器部分
// 低通滤波器，适当提高截止频率保留高频，同时增加 Q 值增强共振
		const lowpassFilter = new Tone.Filter({
			type: "lowpass",
			frequency: 6000, // 稍微提高截止频率
			Q: 1.5,          // 稍微增加 Q 值
			rolloff: -24
		});

// 高通滤波器，进一步去除低频杂音
		const highpassFilter = new Tone.Filter({
			type: "highpass",
			frequency: 250,  // 稍微降低截止频率
			Q: 0.7,          // 稍微降低 Q 值
			rolloff: -12
		});

// 效果器部分
// 压缩器，严格控制音量动态范围
		const compressor = new Tone.Compressor({
			threshold: -30,
			ratio: 6,
			attack: 0.001,
			release: 0.25
		});

// 限幅器，防止声音过载
		const limiter = new Tone.Limiter(-10);

// 混响效果，减少混响时间和湿信号比例
		const reverb = new Tone.Reverb({
			decay: 0.06,
			preDelay: 0.02,
			wet: 0.05
		});

// 均衡器，提升高频部分
		const eq = new Tone.EQ3({
			low: -2,
			mid: 0,
			high: 4,
			lowFrequency: 200,
			highFrequency: 4000
		});

		// 信号路由
		synth.current.chain(highpassFilter, lowpassFilter, reverb, Tone.getDestination());

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
