import {t_noteStep} from "../static/types";
import {base12} from "../../common/radixCalc/radixSymbol";
import PowerRadix from "power-radix";
import coreAlgorithm from "../../common/radixCalc/coreAlgorithm";


export const getLocationIDArrBySemitoneNum = (semitoneValue: number) => {
    return coreAlgorithm.get2DigitNumArrByNum(semitoneValue, base12)
}


export default {getLocationIDArrBySemitoneNum}