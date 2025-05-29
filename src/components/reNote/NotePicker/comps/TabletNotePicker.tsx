/* eslint-disable no-mixed-spaces-and-tabs */

import {css} from "@emotion/react";
import NoteText from "@/components/reNote/NoteText/NoteText.tsx";
import cssPresets from "@/assets/styles/cssPresets.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import googleColors from "@/assets/colors/googleColors.ts";
import {useWindowSize} from "react-use";
import PianoPicker from "@/components/reNote/NotePicker/comps/TabletPianoPicker.tsx";
import byDefault from "@/utils/byDefault.ts";
import {isFunction} from "lodash";

const freezeCss = {backgroundColor: googleColors.gray300, cursor: "pointer"}
const freezeFontColor = googleColors.gray400
const TabletNotePicker = (props: {
  isNormalOnly?: boolean
  onSelect?: (step: string, alter: number) => any
}) => {
  const {width} = useWindowSize();
  const noteSize = 30
  const sharpNoteColor = googleColors.gray700
  const flatNoteColor = googleColors.gray700
  const {setNotePicker, setNotePickerOpen} = useGlobalSettings();
  const isNormalOnly = byDefault(props.isNormalOnly, false)


  const f_set = (step: string, alter: number) => {
    setNotePicker(step, alter)
    setNotePickerOpen(false)
  }
  return <div css={wide_note_picker_css(width)}>
    <div className="piano_selector">
      <PianoPicker onSelect={props.onSelect}/>
    </div>
    <div className="note_selector">
      {/*==================== ROW1 SHARP ============================*/}
      <div className="row">
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("C", 1)
               } else f_set("C", 1)
             }}>
          <NoteText step="C" alter={1} fontSize={noteSize} color={sharpNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("D", 1)
               } else f_set("D", 1)
             }}>
          <NoteText step="D" alter={1} fontSize={noteSize} color={sharpNoteColor}/>
        </div>
        <div className="cell"
             style={isNormalOnly ? freezeCss : void 0}
             onClick={e => {
               if (isNormalOnly) return e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("E", 1)
               } else f_set("E", 1)
             }}>
          <NoteText step="E" alter={1} fontSize={noteSize} color={isNormalOnly ? freezeFontColor : sharpNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("F", 1)
               } else f_set("F", 1)
             }}>
          <NoteText step="F" alter={1} fontSize={noteSize} color={sharpNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("G", 1)
               } else f_set("G", 1)
             }}>
          <NoteText step="G" alter={1} fontSize={noteSize} color={sharpNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("A", 1)
               } else f_set("A", 1)
             }}>
          <NoteText step="A" alter={1} fontSize={noteSize} color={sharpNoteColor}/>
        </div>
        <div className="cell"
             style={isNormalOnly ? freezeCss : void 0}
             onClick={e => {
               if (isNormalOnly) return e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("B", 1)
               } else f_set("B", 1)
             }}>
          <NoteText step="B" alter={1} fontSize={noteSize} color={isNormalOnly ? freezeFontColor : sharpNoteColor}/>
        </div>
      </div>
      {/*==================== ROW2 NATURAL ============================*/}
      <div className="row">
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("C", 0)
               } else f_set("C", 0)
             }}>
          <NoteText step="C" alter={0} fontSize={noteSize}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("D", 0)
               } else f_set("D", 0)
             }}>
          <NoteText step="D" alter={0} fontSize={noteSize}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("E", 0)
               } else f_set("E", 0)
             }}>
          <NoteText step="E" alter={0} fontSize={noteSize}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("F", 0)
               } else f_set("F", 0)
             }}>
          <NoteText step="F" alter={0} fontSize={noteSize}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("G", 0)
               } else f_set("G", 0)
             }}>
          <NoteText step="G" alter={0} fontSize={noteSize}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("A", 0)
               } else f_set("A", 0)
             }}>
          <NoteText step="A" alter={0} fontSize={noteSize}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("B", 0)
               } else f_set("B", 0)
             }}>
          <NoteText step="B" alter={0} fontSize={noteSize}/>
        </div>
      </div>
      {/*==================== ROW3 FLAT ============================*/}
      <div className="row">
        <div className="cell"
             style={isNormalOnly ? freezeCss : void 0}
             onClick={e => {
               if (isNormalOnly) return e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("C", -1)
               } else f_set("C", -1)
             }}>
          <NoteText step="C" alter={-1} fontSize={noteSize}
                    color={isNormalOnly ? freezeFontColor : flatNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("D", -1)
               } else f_set("D", -1)
             }}>
          <NoteText step="D" alter={-1} fontSize={noteSize} color={flatNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("E", -1)
               } else f_set("E", -1)
             }}>
          <NoteText step="E" alter={-1} fontSize={noteSize} color={flatNoteColor}/>
        </div>
        <div className="cell"
             style={isNormalOnly ? freezeCss : void 0}
             onClick={e => {
               if (isNormalOnly) return e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("F", -1)
               } else f_set("F", -1)
             }}>
          <NoteText step="F" alter={-1} fontSize={noteSize} color={isNormalOnly ? freezeFontColor : flatNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("G", -1)
               } else f_set("G", -1)
             }}>
          <NoteText step="G" alter={-1} fontSize={noteSize} color={flatNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("A", -1)
               } else f_set("A", -1)
             }}>
          <NoteText step="A" alter={-1} fontSize={noteSize} color={flatNoteColor}/>
        </div>
        <div className="cell"
             onClick={e => {
               e.stopPropagation()
               if (isFunction(props.onSelect)) {
                 props.onSelect("B", -1)
               } else f_set("B", -1)
             }}>
          <NoteText step="B" alter={-1} fontSize={noteSize} color={flatNoteColor}/>
        </div>
      </div>

    </div>
  </div>
}

export default TabletNotePicker

const wide_note_picker_css = (w: number) => css({
  "& .piano_selector": {
    width: 400,
    ...cssPresets.flexCenter,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 35,
    gap: 0
  },
  "& .note_selector": {
    backgroundColor: "white",
    ...cssPresets.flexCenter, flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    "&>.row:not(:first-of-type)": {
      borderTop: "1px solid #e6e6e6",
    },
    "&>.row": {
      display: "flex",
      "&>.cell:not(:first-of-type)": {
        borderLeft: "1px solid #e6e6e6",
      },
      "&>.cell": {
        width: w / 7,
        maxWidth: 80,
        minWidth: 60,
        height: 65,
        ...cssPresets.flexCenter,
        userSelect: "none",
        cursor: "pointer",
        ...cssPresets.transition,
        ...cssPresets.defaultHoverAndActive as any,
      }
    },

  }
})
