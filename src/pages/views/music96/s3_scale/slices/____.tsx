// noinspection ES6PreferShortImport

import H1 from "@comps/common/docs/H1.tsx";
import t from "@pages/i18n/t.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {Midi} from '@tonejs/midi'
import {Button} from "antd";
import useMIDIPorts from "@utils/useMIDI/useMIDIPorts.ts";
import useMIDIReady from "@utils/useMIDI/useMIDIReady.ts";
import {useState} from "react";
import useMIDIEvents from "@utils/useMIDI/useMIDIEvents.ts";
import useLatestMIDIEvents from "@utils/useMIDI/useLatestMIDIEvents.ts";
import {Scale} from "@/music96/scale/cls/ScaleClass.ts";
import {Note} from "@/music96/note";

const ScaleModeView = () => {
	const [s, setS] = useState(0)
	// create a new midi file
	const midi = new Midi()
// add a track
	const track = midi.addTrack()
	track.addNote({
		midi: 60,
		time: 0,
		duration: 0.2
	}).addNote({
		name: 'C5',
		time: 0.3,
		duration: 1
	}).addNote({
		name: 'F5',
		time: 0.7,
		duration: 2
	}).addNote({
		name: 'G5',
		time: 1.5,
		duration: 2
	}).addNote({
		name: 'E4',
		time: 2,
		duration: 2
	}).addNote({
		name: 'C4',
		time: 2,
		duration: 2
	}).addCC({
		number: 64,
		value: 127,
		time: 2
	})
	track.instrument.number = s
	const midiport = useMIDIPorts()
	const ismidiready = useMIDIReady()

	// const [isPlaying,
	// 	setIsPlaying,
	// 	player] = useMIDIFile("Web", midi.toArray())

	// console.log(piano)
	const [events] = useMIDIEvents(0)
	const singleEvent = useLatestMIDIEvents()
	const a = new Scale(new Note("C", 0), "MAJ")
	console.log(a.getScaleDegreeChord7(7))
	console.log(a.getNoteByIntervalNum(8, true))
	return (<>
		outputs:{midiport.outputs.map(x => <span key={x.id}>{x.name}，</span>)}
		<br/>
		inputs:{midiport.inputs.map(x => <span key={x.id}>{x.name}，</span>)}
		<div>{ismidiready.toString()}</div>
		{/*<Button onClick={() => player.play()}>按下</Button>*/}
		{/*<InputNumber value={s} onChange={(x) => setS(x)}></InputNumber>*/}
		{/*<Button onClick={() => player.stop()}>按下</Button>*/}
		{/*播放：{isPlaying.toString()}*/}
		{/*<div>钢琴好了吗？{isLoaded.toString()}</div>*/}
		<div>
			现在乐器序号是{s}
			<Button onClick={() => setS(s + 1)}>序号+1</Button>
		</div>
		<Button onClick={() => console.log(events)}>按下</Button>
		<div>单一
			{singleEvent.note},{singleEvent.velocity},{singleEvent.time},{singleEvent.name},{singleEvent.isNoteOn ? "开启" : ""},{singleEvent.isNoteOff ? "关闭" : ""}</div>
		{/*{events.map((x, y) => <div key={y}>{x.name},{x.note},{x.isNoteOn.toString()},{x.time}</div>)}*/}
		<H1>{t({cn: "和弦模块", en: "Chord module"})}</H1>
		<H2>{t({cn: "Chord类", en: "Chord Class"})}</H2>
	</>)
}

export default ScaleModeView