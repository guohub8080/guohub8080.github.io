/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import {css} from "@emotion/react";
import white_logo from "@/assets/svgs/logos/whiteLogo.svg"

const HpgFoot = () => {
	return <>
		<div css={HpgFoot_css}>
			<div className="beian">
				<img src={white_logo} alt=""/>
				<div className="t">guohub.top</div>
				<div className="t">京ICP备2023017358号-1</div>
			</div>
		</div>
	</>
}

export default HpgFoot

const HpgFoot_css = css({
	width: "100%",
	backgroundColor: googleColors.gray800,
	"& .beian": {
		width: 180,
		...cssFunctions.py(50),
		...cssPresets.mxAuto,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		"& .t": {
			color:googleColors.gray400,
			fontSize:12,
			marginBottom:5,
		},
		"& img": {
			width: 25,
			opacity: 0.6,
			marginBottom:5,
		},
	}
})
