/* eslint-disable no-mixed-spaces-and-tabs */

import {css} from "@emotion/react";
import cssPresets from "@/assets/styles/cssPresets.ts";
import guohub8080 from "@/assets/svgs/logos/TextLogoFull.svg";
import production from "@/assets/svgs/logos/Production.svg";

const TooShortWindow = (props: {
	isActive: boolean,
	h: number,
	w: number,
}) => {
	// const wid = min([props.h, props.w]) * 0.8
	return <div css={too_short_window_css}
	            style={{display: props.isActive ? "flex" : "none"}}>
		<div style={{
			width: "100%", height:
				"fit-content",
			...cssPresets.flexCenter, aspectRatio: "auto", flexDirection: "column", marginBottom: 10
		}}>
			{/*<img src={production} style={{width: "30%", maxWidth: 120, height: "auto"}} alt=""/>*/}
			<img style={{
				width: "80%",
				maxWidth: 260,
				height: "auto",
			}} src={guohub8080} alt=""/>
		</div>
		<div>屏幕过小，无法显示</div>
	</div>
}

export default TooShortWindow

const too_short_window_css = css({
	width: "calc(100vw)",
	height: "calc(100vh)",
	overflowX: "hidden",
	overflowY: "hidden",
	position: "fixed",
	top: 0,
	left: 0,
	backgroundColor: cssPresets.mainBgColor,
	...cssPresets.flexCenter,
	justifyContent: "center",
	alignItems: "center",
	flexDirection: "column",
	zIndex: 900,
})
