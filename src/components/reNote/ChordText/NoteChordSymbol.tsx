/* eslint-disable no-mixed-spaces-and-tabs */

import byDefault from "@/utils/byDefault.ts";
import {css} from "@emotion/react";
import NoteSymbol from "@/components/reNote/NoteSymbol/NoteSymbol.tsx";
import cssPresets from "@/assets/styles/cssPresets.ts";
import googleColors from "@/assets/colors/googleColors.ts";
import NoteText from "@/components/reNote/NoteText/NoteText.tsx";

const NoteChordSymbol = (props: {
  step: string,
  alter: number,
  chordSymbol: string,
  fontSize?: number,
  isNatural?: boolean,
  color?: string,
}) => {
  const noteColor = byDefault(props.color, googleColors.gray800)
  const fontSize = byDefault(props.fontSize, 14)
  return <div css={chord_text_css(fontSize, noteColor, props.alter)}>
    <NoteText step={props.step} alter={props.alter} color={props.color} fontSize={fontSize}/>
    <div className="chord_text">
      {props.chordSymbol}
    </div>
  </div>
}

export default NoteChordSymbol

const chord_text_css = (fontSize: number, noteColor: string, alter: number) => css({
  ...cssPresets.flexCenter,
  alignItems: "end",

  "& .chord_text": {
    ...cssPresets.flexCenter,
    alignItems: "end",
    fontSize: fontSize * 0.8,
    marginLeft: 2,
    marginBottom: -1,
    color:noteColor
  }
})
