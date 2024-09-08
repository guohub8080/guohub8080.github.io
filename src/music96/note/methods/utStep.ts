import {t_noteStep} from "../static/types";
import {base7, stepList} from "../../common/radixCalc/radixSymbol";
import PowerRadix from "power-radix";
import coreAlgorithm from "../../common/radixCalc/coreAlgorithm";

// input: step, move number, moveDirection
export const getStepByStepMove = (step: t_noteStep,
                                  move: number,
                                  isAscending = true): [number, t_noteStep] => {
	const stepIndex = Number(new PowerRadix(step, stepList as any).toString(10))
	const targetNum = isAscending ? stepIndex + move : stepIndex - move
	const targetArr = coreAlgorithm.get2DigitNumArrByNum(targetNum, base7)
	return [targetArr[0], stepList[targetArr[1]] as t_noteStep]
}

export const getStepIndexByMove = (stepIndex: number, move: number, isMoveUpward = true) => {
	const num = isMoveUpward ? stepIndex + move : stepIndex - move
	return coreAlgorithm.get2DigitNumArrByNum(num, base7)
}

export const getStepGapByStepAlter = (step1: t_noteStep, octave1: number, step2: t_noteStep, octave2: number): number => {
	const stepIndex1 = Number(new PowerRadix(step1, stepList as any).toString(10))
	const stepIndex2 = Number(new PowerRadix(step2, stepList as any).toString(10))
	return coreAlgorithm.getGapNumBetween2DigitNumArr([octave1, stepIndex1], [octave2, stepIndex2], base7)

}
export default {getStepByStepMove, getStepIndexByMove, getStepGapByStepAlter}