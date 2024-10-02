import useGlobalSettings from "@pages/storage/globalSettings.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {EmotionJSX} from "@emotion/react/types/jsx-namespace";
import {isArray} from "lodash";

const returnGroups = (group: Array<any>) => {
	return group.map((x, y) => {
		if (typeof x === "string") return <span key={y}>{x}</span>
		return <span key={y}>{x}</span>
	})
}
const t = (lanArray: {
	cn?: string,
	en?: string,
	cnG?: (EmotionJSX.Element | string)[],
	enG?: (EmotionJSX.Element | string)[]
}) => {
	const globalSettings = useGlobalSettings()
	if (globalSettings.language === "cn" && lanArray.cn) return lanArray["cn"]
	if (globalSettings.language === "en" && lanArray.en) return lanArray["en"]
	if (globalSettings.language === "en" && !lanArray.en && lanArray.cn) return lanArray["cn"]
	if (isArray(lanArray.cnG)) {
		if (globalSettings.language === "cn" && lanArray.cnG.length > 0) {
			return returnGroups(lanArray.cnG)
		}
	}
	if (isArray(lanArray.enG)) {
		if (globalSettings.language === "en" && lanArray.enG.length === 0) {
			return returnGroups(lanArray.cnG)
		} else return returnGroups(lanArray.enG)
	}

	// if (globalSettings.language === "en" && lanArray["enG"]) {
	// 	return lanArray.enG?.map((x, y) => {
	// 		if (typeof x === "string") return <span key={y}>{x}</span>
	// 		else return <span key={y}>{x}</span>
	// 	})
	// }
}
export default t
