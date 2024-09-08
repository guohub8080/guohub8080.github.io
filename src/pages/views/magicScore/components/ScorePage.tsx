import {useEffect, useRef} from "react";
import {OpenSheetMusicDisplay} from "opensheetmusicdisplay";
import cssPresets from "@assets/styles/cssPresets.ts";
import shadowPresets from "@assets/styles/shadowPresets.ts";
import genHead from "@/music96/score/methods/xml/genHead.ts";
import {Midi} from "@tonejs/midi";

const ScorePage = () => {
	console.log(genHead())
	const ref = useRef(null)

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
	track.instrument.number = 1
	const a = ``
	useEffect(() => {
		if (ref) {
			const osmd = new OpenSheetMusicDisplay(ref.current, {
				autoResize: true, // just an example for an option, no option is necessary.
				backend: "svg",
				drawTitle:false,
				drawComposer:false,
				drawSubtitle:false
				// put further options here
			})
			osmd.load(a).then(() => {
				osmd.render()
			})
		}
	}, [ref])
	return <div>
		<div ref={ref} style={{background:"white",boxShadow:shadowPresets.xl,borderRadius:8,width:800,margin:"0 auto"}}></div>
	</div>

}

export default ScorePage