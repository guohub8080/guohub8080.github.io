// noinspection ES6PreferShortImport
import {XMLBuilder} from "fast-xml-parser"
import guoDT from "../../../common/utils/guoDT.ts";

const genMeta = (meta: {
	title: string, subTitle?: string,
	right?: string, left?: string
}) => {
	const builder = new XMLBuilder({
		ignoreAttributes: false,
	})

	const buildObj = {
		"work": {
			"work-number": meta.subTitle,
			"work-title": meta.title
		},
		"identification":
			{
				"creator": [
					{"#text": meta.right, "@_type": "composer"},
					{"#text": meta.left, "@_type": "poet"}
				],
				"rights": "©guo2018@88.com"
			},
		"encoding": {
			"software": "Music96 by Guo",
			"encoding-date": guoDT.getFormattedDayjs(guoDT.getDayjs(), "YYYY-MM-DD")
		}
	}
	return builder.build(buildObj)
}

export default genMeta

