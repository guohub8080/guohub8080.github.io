/* eslint-disable no-mixed-spaces-and-tabs */

import {css} from "@emotion/react";
import naviConfig from "@/router/naviConfig.ts";
import WideScreenNaviItem from "@/components/reFrame/NaviBar/comps/WideScreenNaviItem.tsx";
import text_logo_full from "@/assets/svgs/logos/TextLogoFull.svg";
import logo from "@/assets/svgs/logos/Production.svg";
import cssPresets from "@/assets/styles/cssPresets.ts";
import googleColors from "@/assets/colors/googleColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";

const headHeight = 120;
const PhonePopNaviContent = () => {
  const globalSettings = useGlobalSettings();
  const closeNaviWindow = () => {
    globalSettings.setNaviWindowOpen(false);
  }
  return <div css={phone_mask_content_css}>
    <div className="text_logo" onClick={closeNaviWindow}>
      {/*<img src={logo} alt=""/>*/}
      <img src={text_logo_full} alt=""/>
    </div>
    <div className="navi_items" onClick={closeNaviWindow}>
      {naviConfig.map((x) => ["all", "mobile"].includes(x.type) && <WideScreenNaviItem key={x.link}
                                                                                       itemH={60}
                                                                                       title={x.title}
                                                                                       subtitle={x.subtitle}
                                                                                       link={x.link}
                                                                                       url={x.imgURL}/>)}
      <div style={{width: "100%", height: 50}}></div>
    </div>
  </div>
}

export default PhonePopNaviContent

const phone_mask_content_css = css({
  width: 300,
  height: "calc(100vh)",
  overflowX: "hidden",
  overflowY: "hidden",
  backgroundColor: "white",
  "& .text_logo": {
    // paddingTop: 45,
    // paddingBottom: 25,
    boxSizing: "border-box",
    width: "100%",
    height: headHeight,
    ...cssPresets.flexCenter,
    backgroundColor: googleColors.blueGray50,
    "& img:first-of-type": {
      height: 45,
      marginRight:5,
      width: "auto"
    }, "& img:last-of-type": {
      height: 45,
      width: "auto"
    },
  },
  "& .navi_items": {
    width: "100%",
    height: `calc(100vh - ${headHeight}px)`,
    overflowX: "hidden",
    overflowY: "auto",
    "&>div": {
      borderTop: "1px solid #e5e5e5",
    }
  }
})
