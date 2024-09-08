// noinspection ES6PreferShortImport

import {Chord} from "@/music96/chord/cls/ChordClass.ts";
import {CustomizedScale} from "@/music96/scale/cls/CustomizedScaleClass.ts";

const getCustomizedScaleShowObj = (customizedScaleObj: InstanceType<typeof CustomizedScale>) => {
	try {
		let degreeChord3
		let degreeChord7
		try {
			degreeChord3 = customizedScaleObj.degreeChord3?.map(x => x.scoreSymbol + " ...")
		} catch (e) {
			degreeChord3 = "complex chord"
		}
		try {
			degreeChord7 = customizedScaleObj.degreeChord7?.map(x => x.scoreSymbol + " ...")
		} catch (e) {
			degreeChord7 = "complex chord"
		}
		let notesList
		try {
			notesList = customizedScaleObj.notesList.map(x => x.artName + x.octave).join(", ")
		} catch (e) {
			notesList = "error"
		}
		return {
			...customizedScaleObj,
			intervalList: customizedScaleObj.intervalList.map(x => x[0] + x[1]).join(", "),
			notesList,
			rootNote: customizedScaleObj.rootNote.artName,
			scaleLength: customizedScaleObj.scaleLength,
			degreeChord3,
			degreeChord7,
		}
	} catch {
		return {error: "error."}
	}
}

export default getCustomizedScaleShowObj