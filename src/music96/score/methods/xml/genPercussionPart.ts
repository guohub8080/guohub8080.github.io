// noinspection ES6PreferShortImport
import {XMLBuilder} from "fast-xml-parser"
import guoDT from "../../../common/utils/guoDT.ts";
import {ScoreError} from "../../../common/processError/errorTypes.ts";
import {isArray} from "lodash";
import ByDefault from "../../../common/utils/byDefault.ts";

type t_partMeta = {
	partName: string,
	partAbbr?: string
}
const genPercussionPart = (partMetaList: t_partMeta[]) => {
	if (!isArray(partMetaList)) throw new ScoreError("Part list must be an array.")
	const builder = new XMLBuilder({
		ignoreAttributes: false,
	})


	const dealPerPart = (p: t_partMeta, partID: string) => {
		return {
			"part-name": p.partName,
			"part-abbreviation": ByDefault(p.partAbbr, p.partName)
		}
	}


	const parList = []
	for (let i = 0; i < partMetaList.length; i++) {
		parList.push()
	}
	// const workObj = meta.subTitle ? {
	// 	"work-number": ByDefault(meta.subTitle, ""),
	// 	"work-title": meta.title
	// } : {"work-title": meta.title}
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

export default genPercussionPart

