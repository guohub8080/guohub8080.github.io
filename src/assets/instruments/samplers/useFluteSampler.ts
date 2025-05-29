import useSampler from "@/assets/instruments/samplers/useSampler.ts";
import fluteBase64URLs from "@/assets/instruments/samplersBase64/fluteBase64URLs.ts";


const fixedUrls = {
	"A4": `samples/flute/A4.mp3`,
	"C5": `samples/flute/C5.mp3`,
}

const useFluteSampler = () => {
	if (import.meta.env.VITE_UNIAPP === 'true') {
		return useSampler(fluteBase64URLs, {volume: -16})
	}
	return useSampler(fixedUrls, {volume: -16})
}


export default useFluteSampler;
