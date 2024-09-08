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
const genPartList = (partMetaList: t_partMeta[]) => {
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


	return 1
}

export default genPartList

