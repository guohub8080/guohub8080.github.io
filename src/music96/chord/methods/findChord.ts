// noinspection ES6PreferShortImport

import {Note} from "../../note/cls/NoteClass.ts";
import collect from "collect.js";
import findChordMeta from "../../chord/static/findChordMeta.ts";
import {isEqual} from "lodash";
import {Chord} from "../../chord/cls/ChordClass.ts";
import {ChordError} from "../../common/processError/errorTypes.ts";

const findChord = (notesList: InstanceType<typeof Note>[], findPolicy: "all" | "random" | "first" | "lowest" | "byNote",
                   byNote?: InstanceType<typeof Note>): [] | InstanceType<typeof Chord>[] => {
	const locationList = collect(notesList.map(x => x.locationId)).sort().all()
	if (!["all", "random", "first", "lowest", "byNote"].includes(findPolicy)) throw new ChordError("Please check the find policy.")
	const findChords = collect(findChordMeta).filter(value => {
		/**
		 * eslint-disable-next-line @typescript-eslint/ban-ts-comment
		 * @ts-expect-error
		 */
		if (value?.nLs.length !== locationList.length) return false
		/**
		 * eslint-disable-next-line @typescript-eslint/ban-ts-comment
		 * @ts-expect-error
		 */
		if (findPolicy === "lowest") {
			const lowestNote = collect(notesList).sortByDesc(x => x.pitchValue).first()
			if (value.nRL !== lowestNote.locationId) return false
		} else if (findPolicy === "byNote") {
			if (value.nRL !== byNote.locationId) return false
		}
		return isEqual(value?.nLs, locationList)
	}).all()
	if (!findChords) return []
	const findResults = findChords.map(x => {
		/**
		 * eslint-disable-next-line @typescript-eslint/ban-ts-comment
		 * @ts-expect-error
		 */
		const rootNote = collect(notesList).filter(i => i.locationId === x?.nRL).filter(Boolean).first()
		/**
		 * eslint-disable-next-line @typescript-eslint/ban-ts-comment
		 * @ts-expect-error
		 */
		return new Chord(rootNote, x?.term)
	})
	// if length is 1, no necessary to calculate later.
	if (findResults.length === 1) return findResults
	// then depends on policy  to return
	switch (findPolicy) {
		case "all":
			return findResults
		case "random":
			return [].concat(collect(findResults).random())
		case "first":
			return [findResults[0]]
		case "lowest":
			if (findResults.length === 1) return findResults
			throw new ChordError("Lowest note has multiple chord.")
		case "byNote":
			if (findResults.length === 1) return findResults
			throw new ChordError("Lowest note has multiple chord.")
		default:
			throw new ChordError("Unknown chord bug error.")
	}
}
export default findChord