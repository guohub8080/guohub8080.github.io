/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import shadowPresets from "@/assets/styles/shadowPresets.ts";
import {css} from "@emotion/react";

const HomeShowCard = (props: {
	icon: string
	title: string
	content: string
	onClick?: any
}) => {
	return <>
		<div css={HomeShowCard_css} onClick={props.onClick}>
			<div className="icon"><img src={props.icon} alt=""/></div>
			<div className="right">
				<div className="title">{props.title}</div>
				<div className="content">{props.content}</div>
			</div>
		</div>
	</>
}

export default HomeShowCard

const HomeShowCard_css = css({
	width: 240,
	height: 65,
	maxHeight: 65,
	minWidth: 240,
	...cssPresets.flexCenter,
	...cssFunctions.px(15),
	backgroundColor: "white",
	borderRadius: 8,
	outline: "1px solid #FFFFFF",
	cursor: "pointer",
	transition: "all ease 0.3s",
	"&:hover": {
		// outline: `1px solid ${googleColors.gray400}`,
		boxShadow: "0 0 12px #00000020",
		transform: "scale(1.05)"
	},
	"& .icon": {
		width: 40,
		height: 40,
		minWidth: 40,
		maxWidth: 40,
		...cssPresets.flexCenter,
		"& img": {
			width: "100%",
			height: "100%",
		}
	},
	"& .right": {
		width: "100%",
		...cssPresets.flexCenter,
		flexDirection: "column",
		justifyContent: "start",
		paddingLeft: 16,
		"&>.title": {
			width: "100%",
			textAlign: "left",
			fontSize: 16,
			color: googleColors.gray800,
			marginBottom: 3,
		},
		"&>.content": {
			width: "100%",
			textAlign: "left",
			fontSize: 13,
			color: googleColors.gray400,
		},
	}
})
