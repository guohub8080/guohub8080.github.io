import {css} from "@emotion/react";
import cssPresets from "@assets/styles/cssPresets.ts";
import googleColors from "@assets/styles/googleColors.ts";
import React from "react";
import {SettingOutlined} from "@ant-design/icons";
import t from "@pages/i18n/t.tsx";
import useGlobalSettings from "@pages/storage/globalSettings.ts";
import NavWindow from "@comps/homePage/NavWindow.tsx";
import MainNav from "@comps/homePage/MainNav.tsx";
import {HiLanguage} from "react-icons/hi2";

const NaviBar = () => {
	const globalSettings = useGlobalSettings()
	return <div css={naviBar_css}>
		<div css={innerNavi_css}>
			<div css={currentFrame_css}>
				<NavWindow/>
			</div>
			<div style={{marginLeft: "auto", ...cssPresets.flexCenter, gap: 5}}>
				<div css={settings_css}>
					<SettingOutlined style={{fontSize: 30}}/>
					<div style={{marginLeft: 5, ...cssPresets.normalTransition, width: "fit-content"}}>
						{t({cn: "设置", en: "Settings"})}</div>
				</div>
				<div css={settings_css} onClick={() => {
					if (globalSettings.language === "cn") globalSettings.changeLanguage("en")
					else if (globalSettings.language === "en") globalSettings.changeLanguage("cn")
				}}>
					<HiLanguage/>
				</div>
			</div>
		</div>
		<MainNav/>
	</div>
}

export default NaviBar

const naviBar_css = css({
	...cssPresets.flexCenter,
	backgroundColor: googleColors.gray800,
	width: "100%",
	position: "fixed",
	top: 0,
	height: 45,
	zIndex: 999
});
const innerNavi_css = css({
	...cssPresets.flexCenter,
	// justifyContent:"start",
	maxWidth: 650,
	width: "100%",
	padding: 5
})
const currentFrame_css = css({
	...cssPresets.flexCenter,
	...cssPresets.normalTransition,
	// width:200,
	// height:30,
	// paddingLeft: 10,
	// paddingRight: 10,
	borderRadius: 0,
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
	borderBottom: `4px ${googleColors.blue600} solid`,
})

const settings_css = css({
	minWidth: 50,
	height: 35,
	borderRadius: 4,
	paddingLeft: 20,
	paddingRight: 20,
	transition: "all ease 0.2s",
	backgroundColor: googleColors.gray400,
	...cssPresets.flexCenter,
	...cssPresets.normalTransition,
	userSelect: "none",
	"&:hover": {
		cursor: "pointer",
		backgroundColor: googleColors.gray50
	}
})
type navi_type = {
	link: string,
	title: string
}