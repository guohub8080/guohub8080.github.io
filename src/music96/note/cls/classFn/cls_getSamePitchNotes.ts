// noinspection ES6PreferShortImport

import {Note} from "../NoteClass";
import {getStepByStepMove} from "../../methods/utStep";
import {t_alterValue} from "../../static/types";

// input: isAlterValueLessThan1 means the output note must be alter0
export default (givenNoteInstance: InstanceType<typeof Note>,
                isSelfIncluded = true,
                alterAbsLessThan: 0 | 1 | 2 = 2): InstanceType<typeof Note>[] => {
  if (Math.abs(alterAbsLessThan) > 2) throw new Error("Alter abs value cannot be bigger than 2!")
  const stepsArr = [getStepByStepMove(givenNoteInstance.step, 1),
    getStepByStepMove(givenNoteInstance.step, -1)]
  const newNotes = stepsArr.map(x => {
    const targetNoteInstance = new Note(x[1], 0, x[0] + givenNoteInstance.octave)
    const alterGap = givenNoteInstance.pitchValue - targetNoteInstance.pitchValue
    if (Math.abs(alterGap) > 2) return void 0
    if (Math.abs(alterGap) <= alterAbsLessThan) {
      return new Note(x[1], alterGap as t_alterValue, x[0] + givenNoteInstance.octave)
    }
    return void 0
  })
  if (isSelfIncluded) return [givenNoteInstance, ...newNotes].filter(y => y != void 0)
  return newNotes.filter(y => y != void 0)
}