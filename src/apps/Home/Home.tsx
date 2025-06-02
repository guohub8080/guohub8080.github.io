/* eslint-disable no-mixed-spaces-and-tabs */
import WebToolPart from "@/apps/Home/comps/WebToolPart.tsx";
import HomeTopBar from "@/apps/Home/comps/HomeTopBar.tsx";
import MtKitNavi from "@/apps/Home/comps/MtKitNavi.tsx";
import HpgFoot from "@/apps/Home/parts/HpgFoot.tsx";
import googleColors from "@/assets/colors/googleColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import BiLayerDiv from "@/components/reFrame/BiLayerDiv/BiLayerDiv.tsx";
import {css} from "@emotion/react";
import {ConfigProvider} from "antd";

const Home = (props: {}) => {
	const {pageMargin, phoneWidth} = useGlobalSettings()
	return <>
		<HomeTopBar/>
		<MtKitNavi/>
		<ConfigProvider theme={{
			token: {
				colorSplit: googleColors.gray500
			}
		}}>
			<BiLayerDiv innerMaxWidth={850} px={pageMargin}>
				<WebToolPart/>
			</BiLayerDiv>
		</ConfigProvider>
		<HpgFoot/>
	</>
}

export default Home

const Home_css = css({
	color: googleColors.blue800,
	fontSize: 80,
	zIndex: -999
})
