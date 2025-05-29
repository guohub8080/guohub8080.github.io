/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import byDefault from "@/utils/byDefault.ts";
import {css} from "@emotion/react";
import {Loading} from "antd-mobile";
import {isUndefined} from "lodash";
import * as Tone from "tone";

const SoundPicker = (props: {
	maxW?: number
	isLoaded?: boolean;
	onClick?: () => void;
	title?: string;
	isSelected?: boolean;
	img?: string;
}) => {
	const w = isUndefined(props.maxW) ? "100%" : props.maxW + "px"
	const title = byDefault(props.title, "乐器")
	const isLoaded = byDefault(props.isLoaded, false);
	const isSelected = byDefault(props.isSelected, false);
	return <>
		<div
			onClick={props.onClick}
			css={SoundPicker_css(w, isLoaded, isSelected)}>
			{isLoaded && <img src={props.img} alt=""/>}
			{!isLoaded && <div className="loading">
				<Loading/>
			</div>}
			<div className="name">
				{title}
			</div>
		</div>
	</>
}

export default SoundPicker

const SoundPicker_css = (w: string,
                         isLoaded: boolean,
                         isSelected: boolean) => {
	let backgroundColor = "white"
	if (isSelected) {
		backgroundColor = googleColors.blue50
	}
	if (!isLoaded) {
		backgroundColor = googleColors.gray200
	}
	return css({
		height: 80,
		width: "100%",
		// maxWidth: w,
		flex: "1 0 30%",
		boxSizing: "border-box",
		backgroundColor: backgroundColor,
		borderRadius: 6,
		filter: isLoaded ? "none" : "grayscale(100%)",
		...cssFunctions.py(15),
		...cssPresets.flexCenterColumn as any,
		...cssPresets.transition,
		cursor: "pointer",
		border: `1px solid ${isSelected ? googleColors.blue300 : 'white'}`,
		"&:hover": {
			backgroundColor: isLoaded ? googleColors.blue50 : googleColors.gray400,
		},
		"& .name": {
			color: isSelected ? googleColors.blue800 : googleColors.gray800,
			fontSize: 13,
			marginTop: 5,
		},
		img: {
			width: 35,
			height: 35,
		},
		"& div.loading":{
			height:35,
			minHeight:35,
			...cssPresets.flexCenter
		}
	})
}
