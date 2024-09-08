import getNote from "./getNote"
import noteMeta from "./noteMeta";
import {
    getIndexOrIntervalOctaveRounds as getIndexOctaveRounds,
    getSemitoneOctaveRounds
} from "../common/index"
import {intervalObjType} from "../interval/getInterval";
import {Simulate} from "react-dom/test-utils";
import compositionStart = Simulate.compositionStart;

const getKeynoteByStepAlter = (step: string = "C",
                               alter: number = 0,
                               octave: number = 4) => {
    const noteObj = getNote.getNoteByStepAlter(step, alter)
    if (noteObj) {
        return new KeyNote(noteObj, octave)
    }
    return void 0
}

/**
 * 通过数字index来得到一个note对象，1对应C，2对应D，以此类推，7对应B。
 */
const getKeyNoteByIndexAlter = (index: number = 1,
                                alter: number = 0,
                                octave: number = 4) => {
    const noteObj = getNote.getNoteByIndexAlter(index, alter)
    if (noteObj) {
        return new KeyNote(noteObj, octave)
    }
    return void 0
}

/**
 * 随机地得到一个白键
 */
const getRandomWhiteKeyNote = (octave = 4) => {
    return new KeyNote(getNote.getRandomWhiteNote(), octave)
}

/**
 * 随机地得到一个黑键，注意，该黑键必须是alter的绝对值小于等于1
 */
const getRandomBlackKeyNote = (octave = 4) => {
    return new KeyNote(getNote.getRandomBlackNote(), octave)
}

/**
 * 随机地得到一个键，无论是黑键还是白键
 */
const getRandomKeyNote = (octave = 4) => {
    return new KeyNote(getNote.getRandomNote(), octave)
}

export class KeyNote {
    public noteObj: {
        uid: number;
        isNormal: boolean;
        artName: string;
        isBlack: boolean;
        index: number;
        step: string;
        fifthValue: number;
        semitone: number;
        mathName: string;
        locId: number;
        alter: number
    };

    public readonly octave: number;

    constructor(noteObj, octave) {
        this.noteObj = noteObj
        this.octave = octave
    }

    public get midiValue() {
        return this.octave * 12 + this.noteObj.semitone
    }

    getNoteByInterval(intervalObj: intervalObjType) {
        if (intervalObj.isError) {
            return {
                isError: true,
                errorInfo: "Given interval is invalid."
            }
        }
        let octaveGap: number
        let newIndex: number
        if (intervalObj.direction === "upward") {
            [octaveGap, newIndex] = getIndexOctaveRounds(this.noteObj.index + intervalObj.num - 1)
        } else if (intervalObj.direction === "downward") {
            [octaveGap, newIndex] = getIndexOctaveRounds(this.noteObj.index - intervalObj.num + 1)
        } else {
            return {
                isError: true,
                errorInfo: "Interval direction is invalid."
            }
        }
        const tempTargetKeynote = getKeyNoteByIndexAlter(newIndex, 0, this.octave + octaveGap)
        let semitoneGap: number
        if (intervalObj.direction === "upward") {
            semitoneGap = intervalObj.semitoneGap - (tempTargetKeynote.midiValue - this.midiValue)
        } else {
            semitoneGap =  (this.midiValue - tempTargetKeynote.midiValue) - intervalObj.semitoneGap
        }
        // console.log("半音差是", semitoneGap)
        if (semitoneGap === 0) {
            return {
                isError: false,
                errorInfo: "No error.",
                keynote: tempTargetKeynote
            }
        }
        if (Math.abs(semitoneGap) > 2) {
            return {
                isError: true,
                errorInfo: "Complex interval meets.",
            }
        }
        return {
            isError: false,
            errorInfo: "No error.",
            keynote: getKeyNoteByIndexAlter(newIndex, semitoneGap, this.octave + octaveGap)
        }
    }


    private get simpleDescription() {
        return `${this.noteObj.artName}_${this.octave}`
    }
}

export default {
    getKeynoteByStepAlter, getKeyNoteByIndexAlter, getRandomWhiteKeyNote, getRandomBlackKeyNote,
    getRandomKeyNote,KeyNote
}