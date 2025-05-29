/* eslint-disable no-mixed-spaces-and-tabs */

import logo from "@/assets/svgs/logos/Production.svg";
import text_logo from "@/assets/svgs/logos/TextLogo.svg";
import {css} from "@emotion/react";
import cssPresets from "@/assets/styles/cssPresets.ts";
import googleColors from "@/assets/colors/googleColors.ts";
import byDefault from "@/utils/byDefault.ts";

const LogoWithText = (props: {
	align?: "left" | "center" | "right";
}) => {
	const align = byDefault(props.align, "center");
	return <>
		<div css={logo_css}>
			<div className="logo_frame">
				<img src={logo} alt=""/>
			</div>
			<div className="text_logo_frame">
				<img src={text_logo} alt=""/>
			</div>
			<div className="title2">Music Theory Calculator Pro</div>
		</div>

	</>
}

export default LogoWithText

const logo_css = (naviBarHeight: number) => css({
	width: "100%",
	"& .logo_frame": {
		width: "100%",
		height: 100,
		marginTop: 20,
		...cssPresets.flexCenter,
		"& img": {
			width: "100%",
			height: "100%",
			userSelect: "none",
		}
	},
	"& .text_logo_frame": {
		width: "100%",
		// the font size of the logo:
		height: 37,
		...cssPresets.flexCenter,
		"& img": {
			width: "100%",
			height: "100%",
			userSelect: "none",
		}
	},
	"& .title2": {
		fontSize: 14,
		color: "white",
		width: "fit-content",
		backgroundColor: googleColors.blue400,
		borderRadius: 999,

		margin: "0 auto",
		paddingLeft: 15, paddingRight: 15,
		paddingTop: 3, paddingBottom: 3,
		marginTop: 5
	},
})
