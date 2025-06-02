import bzhanIcon from "../icons/bilibili.svg";
import logo1 from "../icons/gLogo.svg";
import wechatLogo from "../icons/wechatLogo.svg"
import {css} from "@emotion/react";
import copy from "copy-to-clipboard";
import emailLogo from "../icons/email.svg"
import {QRCodeSVG} from 'qrcode.react';
import cssPresets from "@/assets/styles/cssPresets.js";
import toast, {Toaster} from "react-hot-toast";
import warningToast from "@/utils/warningToast.tsx";

const followMe_css = css({
	padding: 10, borderRadius: 5,
	cursor: "pointer",
	width:145,
	boxSizing: "border-box",
	"&:hover": {
		backgroundColor: "#f6f6f6",
		outlineStyle: "solid",
		outlineWidth: 1,
		outlineColor: "#bebebe"
	}
})

const Flex = (props) => {
	return <div style={{...cssPresets.flexCenter, ...props.style}}>{props.children}</div>
}
const FollowMe = () => {
	const copyWechat = () => {
		const copyResult = copy("方块郭")
		try {
			if (copyResult) {
				return toast.success("微信ID已复制到剪贴板")
			}
			throw new Error("错误")
		} catch (e) {
			warningToast("微信限制或无法获取剪贴板权限")
		}
	}
	const copyEmail = () => {
		const copyResult = copy("guo2018@88.com")
		try {
			if (copyResult) {
				return toast.success("邮箱地址已复制到剪贴板")
			}
			throw new Error("错误")
		} catch (e) {
			warningToast("无法获取剪贴板权限")
		}
	}
	return <>
		<Toaster/>
		<div style={{display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20}}>

			<div style={{
				marginTop: 15,
				backgroundColor: "white",
				borderRadius: 8,
				borderStyle: "solid",
				borderWidth: 1,
				width: "fit-content",
				borderColor: "#d7d7d7",
				padding: 5,
				gap: 5,
				flexWrap: "wrap",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
				<div css={followMe_css} onClick={() => window.open("https://space.bilibili.com/8163674", "_blank")}>
					<QRCodeSVG value="https://space.bilibili.com/8163674"
					           level={"H"}
					           bgColor="white" size={110}/>
					<Flex justify="center" align="center" style={{marginTop: 10, flexDirection: "column"}}>
						<img src={bzhanIcon} style={{width: 20}} alt=""/>
						<span style={{fontSize: 14, marginLeft: 5, marginTop: 5}}>哔哩哔哩<br/>
                    <span style={{color: "#1b5dc0"}}>@方块郭</span></span>
					</Flex>
				</div>
				<div css={followMe_css}
				     onClick={copyWechat}>
					<QRCodeSVG
						level={"H"}
						value="http://weixin.qq.com/r/BBNaQrHEruzRrfUh90YW" bgColor="white" size={110}/>
					<Flex justify="center" align="center" style={{marginTop: 10, flexDirection: "column"}}>
						<img src={wechatLogo} style={{width: 20}} alt=""/>
						<span style={{fontSize: 14, marginLeft: 5, marginTop: 5}}>微信公众号<br/>
                    <span style={{color: "#1b5dc0"}}>@方块郭</span></span>
					</Flex>
				</div>
				<div css={followMe_css} onClick={copyEmail}>
					<QRCodeSVG level={"H"} value="guohub@foxmail.com" bgColor="white" size={110}/>
					<Flex justify="center" align="center" style={{marginTop: 10, flexDirection: "column"}}>
						<img src={emailLogo} style={{width: 20}} alt=""/>
						<span style={{fontSize: 14, marginLeft: 5, marginTop: 3}}>电子邮箱<br/>
                    <span style={{fontSize: 12, color: "#1b5dc0"}}>guohub@foxmail.com</span></span>
					</Flex>
				</div>
				<div css={followMe_css} onClick={() => window.open("https://github.com/guohub8080", "_blank")}>
					<QRCodeSVG level={"H"} value="https://github.com/guohub8080" bgColor="white" size={110}/>
					<Flex justify="center" align="center" style={{marginTop: 10, flexDirection: "column"}}>
						<img src={logo1} style={{width: 22}} alt=""/>
						<span style={{fontSize: 14, marginLeft: 5, marginTop: 3}}>GitHub<br/>
                    <span style={{fontSize: 12, color: "#1b5dc0"}}>Guohub8080</span></span>
					</Flex>
				</div>


			</div>
		</div>
	</>
}

export default FollowMe
