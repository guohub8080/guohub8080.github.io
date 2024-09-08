// noinspection ES6PreferShortImport

import {Note} from "../../../../note/cls/NoteClass.ts";
import {Chord} from "../../../../chord/cls/ChordClass.ts";
import {ScaleError} from "../../../../common/processError/errorTypes.ts";
import coreAlgorithm from "../../../../common/radixCalc/coreAlgorithm.ts";
import {base7} from "../../../../common/radixCalc/radixSymbol.ts";
import {range} from "lodash";
import findChord from "../../../../chord/methods/findChord.ts";

const cls_analyseChord = (notesList: InstanceType<typeof Note>[], chordType: 3 | 7): InstanceType<typeof Chord>[] => {
  if (![3, 7].includes(chordType)) throw new ScaleError("Please check the scale degree chord type (3 or 7 required).")
  if (notesList.length !== 7) throw new ScaleError("Only scale containing 7 notes is supported.")
  const chordNotesList = range(0, 7).map(x => {
    if (chordType === 3) return [x, x + 2, x + 4]
    return [x, x + 2, x + 4, x + 6]
  }).map(x => x.map(i => coreAlgorithm.get2DigitNumArrByNum(i, base7)[1])).map(x => x.map(i => notesList[i]))
  // console.log(chordNotesList)
  return chordNotesList.map((x, y) => {
    try {
      const findResult =  findChord(x, "byNote", notesList[y])
      return findResult[0]
    } catch (e) {
      throw new ScaleError("Complex chord is found."+e.message)
    }
  })
}
export default cls_analyseChord