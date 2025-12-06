/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, ReactNode } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import byDefault from "../../../../utils/common/byDefault.ts";

/**
 * 底部对齐容器
 * 通过双层 180 度旋转实现内容底部对齐到容器位置
 * 容器本身高度为 0，内容向上溢出
 * 
 * @description
 * 适用于需要将装饰性内容的底部精确对齐到某个位置的场景。
 * 例如：分隔线、装饰图案等。
 */
const BottomAlignedContainer = (props: {
	children?: ReactNode
	mp?: mpProps
}) => {
	const mpResult = mpGet(byDefault(props.mp, mpBlank))

	const rootStyle: CSSProperties = {
		...rootBaseStyle,
		...mpResult
	};

	return (
		<SectionEx data-label="bottom-aligned-container" style={rootStyle}>
			<section style={outerRotateStyle}>
				<section style={innerRotateStyle}>
					{props.children}
				</section>
			</section>
		</SectionEx>
	);
};

export default BottomAlignedContainer;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
	WebkitTouchCallout: "none",
	userSelect: "text",
	overflow: "hidden",
	textAlign: "center",
	lineHeight: 0,
};

const outerRotateStyle: CSSProperties = {
	textAlign: "center",
	height: 0,
	lineHeight: 0,
	width: "100%",
	margin: "0px auto",
	transform: "rotate(180deg)",
	pointerEvents: "none",
};

const innerRotateStyle: CSSProperties = {
	transform: "rotate(180deg)",
	pointerEvents: "none",
};

