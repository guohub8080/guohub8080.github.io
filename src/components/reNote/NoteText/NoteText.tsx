/* eslint-disable no-mixed-spaces-and-tabs */

import byDefault from "@/utils/byDefault.ts";
import {css} from "@emotion/react";
import NoteSymbol from "@/components/reNote/NoteSymbol/NoteSymbol.tsx";
import cssPresets from "@/assets/styles/cssPresets.ts";
import googleColors from "@/assets/colors/googleColors.ts";

const NoteText = (props: {
  step: string,
  alter: number,
  fontSize?: number,
  isNatural?: boolean,
  color?: string,
}) => {
  const noteColor = byDefault(props.color, googleColors.gray800)
  const isNatural = byDefault(props.isNatural, false)
  const fontSize = byDefault(props.fontSize, 14)
  const isShowNatural = !isNatural && props.alter === 0
  return <div css={note_text_css(fontSize, noteColor, props.alter)}>
    <div className="step">
      {props.step}
    </div>
    {!isShowNatural && <div className="alter">
        <NoteSymbol alter={props.alter} color={noteColor}/>
    </div>}
  </div>
}

export default NoteText

const note_text_css = (fontSize: number, noteColor: string, alter: number) => css({
  userSelect: "none",
  ...cssPresets.flexCenter,
  height:fontSize,
  "& .step": {
    fontSize: fontSize,
    textAlign: "center",
    
    color: noteColor,
  },
  "& .alter": {
    height: fontSize * 0.75,
    marginLeft:1,
    width: alter === -2 ? fontSize * 0.45 : fontSize * 0.3,
    ...cssPresets.flexCenter,
  }
})
