/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import useTranscodeConfig from "@/assets/stores/useTranscodeConfig.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import {css} from "@emotion/react";

const TranscodeNaviBar = (props: {}) => {
	const {transcodeMode, setTranscodeMode} = useTranscodeConfig()
	return <>
		<div css={TranscodeNaviBar_css}>
			<div className="mode"
			     onClick={() => setTranscodeMode("base64")}
			     css={i(["", undefined, "base64", null].includes(transcodeMode))}>
				Base64
			</div>
			<div className="mode"
			     onClick={() => setTranscodeMode("gen_rsa")}
			     css={i(transcodeMode === "gen_rsa")}>
				RSA生成
			</div>
			<div className="mode"
			     onClick={() => setTranscodeMode("encode_rsa")}
			     css={i(transcodeMode === "encode_rsa")}>
				RSA公钥加密
			</div>
			<div className="mode"
			     onClick={() => setTranscodeMode("decode_rsa")}
			     css={i(transcodeMode === "decode_rsa")}>
				RSA私钥解密
			</div>
		</div>
	</>
}

export default TranscodeNaviBar

const TranscodeNaviBar_css = css({
	width: "100%",
	...cssPresets.flexCenter,
	flexWrap: "wrap",
	columnGap: 6,
	rowGap: 6,
	...cssFunctions.py(6),
	backgroundColor: googleColors.gray800
})

const i = (isSelected: boolean) => {
	return css({
		cursor: "pointer",
		transition:"all ease 0.2s",
		...cssFunctions.px(6),
		...cssPresets.flexCenter,
		width: 140,
		height:35,
		maxWidth: 200,
		borderRadius: 8,
		backgroundColor: isSelected ? googleColors.blue100 : googleColors.gray400,
		color: isSelected ? googleColors.blue800 : googleColors.gray600,
		fontSize: isSelected ? 16 : 14
	})
}
