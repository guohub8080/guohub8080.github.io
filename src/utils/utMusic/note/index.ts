import note from "./getNote"
import keyNote from "./getKeynote"
import scoreNote from "./getScoreNote"

export type noteType = "C" | "D" | "E" | "F" | "G" | "A" | "B"
export type alterType = -2 | -1 | 0 | 1 | 2

export default {
    ...note, ...keyNote, ...scoreNote
}