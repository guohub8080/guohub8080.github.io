/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import byDefault from "@/utils/byDefault.ts";
import {css} from "@emotion/react";
import {isUndefined} from "lodash";
import {QRCodeSVG} from 'qrcode.react';
import toast from "react-hot-toast";
import {useCopyToClipboard} from "usehooks-ts"

const WebAddrCard = (props: {
	url: string
	title: string
	w?: string
	showText?: string
	copyContent?: string
	copyInfo?: string
	img?: string
}) => {
	const w = byDefault(props.w, "260px")
	const [copiedText, copy] = useCopyToClipboard()
	const handClick = () => {
		const copyContent = byDefault(props.copyContent, props.url)
		copy(copyContent)
			.then(() => {
				console.log('复制成功')
				toast.success(byDefault(props.copyInfo, "复制成功"))
			})
			.catch(error => {
				console.error('无法复制，请检查浏览权限', error)
				toast.error('无法复制，请检查浏览权限', error)
			})
	}
	return <div css={wide_css(w)} onClick={handClick}>
		<QRCodeSVG
			value={props.url}
			title={"GitHub"}
			size={128}
			bgColor={"#ffffff"}
			fgColor={"#000000"}
			level={"H"}
			imageSettings={isUndefined(props.img) ? void 0 as any: {
				src: props.img as string,
				height:30,
				width:30,
				excavate:true
			}}
		/>
		<div className="right">
			<div className="title">{props.title}</div>
			<div className="addr">{byDefault(props.showText, props.url)}</div>
		</div>
	</div>
}

export default WebAddrCard


const wide_css = (w: string) => css({
	width: w,
	maxWidth: 300,
	paddingTop: 25,
	paddingBottom: 25,
	borderRadius: 8,
	...cssPresets.defaultHoverAndActive as any,
	...cssPresets.flexCenterColumn as any,
	"& .right": {
		...cssPresets.flexCenterColumn as any,
		"& .title": {
			fontSize: 14,
			// borderLeft: `5px solid ${googleColors.blue800}`,
			...cssFunctions.px(15),
			...cssFunctions.py(4),
			borderRadius: 999,
			marginBottom: 8,
			color: googleColors.blue800,
			marginTop: 15,
			backgroundColor: googleColors.blue50
		},
		"& .addr": {
			color: googleColors.gray800,
			...cssFunctions.px(10),
			...cssFunctions.py(4),
			borderRadius: 5,
			fontSize: 12,
			wordBreak: "break-all",
			backgroundColor: googleColors.gray50,
			border: `1px solid ${googleColors.gray300}`,
		}
	}
})
