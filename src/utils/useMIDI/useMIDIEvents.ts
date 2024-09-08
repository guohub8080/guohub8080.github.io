// noinspection ES6PreferShortImport

import {useList} from "react-use";
import {useEffect} from "react";
import JZZ from "./jzz.ts"
import {isUndefined} from "lodash";
import dayjs from "dayjs";
import useMIDIPorts from "@utils/useMIDI/useMIDIPorts.ts";

const useMIDIEvents = (maxArrayLength: number = 20) => {
	const [eventList, eventActions] = useList([])
	const {inputs, outputs, info} = useMIDIPorts()
	useEffect(() => {
		inputs.map((inputObj, index) => {
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
				eventActions.push(readyPushObj)
			})
		})
	}, [inputs, outputs]);
	useEffect(() => {
		if (maxArrayLength === 0) return
		if (maxArrayLength > 0 && eventList.length > maxArrayLength) {
			eventActions.removeAt(0)
		}
	}, [eventList.length, maxArrayLength])
	return [eventList]
}

export default useMIDIEvents