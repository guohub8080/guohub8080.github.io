import noteMeta from "./noteMeta";
import note from "./index";

/**
 * 通过step和alter值来得到一个note对象；如果输入非法，那么就输出null
 */
const getNoteByStepAlter = (step: string, alter: number) => {
    const noteObj = noteMeta.where("step", step.trim().toUpperCase()).where("alter", alter).first()
    if (noteObj) {
        return noteObj
    }
    return void 0
}

/**
 *如果index超过某个值，就看看对于octave的影响。
 */


/**
 * 通过数字index来得到一个note对象，1对应C，2对应D，以此类推，7对应B。
 */
const getNoteByIndexAlter = (index: number, alter: number) => {
    const noteObj = noteMeta.where("index", index).where("alter", alter).first()
    if (noteObj) {
        return noteObj
    }
    return void 0
}

/**
 * 随机地得到一个白键
 */
const getRandomWhiteNote = () => {
    return noteMeta.where("alter", 0).random()
}

/**
 * 随机地得到一个黑键，注意，该黑键必须是alter的绝对值小于等于1
 */
const getRandomBlackNote = () => {
    return noteMeta.where("isBlack", true).filter((value, key) => {
        return Math.abs(value.alter) <= 1
    }).random()
}
/**
 * 随机地得到一个键，无论是黑键还是白键
 */
const getRandomNote = () => {
    return noteMeta.where("isNormal", true).random()
}
export default {
    getNoteByIndexAlter, getNoteByStepAlter,
    getRandomBlackNote, getRandomWhiteNote, getRandomNote,
}
