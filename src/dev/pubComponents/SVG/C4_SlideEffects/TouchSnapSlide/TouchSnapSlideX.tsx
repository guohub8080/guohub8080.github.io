/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import { CSSProperties, useMemo } from "react";
import svgURL from "../../../PubUtils/common/svgURL.ts";

const TouchSnapSlideX = (props: {
	pics: { url: string, isTouchable?: boolean, mt?: number, mb?: number, ml?: number, mr?: number }[]
	viewBoxW: number
	viewBoxH: number
	snap: "start" | "middle" | "end"
	isReverse: boolean
	mpResult: CSSProperties
}) => {
	const containerWidthPercent = useMemo(() => Math.max(1, props.pics.length) * 100, [props.pics.length]);

	// 动态样式
	const rootStyle: CSSProperties = {
		...rootBaseStyle,
		...props.mpResult
	};

	const viewportStyle: CSSProperties = {
		...viewportBaseStyle,
		direction: (props.isReverse ? "rtl" : "ltr") as unknown as CSSProperties["direction"]
	};

	return (
		<SectionEx style={rootStyle} data-label={props.isReverse ? "snap-slide-horizontal-reverse" : "snap-slide-horizontal"}>
			<SectionEx style={viewportStyle}>
				<SectionEx style={trackStyle} important={[["width", `${containerWidthPercent}%`], ["max-width", `${containerWidthPercent}%`]]}>
					{props.pics.map((pic, idx) => {
						const itemStyle: CSSProperties = {
							...itemBaseStyle,
							scrollSnapAlign: props.snap,
							marginTop: pic.mt,
							marginBottom: pic.mb,
							marginLeft: pic.ml,
							marginRight: pic.mr
						};
						const svgStyle: CSSProperties = {
							backgroundImage: svgURL(pic.url),
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							display: "inline",
							lineHeight: 0,
							width: "100%"
						};
						return (
							<SectionEx key={idx} style={itemStyle}>
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

export default TouchSnapSlideX;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
	WebkitTouchCallout: "none",
	userSelect: "text",
	overflow: "hidden",
	textAlign: "center",
	lineHeight: 0
};

const viewportBaseStyle: CSSProperties = {
	overflowX: "scroll",
	overflowY: "hidden",
	isolation: "isolate" as any,
	scrollSnapType: "x mandatory" as any,
	scrollBehavior: "smooth" as any,
	lineHeight: 0
};

const trackStyle: CSSProperties = {
	whiteSpace: "nowrap" as any,
	display: "flex",
	lineHeight: 0
};

const itemBaseStyle: CSSProperties = {
	flex: 1,
	verticalAlign: "top"
};

