// noinspection ES6PreferShortImport
import {XMLBuilder} from "fast-xml-parser"
import guoDT from "../../../common/utils/guoDT.ts";
import {isArray, isString, isUndefined} from "lodash";

const genNote = (noteMeta: {
	isRest?: boolean
	step?: string
	alter?: number
	octave?: number
	duration: number
	type: string
	lyrics?: string[] | string
	isTieStarted?: boolean
	isTieStopped?: boolean
}) => {
	const builder = new XMLBuilder({
		ignoreAttributes: false, processEntities: false, suppressEmptyNode: true
	})

	const lyrics = {lyric: void 0}
	if (noteMeta.lyrics) {
		if (isString(noteMeta.lyrics)) {
			lyrics["lyric"] = {
				"lyric": {
					"@_number": 1,
					"syllabic": "single",
					"text": noteMeta.lyrics,
				}
			}
		} else if (isArray(noteMeta.lyrics)) {
			lyrics["lyric"] = noteMeta.lyrics.map((x, y) => {
				return {
					"@_number": y + 1,
					"syllabic": "single",
					"text": x,
				}
			})
		}
	}

	const tied = {"notations": void 0}
	if (!(isUndefined(noteMeta.isTieStarted) && isUndefined(noteMeta.isTieStopped))) {
		if (noteMeta.isTieStarted) {
			tied["notations"] = {tied: {"@_type": "start", "#text": ""},}
		} else if (noteMeta.isTieStopped) {
			tied["notations"] = {tied: {"@_type": "stop", "#text": ""},}
		}
	}


	let noteType: object
	if (noteMeta.isRest || !noteMeta.step) {
		noteType = {"rest": ""}
	} else {
		noteType = {
			"pitch": {
				"step": noteMeta.step,
				"alter": noteMeta.alter,
				"octave": noteMeta.octave
			}
		}
	}

	const buildObj = {
		"note": {
			...noteType,
			"duration": noteMeta.duration,
			"voice": 1,
			"type": noteMeta.type,
			...tied,
			...lyrics
		}
	}
	return builder.build(buildObj)
}

export default genNote

