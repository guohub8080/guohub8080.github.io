// noinspection ES6PreferShortImport

import {t_alterValue, t_noteStep} from "../../note/static/types.ts";
import {ScoreError} from "@/music96/common/processError/errorTypes.ts";
import {isArray, isString, isUndefined, keys} from "lodash";
import {XMLBuilder} from "fast-xml-parser";
import noteScoreTypeValues from "../static/noteScoreTypeValues.ts";

type t_tieType = "start" | "stop"

export class ScoreNote {
  public noteType: "note" | "rest" | "percussion";
  public duration: number;
  public lyrics: string | string[] | void;
  public step: t_noteStep;
  public alter: t_alterValue;
  public octave: number;
  public isDot: boolean;
  public notationType: string;
  public triplet: { isTriplet: boolean; tripletNotation: "start" | "stop"; isBracket: boolean };
  public beam: { beamNum: number; beamType: "begin" | "continue" | "end"; isBeamLinked: boolean };
  public tie: { isTied: boolean; tieType: t_tieType | t_tieType[] };
  public chord: { isChord: boolean };

  constructor(duration: number, noteType: "note" | "rest" | "percussion", notationType: string) {
    this.noteType = noteType
    this.notationType = notationType
    this.duration = duration
    this.lyrics = void 0
    this.step = void 0
    this.alter = void 0
    this.octave = void 0
    this.isDot = false
    this.triplet = {
      isTriplet: false,
      tripletNotation: void 0,
      isBracket: false
    }

    let beamNum = 0
    if (this.notationType === noteScoreTypeValues.eighth) beamNum = 1
    else if (this.notationType === noteScoreTypeValues["16th"]) beamNum = 2
    this.beam = {
      beamNum: beamNum,
      beamType: void 0,
      isBeamLinked: false
    }

    this.tie = {
      isTied: false,
      tieType: void 0
    }

    this.chord = {
      isChord: false
    }
  }

  public get noteTypeObj() {
    switch (this.noteType) {
      case "note":
        return {"pitch": {"step": this.step, "alter": this.alter, "octave": this.octave}}
      case "rest":
        return {"rest": ""}
      case "percussion":
        return {}
      default:
        throw new ScoreError("Unknown error.")
    }
  }

  public get lyricsObj() {
    const lyrics = {lyric: void 0}
    if (isUndefined(this.lyrics)) return lyrics
    if (isString(this.lyrics)) {
      lyrics["lyric"] = {
        "@_number": 1,
        "syllabic": "single",
        "text": this.lyrics,
      }
      return lyrics
    } else if (isArray(this.lyrics)) {
      lyrics["lyric"] = this.lyrics.map((x, y) => {
        return {
          "@_number": y + 1,
          "syllabic": "single",
          "text": x,
        }
      })
      return lyrics
    }
  }

  public get tieObj() {
    if (!this.tie.isTied) return {"tie": void 0}
    if (isString(this.tie.tieType)) return {"tie": {"@_type": this.tie.tieType, "#text": ""}}
    if (isArray(this.tie.tieType)) return {
      "tie": this.tie.tieType.map(x => {
        return {
          "@_type": x, "#text": ""
        }
      })
    }
  }

  public get notationsObj() {
    let notations = {"notations": {}}
    if (this.triplet.isTriplet) {
      notations["notations"]["tuplet"] = {
        "@_bracket": this.triplet.isBracket ? "yes" : "no",
        "@_type": this.triplet.tripletNotation
      }
    }
    if (this.tie.isTied) {
      if (isString(this.tie.tieType)) {
        notations["notations"]["tied"] = {
          "@_type": this.tie.tieType,
          "#text": ""
        }
      } else if (isArray(this.tie.tieType)) {
        notations["notations"]["tied"] = this.tie.tieType.map(x => {
          return {"@_type": x, "#text": ""}
        })
      }
    }
    if (keys(notations["notations"]).length === 0) notations = {"notations": void 0}
    return notations
  }

  public get buildObj() {
    return {
      "note": {
        "chord": this.chord.isChord ? "" : void 0,
        ...this.noteTypeObj,
        "type": this.notationType,
        "dot": this.isDot ? {
          "#text": this.isDot
        } : void 0,
        "duration": this.duration,
        "voice": 1,
        ...this.tieObj,
        "time-modification": this.triplet.isTriplet ? {
          "actual-notes": 3,
          "normal-notes": 2,
        } : void 0,
        ...this.lyricsObj,
        ...this.notationsObj,
      }
    }
  }

  public get xml() {
    const builder = new XMLBuilder({
      ignoreAttributes: false, processEntities: false, suppressEmptyNode: true
    })
    return builder.build(this.buildObj)
  }
}