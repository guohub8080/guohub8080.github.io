import bzhanIcon from "../icons/bilibili.svg";
import logo1 from "../icons/gLogo.svg";
import wechatLogo from "../icons/wechatLogo.svg"
import copy from "copy-to-clipboard";
import emailLogo from "../icons/email.svg"
import {QRCodeSVG} from 'qrcode.react';
import React from "react";

const FollowMe = () => {
	const copyWechat = () => {
		const copyResult = copy("方块郭")
		if (copyResult) {
			console.log("微信ID已复制到剪贴板")
		} else {
			console.log("微信限制或无法获取剪贴板权限")
		}
	}
	const copyEmail = () => {
		const copyResult = copy("guo2018@88.com")
		if (copyResult) {
			console.log("邮箱地址已复制到剪贴板")
		} else {
			console.log("无法获取剪贴板权限")
		}
	}
	// 获取当前主题的背景色用于二维码
	const qrBgColor = getComputedStyle(document.documentElement).getPropertyValue('--background') || 'hsl(0 0% 100%)';
	
	return (
		<div className="flex justify-center">
			<div className="mt-4 w-fit gap-2 flex flex-wrap justify-center items-center">
				<div 
					className="px-2 py-3 rounded-lg cursor-pointer w-[140px] bg-card border border-border hover:bg-muted transition-colors"
					onClick={() => window.open("https://space.bilibili.com/8163674", "_blank")}
				>
					<div className="flex justify-center">
						<QRCodeSVG 
							value="https://space.bilibili.com/8163674"
							level="H"
							bgColor={qrBgColor}
							fgColor="hsl(var(--foreground))"
							size={105}
						/>
					</div>
					<div className="flex flex-col items-center mt-2.5">
						<img src={bzhanIcon} className="w-5" alt=""/>
						<div className="text-sm mt-1.5 text-card-foreground text-center">
							哔哩哔哩<br/>
							<span className="text-primary">@方块郭</span>
						</div>
					</div>
				</div>
				
				<div 
					className="px-2 py-3 rounded-lg cursor-pointer w-[140px] bg-card border border-border hover:bg-muted transition-colors"
					onClick={copyWechat}
				>
					<div className="flex justify-center">
						<QRCodeSVG
							level="H"
							value="http://weixin.qq.com/r/BBNaQrHEruzRrfUh90YW"
							bgColor={qrBgColor}
							fgColor="hsl(var(--foreground))"
							size={105}
						/>
					</div>
					<div className="flex flex-col items-center mt-2.5">
						<img src={wechatLogo} className="w-5" alt=""/>
						<div className="text-sm mt-1.5 text-card-foreground text-center">
							微信公众号<br/>
							<span className="text-primary">@方块郭</span>
						</div>
					</div>
				</div>
				
				<div 
					className="px-2 py-3 rounded-lg cursor-pointer w-[140px] bg-card border border-border hover:bg-muted transition-colors"
					onClick={copyEmail}
				>
					<div className="flex justify-center">
						<QRCodeSVG 
							level="H" 
							value="guohub@foxmail.com"
							bgColor={qrBgColor}
							fgColor="hsl(var(--foreground))"
							size={105}
						/>
					</div>
					<div className="flex flex-col items-center mt-2">
						<img src={emailLogo} className="w-5" alt=""/>
						<div className="text-sm mt-[3px] text-card-foreground text-center">
							电子邮箱<br/>
							<span className="text-xs text-primary">guohub@foxmail.com</span>
						</div>
					</div>
				</div>
				
				<div 
					className="px-2 py-3 rounded-lg cursor-pointer w-[140px] bg-card border border-border hover:bg-muted transition-colors"
					onClick={() => window.open("https://github.com/guohub8080", "_blank")}
				>
					<div className="flex justify-center">
						<QRCodeSVG 
							level="H" 
							value="https://github.com/guohub8080"
							bgColor={qrBgColor}
							fgColor="hsl(var(--foreground))"
							size={105}
						/>
					</div>
					<div className="flex flex-col items-center mt-2">
						<img src={logo1} className="w-[22px]" alt=""/>
						<div className="text-sm mt-[3px] text-card-foreground text-center">
							GitHub<br/>
							<span className="text-xs text-primary">Guohub8080</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FollowMe
