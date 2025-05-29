import useSampler from "@/assets/instruments/samplers/useSampler.ts";
import PianoBase64URLs from "@/assets/instruments/samplersBase64/pianoBase64URLs.ts";


const fixedUrls = {
	"C4": `samples/piano/C4.mp3`,
	"A4": `samples/piano/A4.mp3`,
	"A5": `samples/piano/A5.mp3`,
	"F#3": `samples/piano/Fs3.mp3`,
	// 可以根据需要添加更多音符的样本
}

const usePianoSampler = () => {
	if (import.meta.env.VITE_UNIAPP === 'true') {
		return useSampler(PianoBase64URLs, {volume: -5})
	}
	return useSampler(fixedUrls, {volume: -5})
}

export default usePianoSampler;
