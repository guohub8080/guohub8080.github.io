/* eslint-disable no-mixed-spaces-and-tabs */

import {css} from "@emotion/react";
import {isString} from "lodash";
import googleColors from "@/assets/colors/googleColors.ts";

const AboutItems = (props: {
	title: string,
	content: string | any[],
}) => {
	return <div css={about_items_css}>
		<div className="title">{props.title}</div>
		{isString(props.content) && <div className="content_str">{props.content}</div>}
	</div>
}

export default AboutItems

const about_items_css = css({
	minWidth:25,
	width:150,
	maxWidth: "100%",
	userSelect: "none",
	"& .title": {
		
		fontSize: 14,
		width: "fit-content",
		margin:"0 auto",
		marginBottom: 5,
		marginTop:25,
		paddingLeft:15,paddingRight:15,
		color:googleColors.blue700,
		paddingTop:3,paddingBottom:3,
		borderRadius:999,
		backgroundColor: googleColors.blue50,
	},
	"& .content_str": {
		
		fontSize:14
	}
})
