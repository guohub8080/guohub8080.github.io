/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import { CSSProperties } from "react";
import SeamlessImg from "../../C1_Standard/SeamlessImg";

const TouchSlideB = (props: {
	pics?: { url: string, isTouchable?: boolean, mt?: number, mb?: number, ml?: number, mr?: number }[]
	viewBoxW: number
	viewBoxH: number
	mpResult: CSSProperties
}) => {
	const pics = props.pics;

	// 动态样式
	const rootStyle: CSSProperties = {
		...rootBaseStyle,
		...props.mpResult
	};

	const verticalBoxStyle: CSSProperties = {
		width: "100%",
		aspectRatio: `${props.viewBoxW}/${props.viewBoxH}`,
		overflow: "hidden",
		lineHeight: 0
	};

	const viewportStyle: CSSProperties = {
		...viewportBaseStyle,
		transform: "rotate(180deg)",
		transformOrigin: "center center"
	};

	const itemStyle: CSSProperties = {
		...itemBaseStyle,
		height: "100%",
		transform: "rotate(180deg)",
		transformOrigin: "center center"
	};

	return (
		<SectionEx style={rootStyle} data-label="touch-slide-vertical-reverse">
			<SectionEx style={verticalBoxStyle}>
				<section style={viewportStyle as any}>
					<SectionEx style={trackStyle}>
						{pics.map((x, i) => {
							const isLast = i === pics.length - 1;
							const svgStyle: CSSProperties = {
								backgroundImage: svgURL(x.url),
								backgroundSize: (isLast ? "100% auto" : "100%") as any,
								backgroundRepeat: "no-repeat",
								display: "block",
								lineHeight: 0,
								transform: "scale(1)",
								marginTop: x.mt,
								marginBottom: x.mb,
								marginLeft: x.ml,
								marginRight: x.mr,
								height: "100%"
							};
							return (
								<SectionEx key={i} style={itemStyle}>
									{x.isTouchable ? (
										<SeamlessImg url={x.url}
											mp={{
												mt: x.mt,
												mb: x.mb,
												ml: x.ml,
												mr: x.mr
											}}
										/>
									) : (
										<SvgEx viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
											style={svgStyle}
											width="100%"
											preserveAspectRatio="xMinYMin meet"
										/>
									)}
								</SectionEx>
							);
						})}
					</SectionEx>
				</section>
			</SectionEx>
		</SectionEx>
	);
}

export default TouchSlideB;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
	WebkitTouchCallout: "none",
	userSelect: "text",
	overflow: "hidden",
	textAlign: "center",
	lineHeight: 0
};

const viewportBaseStyle: CSSProperties = {
	lineHeight: 0,
	margin: 0,
	overflow: "overlay",
	width: "100%",
	height: "100%",
	visibility: "visible",
	marginTop: 0,
	WebkitOverflowScrolling: "touch"
};

const trackStyle: CSSProperties = {
	display: "block",
	boxSizing: "border-box",
	width: "100%",
	overflow: "hidden",
	whiteSpace: "normal"
};

const itemBaseStyle: CSSProperties = {
	display: "block",
	width: "100%",
	boxSizing: "border-box"
};
