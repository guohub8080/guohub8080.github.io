import utFifthCircle from "../../fifthCircle/methods/utFifthCircle";
import utStep from "../../note/methods/utStep"

export {getFifthCircleIdByAnyNum, fifthCircleClockMove} from "../../fifthCircle/methods/utFifthCircle"
export {getStepByStepMove, getStepIndexByMove} from "../../note/methods/utStep"
export {
    getIntervalArrWithinOctaveByIntervalNum,
    getIntervalGapArrByStepAlter,
    getIntervalGapNumByStepAlter
} from "../../interval/methods/utInterval"
export {getLocationIDArrBySemitoneNum} from "../../note/methods/utSemitone"
export default {
    ...utFifthCircle, ...utStep
}