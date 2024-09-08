import collect from "collect.js";
import modeMeta from "./modeMeta.ts";
import {range} from "lodash";
import {Interval} from "@/music96/interval";
import coreAlgorithm from "@/music96/common/radixCalc/coreAlgorithm.ts";
import {base12} from "@/music96/common/radixCalc/radixSymbol.ts";

const ____makeScale = () => {
  const scaleInfo = collect(modeMeta).all()
  const result = []
  range(0, 12).forEach((eachSemitoneLocation) => {
    scaleInfo.forEach((eachScaleInfo) => {
      const scaleLocationArray = [eachSemitoneLocation]
      const noteInScale = {}
      // @ts-ignore
      eachScaleInfo?.intervalList.forEach((intervalListItem) => {
        // @ts-ignore
        const itv = new Interval(intervalListItem[0], intervalListItem[1])
        const lN = coreAlgorithm.get2DigitNumArrByNum(itv.semitoneLocation + eachSemitoneLocation, base12)[1]
        scaleLocationArray.push(lN)
        noteInScale[`n${intervalListItem[1]}L`] = lN
      })
      result.push({
        // @ts-ignore
        uid: eachScaleInfo.uid,
        nRL: eachSemitoneLocation,
        ...noteInScale,
        nLs: collect(scaleLocationArray).sort().all()
      })
      return
    })

  })
  return result
}

// export default ____makeScale