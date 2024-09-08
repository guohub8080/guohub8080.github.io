/* eslint-disable no-mixed-spaces-and-tabs */
import useGlobalSettings from "@pages/storage/globalSettings.ts";
import {css} from "@emotion/react";
import shadowPresets from "@assets/styles/shadowPresets.ts";
import navigatorOptions from "@comps/homePage/navigatorOptions.tsx";
import t from "@pages/i18n/t.tsx";
import googleColors from "@assets/styles/googleColors.ts";
import cssPresets from "@assets/styles/cssPresets.ts";
import {useEffect, useRef, useState} from "react";
import {useWindowSize} from "react-use";
import {useNavigate} from "react-router-dom";

const MainNav = () => {
	const windowSize = useWindowSize();
	const globalSettings = useGlobalSettings()
	const navigate = useNavigate()
	const linkTo = (targetLink: string) => {
		navigate(targetLink)
		globalSettings.changeNaviWindowOpen(false)
	}
	const ref = useRef(null)
	const [eachCellWidth, setEachCellWith] = useState("100")
	const [eachCellMaxWidth, setEachCellMaxWith] = useState("100%")
	const onMouseLeave = () => {
		if (globalSettings.isNaviWindowOpen) globalSettings.changeNaviWindowOpen(false)
	}
	useEffect(() => {
		if (windowSize.width <= 580) {
			setEachCellWith("100%")
		} else {
			setEachCellWith("calc((100% - 10px)/ 2 )")
		}
	}, [windowSize])


	return <div style={{display: globalSettings.isNaviWindowOpen ? "block" : "none", zIndex: 999}}
	            css={mainNavFrame}
	            ref={ref}
	            onMouseLeave={onMouseLeave}>
		<div>
			<div css={groupTitle_css}>{t({cn: "Music96.js文档", en: "Music96.js Document"})}</div>
			<div css={naviFrame_css}>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/music96/intro")}>
					{navigatorOptions("/music96/intro")}
				</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/music96/interval_and_note")}>
					{navigatorOptions("/music96/interval_and_note")}
				</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/music96/chord")}>
					{navigatorOptions("/music96/chord")}
				</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/music96/scale")}>
					{navigatorOptions("/music96/scale")}
				</div>
			</div>
		</div>
		<div>
			<div css={groupTitle_css}>{t({cn: "乐理计算器", en: "Music Calculator"})}</div>
			<div css={naviFrame_css}>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/interval")}>
					{navigatorOptions("/interval")}
				</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/interval")}>
					{t({cn: "和弦计算", en: "Chord Calculator"})}
				</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/interval")}>
					{t({cn: "音阶计算", en: "Scale Calculator"})}
				</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/fifth")}>
					{t({cn: "五度圈", en: "Fifth Circle"})}
				</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/fifth")}>
					{t({cn: "神奇终端", en: "Magic Terminal"})}
				</div>
			</div>
		</div>
		<div>
			<div css={groupTitle_css}>{t({cn: "小工具", en: "Utility"})}</div>
			<div css={naviFrame_css}>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}
				     onClick={() => linkTo("/score")}>{t({cn: "乐谱工具", en: "Score"})}
				</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}>1</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}>1</div>
				<div css={eachCell_css(eachCellWidth, eachCellMaxWidth)}>1</div>
			</div>
		</div>
	</div>
}

export default MainNav

const mainNavFrame = css({
	position: "fixed",
	top: -5,
	borderRadius: 8,
	border: `3px ${googleColors.blue600} solid`,
	borderTopRightRadius: 0,
	borderTopLeftRadius: 0,
	overflow: "hidden",
	boxShadow: shadowPresets.lg,
	maxWidth: 650,
	width: "100%",
	margin: "0 auto",
	marginTop: 50,
	backgroundColor: "white",
	zIndex: 9999
})

const groupTitle_css = css({
	backgroundColor: googleColors.blue600,
	width: "100%",
	height: 30,
	...cssPresets.flexCenter,

	padding: 3,
	textAlign: "left",
	color: googleColors.gray100
})

const naviFrame_css = css({
	...cssPresets.flexCenter,
	justifyContent: "start",
	flexWrap: "wrap",
	gap: 10,
	padding: 10
})

const eachCell_css = (w: string, mw: string) => css({
	...cssPresets.flexCenter,
	justifyContent: "start",
	maxWidth: mw,
	width: w,
	minHeight: 40,
	textAlign: "left",
	border: `1px ${googleColors.gray400} solid`,
	padding: 10,
	paddingLeft: 15,
	paddingRight: 15,
	borderRadius: 6,
	cursor: "pointer",
	transition: "all ease 0.2s",
	color: googleColors.gray700,
	"&:hover": {
		backgroundColor: googleColors.gray100
	}
})