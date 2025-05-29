import useSampler from "@/assets/instruments/samplers/useSampler.ts";
import EPianoBase64URLs from "@/assets/instruments/samplersBase64/ePianoBase64URLs.ts";

const fixedUrls = {
	"C2": `samples/epiano/C2.mp3`,
	"C3": `samples/epiano/C3.mp3`,
	"F#4": `samples/epiano/Fs4.mp3`,
}

const useEPianoSampler = () => {
	if (import.meta.env.VITE_UNIAPP === 'true') {
		return useSampler(EPianoBase64URLs, {volume: -15})
	}
	return useSampler(fixedUrls, {volume: -15})
}


export default useEPianoSampler;
