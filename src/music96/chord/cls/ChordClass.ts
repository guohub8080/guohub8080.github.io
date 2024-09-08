// noinspection ES6PreferShortImport

import {Note} from "../../note/cls/NoteClass";
import cls_initChordClass from "./classFn/cls_initChordClass";
import {t_intervalList, t_intervalType} from "../../interval/static/types.ts";
import {
  t_chordNotesPanel,
  t_chordVoicing,
  t_intervalNum,
  t_intervalPanel,
  t_octaveConfig,
  t_transformPanel,
  t_transformString
} from "../static/types.ts";
import cls_dealTransformString from "./classFn/cls_dealTransformString.ts";
import cls_dealOmit from "./classFn/cls_dealOmit.ts";
import cls_getIntervalPanel from "./classFn/cls_getIntervalPanel.ts";
import cls_getNotesList from "./classFn/cls_getNotesList.ts";
import cls_getNotesPanel from "./classFn/cls_getNotesPanel.ts";
import cls_getIntervalList from "./classFn/cls_getIntervalList.ts";
import cls_getNotesListAfterVoicing from "./classFn/cls_getNotesListAfterVoicing.ts";
import cls_getScoreSymbol from "@/music96/chord/cls/classFn/cls_getScoreSymbol.ts";
import cls_addAdditionalNotes from "@/music96/chord/cls/classFn/cls_addAdditionalNotes.ts";


export class Chord {
  public rootNote: InstanceType<typeof Note>
  #transformPanel: t_transformPanel
  private chordVoicing: t_chordVoicing
  #initInfo: {
    intervalPanel: t_intervalPanel;
    scoreSymbol: string;
    cnName: string;
    intervalList: [t_intervalList, number][];
    term: string
  };

  constructor(rootNote: InstanceType<typeof Note>, chordTerm: string) {
    this.rootNote = rootNote
    const initChordInfo = cls_initChordClass(chordTerm)
    // This means the init info when the instance was created ( No transform info contains)
    this.#initInfo = {
      scoreSymbol: initChordInfo.scoreSymbol,
      intervalList: initChordInfo.baseIntervalList,
      term: initChordInfo.term,
      cnName: initChordInfo.cnName,
      intervalPanel: initChordInfo.baseIntervalPanel
    }
    this.#transformPanel = {
      2: void 0, 3: void 0, 4: void 0, 5: void 0, 6: void 0,
      7: void 0, 9: void 0, 11: void 0, 13: void 0
    }
    this.chordVoicing = {
      octaveConfigs: {},
      additionalNotes: []
    }
  }


  public setTransform(transformString: t_transformString) {
    this.#transformPanel = cls_dealTransformString(this.#transformPanel, transformString)
  }


  public setOctaves(octaveConfig: t_octaveConfig) {
    this.chordVoicing.octaveConfigs = octaveConfig
  }

  public setOmit(omitInterval: t_intervalNum) {
    this.#transformPanel = cls_dealOmit(this.#transformPanel, omitInterval)
  }

  public get scoreSymbol(): string {
    return cls_getScoreSymbol(this.rootNote, this.#initInfo.scoreSymbol,
      this.#initInfo.intervalPanel, this.#transformPanel, this.notesListAfterVoicing)
  }

  public addAdditionalNotes(additionalNotes: InstanceType<typeof Note>[] | InstanceType<typeof Note>) {
    this.chordVoicing.additionalNotes = cls_addAdditionalNotes(this.chordVoicing.additionalNotes, additionalNotes)
  }

  public clearAdditionalNotes(): void {
    this.chordVoicing.additionalNotes = []
  }

  public clearTransform(): void {
    this.chordVoicing = {
      octaveConfigs: {},
      additionalNotes: []
    }
  }

  get #intervalPanel(): t_intervalPanel {
    return cls_getIntervalPanel(this.#initInfo.intervalPanel, this.#transformPanel)
  }

  public get intervalList(): [t_intervalType, number][] {
    return cls_getIntervalList(this.#intervalPanel)
  }


  get #notesPanel(): t_chordNotesPanel {
    return cls_getNotesPanel(this.rootNote, this.#intervalPanel)
  }

  public get notesList(): Note[] {
    return cls_getNotesList(this.rootNote, this.#intervalPanel)
  }

  public get notesListAfterVoicing(): InstanceType<typeof Note>[] {
    return cls_getNotesListAfterVoicing(this.#notesPanel, this.notesList, this.chordVoicing)
  }

  public get simpleDescription() {
    return this.notesList.map((noteInstance) => noteInstance.simpleDescription).join(",")
  }

  public get simpleDescriptionAfterVoicing() {
    return this.notesListAfterVoicing.map((noteInstance) => noteInstance.simpleDescription).join(",")
  }
}