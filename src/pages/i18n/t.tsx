import useGlobalSettings from "@pages/storage/globalSettings.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {EmotionJSX} from "@emotion/react/types/jsx-namespace";

const t = (lanArray: {
	cn?: string, en?: string,
	cnG?: (EmotionJSX.Element | string)[], enG?: (EmotionJSX.Element | string)[]
}) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const globalSettings = useGlobalSettings()
	if (globalSettings.language === "cn" && lanArray.cn) return lanArray["cn"]
	if (globalSettings.language === "en" && lanArray.en) return lanArray["en"]
	if (globalSettings.language === "en" && !lanArray.en && lanArray.cn) return lanArray["cn"]
	if ((globalSettings.language === "cn" && lanArray.cnG.length > 0) || (globalSettings.language === "en" && lanArray.enG.length===0)) {
		return lanArray.cnG.map((x, y) => {
			if (typeof x === "string") return <span key={y}>{x}</span>
			else return <span key={y}>{x}</span>
		})
	}
	if (globalSettings.language === "en" && lanArray["enG"]) return lanArray.enG.map((x, y) => {
		if (typeof x === "string") return <span key={y}>{x}</span>
		else return <span key={y}>{x}</span>
	})
}
export default t