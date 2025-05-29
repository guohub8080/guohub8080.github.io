/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import byDefault from "@/utils/byDefault.ts";
import {OpenSheetMusicDisplay} from "opensheetmusicdisplay";
import {create} from "xmlbuilder2";
import cssPresets from "@/assets/styles/cssPresets.ts";
import {isArray, isNull, isUndefined, range} from "lodash";
import * as music12 from "@/music12";

const RoughStaveClefAndScale = (props: {
  keys?: number
  clef?: string
  onClick?: () => void
  notesList?: { step: string, alter: number }[]
  w?: number
  h?: number
}) => {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  // 根据props来确定有几个升降号
  const keys = byDefault(props.keys, 0)
  const w = byDefault(props.w, 450)
  const h = byDefault(props.h, 150)
  // 谱表（高音、低音）
  const clef = useMemo(() => {
    const propsClef = byDefault(props.clef, "C").toUpperCase().trim()
    switch (propsClef) {
      case "C":
        return {sign: "C", line: 3}
      case "M":
        return {sign: "C", line: 3}
      case "F":
        return {sign: "F", line: 4}
      case "B":
        return {sign: "F", line: 4}
      default:
        return {sign: "G", line: 2}
    }
  }, [props.clef])

  // 音符的函数，因为过长单独提取出来而不直接合并到渲染函数中，否则过乱
  const notesObj = useMemo(() => {
    if (isUndefined(props.notesList) || isNull(props.notesList)) return []
    if (!isArray(props.notesList)) return []
    let readyResult = []
    if (clef.sign === "G") {
      readyResult = props.notesList.map(eachNote => {
          return range(3, 7).map(octave => {
            const noteInstance = music12.factory.getNote(eachNote.step, eachNote.alter, octave)
            if (noteInstance.pitchValue >= 45 && noteInstance.pitchValue <= 75) return {
              step: noteInstance.step,
              alter: noteInstance.alter,
              octave: noteInstance.octave
            }
          }).filter(Boolean)
        }
      ).filter(Boolean)
    } else if (clef.sign === "M" || clef.sign === "C") {
      readyResult = props.notesList.map(eachNote => {
          return range(2, 6).map(octave => {
            const noteInstance = music12.factory.getNote(eachNote.step, eachNote.alter, octave)
            if (noteInstance.pitchValue >= 35 && noteInstance.pitchValue <= 65) return {
              step: noteInstance.step,
              alter: noteInstance.alter,
              octave: noteInstance.octave
            }
          }).filter(Boolean)
        }
      ).filter(Boolean)
    } else if (clef.sign === "B" || clef.sign === "F") {
      readyResult = props.notesList.map(eachNote => {
          return range(1, 5).map(octave => {
            const noteInstance = music12.factory.getNote(eachNote.step, eachNote.alter, octave)
            if (noteInstance.pitchValue >= 23 && noteInstance.pitchValue <= 55) return {
              step: noteInstance.step,
              alter: noteInstance.alter,
              octave: noteInstance.octave
            }
          }).filter(Boolean)
        }
      ).filter(Boolean)
    }
    const resultList = []
    readyResult.forEach((eachNoteArray) => {
      eachNoteArray.forEach((eachNote, noteIndex) => {
        if (noteIndex === 0) resultList.push({
          pitch: {
            step: eachNote.step,
            alter: eachNote.alter,
            octave: eachNote.octave
          },
          'duration': '4',
          'type': 'whole',
          'beam': 'no', // 禁用 beam
          'stem': 'none' // 去掉音符杆
        })
        else {
          resultList.push({
            'chord': {},
            pitch: {
              step: eachNote.step,
              alter: eachNote.alter,
              octave: eachNote.octave
            },
            'duration': '4',
            'type': 'whole',
            'beam': 'no',  // 禁用 beam
            'stem': 'none' // 去掉音符杆
          })
        }
      })

    })
    return resultList
  }, [clef, props.notesList])

  // 用于引用画布的DOM元素
  const divRef = useRef<HTMLDivElement>(null);

  // 组成 MusicXML 字符串的动态函数
  const musicXML = useMemo(() => {
    const musicXMLObject = {
      'score-partwise': {
        '@version': '3.1',
        'part-list': {
          'score-part': {
            '@id': 'P1',
            'part-name': null  // 生成自闭合标签 <part-name/>
          }
        },
        'part': {
          '@id': 'P1',
          'measure': {
            '@number': '1',
            'attributes': {
              'divisions': '1',
              'key': {
                'fifths': keys,
              },
              clef,
            },
            'note': notesObj
          }
        }
      }
    };
    return create({version: '1.0', encoding: 'UTF-8'}, musicXMLObject)
      .end({prettyPrint: true});
  }, [clef, keys, notesObj])

  // 渲染函数
  const renderRef = useCallback(async () => {
    const container = divRef.current;
    if (!container) return;

    // 如果实例不存在则创建
    if (!osmdRef.current) {
      osmdRef.current = new OpenSheetMusicDisplay(container, {
        autoResize: true,
        drawTitle: false,
        drawComposer: false,
        drawCredits: false,
        drawMetronomeMarks: false,
        drawPartNames: false,
        drawSubtitle: false,
        drawTimeSignatures: false,
        drawLyricist: false,
        renderSingleHorizontalStaffline: true,
      });
      // 配置 EngravingRules
      const rules = osmdRef.current.EngravingRules;
      rules.PageTopMargin = 1;
      rules.PageBottomMargin = 1;
      rules.PageLeftMargin = 2;
      rules.PageRightMargin = 2;
    }

    // 更新 MusicXML
    await osmdRef.current.load(musicXML);
    osmdRef.current.render();
  }, [musicXML])
  useEffect(() => {
    renderRef().then()
  }, [props, renderRef])

  // 实际DOM结构
  return <>
    <div css={StaveWindow_css(w, h)} onClick={props.onClick}>
      <div className="frame">
        <div ref={divRef} className="svg_frame"></div>
      </div>
    </div>
  </>
}

export default RoughStaveClefAndScale

const StaveWindow_css = (w: number, h: number) => css({
  marginTop: 20,
  cursor: "pointer",
  userSelect: "none",
  marginLeft: "auto",
  marginRight: "auto",
  ...cssPresets.flexCenter,
  "& .frame": {
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "white",
    width: w,
    borderRadius: 8,
    overflow: "hidden",
    height: h,
    ...cssPresets.flexCenter,
    "& .svg_frame": {
      width: "100%",

    }
  }
})
