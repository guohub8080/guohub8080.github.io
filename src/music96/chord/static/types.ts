// noinspection ES6PreferShortImport

import {t_intervalType} from "../../interval/static/types.ts";
import {Note} from "../../note/cls/NoteClass.ts";

export type t_chordType = "maj3" | "maj3b5" | "min3" | "dim3" | "maj6" | "maj69" | "min6" | "min69" | "aug3"
  | "sus2" | "sus4" | "maj7" | "maj7sus4" | "maj7b5" | "maj7#11" | "maj7#5sus4" | "maj7#5" | "dom7"
  | "dom7#5" | "dom7b5" | "dom7#5sus4" | "dom7#5b9#11" | "dom7b9#11" | "dom7#9" | "dom7b9" | "dom7b9sus4"
  | "dom7#11" | "dom7sus4" | "dom7b13" | "alt7" | "min7" | "halfDim7" | "mM7" | "mM7b6" | "dim7"
  | "dom9" | "dom9b13" | "maj9" | "maj9sus4" | "maj9#11" | "min9" | "mM9" | "dom11" | "dom11b9"
  | "maj11" | "min11" | "dom13" | "dom13#9" | "maj13" | "min13"


export type t_transformString = "2" | "#2" | "b2" | "3" | "#3" | "b3" | "4" | "#4" | "b4" | "5" | "#5"
  | "b5" | "6" | "#6" | "b6" | "7" | "#7" | "b7" | "9" | "#9" | "b9" | "11" | "#11" | "b11" | "13" | "#13" | "b13"

export type t_transformPanel = {
  2: t_intervalType | "omit" | void
  3: t_intervalType | "omit" | void
  4: t_intervalType | "omit" | void
  5: t_intervalType | "omit" | void
  6: t_intervalType | "omit" | void
  7: t_intervalType | "omit" | void
  9: t_intervalType | "omit" | void
  11: t_intervalType | "omit" | void
  13: t_intervalType | "omit" | void
}

export type t_intervalPanel = {
  2: t_intervalType | void
  3: t_intervalType | void
  4: t_intervalType | void
  5: t_intervalType | void
  6: t_intervalType | void
  7: t_intervalType | void
  9: t_intervalType | void
  11: t_intervalType | void
  13: t_intervalType | void
}

export type t_chordNotesPanel = {
  1: InstanceType<typeof Note>
  2: InstanceType<typeof Note> | void
  3: InstanceType<typeof Note> | void
  4: InstanceType<typeof Note> | void
  5: InstanceType<typeof Note> | void
  6: InstanceType<typeof Note> | void
  7: InstanceType<typeof Note> | void
  9: InstanceType<typeof Note> | void
  11: InstanceType<typeof Note> | void
  13: InstanceType<typeof Note> | void
}

export type t_intervalNum = 2 | 3 | 4 | 5 | 6 | 7 | 9 | 11 | 13

export type t_octaveConfig = {
  n1?: number[] | number,
  2?: number[] | number,
  3?: number[] | number,
  4?: number[] | number,
  5?: number[] | number,
  6?: number[] | number,
  7?: number[] | number,
  9?: number[] | number,
  11?: number[] | number,
  13?: number[] | number,
}

export type t_chordVoicing = {
  octaveConfigs: t_octaveConfig
  additionalNotes: [] | InstanceType<typeof Note>[]
}