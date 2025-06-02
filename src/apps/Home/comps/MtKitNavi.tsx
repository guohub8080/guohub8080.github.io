/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import tailwindColors from "@/assets/colors/tailwindColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import mtkit_text from "@/assets/svgs/logos/MtKitText.svg";
import mtkit_logo from "@/assets/svgs/logos/Production.svg";
import BiLayerDiv from "@/components/reFrame/BiLayerDiv/BiLayerDiv.tsx";
import routerPath from "@/router/routerPath.ts";
import {css} from "@emotion/react";
import {useState} from "react";
import {BiLink, BiSolidArrowToTop} from "react-icons/bi";
import {GrMore} from "react-icons/gr";
import {useNavigate} from "react-router-dom";
import {useWindowSize} from "react-use";

const MtKitNavi = (props: {}) => {
	const {pageMargin, phoneWidth} = useGlobalSettings()
	const navigate = useNavigate()
	const {width} = useWindowSize()
	if (width >= phoneWidth) return <>
		<BiLayerDiv px={pageMargin} innerMaxWidth={phoneWidth}>
			<div css={MtKitNavi_css}>
				<div className="float_star">
					<BiSolidArrowToTop size={20} color={tailwindColors.orange300}/>
				</div>
				<div className="line1">
					<div className="mtkit_logo">
						<img src={mtkit_logo} alt="" className="logo1"/>
						<img src={mtkit_text} alt="" className="logo2"/>
					</div>
					<div className="click_navi">
						<div className="more" onClick={() => navigate(`/${routerPath.mtkit}`, {replace: true})}>
							<GrMore style={{marginRight: 3}} size={20} color={googleColors.blue800}/>
							详情
						</div>
						<div className="fangwen" onClick={() => window.open("https://mtkit.top/", "_blank")}>
							<BiLink size={20} color={googleColors.blue800}></BiLink>
							访问
						</div>
					</div>
				</div>
			</div>
		</BiLayerDiv>
	</>
	//窄屏下显示折叠的导航栏
	return <BiLayerDiv px={pageMargin} innerMaxWidth={phoneWidth}>
		<div css={MtKitNavi_css}>
			<div className="float_star">
				<BiSolidArrowToTop size={20} color={tailwindColors.orange300}/>
			</div>
			<div className="mtkit_logo">
				<img src={mtkit_logo} alt="" className="logo1"/>
				<img src={mtkit_text} alt="" className="logo2"/>
			</div>
			<div className="click_navi_phone">
				<div className="more" onClick={() => navigate(`/${routerPath.mtkit}`, {replace: true})}>
					<GrMore style={{marginRight: 3}} size={20} color={googleColors.blue800}/>
					详情
				</div>
				<div className="fangwen" onClick={() => window.open("https://mtkit.top/", "_blank")}>
					<BiLink size={20} color={googleColors.blue800}></BiLink>
					访问
				</div>
			</div>
		</div>
	</BiLayerDiv>
}

export default MtKitNavi

const MtKitNavi_css = css({
	width: "100%",
	backgroundColor: "white",
	borderRadius: 8,
	overflow: "hidden",
	marginBottom: 20,
	...cssPresets.flexCenter,
	flexDirection: "column",
	flexWrap: "wrap",
	position: "relative",
	...cssFunctions.py(10),
	"& .float_star": {
		right: 5,
		position: "absolute",
		top: 5,
	},
	"& .click_navi": {
		fontSize: 12,
		width: "60%",
		minWidth: 160,
		maxWidth: 300,
		color: tailwindColors.gray500,
		...cssPresets.flexCenter,
		justifyContent: "space-evenly",
		marginTop: 5,
		"& .more": {
			width: "40%",
			...cssPresets.flexCenter,
			backgroundColor: googleColors.blue50,
			color: googleColors.blue800,
			cursor: "pointer",
			minWidth: 100,
			height: 40,
			borderRadius: 999,
			...cssPresets.transition,
			"&:active": {
				transform: "scale(0.95)",
				backgroundColor: googleColors.blue100
			},
		},
		"& .fangwen": {
			width: "40%",
			...cssPresets.flexCenter,
			backgroundColor: googleColors.blue50,
			color: googleColors.blue800,
			cursor: "pointer",
			minWidth: 100,
			height: 40,
			borderRadius: 999,
			...cssPresets.transition,
			"&:active": {
				transform: "scale(0.95)",
				backgroundColor: googleColors.blue100
			},
		}
	},
	"& .click_navi_phone": {
		fontSize: 12,
		width: "100%",
		color: tailwindColors.gray500,
		...cssPresets.flexCenter,
		gap:25,
		marginTop: 5,
		"& .more": {
			width: "40%",
			maxWidth:150,
			...cssPresets.flexCenter,
			backgroundColor: googleColors.blue50,
			color: googleColors.blue800,
			cursor: "pointer",
			minWidth: 100,
			height: 40,
			borderRadius: 999,
			...cssPresets.transition,
			"&:active": {
				transform: "scale(0.95)",
				backgroundColor: googleColors.blue100
			},
		},
		"& .fangwen": {
			width: "40%",
			maxWidth:150,
			...cssPresets.flexCenter,
			backgroundColor: googleColors.blue50,
			color: googleColors.blue800,
			cursor: "pointer",
			minWidth: 100,
			height: 40,
			borderRadius: 999,
			...cssPresets.transition,
			"&:active": {
				transform: "scale(0.95)",
				backgroundColor: googleColors.blue100
			},
		}
	},
	"& .line1": {
		width: "100%",
		...cssPresets.flexCenter,
		flexWrap: "wrap",
		gap: 10,
	},
	"& .mtkit_logo": {
		minWidth: 200,
		maxWidth: 200,
		...cssPresets.flexCenter,
		"& .logo1": {
			width: 40,
			marginRight: 5,
		},
		"& .logo2": {
			width: 130,
			height: 65
		}
	}
})
