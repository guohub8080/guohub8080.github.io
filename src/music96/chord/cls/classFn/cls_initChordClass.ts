// noinspection ES6PreferShortImport

import chordMeta from "../../static/chordMeta";
import {ChordError} from "../../../common/processError/errorTypes";
import {t_intervalList} from "../../../interval/static/types";
import {t_intervalPanel} from "../../../chord/static/types.ts";

const cls_initChordClass = (chordTerm: string): {
  baseIntervalList: [t_intervalList, number][],
  baseIntervalPanel: t_intervalPanel,
  scoreSymbol: string,
  term: string
  cnName: string
} => {
  const findChordObj = chordMeta.where("term", chordTerm).first()
  if (!findChordObj) throw new ChordError(`No such chord term like ${chordTerm}.`)
  const targetBaseIntervalPanel: t_intervalPanel = {
    2: void 0, 3: void 0, 4: void 0, 5: void 0, 6: void 0,
    7: void 0, 9: void 0, 11: void 0, 13: void 0,
  }
  findChordObj.intervalList.map((x) => {
    targetBaseIntervalPanel[x[1]] = x[0]
  })
  return {
    baseIntervalList: findChordObj.intervalList as [t_intervalList, number][],
    baseIntervalPanel: targetBaseIntervalPanel,
    scoreSymbol: findChordObj.scoreSymbol as string,
    term: findChordObj.term,
    cnName: findChordObj.cnName
  }
}

export default cls_initChordClass