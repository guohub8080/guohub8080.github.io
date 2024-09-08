// noinspection ES6PreferShortImport

import {useEffect, useState} from "react";
import JZZ from "./jzz.ts"
import {isUndefined} from "lodash";
import dayjs from "dayjs";
import useMIDIPorts from "@utils/useMIDI/useMIDIPorts.ts";

const useMIDIEvents = (portName?: string) => {
	const [event, setEvent] = useState({
		name: "",
		note: 0,
		isNoteOn: false,
		isNoteOff: false,
		velocity: 0,
		time: dayjs().format("HH:mm:ssSSS")
	})
	const {inputs, outputs, info} = useMIDIPorts()
	useEffect(() => {
		inputs.map((inputObj, index) => {
			if (portName && inputObj.name !== portName) return
			JZZ().openMidiIn(index).connect((msg) => {
				const handle = JZZ.MIDI(msg)
				if (isUndefined(handle.getChannel())) return
				if (isUndefined(handle.getNote())) return
				const readyPushObj = {
					name: inputObj.name,
					note: handle.getNote(),
					isNoteOn: handle.isNoteOn(),
					isNoteOff: handle.isNoteOff(),
					velocity: handle.getVelocity(),
					time: dayjs().format("HH:mm:ssSSS")
				}
				setEvent(readyPushObj)
			})
		})
	}, [inputs, outputs, portName]);

	return event
}

export default useMIDIEvents