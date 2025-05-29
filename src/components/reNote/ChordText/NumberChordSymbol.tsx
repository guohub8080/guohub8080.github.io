/* eslint-disable no-mixed-spaces-and-tabs */

import byDefault from "@/utils/byDefault.ts";
import {css} from "@emotion/react";
import cssPresets from "@/assets/styles/cssPresets.ts";
import googleColors from "@/assets/colors/googleColors.ts";
import NumberNote from "@/components/reNote/NumberNote/NumberNote.tsx";

const NumberChordSymbol = (props: {
  num: number,
  alter: number,
  chordSymbol: string,
  fontSize?: number,
  isNatural?: boolean,
  color?: string,
  isRomeStyle: boolean
}) => {
  const noteColor = byDefault(props.color, googleColors.gray800)
  const fontSize = byDefault(props.fontSize, 14)
  return <div css={chord_text_css(fontSize, noteColor, props.isRomeStyle)}>
    <NumberNote
      isRomeStyle={props.isRomeStyle}
      num={props.num} alter={props.alter} color={props.color} fontSize={fontSize}/>
    <div className="chord_text">
      {props.chordSymbol}
    </div>
  </div>
}

export default NumberChordSymbol

const chord_text_css = (fontSize: number, noteColor: string, i: boolean) => css({
  ...cssPresets.flexCenter,
  alignItems: "end",
  "& .chord_text": {
    fontSize: fontSize * 0.8,
    marginLeft: 2,
    marginBottom: 2,
    color: noteColor
  }
})
