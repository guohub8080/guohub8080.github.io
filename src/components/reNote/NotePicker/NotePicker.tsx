/* eslint-disable no-mixed-spaces-and-tabs */

import {css} from "@emotion/react";
import useIsWideScreen from "@/utils/useIsWideScreen.tsx";
import {Mask} from "antd-mobile";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import TabletNotePicker from "@/components/reNote/NotePicker/comps/TabletNotePicker.tsx";
import PhoneNotePicker from "@/components/reNote/NotePicker/comps/PhoneNotePicker.tsx";
import byDefault from "@/utils/byDefault.ts";

const NotePicker = (props: {
  isNormalOnly?: boolean
  onSelect?: (step: string, alter: number) => any
}) => {
  const {isNotePickerOpen, setNotePickerOpen} = useGlobalSettings();
  const isWideScreen = useIsWideScreen();
  const isNormalOnly = byDefault(props.isNormalOnly, false)
  return (<>
    <Mask visible={isNotePickerOpen}
          style={{...cssPresets.defaultBlur}}
          opacity={0.5}
          destroyOnClose={true}>
      <div css={note_picker_css} onClick={() => setNotePickerOpen(false)}>
        {isWideScreen && <TabletNotePicker onSelect={props.onSelect} isNormalOnly={isNormalOnly}/>}
        {!isWideScreen && <PhoneNotePicker onSelect={props.onSelect} isNormalOnly={isNormalOnly}/>}
      </div>
    </Mask>
  </>)

}

export default NotePicker

const note_picker_css = css({
  userSelect: "none",
  width: "calc(100vw)",
  height: "calc(100vh)",
  zIndex: 999,
  ...cssPresets.flexCenter,
  overflowX: "hidden",
  overflowY: "hidden",
})
