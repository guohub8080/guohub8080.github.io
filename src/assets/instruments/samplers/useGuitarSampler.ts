import useSampler from "@/assets/instruments/samplers/useSampler.ts";
import guitarBase64URLs from "@/assets/instruments/samplersBase64/guitarBase64URLs.ts";


const fixedUrls = {
	"A4": `samples/guitar-acoustic/A4.mp3`,
	"A3": `samples/guitar-acoustic/A3.mp3`,
	"D5": `samples/guitar-acoustic/D5.mp3`,
};

const useGuitarSampler = () => {
	if (import.meta.env.VITE_UNIAPP === 'true') {
		return useSampler(guitarBase64URLs, {volume: -10})
	}
	return useSampler(fixedUrls, {volume: -10})
}
export default useGuitarSampler;
