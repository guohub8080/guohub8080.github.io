/* eslint-disable no-mixed-spaces-and-tabs */
import {useEffect, useRef} from "react";
import BetterQRCode from "../../../SVG/C1_Standard/BetterQRCode";

const qrCode_src = "https://mmbiz.qpic.cn/sz_mmbiz_png/S6lhSUeSxeNRW0Al25iaiavZicTVOX5ruIF5SD9xZRIicz2PGLVanl0ibsaBwMrdsflYJxAo7s2vcxX159rCCic5Rosg/0?wx_fmt=png&from=appmsg"
const aiecoText = "https://mmbiz.qpic.cn/sz_mmbiz_png/S6lhSUeSxeO6OeSRRuJmicE7L7lkOZZbgfH1JyJMdaEDedHdjhF1LwDnt6HRBDpsVGPBZhHL5tcEzQujHMg0Rog/640?wx_fmt=png&from=appmsg"


const FootAIECOWithoutTop = () => {
	const qrcodeSize = 140
	const footRadius = 10
	const ref = useRef()
	useEffect(() => {
		if (ref.current) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			ref.current?.style.setProperty("max-width", "330px", "important")
		}
	}, [])
	return <section>
		<section style={{
			backgroundColor: "#f3f4f6",
			width: "100%",
			paddingBottom: 50,
			paddingTop: 50,
			margin: "0 auto",
			borderRadius: footRadius,
			borderWidth: 1,
			borderStyle: "solid",
			boxSizing: "border-box",
			borderColor: "#d1d5db",
			borderTop: 0,
			borderTopLeftRadius: 0,
			borderTopRightRadius: 0
		}}>
			<section style={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center"
			}}>
				{/*AIECO中英文名称*/}
				<section style={{
					paddingLeft: 30,
					paddingRight: 30,
					width: "100%",
					display: "flex",
					justifyContent: "center"
				}}>
					<img src={aiecoText} alt="" referrerPolicy="no-referrer" ref={ref}
					     style={{width: "100%", margin: "0 auto"}}/>
				</section>
				<section style={{
					width: qrcodeSize + 20,
					height: qrcodeSize + 20,
					padding: 10,
					backgroundColor: "white",
					borderRadius: 8,
					marginBottom: 30,
					marginTop: 30,
					boxShadow: "0px 0px 15px #EcEcEc"
				}}>
					<BetterQRCode url={qrCode_src} />
				</section>


			</section>
			<section style={{width: "100%", marginTop: 25}}>
				<p style={{textAlign: "center", fontSize: 14, color: "#8d8d8d", marginBottom: 5, fontWeight: 700}}>
					<strong>更多资讯请关注微信公众号</strong>
				</p>
				<p style={{textAlign: "center", fontSize: 14, color: "#8d8d8d", marginBottom: 5}}>
					官方网站：aieco.org.cn
				</p>
				<p style={{textAlign: "center", fontSize: 14, color: "#8d8d8d", marginBottom: 5}}>
					投稿邮箱：tg@aieco.org.cn
				</p>

			</section>
		</section>
	</section>
}
export default FootAIECOWithoutTop
