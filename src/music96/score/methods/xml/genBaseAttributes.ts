// noinspection ES6PreferShortImport
import {XMLBuilder} from "fast-xml-parser"
import byDefault from "../../../common/utils/byDefault.ts";
import {ScoreError} from "../../../common/processError/errorTypes.ts";


const genBaseAttributes = (attributes: {
	divisions: number,
	fifth?: number,
	beats?: number
	beatType?: number,
	bpm?: number,
	clef?: "treble" | "g" | "G" | "bass" | "F" | "f" | "middle" | "alto" | "m" | "M" | "percussion" | "P" | "p"
}) => {
	const builder = new XMLBuilder({
		ignoreAttributes: false, suppressEmptyNode: true
	})
	const clef = byDefault(attributes.clef, "treble")
	const clefObj = {"sign": "", "line": 0}
	if (["treble", "g", "G"].includes(clef)) {
		clefObj.sign = "G"
		clefObj.line = 2
	} else if (["bass", "F", "f"].includes(clef)) {
		clefObj.sign = "F"
		clefObj.line = 4
	} else if (["middle", "alto", "m", "M"].includes(clef)) {
		clefObj.sign = "C"
		clefObj.line = 3
	} else if (["percussion", "P", "p"].includes(clef)) {
		clefObj.sign = "percussion"
		clefObj.line = 2
	} else throw new ScoreError("unknown clef")
	const buildObj = {
		"attributes": [
			{
				"divisions": attributes.divisions,
				"key": {
					"fifths": byDefault(attributes.fifth, 0)
				},
				"time": {
					"beats": byDefault(attributes.beats, 4),
					"beatType": byDefault(attributes.beatType, 4)
				},
				"clef": clefObj
			},
		],
		"direction": {
			"@_placement": "above",
			"direction-type": {
				"metronome": {
					"@_parentheses": "no",
					"beat-unit": "quarter",
					"per-minute": byDefault(attributes.bpm, 100)
				}
			},
			"sound": {
				"@_tempo": byDefault(attributes.bpm, 100),
				"#text": ""
			}
		}
	}
	return builder.build(buildObj)
}

export default genBaseAttributes

