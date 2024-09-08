// noinspection ES6PreferShortImport

import {t_intervalType} from "../static/types";
import {Note} from "../../note/cls/NoteClass";
import {Interval} from "../cls/IntervalClass";
import {IntervalError} from "../../common/processError/errorTypes";
import intervalMeta from "../static/intervalMeta";
import {getStepGapByStepAlter} from "../../note/methods/utStep";
import coreAlgorithm from "../../common/radixCalc/coreAlgorithm";
import {base12, base7} from "../../common/radixCalc/radixSymbol";


const getIntervalByComparingNotes= (note1: InstanceType<typeof Note>,
                note2: InstanceType<typeof Note>): InstanceType<typeof Interval> => {
    // Some cases:
    //   Notes         direction    semitoneGap      intervalArr       semitoneArr
    // C_4 -> C_4        上行             0            [  0, 1 ]        [  0, 0  ]
    // C_4 -> C♯_4       上行             1            [  0, 1 ]        [  0, 1  ]
    // C_4 -> C♭_4       下行            -1            [  0, 1 ]        [ -1, 11 ]
    // C_4 -> B_3        下行            -1            [ -1, 7 ]        [ -1, 11 ]
    // C_4 -> D_4        上行             2            [  0, 2 ]        [  0, 2  ]
    // C_4 -> B♯_3       上行             0            [ -1, 7 ]        [  0, 0  ]
    // C_4 -> D♭_4       上行             1            [  0, 2 ]        [  0, 1  ]
    // C_4 -> B♯♯_3      上行             1            [ -1, 7 ]        [  0, 1  ]
    // C_4 -> D♭♭_4      上行             0            [  0, 2 ]        [  0, 0  ]
    // C_4 -> C♭♭_4      下行            -2            [  0, 1 ]        [ -1, 10 ]
    let semitoneGap = note2.pitchValue - note1.pitchValue
    // deal with the parallel relationship.
    if (semitoneGap === 0) {
        const intervalGap = Math.abs(getStepGapByStepAlter(note1.step, note1.octave, note2.step, note2.octave)) + 1
        const findIntervalObj = intervalMeta.where("semitoneGap", 0).where("num", intervalGap).first()
        if (findIntervalObj) return new Interval(findIntervalObj.type as t_intervalType, findIntervalObj.num)
        throw new IntervalError("Parallel but not fit interval.")
    }
    // if the semitoneGap is negative, flip it around first.
    if (semitoneGap < 0) semitoneGap = semitoneGap * -1
    const semitoneGapArr = coreAlgorithm.get2DigitNumArrByNum(semitoneGap, base12)
    const stepGap = Math.abs(getStepGapByStepAlter(note1.step, note1.octave, note2.step, note2.octave))
    const stepGapArr = coreAlgorithm.get2DigitNumArrByNum(stepGap, base7)
    const semitoneWithinOctave = stepGapArr[0] === semitoneGapArr[0] ? semitoneGapArr[1] : semitoneGapArr[1] + 12 * (semitoneGapArr[0] - stepGapArr[0])
    const findIntervalObj = intervalMeta.where("semitoneGap", semitoneWithinOctave).where("num", stepGapArr[1] + 1).first()
    if (findIntervalObj) return new Interval(findIntervalObj.type as t_intervalType, stepGapArr[0] * 7 + stepGapArr[1] + 1)
    throw new IntervalError("Cannot find the interval.")
}
export {getIntervalByComparingNotes}
export default getIntervalByComparingNotes