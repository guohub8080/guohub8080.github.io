/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import { CSSProperties } from "react";
import SeamlessImg from "../../C1_Standard/SeamlessImg";

const TouchSlideX = (props: {
	pics: { url: string, isTouchable?: boolean, mt?: number, mb?: number, ml?: number, mr?: number }[]
	viewBoxW: number
	viewBoxH: number
	isReverse: boolean
	mpResult: CSSProperties
}) => {
	const pics = props.pics;
	const slideCount = Math.max(1, pics.length);
	const slideWidthPercent = slideCount * 100;

	// 动态样式
	const rootStyle: CSSProperties = {
		...rootBaseStyle,
		...props.mpResult
	};

	const viewportStyle: CSSProperties = {
		...viewportBaseStyle,
		direction: props.isReverse ? "rtl" : "ltr"
	};

	const trackStyle: CSSProperties = {
		...trackBaseStyle,
		flex: `0 0 ${slideWidthPercent}%`,
		maxWidth: `${slideWidthPercent}%`
	};

	const itemStyle: CSSProperties = {
		...itemBaseStyle,
		flex: `0 0 ${100 / slideCount}%`
	};

	return (
		<SectionEx style={rootStyle} data-label={props.isReverse ? "touch-slide-horizontal-reverse" : "touch-slide-horizontal"}>
			<SectionEx style={viewportStyle}>
				<SectionEx style={trackStyle} important={[["width", `${slideWidthPercent}%`], ["max-width", `${slideWidthPercent}%`]]}>
					{pics.map((x, i) => {
						const svgStyle: CSSProperties = {
							backgroundImage: svgURL(x.url),
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							display: "inline",
							lineHeight: 0,
							marginTop: x.mt,
							marginBottom: x.mb,
							marginLeft: x.ml,
							marginRight: x.mr,
						};
						return (
							<SectionEx key={i} style={itemStyle}>
								{x.isTouchable ? (
									<SeamlessImg url={x.url} mp={{
										mt: x.mt,
										mb: x.mb,
										ml: x.ml,
										mr: x.mr
									}} />
								) : (
									<SvgEx
										viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
										style={svgStyle}
										width="100%"
										preserveAspectRatio="xMinYMin meet"
									/>
								)}
							</SectionEx>
						);
					})}
				</SectionEx>
			</SectionEx>
		</SectionEx>
	);
}

export default TouchSlideX;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
	WebkitTouchCallout: "none",
	userSelect: "text",
	overflow: "hidden",
	textAlign: "center",
	lineHeight: 0
};

const viewportBaseStyle: CSSProperties = {
	width: "100%",
	display: "block",
	verticalAlign: "top",
	overflow: "scroll hidden",
	boxSizing: "border-box",
	pointerEvents: "painted" as unknown as CSSProperties["pointerEvents"],
	WebkitOverflowScrolling: "touch",
	marginTop: 1,
	lineHeight: 0
};

const trackBaseStyle: CSSProperties = {
	display: "flex",
	flexDirection: "row",
	overflow: "hidden",
	boxSizing: "border-box",
	whiteSpace: "nowrap",
	lineHeight: 0
};

const itemBaseStyle: CSSProperties = {
	display: "inline-block",
	verticalAlign: "top",
	boxSizing: "border-box"
};
