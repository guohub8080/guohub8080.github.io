/* eslint-disable no-mixed-spaces-and-tabs */
// noinspection ES6PreferShortImport
import {XMLBuilder} from "fast-xml-parser"
import guoDT from "../../../common/utils/guoDT.ts";
import {isArray, isString, isUndefined} from "lodash";

type t_tripletPlaceElement = {
	isRest?: boolean
	step?: string
	alter?: number
	octave?: number
	duration: number
	lyrics?: string[] | string
}

type t_eachTripletPlace = t_tripletPlaceElement[]

type t_tripletNotesList = {
	totalDuration: number,
	eachNoteType: string,
	list: t_eachTripletPlace[]
}

const genNote = (tripletNotesList: t_tripletNotesList) => {
	const builder = new XMLBuilder({
		ignoreAttributes: false, processEntities: false, suppressEmptyNode: true
	})
	const dealOnePlace = (noteMeta: t_tripletPlaceElement, type: string, isInChord: boolean,
	                      beamNum: number,) => {
		const innerBuilder = new XMLBuilder({
			ignoreAttributes: false, processEntities: false, suppressEmptyNode: true
		})
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

		const buildObj = {
			"note": {
				"chord": {
					"#text": isInChord ? "" : void 0
				},
				...noteType,
				"duration": noteMeta.duration,
				"voice": 1,
				"type": type,
				"time-modification": {
					"actual-notes": 3,
					"normal-notes": 2
				},
				...lyrics
			}
		}
		return lyrics
	}


	// const tied = {"notations": void 0}
	// if (!(isUndefined(noteMeta.isTieStarted) && isUndefined(noteMeta.isTieStopped))) {
	// 	if (noteMeta.isTieStarted) {
	// 		tied["notations"] = {tied: {"@_type": "start", "#text": ""},}
	// 	} else if (noteMeta.isTieStopped) {
	// 		tied["notations"] = {tied: {"@_type": "stop", "#text": ""},}
	// 	}
	// }


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

