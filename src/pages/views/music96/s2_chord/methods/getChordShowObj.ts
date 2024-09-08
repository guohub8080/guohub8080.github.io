// noinspection ES6PreferShortImport

import {Chord} from "@/music96/chord/cls/ChordClass.ts";

const getChordShowObj = (chordObj: InstanceType<typeof Chord>) => {
	return {
		...chordObj, rootNote: chordObj.rootNote.artName + chordObj.rootNote.octave + " ...",
		chordVoicing:"...",
		intervalList: chordObj.intervalList.map(x => x[0] + x[1]).join(", ") + " ...",
		notesList: chordObj.notesList.map(x => x.artName + x.octave).join(", ") + " ...",
		notesListAfterVoicing: chordObj.notesListAfterVoicing.map(x => x.artName + x.octave).join(", ") + " ...",
		scoreSymbol: chordObj.scoreSymbol, simpleDescription: chordObj.simpleDescription,
		simpleDescriptionAfterVoicing: chordObj.simpleDescriptionAfterVoicing
	}
}

export default getChordShowObj