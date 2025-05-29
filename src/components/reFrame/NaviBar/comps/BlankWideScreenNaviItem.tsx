/* eslint-disable no-mixed-spaces-and-tabs */

import {css} from "@emotion/react";
import cssPresets from "@/assets/styles/cssPresets.ts";
import googleColors from "@/assets/colors/googleColors.ts";
import byDefault from "@/utils/byDefault.ts";
import {DotLoading} from "antd-mobile";

const BlankWideScreenNaviItem = (props: {
  itemH: number,
  itemW?: number
}) => {
  const itemW = byDefault(props.itemW, "100%")

  return <div css={navi_item_css(props.itemH, itemW)}>
    <div style={{color: googleColors.gray400,fontSize:14}}>更多功能开发中</div>
    <div>
      <DotLoading color={googleColors.gray400}/>
    </div>
  </div>
}

export default BlankWideScreenNaviItem

const navi_item_css = (itemH: number, itemW: number) => css({
  width: itemW,
  height: itemH,
  userSelect: "none",
  margin:0,
  backgroundColor: googleColors.gray200,
  boxSizing: "border-box",
  ...cssPresets.flexCenter,
  paddingLeft: 20,
  cursor: "not-allowed",

})
