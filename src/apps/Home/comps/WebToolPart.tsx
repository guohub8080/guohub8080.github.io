/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import tailwindColors from "@/assets/colors/tailwindColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import mtkit_text from "@/assets/svgs/logos/MtKitText.svg";
import mtkit_logo from "@/assets/svgs/logos/Production.svg";
import HomeShowCard from "@/components/common/HomeShowCard.tsx";
import BiLayerDiv from "@/components/reFrame/BiLayerDiv/BiLayerDiv.tsx";
import naviConfig from "@/router/naviConfig.ts";
import routerPath from "@/router/routerPath.ts";
import {css} from "@emotion/react";
import wechat from "@/apps/Abouts/icons/wechatLogo.svg"
import {Divider} from "antd";
import collect from "collect.js";
import {useState} from "react";
import {BiLink, BiSolidArrowToTop} from "react-icons/bi";
import {GrMore} from "react-icons/gr";
import {useNavigate} from "react-router-dom";
import {useWindowSize} from "react-use";

const WebToolPart = () => {
	const {pageMargin, phoneWidth} = useGlobalSettings()
	const navigate = useNavigate()
	const transcode = collect(naviConfig).where("link", `/${routerPath.code}`).first()
	const {width} = useWindowSize()
	return <div style={{width: "100%", paddingBottom: 20}}>
		<Divider>前端小工具</Divider>
		<div style={{width: "100%", ...cssPresets.flexCenter, flexWrap: "wrap",gap:15}}>
			<HomeShowCard title="公众号编辑工具" icon={wechat} content="点击进入GitHub仓库"
			              onClick={() => window.open("https://github.com/guohub8080/wechat_articles_editor", "_blank")}/>
			<HomeShowCard title={transcode.title}
			              onClick={() => navigate(`/${routerPath.code}`)}
			              icon={transcode.imgURL} content={transcode.subtitle}/>

		</div>
	</div>
}
export default WebToolPart;
