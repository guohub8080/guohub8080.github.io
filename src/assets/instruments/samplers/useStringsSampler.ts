import useSampler from "@/assets/instruments/samplers/useSampler.ts";
import stringsBase64URLs from "@/assets/instruments/samplersBase64/stringsBase64URLs.ts";


const fixedUrls = {
	"A4": `samples/strings/A4.mp3`,
	"G4": `samples/strings/G4.mp3`,
	"A3": `samples/strings/A3.mp3`,
}

const useStringsSampler = () => {
	if (import.meta.env.VITE_UNIAPP === 'true') {
		return useSampler(stringsBase64URLs, {volume: -16})
	}
	return useSampler(fixedUrls, {volume: -16})
}


export default useStringsSampler;
