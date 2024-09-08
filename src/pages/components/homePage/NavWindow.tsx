import {css} from "@emotion/react";
import useGlobalSettings from "@pages/storage/globalSettings.ts";
import googleColors from "@assets/styles/googleColors.ts";
import cssPresets from "@assets/styles/cssPresets.ts";
import {RightOutlined} from "@ant-design/icons";
import {useLocation} from "react-router-dom";
import navigatorOptions from "@comps/homePage/navigatorOptions.tsx";

const NavWindow = () => {
	const {pathname} = useLocation()
	const title = navigatorOptions(pathname)
	const globalSettings = useGlobalSettings()
	const onMouseEnter = () => {
		if (!globalSettings.isNaviWindowOpen) globalSettings.changeNaviWindowOpen(true)
	}
	const onClick = () => {
		globalSettings.changeNaviWindowOpen(!(globalSettings.isNaviWindowOpen))
	}
	return <div onMouseEnter={onMouseEnter} onClick={onClick} css={windowFrame_css}>
		<div style={{marginRight: 10}}><RightOutlined style={{width: 15, height: 15, color: googleColors.gray700}}/></div>
		<div style={{marginRight: "auto"}}>{title}</div>
	</div>
}

export default NavWindow

const windowFrame_css = css({
	width: 300,
	borderRadius: 4,
	height: 35,
	backgroundColor: googleColors.gray300,
	...cssPresets.flexCenter,
	justifyContent: "center",
	paddingLeft: 10,
	paddingRight: 15,
	cursor: "pointer",
	userSelect: "none",
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
	color: googleColors.blueGray700
})

