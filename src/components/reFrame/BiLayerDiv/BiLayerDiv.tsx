/* eslint-disable no-mixed-spaces-and-tabs */
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import byDefault from "@/utils/byDefault.ts";
import {css} from "@emotion/react";
import {CSSProperties} from "react";

const BiLayerDiv = (props: {
	children?: React.ReactNode
	py?: number
	px?: number
	innerDisplayStyle?: string
	innerMaxWidth?: number | string
	innerDivCss?: CSSProperties
}) => {
	const innerDisplayStyle = byDefault(props.innerDisplayStyle, "flex")
	const innerMaxWidth = byDefault(props.innerMaxWidth, "100%")
	const py = byDefault(props.py, 0)
	const px = byDefault(props.px, 0)
	return <>
		<div css={BiLayerDiv_css({px, py})}>
			<div css={inner_css({innerDisplayStyle, innerMaxWidth, innerDivCss: props.innerDivCss})}>
				{props.children}
			</div>
		</div>
	</>
}

export default BiLayerDiv

const BiLayerDiv_css = (i: {
	py: number,
	px: number
}) => css({
	width: "100%",
	minWidth: "100%",
	overflowX: "hidden",
	...cssPresets.flexCenter,
	paddingLeft: i.px,
	paddingRight: i.px,
	paddingTop: i.py,
	paddingBottom: i.py,
})

const inner_css = (i: {
	innerDisplayStyle: string,
	innerMaxWidth: number | string,
	innerDivCss?: CSSProperties
}) => {
	const commonCss = {
		width: "100%",
		maxWidth: i.innerMaxWidth,
		...cssPresets.mxAuto,
		...i.innerDivCss,
	}
	if (i.innerDisplayStyle === "flex") {
		return css({
			...cssPresets.flexCenter,
			...commonCss
		})
	}
	return css({
		...commonCss,
		display: "block",
	})
}
