import collect from "collect.js";
import {t_intervalList} from "../../interval/static/types";

type chordObj = {
  uid: string,
  scoreSymbol: string,
  noteNum: number,
  intervalList: t_intervalList[],
  semitoneGap: number[],
  semitoneCircleGap: number[],
  isWithinOctave: boolean,
  tag: string[]
}

const chords = [{
  term: "maj3",
  scoreSymbol: "",
  noteNum: 3,
  cnName: "大三",
  intervalList: [["maj", 3], ["p", 5]]
}, {
  term: "maj3b5",
  scoreSymbol: "Mb5",
  noteNum: 3,
  cnName: "大三降五",
  intervalList: [["maj", 3], ["dim", 5]]
}, {term: "min3", scoreSymbol: "m", noteNum: 3, cnName: "小三", intervalList: [["min", 3], ["p", 5]]}, {
  term: "dim3",
  scoreSymbol: "°",
  noteNum: 3,
  cnName: "减三",
  intervalList: [["min", 3], ["dim", 5]]
}, {
  term: "maj6",
  scoreSymbol: 6,
  noteNum: 4,
  cnName: "大六",
  intervalList: [["maj", 3], ["p", 5], ["maj", 6]]
}, {
  term: "maj69",
  scoreSymbol: "M69",
  noteNum: 5,
  cnName: "大六九",
  intervalList: [["maj", 3], ["p", 5], ["maj", 6], ["maj", 9]]
}, {
  term: "min6",
  scoreSymbol: "m6",
  noteNum: 4,
  cnName: "小六",
  intervalList: [["min", 3], ["p", 5], ["maj", 6]]
}, {
  term: "min69",
  scoreSymbol: "m69",
  noteNum: 5,
  cnName: "小六九",
  intervalList: [["min", 3], ["p", 5], ["maj", 6], ["maj", 9]]
}, {term: "aug3", scoreSymbol: "+", noteNum: 3, cnName: "增三", intervalList: [["maj", 3], ["aug", 5]]}, {
  term: "sus2",
  scoreSymbol: "sus",
  noteNum: 3,
  cnName: "挂二",
  intervalList: [["maj", 2], ["p", 5]]
}, {term: "sus4", scoreSymbol: "sus4", noteNum: 3, cnName: "挂四", intervalList: [["p", 4], ["p", 5]]}, {
  term: "maj7",
  scoreSymbol: "M7",
  noteNum: 4,
  cnName: "大七",
  intervalList: [["maj", 3], ["p", 5], ["maj", 7]]
}, {
  term: "maj7sus4",
  scoreSymbol: "M7sus4",
  noteNum: 4,
  cnName: "大七挂四",
  intervalList: [["p", 4], ["p", 5], ["maj", 7]]
}, {
  term: "maj7b5",
  scoreSymbol: "M7b5",
  noteNum: 4,
  cnName: "大七降五",
  intervalList: [["maj", 3], ["dim", 5], ["maj", 7]]
}, {
  term: "maj7#11",
  scoreSymbol: "M7#11",
  noteNum: 5,
  cnName: "大七升十一",
  intervalList: [["maj", 3], ["p", 5], ["maj", 7], ["aug", 11]]
}, {
  term: "maj7#5sus4",
  scoreSymbol: "M7#5sus4",
  noteNum: 4,
  cnName: "大七升五挂四",
  intervalList: [["p", 4], ["aug", 5], ["maj", 7]]
}, {
  term: "maj7#5",
  scoreSymbol: "M7#5",
  noteNum: 4,
  cnName: "大七升五",
  intervalList: [["maj", 3], ["aug", 5], ["maj", 7]]
}, {
  term: "dom7",
  scoreSymbol: 7,
  noteNum: 4,
  cnName: "属七",
  intervalList: [["maj", 3], ["p", 5], ["min", 7]]
}, {
  term: "dom7#5",
  scoreSymbol: "7#5",
  noteNum: 4,
  cnName: "属七升五",
  intervalList: [["maj", 3], ["aug", 5], ["min", 7]]
}, {
  term: "dom7b5",
  scoreSymbol: "7b5",
  noteNum: 4,
  cnName: "属七降五",
  intervalList: [["maj", 3], ["dim", 5], ["min", 7]]
}, {
  term: "dom7#5sus4",
  scoreSymbol: "7#5sus4",
  noteNum: 4,
  cnName: "属七升五挂四",
  intervalList: [["p", 4], ["aug", 5], ["min", 7]]
}, {
  term: "dom7#5b9#11",
  scoreSymbol: "7#5b9#11",
  noteNum: 6,
  cnName: "属七升五降九升十一",
  intervalList: [["maj", 3], ["aug", 5], ["min", 7], ["min", 9], ["aug", 11]]
}, {
  term: "dom7b9#11",
  scoreSymbol: "7b9#11",
  noteNum: 6,
  cnName: "属七降九升十一",
  intervalList: [["maj", 3], ["p", 5], ["min", 7], ["min", 9], ["aug", 11]]
}, {
  term: "dom7#9",
  scoreSymbol: "7#9",
  noteNum: 5,
  cnName: "属七升九",
  intervalList: [["maj", 3], ["p", 5], ["min", 7], ["aug", 9]]
}, {
  term: "dom7b9",
  scoreSymbol: "7b9",
  noteNum: 5,
  cnName: "属七降九",
  intervalList: [["maj", 3], ["p", 5], ["min", 7], ["min", 9]]
}, {
  term: "dom7b9sus4",
  scoreSymbol: "7b9sus4",
  noteNum: 5,
  cnName: "属七降九挂四",
  intervalList: [["p", 4], ["p", 5], ["min", 7], ["min", 9]]
}, {
  term: "dom7#11",
  scoreSymbol: "7#11",
  noteNum: 5,
  cnName: "属七升十一",
  intervalList: [["maj", 3], ["p", 5], ["min", 7], ["aug", 11]]
}, {
  term: "dom7sus4",
  scoreSymbol: "7sus4",
  noteNum: 4,
  cnName: "属七挂四",
  intervalList: [["p", 4], ["p", 5], ["min", 7]]
}, {
  term: "dom7b13",
  scoreSymbol: "7b13",
  noteNum: 4,
  cnName: "属七降十三",
  intervalList: [["maj", 3], ["min", 7], ["min", 13]]
}, {
  term: "alt7",
  scoreSymbol: "alt7",
  noteNum: 4,
  cnName: "变七",
  intervalList: [["maj", 3], ["min", 7], ["min", 9]]
}, {
  term: "min7",
  scoreSymbol: "m7",
  noteNum: 4,
  cnName: "小七",
  intervalList: [["min", 3], ["p", 5], ["min", 7]]
}, {
  term: "halfDim7",
  scoreSymbol: "ø",
  noteNum: 4,
  cnName: "半减七",
  intervalList: [["min", 3], ["dim", 5], ["min", 7]]
}, {
  term: "mM7",
  scoreSymbol: "mM7",
  noteNum: 4,
  cnName: "小大七",
  intervalList: [["min", 3], ["p", 5], ["maj", 7]]
}, {
  term: "mM7b6",
  scoreSymbol: "mM7b6",
  noteNum: 5,
  cnName: "小大七降六",
  intervalList: [["min", 3], ["p", 5], ["min", 6], ["maj", 7]]
}, {
  term: "dim7",
  scoreSymbol: "°7",
  noteNum: 4,
  cnName: "减七",
  intervalList: [["min", 3], ["dim", 5], ["dim", 7]]
}, {
  term: "dom9",
  scoreSymbol: 9,
  noteNum: 5,
  cnName: "属九",
  intervalList: [["maj", 3], ["p", 5], ["min", 7], ["maj", 9]]
}, {
  term: "dom9b13",
  scoreSymbol: "9b13",
  noteNum: 5,
  cnName: "属九降十三",
  intervalList: [["maj", 3], ["min", 7], ["maj", 9], ["min", 13]]
}, {
  term: "maj9",
  scoreSymbol: "M9",
  noteNum: 5,
  cnName: "大九",
  intervalList: [["maj", 3], ["p", 5], ["maj", 7], ["maj", 9]]
}, {
  term: "maj9sus4",
  scoreSymbol: "M9sus4",
  noteNum: 5,
  cnName: "大九挂四",
  intervalList: [["p", 4], ["p", 5], ["maj", 7], ["maj", 9]]
}, {
  term: "maj9#11",
  scoreSymbol: "M9#11",
  noteNum: 6,
  cnName: "大九升十一",
  intervalList: [["maj", 3], ["p", 5], ["maj", 7], ["maj", 9], ["aug", 11]]
}, {
  term: "min9",
  scoreSymbol: "m9",
  noteNum: 5,
  cnName: "小九",
  intervalList: [["min", 3], ["p", 5], ["min", 7], ["maj", 9]]
}, {
  term: "mM9",
  scoreSymbol: "mM9",
  noteNum: 5,
  cnName: "小大九",
  intervalList: [["min", 3], ["p", 5], ["maj", 7], ["maj", 9]]
}, {
  term: "dom11",
  scoreSymbol: 11,
  noteNum: 6,
  cnName: "属十一",
  intervalList: [["maj", 3], ["p", 5], ["min", 7], ["maj", 9], ["p", 11]]
}, {
  term: "dom11b9",
  scoreSymbol: "11b9",
  noteNum: 5,
  cnName: "属十一降9",
  intervalList: [["p", 5], ["min", 7], ["min", 9], ["p", 11]]
}, {
  term: "maj11",
  scoreSymbol: "M11",
  noteNum: 6,
  cnName: "大十一",
  intervalList: [["maj", 3], ["p", 5], ["maj", 7], ["maj", 9], ["p", 11]]
}, {
  term: "min11",
  scoreSymbol: "m11",
  noteNum: 6,
  cnName: "小十一",
  intervalList: [["min", 3], ["p", 5], ["min", 7], ["maj", 9], ["p", 11]]
}, {
  term: "dom13",
  scoreSymbol: 13,
  noteNum: 7,
  cnName: "属十三",
  intervalList: [["maj", 3], ["p", 5], ["min", 7], ["maj", 9], ["p", 11], ["maj", 13]]
}, {
  term: "dom13#9",
  scoreSymbol: "13#9",
  noteNum: 6,
  cnName: "属十三升九",
  intervalList: [["maj", 3], ["p", 5], ["min", 7], ["aug", 9], ["maj", 13]]
}, {
  term: "maj13",
  scoreSymbol: "M13",
  noteNum: 7,
  cnName: "大十三",
  intervalList: [["maj", 3], ["p", 5], ["maj", 7], ["maj", 9], ["p", 11], ["maj", 13]]
}, {
  term: "min13",
  scoreSymbol: "m13",
  noteNum: 7,
  cnName: "小十三",
  intervalList: [["min", 3], ["p", 5], ["min", 7], ["maj", 9], ["p", 11], ["maj", 13]]
}]
export default collect([
  ...chords
])