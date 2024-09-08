import coreAlgorithm from "../../../common/radixCalc/coreAlgorithm";
import {base12} from "../../../common/radixCalc/radixSymbol";

export default (baseCircleId: number, moveStep: number, isClockwise = true): number => {
    const targetBase10Num = isClockwise ? baseCircleId + moveStep : baseCircleId - moveStep
    return coreAlgorithm.get2DigitNumArrByNum(targetBase10Num, base12)[1]
}