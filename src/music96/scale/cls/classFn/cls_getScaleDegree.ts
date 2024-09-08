// noinspection ES6PreferShortImport

import {Note} from "../../../note/cls/NoteClass.ts";
import {ScaleError} from "../../../common/processError/errorTypes.ts";
import coreAlgorithm from "../../../common/radixCalc/coreAlgorithm.ts";
import {base7} from "../../../common/radixCalc/radixSymbol.ts";
import findChord from "../../../chord/methods/findChord.ts";

export default (scaleDegree: number, chordNum = 3,
                notesList: InstanceType<typeof Note>[]) => {
	if (notesList && notesList.length !== 7) throw new ScaleError("This function only support the scale containing 7 notes.")
	if (![3, 7].includes(chordNum)) throw new ScaleError("Only support chord3 and chord7.")
	const primaryIndex = coreAlgorithm.get2DigitNumArrByNum(scaleDegree - 1, base7)[1]
	let selectedIndexList: number[] = [primaryIndex, primaryIndex + 2, primaryIndex + 4]
	if (chordNum === 7) selectedIndexList.push(primaryIndex + 6)
	selectedIndexList = selectedIndexList.map(x => coreAlgorithm.get2DigitNumArrByNum(x, base7)[1])
	const chordNotesList = selectedIndexList.map(x => notesList[x])
	const findChordResultList = findChord(chordNotesList, "byNote", chordNotesList[0])
	if (findChordResultList.length === 0) throw new ScaleError("No chords found.")
	if (findChordResultList.length >= 2) throw new ScaleError("Multiple chords found.")
	return findChordResultList[0]
}