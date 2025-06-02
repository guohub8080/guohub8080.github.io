import elecLogo from "../icons/electronic.svg"
import internetLogo from "../icons/Internet.svg"
import musicLogo from "../icons/music.svg"
import artLogo from "../icons/art.svg"
import game from "../icons/game.svg"
import {css} from "@emotion/react";
import manual from "../icons/manual.svg"
import {Divider} from "antd";

const eachCell_css = css({
	borderColor: "#d7d7d7",
	backgroundColor: "white",
	borderRadius: 8,
	borderStyle: "solid",
	borderWidth: 1,
	padding: 10,
	paddingTop: 12,
	paddingBottom: 12,
	width: 120
})
const Certificate = () => {
	const iconSize = 40
	const titleFontSize = 15
	return <div>
		<Divider>兴趣领域</Divider>
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
					<div style={{
						width: iconSize,
						height: iconSize,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						margin: "0 auto"
					}}>
						<img src={elecLogo} style={{width: 33}} alt=""/>
					</div>
					
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>电子科技</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>硬件新闻</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={internetLogo} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>互联网</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>软件与体验</div>
					</div>
				</div>
				
				<div css={eachCell_css}>
					<img src={musicLogo} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>音乐</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>流行/爵士</div>
					</div>
				</div>
				
				<div css={eachCell_css}>
					<img src={artLogo} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>书法/绘画</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>欣赏他人</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={game} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>游戏</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>休闲/桌游</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={manual} style={{width: iconSize}} alt=""/>
					<div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>手工</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>偏爱DIY</div>
					</div>
				</div>
			
			
			</div>
		</div>
	</div>
}

export default Certificate
