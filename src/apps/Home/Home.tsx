/* eslint-disable no-mixed-spaces-and-tabs */
import HomeTopBar from "@/apps/Home/comps/HomeTopBar.tsx";
import MtKitNavi from "@/apps/Home/comps/MtKitNavi.tsx";
import HpgFoot from "@/apps/Home/parts/HpgFoot.tsx";
import googleColors from "@/assets/colors/googleColors.ts";
import {css} from "@emotion/react";

const Home = (props: {}) => {
	return <>
		<HomeTopBar/>
		<MtKitNavi/>
		<div css={Home_css}>
		</div>
		<HpgFoot/>
	</>
}

export default Home

const Home_css = css({
	color: googleColors.blue800,
	fontSize: 80
})
