/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import {useEffect, useMemo, useRef, useState} from "react";
import * as music12 from "@/music12";
import NoteText from "@/components/reNote/NoteText/NoteText.tsx";
import byDefault from "@/utils/byDefault.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import googleColors from "@/assets/colors/googleColors.ts";


const NoteByLocation = (props: {
  location: number
  fontSize?: number
  color?: string
}) => {
  const fontSize = byDefault(props.fontSize, 16)
  const notes = useMemo(() => {
    return music12.note.getNoteByLocation(props.location)
  }, [props.location])
  const color = byDefault(props.color, googleColors.gray800)
  return <>
    <div css={NoteByLocation_css}>
      {notes.length === 1 &&
          <NoteText step={notes[0].step} color={color} fontSize={fontSize} alter={notes[0].alter}/>}
      {notes.length === 2 && <>
          <NoteText step={notes[0].step} fontSize={fontSize} color={color} alter={notes[0].alter}/>
          <div style={{marginLeft: 2, marginRight: 2, fontSize: fontSize, color: color}}>/</div>
          <NoteText step={notes[1].step} fontSize={fontSize} color={color} alter={notes[1].alter}/>
      </>
      }
    </div>
  </>
}
export default NoteByLocation

const NoteByLocation_css = css({
  ...cssPresets.flexCenter,
  height: "100%"
})
