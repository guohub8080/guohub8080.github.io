/* eslint-disable no-mixed-spaces-and-tabs */
import infos from "@/apps/Aboout/infos.ts";
import googleColors from "@/assets/colors/googleColors.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import logo from "@/assets/svgs/logos/Production.svg";
import text_logo from "@/assets/svgs/logos/TextLogoFull.svg";
import {css} from "@emotion/react";
import updateObj from "@/apps/UpgradeLog/updateObj.ts";
import {useMemo} from "react";

const WideScreenAboutTop = () => {
	const v = useMemo(() => {
		return updateObj[updateObj.length - 1]['v']
	}, [updateObj])
	return <>
		<div css={WideScreenAboutTop_css}>
			<div className="left">
				<div className="logo_frame">
					<img src={logo} alt=""/>
				</div>
				<div className="text_logo_frame">
					<img src={text_logo} alt=""/>
				</div>
			</div>
			<div className="right">
				<div className="title">版本号</div>
				<div className="content">{v}</div>
				<div style={{width: "100%", height: 15}}></div>

				<div className="title">备案信息</div>
				<div className="content">{infos.reg}</div>
			</div>
		</div>

	</>
}

export default WideScreenAboutTop

const WideScreenAboutTop_css = css({
	// backgroundColor: googleColors.gray200,
	...cssPresets.flexCenter,
	gap: 20,
	flexWrap: "wrap",
	"& .left": {
		...cssFunctions.px(20),
		"& .logo_frame": {
			userSelect: "none",
			width: "100%",
			height: 50,
			marginTop: 40,
			marginBottom: 10,
			...cssPresets.flexCenter,
			"& img": {
				width: "100%",
				height: "100%",
				userSelect: "none",
			}
		},
		"& .text_logo_frame": {
			userSelect: "none",
			width: "100%",
			// the font size of the logo:
			height: 50,
			...cssPresets.flexCenter,
			marginBottom: 20,
			"& img": {
				width: "100%",
				height: "100%",
				userSelect: "none",
			}
		},
		"& .items": {
			...cssPresets.flexCenter,
			flexWrap: "wrap",
			userSelect: "none",
		},
	},
	"& .right": {
		width: 220,
		paddingTop: 10,
		// backgroundColor: googleColors.gray200,
		...cssPresets.flexCenterColumn as any,
		"& .title": {
			color: googleColors.blue800,
			marginBottom: 5,
			fontSize: 13,
			...cssFunctions.px(15),
			// borderLeft:`6px solid ${googleColors.blue800}`,
			backgroundColor: googleColors.blue50,
			borderRadius: 999,
			...cssFunctions.py(3)
		},
		"& .content": {
			...cssFunctions.px(6),
			...cssFunctions.py(2),
			fontSize: 14,
			color: googleColors.gray800,
			// borderLeft:`6px solid ${googleColors.blue200}`,
			// backgroundColor:googleColors.gray100
		}
	}

})
