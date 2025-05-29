/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import byDefault from "@/utils/byDefault.ts";
import {OpenSheetMusicDisplay} from "opensheetmusicdisplay";
import {create} from "xmlbuilder2";
import cssPresets from "@/assets/styles/cssPresets.ts";
import {isArray, isNull, isUndefined, range} from "lodash";
import * as music12 from "@/music12";

const StaveWithOneNote = (props: {
  keys?: number
  clef?: string
  w?: number
  h?: number
  step: string
  alter: number
  octave: number
}) => {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  // 根据props来确定有几个升降号
  const keys = byDefault(props.keys, 0)
  const w = byDefault(props.w, 450)
  const h = byDefault(props.h, 180)
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
            'note': {
              pitch: {
                step: props.step,
                alter: props.alter,
                octave: props.octave,
              },
              duration: "4",
              type: "quarter",
            }
          }
        }
      }
    };
    return create({version: '1.0', encoding: 'UTF-8'}, musicXMLObject)
      .end({prettyPrint: true});
  }, [clef, keys, props.alter, props.octave, props.step])

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
      rules.FixedMeasureWidth=true;
      rules.FixedMeasureWidthFixedValue = 3
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
    <div css={StaveWindow_css(w, h)}>
      <div className="frame">
        <div ref={divRef} className="svg_frame"></div>
      </div>
    </div>
  </>
}

export default StaveWithOneNote

const StaveWindow_css = (w: number, h: number) => css({
  marginTop: 20,
  cursor: "pointer",
  userSelect: "none",
  marginLeft: "auto",
  marginRight: "auto",
  pointerEvents: "none",
  ...cssPresets.flexCenter,

  "& .frame": {
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "white",
    width: w,
    minWidth: 320,
    maxWidth: 400,
    borderRadius: 8,
    overflow: "hidden",
    userSelect: "none",
    height: h,
    ...cssPresets.flexCenter,
    "& .svg_frame": {
      width: "100%",
      transform: "scale(1.5)",
    }
  }
})
