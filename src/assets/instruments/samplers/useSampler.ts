import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import byDefault from "@/utils/byDefault.ts";
import {useState, useEffect, useRef, useMemo} from 'react';
import * as Tone from 'tone';
import {base} from "@/assets/datas/VITE_ENVS.ts";

const defaultParams = {
	volume: 0,
	release: 1
};

const useSampler = (urls: Record<string, string>, initialParams?: {
	volume?: number,
	release?: number
}) => {
	const {mainVolume, setMainVolume} = useGlobalSettings()
	const [isLoaded, setLoaded] = useState(false);
	const [volume, setVolume] = useState(byDefault(initialParams['volume'], defaultParams.volume));
	const [release, setRelease] = useState(byDefault(initialParams['release'], defaultParams.release));
	const dealedURLs = useMemo(() => {
		const newUrls: Record<string, string> = {};
		for (const key in urls) {
			newUrls[key] = base() + urls[key];
		}
		return newUrls;
	}, [urls, base]);
	const sampler = useRef(null);
	const player = useMemo(() => sampler.current, [sampler, isLoaded, volume, release])
	// 初始化采样器
	useEffect(() => {
		sampler.current = new Tone.Sampler({
			urls: dealedURLs,
			release: release,
			volume: volume,
			onload: () => {
				if (sampler.current) {
					sampler.current.toDestination();
					setLoaded(true);
				} else {
					setLoaded(false)
				}
			},
			onerror: (error) => {
				setLoaded(true);
			}
		}).chain(
			new Tone.Volume(volume + mainVolume).toDestination()
		);

		return () => sampler.current.dispose();
	}, []);

	// 动态参数更新
	useEffect(() => {
		if (!sampler.current) return;
		sampler.current.volume.value = volume + mainVolume;
		sampler.current.release = release;
	}, [volume, release, mainVolume]);

	return {isLoaded, volume, setVolume, setRelease, sampler, player};
}

export default useSampler;
