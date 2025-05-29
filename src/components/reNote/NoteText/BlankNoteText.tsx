/* eslint-disable no-mixed-spaces-and-tabs */

import byDefault from "@/utils/byDefault.ts";
import {css} from "@emotion/react";
import cssPresets from "@/assets/styles/cssPresets.ts";
import googleColors from "@/assets/colors/googleColors.ts";

const NoteText = (props: {
  blankString?: string,
  fontSize?: number,
  isNatural?: boolean,
  color?: string,
}) => {
  const noteColor = byDefault(props.color, googleColors.gray800)
  const blankString = byDefault(props.blankString, "?")
  const fontSize = byDefault(props.fontSize, 14)
  return <div css={note_text_css(fontSize, noteColor)}>
    <div className="step">
      {blankString}
    </div>
  </div>
}

export default NoteText

const note_text_css = (fontSize: number, noteColor: string) => css({

  ...cssPresets.flexCenter,
  height: fontSize,
  "& .step": {
    fontSize: fontSize,
    textAlign: "center",
    
    color: noteColor,
  },

})
