// noinspection ES6PreferShortImport

import JZZ from "./jzz.ts";
import {useEffect, useState} from "react";

const useMIDIFile = (midiOutPortName: string, midiArray: ArrayBuffer) => {
	const smf = JZZ.MIDI.SMF(midiArray)
	const player = smf.player()
	const [isPlaying, setIsPlaying] = useState(false)
	player.onEnd = () => setIsPlaying(false)


	// player._receive = (x) => {
	// 	const i = JZZ.MIDI(x)
	// 	// console.log(i.getNote())
	// 	const note = i.getNote()
	// 	console.log(note)
	// 	if (isLoaded && isPlaying) {
	// 		piano.start(note)
	// 	}
	// 	// if (isPlaying) player?._emit(x)
	// }
	useEffect(() => {
		JZZ().and(() => {
			const opt = JZZ().openMidiOut(midiOutPortName)
			player.connect(opt)
		})
	}, [midiOutPortName, player])

	return [isPlaying, setIsPlaying, player]
}

export default useMIDIFile