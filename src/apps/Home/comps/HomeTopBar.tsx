/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import routerPath from "@/router/routerPath.ts";
import {css} from "@emotion/react";
import colorLogo from "@/assets/svgs/logos/authorLogo.svg";
import fkg_logo from "@/assets/svgs/logos/PureText.svg";
import url_text from "@/assets/svgs/logos/URLText.svg";
import {useNavigate} from "react-router-dom";

const HomeTopBar = (props: {}) => {
	const navigate = useNavigate()
	return <>
		<div css={css_HomeHead} onClick={() => {
			navigate(`/${routerPath.about}`, {replace: true})
		}}>
			<img css={css_MainLogo} src={colorLogo} alt=""/>
			<div css={css_AuthorName}><img src={fkg_logo} alt=""/></div>
			<div css={css_WebsiteAddr}><img src={url_text} alt=""/></div>
		</div>

	</>
}

export default HomeTopBar

const css_HomeHead = css({
	marginTop: 10,
	paddingTop: 25,
	display: "flex",
	...cssFunctions.px(40),
	borderRadius: 60,
	width: "fit-content",
	...cssPresets.mxAuto,
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	marginBottom: 10,
	border: `1px solid #FFFFFF00`,
	cursor: "pointer",
	transition: "all ease 0.5s",
	"&:hover": {
		backgroundColor: googleColors.gray50,
		transform: "scale(1.10)",
		border: `1px solid ${googleColors.blue50}`,
		marginBottom: 40,
		paddingBottom: 25,
		paddingTop: 25,
		borderRadius: 15,
		marginTop: 40,
	}
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
	"& img": {
		width: 130,
		height: "auto"
	}
})
