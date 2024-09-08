import {t_noteStep} from "../../note/static/types";
import {base7, stepList} from "../../common/radixCalc/radixSymbol";
import PowerRadix from "power-radix";
import coreAlgorithm from "../../common/radixCalc/coreAlgorithm";

// given a rough interval value, give the ArrayList within octave.
// e.g. given: 1 , output: [ 0 , 1 ]
// e.g. given: 8 , output: [ 1 , 0 ]
export const getIntervalArrWithinOctaveByIntervalNum = (intervalNum: number): [number, number] => {
    const stepNum = intervalNum - 1
    const stepArr = coreAlgorithm.get2DigitNumArrByNum(stepNum, base7)
    return [stepArr[0], stepArr[1] + 1]
}

// given two pairs of step and octave, give the rough interval value (not include augment/ diminish /major / minor...)
// e.g. given : C, 4, D, 4   output: 2
// e.g. given : C, 4, D, 5   output: 9
export const getIntervalGapNumByStepAlter = (step1: t_noteStep, octave1: number,
                                             step2: t_noteStep, octave2: number): number => {
    const step1Index = Number(new PowerRadix(step1, stepList as any).toString(10))
    const step1Base10 = coreAlgorithm.getNumBy2DigitNumArr([octave1, step1Index], base7)
    const step2Index = Number(new PowerRadix(step2, stepList as any).toString(10))
    const step2Base10 = coreAlgorithm.getNumBy2DigitNumArr([octave2, step2Index], base7)
    return step2Base10 - step1Base10 + 1
}

// given two pairs of step and octave, give the rough interval Array (not include augment/ diminish /major / minor...)
// e.g. given : C, 4, D, 4   output: [0,2]
// e.g. given : C, 4, D, 5   output: [1,2]
export const getIntervalGapArrByStepAlter = (step1: t_noteStep, octave1: number,
                                             step2: t_noteStep, octave2: number): [number, number] => {
    const intervalGapNum = getIntervalGapNumByStepAlter(step1, octave1, step2, octave2)
    const indexArr = coreAlgorithm.get2DigitNumArrByNum(intervalGapNum - 1, base7)
    return [indexArr[0], indexArr[1] + 1]
}


export default {getIntervalArrWithinOctaveByIntervalNum, getIntervalGapArrByStepAlter, getIntervalGapNumByStepAlter}