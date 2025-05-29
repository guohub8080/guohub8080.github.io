/* eslint-disable no-mixed-spaces-and-tabs */

import {css} from "@emotion/react";
import googleColors from "@/assets/colors/googleColors.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import production from "@/assets/svgs/logos/Production.svg";
import text_logo from "@/assets/svgs/logos/TextLogoFull.svg";

const LandScreen = () => {
	return <div css={land_screen_css}>
		<div className="left_logo">
			{/*<img src={production} alt=""/>*/}
			<img src={text_logo} alt=""/>
		</div>
		<div className="description">
			为了更好的使用体验，请将设备旋转至竖屏模式
		</div>
	</div>
}

export default LandScreen

const land_screen_css = css({
	width: "calc(100vw)",
	height: "calc(100vh)",
	overflowX: "hidden",
	overflowY: "hidden",
	backgroundColor: cssPresets.mainBgColor,
	...cssPresets.flexCenter,
	position: "fixed",
	zIndex: 1000,
	flexDirection: "column",
	"& .left_logo": {
		width: "fit-content",
		height: 100,
		...cssPresets.flexCenter,
		"& img:first-of-type": {
			height: 100,
			width: "auto",
			userSelect: "none",
		},
		"& img:last-of-type": {
			height: 70,
			width: "auto",
			userSelect: "none",
		},
	},
	"& .description": {

		fontSize: 16,
		width: "fit-content",
		borderRadius: 999,
		marginTop: 25
	}
})
