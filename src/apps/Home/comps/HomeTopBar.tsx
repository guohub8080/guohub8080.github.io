/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import {css} from "@emotion/react";
import colorLogo from "@/assets/svgs/logos/authorLogo.svg";
import fkg_logo from "@/assets/svgs/logos/PureText.svg";
import url_text from "@/assets/svgs/logos/URLText.svg";

const HomeTopBar = (props: {}) => {
	return <>
		<div css={css_HomeHead}>
			<img css={css_MainLogo} src={colorLogo} alt=""/>
			<div css={css_AuthorName}><img src={fkg_logo} alt=""/></div>
			<div css={css_WebsiteAddr}><img src={url_text} alt=""/></div>
		</div>

	</>
}

export default HomeTopBar

const css_HomeHead = css({
	marginTop: 30,
	width: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	marginBottom: 10
})

const css_MainLogo = css({
	width: 60,
	filter: "drop-shadow(0px 5px 5px #bfbfbf);"
})

const css_AuthorName = css({
	marginTop: 5,
	"& img": {
		width: 100,
		height: 45
	}
})
const css_WebsiteAddr = css({
	marginBottom: 10,
	"& img":{
		width:130,
		height:"auto"
	}
})
