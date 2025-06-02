import googleColors from "@/assets/colors/googleColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import {ConfigProvider} from "antd";
import RotateCube from "./components/RotateCube/index.jsx";
import BiLayerDiv from "@/components/reFrame/BiLayerDiv/BiLayerDiv.tsx";
import {useEffect, useState} from "react";
import {useWindowScroll} from "react-use";
import styles from "./styles.ts";
import FullscreenBg from "./components/FullscreenBg/index.jsx";
import TypeWriter from "./components/TypeWriter/index.jsx";
import {useNavigate} from "react-router-dom";
import FollowMe from "./components/FollowMe.tsx";
import IntroduceTags from "./components/IntroduceTags.jsx";
import Certificate from "./components/Certificate.jsx";
import Skill from "./components/Skill.jsx";
import Intresting from "./components/Intresting.jsx";
import PublicAnn from "./components/PublicAnn.jsx";

const Abouts = () => {
	const [maskTransparency, setMaskTransparency] = useState(0.5)
	const {setMainBgColor} = useGlobalSettings()

	// eslint-disable-next-line no-unused-vars
	const windowScroll = useWindowScroll()
	const navigate = useNavigate()
	useEffect(() => {
		if (windowScroll.y >= 250) {
			setMaskTransparency(0.6)
		} else {
			setMaskTransparency(0)
		}
	}, [windowScroll])
	return <>


		<BiLayerDiv innerMaxWidth={550} innerDivCss={{display: "block"}}>
			{/*<div css={styles.backHome} onClick={() => navigate("/home")}>返回主页</div>*/}
			<RotateCube/>
			<TypeWriter/>
		</BiLayerDiv>
		<ConfigProvider theme={{
			token: {
				colorSplit: googleColors.gray500
			}
		}}>
			<BiLayerDiv
				px={15}
				innerMaxWidth={650}
				innerDivCss={{marginBottom: 50}}>
				<div style={{width: "100%", borderRadius: 10, paddingBottom: 25}}>
					<div style={{fontSize: 28, paddingTop: 0}}>
						<span style={{fontSize: 28, whiteSpace: "nowrap"}}>你好，我是</span>
						<span style={{whiteSpace: "nowrap", fontSize: 28, color: googleColors.blue800}}>方块郭</span>
					</div>
					<IntroduceTags/>
					<div style={{marginBottom: 40}}>
						<FollowMe/>
					</div>
					<div style={{marginBottom: 40}}>
						<Certificate/>
					</div>
					<div style={{marginBottom: 40}}>
						<Skill/>
					</div>
					<div style={{marginBottom: 40}}>
						<Intresting/>
					</div>
					<div style={{marginBottom: 40}}>
						<PublicAnn/>
					</div>
				</div>
			</BiLayerDiv>
		</ConfigProvider>

	</>
}
export default Abouts
