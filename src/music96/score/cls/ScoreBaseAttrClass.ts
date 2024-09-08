// noinspection ES6PreferShortImport

import {XMLBuilder} from "fast-xml-parser";
import guoDT from "../../common/utils/guoDT.ts";
import byDefault from "../../common/utils/byDefault.ts";
import {ScoreError} from "../../common/processError/errorTypes.ts";


export class ScoreBaseAttr {
  public mode: "major" | "minor";
  public bpm: number;
  public beats: number;
  public beatType: number
  public clef: "treble" | "g" | "G" | "bass" | "F" | "f" | "middle" | "alto" | "m" | "M" | "percussion" | "P" | "p"
  public fifth: number;
  public show: { bpm: boolean, beat: boolean, clef: boolean, fifth: boolean, divisions: boolean };
  public divisions: number;

  constructor() {
    this.bpm = void 0
    this.beats = void 0
    this.beatType = void 0
    this.mode = "major"
    this.clef = "treble"
    this.fifth = 0
    this.divisions = 0
    this.show = {bpm: false, beat: false, clef: false, fifth: false, divisions: true}
  }

  public get buildObj() {
    return {
      "attributes": {
        "divisions": this.show.divisions ? this.divisions : void 0,
        "key": {
          "fifths": this.show.fifth ? byDefault(this.fifth, 0) : void 0,
          "mode": byDefault(this.mode, "major")
        },
        "time": this.show.beat ? {
          "beats": byDefault(this.beats, 4),
          "beatType": byDefault(this.beatType, 4)
        } : void 0,
        "clef": this.show.clef ? this.clefObj : void 0
      },
      "direction": this.show.bpm ? {
        "@_placement": "above",
        "direction-type": {
          "metronome": {
            "@_parentheses": "no",
            "beat-unit": "quarter",
            "per-minute": byDefault(this.bpm, 100)
          }
        },
        "sound": {
          "@_tempo": byDefault(this.bpm, 100),
          "#text": ""
        }
      } : void 0
    }
  }

  public get clefObj() {
    const clef = byDefault(this.clef, "treble")
    const resultObj = {"sign": "", "line": 0}
    if (["treble", "g", "G"].includes(clef)) {
      resultObj.sign = "G"
      resultObj.line = 2
    } else if (["bass", "F", "f"].includes(clef)) {
      resultObj.sign = "F"
      resultObj.line = 4
    } else if (["middle", "alto", "m", "M"].includes(clef)) {
      resultObj.sign = "C"
      resultObj.line = 3
    } else if (["percussion", "P", "p"].includes(clef)) {
      resultObj.sign = "percussion"
      resultObj.line = 2
    } else throw new ScoreError("unknown clef")
    return resultObj
  }

  public get xml() {
    const builder = new XMLBuilder({
      ignoreAttributes: false, suppressEmptyNode: true
    })
    return builder.build(this.buildObj)
  }
}