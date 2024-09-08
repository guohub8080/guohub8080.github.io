// noinspection ES6PreferShortImport,TypeScriptCheckImport
// noinspection ES6UnusedImports

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {JZZ} from "jzz"
import {SMF} from "jzz-midi-smf"
import {GM} from "jzz-midi-gm"
import {Tiny} from 'jzz-synth-tiny';

SMF(JZZ)
GM(JZZ)
Tiny(JZZ)

const logger = JZZ.Widget({
	_receive: (msg) => {
		console.log(msg.toString());
		logger._emit(msg)
	}
});

JZZ.addMidiOut('ConsoleLogger', logger);

JZZ.synth.Tiny.register("tinySynth");

export const guoPot = JZZ.Widget({
	_receive: (msg) => {
		// console.log(msg.toString());
		// guoPot._emit(msg)
		console.log("nihao")
		// msg._emit(msg)
	}
})
JZZ.addMidiIn("Web", guoPot)
JZZ.addMidiOut("Web", guoPot)
// now it can be used as a port:
// var port = JZZ().openMidiOut('Console Logger');
// ...

// if required, substitute the native MIDIAccess
// to make virtual ports visible to the Web MIDI API code:
// navigator.requestMIDIAccess = JZZ.requestMIDIAccess;
export default JZZ