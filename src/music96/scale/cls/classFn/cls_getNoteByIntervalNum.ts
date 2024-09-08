// noinspection ES6PreferShortImport

import {Note} from "../../../note/cls/NoteClass.ts";
import coreAlgorithm from "../../../common/radixCalc/coreAlgorithm.ts";
import {base7} from "../../../common/radixCalc/radixSymbol.ts";

const cls_getNoteByIntervalNum = (notesList: InstanceType<typeof Note>[],
                                  num: number,
                                  isWithinOctave = false): InstanceType<typeof Note> => {
	const intervalNumList = coreAlgorithm.get2DigitNumArrByNum(num - 1, base7)
	if (intervalNumList[0] === 0 || isWithinOctave) return notesList[intervalNumList[1]]
	const targetNote = notesList[intervalNumList[1]]
	const newOctave = intervalNumList[0] + targetNote.octave
	return new Note(targetNote.step, targetNote.alter, newOctave)
}

export default cls_getNoteByIntervalNum