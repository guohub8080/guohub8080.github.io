// noinspection ES6PreferShortImport

import * as music12 from "@/music12";
import {sortBy} from "lodash";

const getChordTransform = (baseChordInfoObj: {
	rootNoteLocation: number,
	n3L: number,
	n5L: number,
	n7L: number,
	n9L: number,
	n11L: number,
	n13L: number,
}, baseChordKey: string, needCompareNoteLocationList: number[], absoluteRootNoteLocation: number) => {

	const transformList = music12.chord.getChordTransformByLocationList(baseChordInfoObj, needCompareNoteLocationList)
	const rootInChordList = music12.note.getNoteByLocation(baseChordInfoObj.rootNoteLocation)
	let rootNoteInChord: music12.note.Note
	let standardChord
	if (rootInChordList.length === 1) {
		rootNoteInChord = rootInChordList[0]
		standardChord = new music12.chord.Chord(rootNoteInChord, baseChordKey)
	} else {
		try {
			rootNoteInChord = rootInChordList[0]
			standardChord = new music12.chord.Chord(rootNoteInChord, baseChordKey)
		} catch {
			rootNoteInChord = rootInChordList[1]
			standardChord = new music12.chord.Chord(rootNoteInChord, baseChordKey)
		}
	}
	const scoreSymbol = standardChord['scoreSymbol']
	let transformString = ''
	if (transformList.p.length > 0) {
		transformString += sortBy(transformList.p).join(",") + ","
	}
	if (transformList.maj.length > 0) {
		transformString += sortBy(transformList.maj.map(x => `M${x}`)).join(",") + ","
	}
	if (transformList.aug.length > 0) {
		transformString += sortBy(transformList.aug).map(x => `#${x}`).join(",") + ","
	}
	if (transformList.min.length > 0) {
		transformString += sortBy(transformList.min).map(x => `b${x}`).join(",") + ","
	}
	if (transformList.dim.length > 0) {
		transformString += sortBy(transformList.dim).map(x => `b${x}`).join(",") + ","
	}
	if (transformList.omit.length > 0) {
		transformString += "omit"
		transformString += sortBy(transformList.omit).join(",") + ","
	}
	if (transformString.endsWith(",")) {
		transformString = transformString.slice(0, -1)
	}
	return {
		scoreSymbol,
		transformString,
		chordKey: baseChordKey,
		isRootNoteTransformed: absoluteRootNoteLocation !== baseChordInfoObj.rootNoteLocation,
		rootNoteLocationOfChord: baseChordInfoObj.rootNoteLocation,
	}
}

export default getChordTransform
