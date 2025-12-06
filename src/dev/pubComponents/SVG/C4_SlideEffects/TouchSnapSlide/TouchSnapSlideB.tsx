/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import { CSSProperties } from "react";
import svgURL from "../../../PubUtils/common/svgURL.ts";

const TouchSnapSlideB = (props: {
	pics: { url: string, isTouchable?: boolean, mt?: number, mb?: number, ml?: number, mr?: number }[]
	viewBoxW: number
	viewBoxH: number
	mpResult: CSSProperties
	snap: "start" | "middle" | "end"
}) => {

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

	return (
		<SectionEx style={rootStyle} data-label="snap-slide-vertical-reverse">
			<SectionEx style={verticalBoxStyle}>
				<SectionEx style={viewportBaseStyle} important={[["scroll-snap-type", "y mandatory"], ["overflow-y", "scroll"], ["height", "100%"], ["transform", "rotate(180deg)"], ["transform-origin", "center center"]]}>
					{props.pics.map((pic, idx) => {
						const itemStyle: CSSProperties = {
							...itemBaseStyle,
							scrollSnapAlign: props.snap
						};
						const svgStyle: CSSProperties = {
							backgroundImage: svgURL(pic.url),
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							display: "block",
							lineHeight: 0,
							width: "100%",
							height: "100%",
							marginTop: pic.mt,
							marginBottom: pic.mb,
							marginLeft: pic.ml,
							marginRight: pic.mr
						};
						return (
							<SectionEx key={idx} style={itemStyle} important={[["scroll-snap-align", props.snap],
							["height", "100%"], ["transform", "rotate(180deg)"], ["transform-origin", "center center"]]}>
								<SvgEx
									style={svgStyle}
									viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
								/>
							</SectionEx>
						);
					})}
				</SectionEx>
			</SectionEx>
		</SectionEx>
	);
}

export default TouchSnapSlideB;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
	WebkitTouchCallout: "none",
	userSelect: "text",
	overflow: "hidden",
	textAlign: "center",
	lineHeight: 0
};

const viewportBaseStyle: CSSProperties = {
	overflowY: "scroll",
	overflowX: "hidden",
	scrollSnapType: "y mandatory" as any,
	scrollBehavior: "smooth" as any,
	width: "100%",
	height: "100%",
	lineHeight: 0,
	transform: "rotate(180deg)",
	transformOrigin: "center center"
};

const itemBaseStyle: CSSProperties = {
	display: "block",
	width: "100%",
	height: "100%",
	boxSizing: "border-box",
	transform: "rotate(180deg)",
	transformOrigin: "center center"
};
