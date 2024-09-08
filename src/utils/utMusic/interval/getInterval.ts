import {intervalType} from "./index"
import intervalMeta from "./intervalMeta";
import {
    getIndexOrIntervalOctaveRounds,
    getIndexOrIntervalOctaveRounds as getIntervalRounds,
    getSemitoneOctaveRounds
} from "../common/index"
import getKeynote from "../note/getKeynote";
import {KeyNote} from "../note/getKeynote";
import {Simulate} from "react-dom/test-utils";
import drag = Simulate.drag;
import getNote from "../note/getNote";

export type intervalObjType = {
    isError: boolean,
    errorInfo: string,
    direction?: "upward" | "downward" | "parallel",
    type?: string,
    num?: number,
    intervalNumOctaveRounds?: number,
    numWithinOctave?: number,
    cnPrefix?: string,
    semitoneGap?: number,
    indexGap?: number
}


const getInterval = (intervalType: intervalType,
                     intervalNum: number,
                     direction: intervalObjType["direction"]): intervalObjType => {
    // 如果小于1，那么不支持查询
    if (intervalNum < 1) {
        return {
            isError: true,
            errorInfo: "Interval num can NOT be 0 or negative."
        }
    }
    // 如果小于8，那么就直接在obj里查找即可
    if (1 <= intervalNum && intervalNum <= 8) {
        const intervalObj = intervalMeta.where("num", intervalNum).where("type", intervalType).first()
        if (intervalObj) {
            const readyReturn = {
                ...intervalObj,
                direction: direction, isError: false, errorInfo: "No error.",
                intervalNumOctaveRounds: 1, numWithinOctave: intervalObj.num
            }
            if (intervalNum === 8) {
                return {
                    ...readyReturn, intervalNumOctaveRounds: 2
                }
            }
            return readyReturn
        }
        return {
            isError: true,
            errorInfo: "No fit interval. For example NO such things like maj5(only p5)."
        }
    }

    const [octave, numWithinOctave] = getIntervalRounds(intervalNum)
    const intervalObj = intervalMeta.where("num", numWithinOctave).where("type", intervalType).first()
    if (intervalObj) {
        return {
            ...intervalObj, direction: direction,
            semitoneGap: intervalObj.semitoneGap + octave * 12,
            num: intervalObj.num + octave * 7, numWithinOctave: numWithinOctave,
            intervalNumOctaveRounds: octave + 1,
            isError: false, errorInfo: "No error."
        }
    }
    return {
        isError: true,
        errorInfo: "Huge interval num with wrong type."
    }
}


const getIntervalByComparingNotes = (keynote1: InstanceType<typeof KeyNote>,
                                     keynote2: InstanceType<typeof KeyNote>): intervalObjType => {
    // 处理平行
    if (keynote1.midiValue === keynote2.midiValue) {
        if (keynote1.noteObj.index === keynote2.noteObj.index) {
            return {
                ...getInterval("p", 1, "upward"),
                direction: "parallel"
            }
        }
        const indexGap = Math.abs(keynote1.noteObj.index - keynote2.noteObj.index)
        const intervalObj = intervalMeta.where("indexGap", indexGap).where("semitoneGap", 0).first()
        if (intervalObj) {
            return {
                ...intervalObj,
                isError: false,
                errorInfo: "No error.",
                direction: "parallel"
            }
        }
        return {
            isError: true,
            errorInfo: "Parallel but complex interval.",
            direction: "parallel"
        }
    }
    const direction = keynote2.midiValue > keynote1.midiValue ? "upward" : "downward"
    const [lowKeynote, highKeynote] = keynote2.midiValue > keynote1.midiValue ? [keynote1, keynote2] : [keynote2, keynote1]
    const originIndexGap = (highKeynote.octave - lowKeynote.octave) * 7 +
        highKeynote.noteObj.index  - lowKeynote.noteObj.index
    console.log(originIndexGap)
    if (originIndexGap <= 0) {
        return {
            isError: true,
            errorInfo: "Unexpected: interval gap is zero or negative."
        }
    }
    // 如果index差小于等于7，即一个八度内，就直接查找
    if (originIndexGap < 7) {
        console.log( highKeynote.midiValue - lowKeynote.midiValue,originIndexGap)
        const firstSearch = intervalMeta.where("indexGap", originIndexGap).where("semitoneGap",
            highKeynote.midiValue - lowKeynote.midiValue).first()
        if (firstSearch) {
            return getInterval(<"p" | "maj" | "min" | "aug" | "dim" | "aug+" | "dim-">firstSearch.type,
                firstSearch.num, <"upward" | "downward">direction)
        }
        return {
            isError: true,
            errorInfo: "Complex interval is found."
        }
    }
    // 否则就要开始八度的循环
    const [indexOctaveRounds, indexWithinOctave] = getIntervalRounds(originIndexGap)
    const [__temp__, semitoneWithinOctave] = getSemitoneOctaveRounds(highKeynote.midiValue - lowKeynote.midiValue)
    console.log(indexWithinOctave, semitoneWithinOctave)
    const secondSearch = intervalMeta.where("indexGap", indexWithinOctave).where(
        "semitoneGap", semitoneWithinOctave).first()
    console.log(secondSearch)
    if (secondSearch) {
        return {
            ...getInterval(<"p" | "maj" | "min" | "aug" | "dim" | "aug+" | "dim-">secondSearch.type,
                secondSearch.indexGap + 1 + indexOctaveRounds * 7, direction)
        }
    }
    return {
        direction,
        isError: true,
        errorInfo: "Complex interval type."
    }
}
export default {
    getInterval, getIntervalByComparingNotes
}