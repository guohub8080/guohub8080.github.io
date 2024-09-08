import {Note} from "../NoteClass";
import noteMeta from "../../static/noteMeta";
import {t_alterValue, t_noteStep} from "../../static/types";
import {getStepByStepMove} from "../../methods/utStep";
import {getLocationIDArrBySemitoneNum} from "../../methods/utSemitone";
import {IntervalError, NoteError} from "../../../common/processError/errorTypes";
import {Interval} from "../../../interval/cls/IntervalClass";
import {getIntervalArrWithinOctaveByIntervalNum} from "../../../interval/methods/utInterval";
import {intervalSlide_145, intervalSlide_2367} from "../../../interval/methods/intervalSlide";
import {t_intervalType} from "../../../interval/static/types";

export default (noteInstance: InstanceType<typeof Note>,
                numberNotation: string,
                isAscending = true): InstanceType<typeof Note> => {
    const intervalNumReg = numberNotation.match(/\d+/g)
    if (intervalNumReg.length > 1) throw new IntervalError("2 or more interval is given.")
    const lowOctaveReg = numberNotation.match(/[.lL<vV]/g)
    const lowOctaveValue = lowOctaveReg ? lowOctaveReg.length : 0
    const highOctaveReg = numberNotation.match(/[*hH>^]/g)
    const highOctaveValue = highOctaveReg ? highOctaveReg.length : 0
    const flatReg = numberNotation.match(/[-fFbB]/g)
    const flatRegValue = flatReg ? flatReg.length : 0
    const sharpReg = numberNotation.match(/[+sS#]/g)
    const sharpRegValue = sharpReg ? sharpReg.length : 0
    const totalOctaveGap = highOctaveValue - lowOctaveValue
    const intervalNum = Number(intervalNumReg[0])
    const intervalNumArr = getIntervalArrWithinOctaveByIntervalNum(intervalNum)
    const totalAlterValue = sharpRegValue - flatRegValue
    let intervalPrefix: string
    if ([1, 4, 5].indexOf(intervalNumArr[1]) != -1) intervalPrefix = intervalSlide_145("p", totalAlterValue)
    else if ([2, 3, 6, 7].indexOf(intervalNumArr[1]) != -1) intervalPrefix = intervalSlide_2367("maj", totalAlterValue)
    const intervalInstance = new Interval(intervalPrefix as t_intervalType, intervalNum)
    if (totalOctaveGap === 0) return noteInstance.getNoteByInterval(intervalInstance, isAscending)
    const noteNeedOctaveShift = noteInstance.getNoteByInterval(intervalInstance, isAscending)
    return new Note(noteNeedOctaveShift.step, noteNeedOctaveShift.alter, noteNeedOctaveShift.octave + totalOctaveGap)
}