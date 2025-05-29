import useSampler from "@/assets/instruments/samplers/useSampler.ts";
import harpBase64URLs from "@/assets/instruments/samplersBase64/harpBase64URLs.ts";

const fixedUrls = {
	"F4": `samples/harp/F4.mp3`,
	"B5": `samples/harp/B5.mp3`,
	"D6": `samples/harp/D6.mp3`,
}

const useHarpSampler = () => {
	if (import.meta.env.VITE_UNIAPP === 'true') {
		return useSampler(harpBase64URLs, {volume: -10, release: 1})
	}
	return useSampler(fixedUrls, {volume: -10, release: 1})
}


export default useHarpSampler;
