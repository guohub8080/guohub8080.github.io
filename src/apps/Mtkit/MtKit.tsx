/* eslint-disable no-mixed-spaces-and-tabs */
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import BiLayerDiv from "@/components/reFrame/BiLayerDiv/BiLayerDiv.tsx";
import {css} from "@emotion/react";
import production_svg from "@/assets/svgs/logos/Production.svg";
import mtkit_text_svg from "@/assets/svgs/logos/MtKitText.svg";
import {Toaster} from "react-hot-toast";
import WebAddrCard from "./comps/WebAddrCard";
import github from "./icons/github_logo.svg";
import cloudflare from "./icons/cloudflare.svg";
import vercel from "./icons/vercel.svg";
import netlify from "./icons/netlify_light.svg";

const MtKit = (props: {}) => {
	return <>
		<Toaster/>
		<div css={MtKit_css}>
			<div className="icon1">
				<img src={production_svg} alt=""/>
			</div>
			<div className="icon2">
				<img src={mtkit_text_svg} alt=""/>
			</div>
		</div>
		<BiLayerDiv innerMaxWidth={650} innerDivCss={{flexWrap: "wrap", columnGap: 15, marginTop: 20}}>
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
		</BiLayerDiv>
		<div style={{width: "100%", height: 120}}></div>
	</>
}

export default MtKit

const MtKit_css = css({
	...cssPresets.flexCenter,
	flexDirection: "column",
	"& .icon1": {
		marginTop: 40,
		marginBottom: 10,
		width: "100%",
		...cssPresets.mxAuto,
		"& img": {
			width: "100%",
			maxWidth: 45
		}
	}, "& .icon2": {
		width: "100%",
		...cssPresets.mxAuto,
		"& img": {
			width: "100%",
			maxWidth: 150
		}
	},
})
