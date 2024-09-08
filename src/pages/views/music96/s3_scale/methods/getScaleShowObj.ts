// noinspection ES6PreferShortImport

import {Scale} from "@/music96/scale/cls/ScaleClass.ts";
import {truncate} from "lodash";

const getScaleShowObj = (scaleObj: InstanceType<typeof Scale>) => {

	return {
		rootNote: scaleObj.rootNote.artName + scaleObj.rootNote.octave + " ...",
		originRootNote: scaleObj.originRootNote.artName + scaleObj.originRootNote.octave + " ...",
		modeDescription: truncate(scaleObj.modeDescription, {length: 22}),
		modeName: scaleObj.modeName, isTonicNoteReplaced: scaleObj.isTonicNoteReplaced,
		simpleDescription: scaleObj.simpleDescription,
		intervalList: scaleObj.intervalList.map(x => `${x[0]}${x[1]}`).join(", "),
		notesList: scaleObj.notesList.map(x => x.artName + x.octave + " ...")

	}
}

export default getScaleShowObj