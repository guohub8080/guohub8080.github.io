import PowerRadix from "power-radix";
import coreAlgorithm from "../../common/radixCalc/coreAlgorithm";
import {base12} from "../../common/radixCalc/radixSymbol";

export const getFifthCircleIdByAnyNum = (inputNum: number) => {
    return coreAlgorithm.get2DigitNumArrByNum(inputNum, base12)[1]
}

export const fifthCircleClockMove = (baseCircleId: number, moveStep: number, isClockwise = true): number => {
    const targetBase10Num = isClockwise ? baseCircleId + moveStep : baseCircleId - moveStep
    return coreAlgorithm.get2DigitNumArrByNum(targetBase10Num, base12)[1]
}
export default {
    getFifthCircleIdByAnyNum, fifthCircleClockMove
}