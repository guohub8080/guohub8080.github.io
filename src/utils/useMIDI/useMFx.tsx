// @ts-ignore
import {SMF} from "jzz-midi-smf"
import {useEffect, useState} from "react";
// @ts-ignore
import {JZZ} from "jzz"
// import jzz from "jzz"
import {Midi} from '@tonejs/midi'
import {Button} from "antd";
// @ts-ignore
import {Tiny} from 'jzz-synth-tiny';
import useMIDIPorts from "@utils/useMIDI/useMIDIPorts.ts";
import {Instrument} from "@tonejs/midi/dist/Instrument";
// @ts-ignore
import { GM } from 'jzz-midi-gm';
SMF(JZZ)
Tiny(JZZ)
GM(JZZ);


const hhhhhh = JZZ.synth.Tiny.register("hhhhhhhh");

// synth.register("synthGuo")
const useMF = () => {
  const [i, setI] = useState(0)
  const midiports = useMIDIPorts()
  // create a new midi file
  var midi = new Midi()
// add a track
  const track = midi.addTrack()
  track.addNote({midi: 60, time: 0, duration: 2}).addNote({name: 'C6', time: 0.5, duration: 3}).addNote({
    name: 'F5',
    time: 1,
    duration: 3
  }).addNote({midi: 72, time: 2, duration: 3})
  track.channel = 0
  // track.instrument.number = i
  track.instrument.name="Hi Bongo"
  const ply = JZZ.MIDI.SMF(midi.toArray()).player()


  const a = () => {
    const opt = JZZ().and().openMidiOut("loopMIDI Port")
    console.log("开始了")
    ply.connect(opt)
    ply.play()
  }
  const b = () => {
    console.log("停止了")
    ply.stop()
  }
  const [state, setState] = useState(0);
  return <div>
    <Button onClick={() => setI(() => i + 1)}>+1</Button>
    <Button onClick={() => setI(() => i - 1)}>-1</Button>
    <span>现在是{i}</span>
    <Button onClick={a}>启动</Button>
    <Button onClick={b}>暂停</Button>
  </div>
}

export default useMF