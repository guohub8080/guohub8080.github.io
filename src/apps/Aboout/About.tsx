/* eslint-disable no-mixed-spaces-and-tabs */

import citeItems from "@/apps/Aboout/citeItems.ts";
import WebAddrCard from "@/apps/Aboout/comps/WebAddrCard.tsx";
import WideScreenAboutTop from "@/apps/Aboout/comps/WideScreenAboutTop.tsx";
import googleColors from "@/assets/colors/googleColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import UseResetAllStores from "@/assets/stores/useResetAllStores.tsx";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import guohub8080 from "@/assets/svgs/logos/authorLogo.svg";
import {css} from "@emotion/react";
import collect from "collect.js";
import {useMemo} from "react";
import toast, {Toaster} from 'react-hot-toast';
import {useNavigate} from "react-router-dom";
import cloudflare from "./icons/cloudflare.svg";
import vercel from "./icons/vercel.svg";
import netlify from "./icons/netlify_light.svg";
import github from "@/apps/Author/icons/github_logo.svg";


const About = () => {
	const i = useMemo(() => {
		return collect(citeItems).shuffle().all()
	}, [])
	const {resetAll} = UseResetAllStores()
	const navigate = useNavigate()
	const reset = () => {
		resetAll()
		toast.success('重置成功');
		setTimeout(() => {
			navigate("/", {replace: true})
		}, 2000)
	}
	const {naviBarHeight} = useGlobalSettings()
	return <div css={frame_css(naviBarHeight)}>
		<Toaster/>
		<div className="inner_frame">
			<WideScreenAboutTop/>
			<div className="webcard_frame">
				<WebAddrCard
					url={"https://mtkit.top"} title="项目主页"/>
				<WebAddrCard
					img={github}
					url={"https://github.com/guohub8080/mtkit"} title="GitHub仓库"/>
				<WebAddrCard
					img={github}
					url={"https://guohub8080.github.io/mtkit/"} title="GitHub Pages镜像"/>
				<WebAddrCard
					img={cloudflare}
					url={"https://mtkit.pages.dev/"} title="Cloudflare Pages镜像"/>
				<WebAddrCard
					img={vercel}
					url={"https://mtkit.vercel.app/"} title="Vercel镜像"/>
				<WebAddrCard
					img={netlify}
					url={"https://mtkit.netlify.app/"} title="Netlify镜像"/>
			</div>
			<div className="cite_title">乐理计算</div>
			<div style={{width: "100%", ...cssPresets.flexCenter, ...cssFunctions.px(15), marginBottom: 25}}>
				<WebAddrCard
					img={github}
					w={"100%"} url={"https://github.com/guohub8080/music12"} title="music12.js"/>
			</div>
			<div style={{...cssFunctions.px(25), color: googleColors.gray700, lineHeight: 1.6}}>
				<span>
					本项目乐理计算由
				</span>
				<span style={{
					backgroundColor: googleColors.blue50,
					fontSize: 14,
					color: googleColors.blue800, width: "fit-content",
					...cssFunctions.mx(2), textAlign: "center", textIndent: 0,
					textJustify: "auto",
					borderRadius: 5, ...cssFunctions.px(8), ...cssFunctions.py(3)
				}}>music12.js</span>
				<span>
				支持。
				</span>
				<span>
	该库为乐理计算器Pro作者同步开源的TypeScript Library，将在GitHub中的readme.md文件持续更新使用手册。
				</span>
			</div>

			<div className="cite_title">引用Js库</div>
			<div className="cite_frame">
				{i.map((item, index) => (
					<div className="cite_item" key={index}>
						{item}
					</div>
				))}
			</div>
			<div className="cite_title">项目协议</div>
			<div className="cite_frame">
				<div className="cite_item">MIT</div>
			</div>
			<div style={{marginTop: 100, marginBottom: 100, width: '100%', height: 45}}>
				<img src={guohub8080} style={{
					height: "100%", width: "auto",
					//drop shadow
					filter: "drop-shadow(0px 3px 10px rgba(0, 0, 0, 0.2))"
				}} alt=""/>
			</div>
		</div>

	</div>
}

export default About

const frame_css = (naviBarHeight: number) => css({
	width: "100%",
	height: `calc(100vh - ${naviBarHeight}px)`,
	overflowX: "hidden",
	overflowY: "auto",
	paddingLeft: 25, paddingRight: 25,
	userSelect: "none",
	touchAction: "auto",
	"& div": {
		userSelect: "none",
		fontFamilyL: "misans-m",
	},
	"& .reset": {
		width: "100%",
		height: 150,
		userSelect: "none",
		...cssPresets.flexCenter,
		flexDirection: "column",
		marginTop: 55,
		"& .reset_desc": {
			fontSize: 14,
			color: googleColors.gray400,
			userSelect: "none",
			marginLeft: 40,
			marginRight: 40,
		},
		"& .btn": {
			width: 125,
			height: 45,
			userSelect: "none",
			...cssPresets.flexCenter,
			backgroundColor: googleColors.red300,
			borderRadius: 999,
			fontSize: 16,
			marginTop: 15,
			cursor: "pointer",
			...cssPresets.transition,
			color: googleColors.red50,
			"&:hover": {
				backgroundColor: googleColors.red400,
			},
			"&:active": {
				backgroundColor: googleColors.red800,
			},
		}
	},
	"& .inner_frame": {
		boxSizing: "border-box",
		touchAction: "auto",
		width: "100%",
		maxWidth: 650,
		userSelect: "none",
		margin: "0 auto",
		height: `calc(100vh - ${naviBarHeight + 30}px)`,
		marginTop: 15,
		backgroundColor: "white",
		borderRadius: 8,
		overflowX: "hidden",
		overflowY: "auto",
		WebkitOverflowScrolling: "touch",
		"& .webcard_frame": {
			...cssPresets.flexCenter,
			gap: 25,
			marginTop: 25,
			marginBottom: 25,
			...cssFunctions.px(20),
			flexWrap: "wrap",
		},
		"& .items": {
			...cssPresets.flexCenter,
			flexWrap: "wrap",
			userSelect: "none",
		}
	},
	"& .cite_title": {
		
		fontSize: 16,
		width: "100%",
		margin: "0 auto",
		marginBottom: 15,
		userSelect: "none",
		marginTop: 45,
		...cssFunctions.px(20),
		backgroundColor: googleColors.lightBlue50,
		color: googleColors.blue800,
		borderTop: `8px solid ${googleColors.blue800}`,
		paddingTop: 10, paddingBottom: 10,
	},
	"& .cite_frame": {
		marginLeft: 15, marginRight: 15,
		...cssPresets.flexCenter,
		
		userSelect: "none",
		gap: 10,
		flexWrap: "wrap",
		"& .cite_item": {
			width: "fit-content",
			...cssPresets.flexCenter,
			padding: "5px 15px ",
			userSelect: "none",
			borderRadius: 999,
			fontSize: 14,
			backgroundColor: googleColors.gray100,
			border: `1px solid ${googleColors.gray300}`
		}
	}
})
