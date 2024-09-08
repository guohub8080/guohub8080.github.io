// noinspection TypeScriptUnresolvedReference

import collect from "collect.js";
import chordMeta from "@/music96/chord/static/chordMeta.ts";
import {range} from "lodash";
import {Interval} from "@/music96/interval";
import coreAlgorithm from "@/music96/common/radixCalc/coreAlgorithm.ts";
import {base12} from "@/music96/common/radixCalc/radixSymbol.ts";

const ____makeChord = () => {
  const chordInfo = collect(chordMeta).all()
  const result = []
  range(0, 12).forEach((eachSemitoneLocation) => {
    chordInfo.forEach((eachChordInfo) => {
      const chordLocationArray = [eachSemitoneLocation]
      const noteInChord = {}
      // @ts-ignore
      eachChordInfo.intervalList?.forEach((intervalListItem) => {
        const itv = new Interval(intervalListItem[0], intervalListItem[1])
        const lN=coreAlgorithm.get2DigitNumArrByNum(itv.semitoneLocation+ eachSemitoneLocation,base12)[1]
        chordLocationArray.push(lN)
        noteInChord[`n${intervalListItem[1]}L`] = lN
      })

      result.push({
        // @ts-ignore
        term: eachChordInfo.term,
        nRL: eachSemitoneLocation,
        ...noteInChord,
        nLs: collect(chordLocationArray).sort().all()
      })
    })

  })
  console.log(result)
}

// export default ____makeChord