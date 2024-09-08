// noinspection ES6PreferShortImport
import {Note} from "../cls/NoteClass.ts";
import noteMeta from "../static/noteMeta.ts";
import {t_alterValue, t_noteStep} from "../static/types.ts";
import {isArray, isNumber} from "lodash";
import collect from "collect.js";

const dealOctave = (octave: number | number[] = 4): number => {
	if (isNumber(octave)) return octave as number
	if (isArray(octave)) {
		const a = collect(octave).random()
		if (isNumber(a)) return a
		throw new Error("Octave inputs must be number type!")
	}
}
export const getCasualRandomNote = (octave: number | number[] = 4) => {
	const noteObj = noteMeta.random()
	return new Note(noteObj.step as t_noteStep, noteObj.alter as t_alterValue, dealOctave(octave))
}

export const getWhiteRandomNote = (octave: number | number[] = 4, isNormal = true) => {
	if (isNormal) {
		const noteObj = noteMeta.where("uid", "<=", 7).random()
		return new Note(noteObj.step as t_noteStep, noteObj.alter as t_alterValue, dealOctave(octave))
	}
	const noteObj = noteMeta.where("isBlack", false).random()
	return new Note(noteObj.step as t_noteStep, noteObj.alter as t_alterValue, dealOctave(octave))
}

export const getBlackRandomNote = (octave: number | number[] = 4, isNormal = true) => {
	if (isNormal) {
		const noteObj = noteMeta.where("isBlack", true).where("isNormal", true).random()
		return new Note(noteObj.step as t_noteStep, noteObj.alter as t_alterValue, dealOctave(octave))
	}
	const noteObj = noteMeta.where("isBlack", true).random()
	return new Note(noteObj.step as t_noteStep, noteObj.alter as t_alterValue, dealOctave(octave))
}

export const getNormalRandomNote = (octave: number | number[] = 4) => {
	const noteObj = noteMeta.where("isNormal", true).random()
	return new Note(noteObj.step as t_noteStep, noteObj.alter as t_alterValue, dealOctave(octave))
}



