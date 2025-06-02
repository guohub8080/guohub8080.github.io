import psLogo from "../icons/ps.svg"
import vueLogo from "../icons/vue.svg"
import scoreLogo from "../icons/score.svg"
import cubaseLogo from "../icons/cubase.svg"
import {css} from "@emotion/react";
import reactLogo from "../icons/react.svg"
import pythonIcon from "../icons/pythonIcon.svg"
import mtkit_logo from "@/assets/svgs/logos/Production.svg"
import {Divider} from "antd";

const eachCell_css = css({
	borderColor: "#d7d7d7",
	backgroundColor: "white", borderRadius: 8, borderStyle: "solid",
	borderWidth: 1, padding: 10, paddingTop: 12, paddingBottom: 12,
	width: 120
})
const Certificate = () => {
	const iconSize = 40
	const titleFontSize = 15
	return <div>
		<Divider>技能</Divider>
		<div style={{display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20}}>
			<div style={{
				width: "fit-content",
				padding: 5,
				gap: 15,
				flexWrap: "wrap",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
				
				<div css={eachCell_css}>
					<img src={psLogo} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>Photoshop</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>熟练</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={pythonIcon} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>Python</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>熟练</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={vueLogo} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>Vue.js</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>掌握</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={reactLogo} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>React.js</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>熟练</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={mtkit_logo} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>乐理</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>熟悉</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={cubaseLogo} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>音乐宿主</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>入门</div>
					</div>
				</div>
			
			
			</div>
		</div>
	</div>
}

export default Certificate
