import {useEffect, useState} from "react";
import JZZ from "./jzz.ts";

const useMIDIReady = () => {
	const [isMIDIReady, setIsMIDIReady] = useState(false)
	useEffect(() => {
		JZZ().or(() => {
			setIsMIDIReady(false)
		}).openMidiOut().or(() => {
			setIsMIDIReady(false)
		}).and(() => setIsMIDIReady(true))

	}, [])
	return isMIDIReady
}

export default useMIDIReady