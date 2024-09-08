import {getBlackRandomNote} from "./methods/utGetNote.ts"
import {getWhiteRandomNote} from "./methods/utGetNote.ts"
import {getNormalRandomNote} from "./methods/utGetNote.ts"
import {getCasualRandomNote} from "./methods/utGetNote.ts"

export {Note} from "./cls/NoteClass.ts"
export {getBlackRandomNote, getNormalRandomNote, getCasualRandomNote, getWhiteRandomNote} from "./methods/utGetNote.ts"
export {getStepByStepMove, getStepGapByStepAlter, getStepIndexByMove} from "./methods/utStep.ts"
export default {
	getBlackRandomNote,
	getWhiteRandomNote,
	getNormalRandomNote,
	getCasualRandomNote
}