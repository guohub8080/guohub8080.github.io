// noinspection ES6PreferShortImport

import byDefault from "../../common/utils/byDefault.ts";
import sounds_musicXML from "..//static/sounds_musicXML.ts";
import {XMLBuilder} from "fast-xml-parser";

export class ScoreOneInstrument {
  public partID: string
  public partName: string
  public partAbbr: string
  public midiChannel: number
  public midiProgram: number
  public midiPort: number
  public instrumentId: number | string
  public instrumentName: string
  public instrumentSound: string

  constructor(partID: string, partName: string, partAbbr?: string) {
    this.partID = partID
    this.partName = partName
    this.partAbbr = byDefault(partAbbr, partName)
    this.midiChannel = 1
    this.midiProgram = 1
    this.midiPort = 1
    this.instrumentSound = sounds_musicXML["keyboard.piano"]
    this.instrumentName = "piano"
    this.instrumentId = "I1"
  }


  public get bulildObj() {
    return {
      "score-part":
        {
          "@_id": this.partID,
          "part-name": this.partName,
          "part-abbreviation": byDefault(this.partAbbr, this.partName),
          "score-instrument": {
            "@_id": `${this.partID}-${byDefault(this.instrumentId, "I1")}`,
            "instrument-name": byDefault(this.instrumentName, "piano"),
            "instrument-sound": byDefault(this.instrumentSound, sounds_musicXML["keyboard.piano"]),
          },
          "midi-device": {
            "@_id": `${this.partID}-${byDefault(this.instrumentId, "I1")}`,
            "@_port": byDefault(this.midiPort, 1)
          },
          "midi-instrument": {
            "@_id": `${this.partID}-${byDefault(this.instrumentId, "I1")}`,
            "midi-channel": byDefault(this.midiChannel, 1),
            "midi-program": byDefault(this.midiProgram, 1),
          }
        }
    }
  }

  public get xml() {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
    })
    return builder.build(this.bulildObj)
  }
}