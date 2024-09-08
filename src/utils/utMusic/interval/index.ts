export type intervalType = "p" | "maj" | "min" | "aug" | "dim" | "aug+" | "dim-"
export type interval = {
    intervalType: intervalType,
    intervalNum: number,
    direction: "up" | "down"
}
import getInterval from "./getInterval"

export default {
    ...getInterval
}