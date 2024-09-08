import {Note} from "../NoteClass";
import noteMeta from "../../static/noteMeta";
import {t_alterValue, t_noteStep} from "../../static/types";
import {getStepByStepMove} from "../../methods/utStep";
import {getLocationIDArrBySemitoneNum} from "../../methods/utSemitone";
import {IntervalError, NoteError} from "../../../common/processError/errorTypes";
import {Interval} from "../../../interval/cls/IntervalClass";

export default (noteInstance: InstanceType<typeof Note>,
                intervalInstance: InstanceType<typeof Interval>,
                isAscending = true): InstanceType<typeof Note> => {
    if (typeof intervalInstance === "undefined") throw new IntervalError("Interval is empty.")
    if (typeof noteInstance === "undefined") throw new NoteError("Note is empty.")
    let targetStepArr: [number, t_noteStep]
    let targetLocationIDArr: [number, number]
    if (isAscending) {
        targetStepArr = getStepByStepMove(noteInstance.step, intervalInstance.num - 1)
        targetLocationIDArr = getLocationIDArrBySemitoneNum(noteInstance.semitoneWithinOctave + intervalInstance.semitoneGap)
    } else {
        targetStepArr = getStepByStepMove(noteInstance.step, (intervalInstance.num - 1) * -1)
        targetLocationIDArr = getLocationIDArrBySemitoneNum(noteInstance.semitoneWithinOctave - intervalInstance.semitoneGap)
    }
    const findBaseNoteObj = noteMeta.where("step", targetStepArr[1]).where("locationId", targetLocationIDArr[1]).first()
    if (!Boolean(findBaseNoteObj)) throw new NoteError("No fit note from base note by the given interval.")
    return new Note(findBaseNoteObj.step as t_noteStep, findBaseNoteObj.alter as t_alterValue, noteInstance.octave + targetStepArr[0])
}