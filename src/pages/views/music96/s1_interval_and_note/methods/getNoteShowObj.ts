// noinspection ES6PreferShortImport

import {Note} from "@/music96/note";

const getNoteShowObj = (note: InstanceType<typeof Note>) => {
	return {...note, pitchValue: note.pitchValue, simpleDescription: note.simpleDescription}
}

export default getNoteShowObj