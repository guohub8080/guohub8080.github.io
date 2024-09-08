// noinspection ES6PreferShortImport

import {Note} from "../../note/cls/NoteClass";
import {t_scaleIntervalPanel, t_scaleMode} from "../static/types";
import cls_initScale from "./classFn/cls_initScale";
import {t_intervalList} from "../../interval/static/types";
import cls_getScaleDegree from "./classFn/cls_getScaleDegree";
import cls_getReplacedNotes from "./classFn/cls_getReplacedNotes.ts";
import cls_getNotesPanel from "./classFn/cls_getNotesPanel.ts";
import cls_getNoteByIntervalNum from "@/music96/scale/cls/classFn/cls_getNoteByIntervalNum.ts";

export class Scale {
	public modeDescription: string
	public rootNote: InstanceType<typeof Note>
	#initInfo: {
		rootNote: InstanceType<typeof Note>
		intervalPanel: t_scaleIntervalPanel
		intervalList: t_intervalList[]
		notesList: InstanceType<typeof Note>[]
		alterTimes: number
		modeName: string
		modeUid: string
	};

	constructor(rootNote: InstanceType<typeof Note>, scaleMode: t_scaleMode) {
		const scaleInitInfo = cls_initScale(rootNote, scaleMode)
		this.#initInfo = {
			rootNote: rootNote,
			intervalPanel: scaleInitInfo.intervalPanel,
			intervalList: scaleInitInfo.intervalList,
			notesList: scaleInitInfo.notesList,
			alterTimes: scaleInitInfo.alterTimes,
			modeName: scaleInitInfo.modeName,
			modeUid: scaleInitInfo.modeUid
		}
		this.rootNote = this.#initInfo.alterTimes === this.#initInfo.notesList.length ? rootNote.getSamePitchNotes(false, 1)[0] : rootNote
		this.modeDescription = scaleInitInfo.description
	}

	public get modeName() {
		return this.#initInfo.modeName
	}

	get #intervalPanel() {
		return this.#initInfo.intervalPanel
	}

	public get originRootNote() {
		return this.#initInfo.rootNote
	}

	public get intervalList() {
		return this.#initInfo.intervalList
	}

	public get notesList() {
		if (!this.isTonicNoteReplaced) return this.#initInfo.notesList
		return cls_getReplacedNotes(this.rootNote, this.#initInfo.intervalList)
	}

	get #notesPanel() {
		return cls_getNotesPanel(this.rootNote, this.#initInfo.intervalList)
	}

	public getNoteByIntervalNum(num: number, isWithinOctave = false): InstanceType<typeof Note> {
		return cls_getNoteByIntervalNum(this.notesList, num, isWithinOctave)
	}

	public get isTonicNoteReplaced() {
		return this.rootNote.mathName !== this.#initInfo.rootNote.mathName;
	}

	public get simpleDescription() {
		return this.notesList.map(x => x.artName + x.octave).join(",")
	}

	getScaleDegreeChord3(scaleDegree = 1) {
		return cls_getScaleDegree(scaleDegree, 3, this.notesList)
	}

	getScaleDegreeChord7(scaleDegree = 1) {
		return cls_getScaleDegree(scaleDegree, 7, this.notesList)
	}


}