// noinspection ES6PreferShortImport

import {Note} from "../../../note/cls/NoteClass";
import {t_scaleIntervalPanel, t_scaleMode} from "../../static/types";
import modeMeta from "../../static/modeMeta";
import collect from "collect.js";
import {ScaleError} from "../../../common/processError/errorTypes";
import {Interval} from "../../../interval/cls/IntervalClass";
import {t_intervalList, t_intervalType} from "../../../interval/static/types.ts";

export default (rootNote: InstanceType<typeof Note>,
                scaleMode: t_scaleMode = "MAJ"): {
  rootNote: InstanceType<typeof Note>
  intervalPanel: t_scaleIntervalPanel
  notesList: InstanceType<typeof Note>[]
  alterTimes: number
  modeName: string
  modeUid: string
  description: string
  intervalList: t_intervalList[]
} => {
  // find scale obj
  let modeName = scaleMode.trim().toUpperCase()
  if (modeName === "AEO") modeName = "MIN"
  else if (modeName === "ION") modeName = "MAJ"
  const findModeObj = collect(modeMeta).where("uid", modeName).first()
  if (!findModeObj) {
    throw new ScaleError("Cannot find the scale mode, please check.")
  }
  // make intervalPanel & notes list.
  const intervalPanel = {}
  const notesList = [rootNote]
  const alterJudgeList = rootNote.alter === 0 ? [] : [rootNote.alter]
  try {
    findModeObj.intervalList.forEach(x => {
      intervalPanel[x[1]] = x[0]
      const intervalInstance = new Interval(x[0] as t_intervalType, x[1] as number)
      const targetNote = rootNote.getNoteByInterval(intervalInstance)
      notesList.push(targetNote)
      if (targetNote.alter !== 0) alterJudgeList.push(targetNote.alter)
    })
  } catch {
    throw new ScaleError("Maybe the root note is not fit for the scale.")
  }
  return {
    rootNote: rootNote,
    intervalPanel,
    notesList,
    alterTimes: alterJudgeList.length,
    intervalList: findModeObj.intervalList as any,
    modeName: findModeObj.name,
    modeUid: findModeObj.uid,
    description: findModeObj.description
  }
}