/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import {CSSProperties} from "react";

const NoWrapSection = (props: {
	style?: CSSProperties
	color?: string
	t: string
}) => {
	return <>
		<div css={NoWrapSection_css} style={{color: props.color, ...props.style}}>
			{props.t}
		</div>
	</>
}

export default NoWrapSection

const NoWrapSection_css = css({
	display: "inline-block",
	whiteSpace: "nowrap",

})
