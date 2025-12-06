/* eslint-disable no-mixed-spaces-and-tabs */
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import byDefault from "../../../../utils/common/byDefault.ts";
import { range } from "lodash";
import { useMemo } from "react";
import TouchSnapSlideX from "./TouchSnapSlideX.tsx";
import TouchSnapSlideT from "./TouchSnapSlideT.tsx";
import TouchSnapSlideB from "./TouchSnapSlideB.tsx";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";

/**
 * 触摸吸附滑动组件
 * 
 * @description
 * 支持横向和纵向吸附滑动的图片轮播组件。
 * 每次滑动会自动吸附到下一张图片，支持四个方向的滑动。
 * 
 * @example
 * ```tsx
 * // 基础用法（默认左滑）
 * <TouchSnapSlide pics={[
 *   { url: pic1 },
 *   { url: pic2 },
 *   { url: pic3 }
 * ]} />
 * 
 * // 右滑
 * <TouchSnapSlide direction="R" pics={[...]} />
 * 
 * // 向上滑动
 * <TouchSnapSlide direction="T" pics={[...]} />
 * 
 * // 自定义吸附位置（开始/中间/结束）
 * <TouchSnapSlide snap="start" pics={[...]} />
 * 
 * // 带边距
 * <TouchSnapSlide pics={[...]} mt={10} mb={10} />
 * ```
 * 
 * @param props - 组件属性
 * @param props.pics - 图片数组
 * @param props.viewBoxBase - 用于获取viewBox尺寸的图片索引，默认 0
 * @param props.viewBoxW - viewBox 宽度（可选，会自动从图片获取）
 * @param props.viewBoxH - viewBox 高度（可选，会自动从图片获取）
 * @param props.direction - 滑动方向："L"(左)、"R"(右)、"T"(上)、"B"(下)，默认 "L"
 * @param props.mt - 外边距上，默认 0
 * @param props.mb - 外边距下，默认 0
 * @param props.ml - 外边距左，默认 0
 * @param props.mr - 外边距右，默认 0
 * @param props.snap - 吸附位置："start"(开始)、"middle"(中间)、"end"(结束)，默认 "middle"
 * 
 * @returns React 组件
 */

export type TouchSnapSlideProps = {
	pics?: { url: string, isTouchable?: boolean, mt?: number, mb?: number, ml?: number, mr?: number }[]
	viewBoxW?: number
	viewBoxH?: number
	isX?: boolean
	isY?: boolean
	isReverse?: boolean
	mp?: mpProps
	snap?: "start" | "middle" | "end"
}

const TouchSnapSlide = (props: TouchSnapSlideProps) => {
	const snap = byDefault(props.snap, "middle");
	let isX = byDefault(props.isX, false);
	const isY = byDefault(props.isY, false);
	const isReverse = byDefault(props.isReverse, false);
	//X方向优先
	if (!isX && !isY) { isX = true }

	const comp_mpResult = mpGet(byDefault(props.mp, mpBlank));

	// 统一规范 pics：默认 3 张占位，字段补 0
	const normalizedPics = useMemo(() => {
		const middle = byDefault(props.pics, [] as { url: string, isTouchable?: boolean, mt?: number, mb?: number, ml?: number, mr?: number }[]);
		if (middle.length > 0) return middle.map(x => ({
			url: x.url,
			isTouchable: byDefault(x?.isTouchable, false),
			mt: byDefault(x?.mt, 0),
			mb: byDefault(x?.mb, 0),
			ml: byDefault(x?.ml, 0),
			mr: byDefault(x?.mr, 0),
		}));
		return range(3).map(i => ({
			url: getTextImgPic1(450, 750, `${i + 1}`),
			isTouchable: false,
			mt: 0, mb: 0, ml: 0, mr: 0,
		}));
	}, [props.pics]);


	const resolvedViewBox = getImgSizeByDefault(normalizedPics[0].url, props.viewBoxW, props.viewBoxH);

	// 横向 L/R 统一由 Horizontal 渲染
	if (isX) {
		return (<TouchSnapSlideX pics={normalizedPics}
			viewBoxW={resolvedViewBox.w}
			viewBoxH={resolvedViewBox.h}
			snap={snap}
			isReverse={isReverse}
			mpResult={comp_mpResult}
		/>
		);
	}

	// 纵向吸附：顶部（T）与底部（B，180°旋转）
	if (isReverse) {
		return (<TouchSnapSlideB
			pics={normalizedPics}
			viewBoxW={resolvedViewBox.w}
			viewBoxH={resolvedViewBox.h}
			mpResult={comp_mpResult}
			snap={snap}
		/>
		);
	}
	return (<TouchSnapSlideT
		pics={normalizedPics}
		viewBoxW={resolvedViewBox.w}
		viewBoxH={resolvedViewBox.h}
		mpResult={comp_mpResult}
		snap={snap}
	/>
	);
}

export default TouchSnapSlide;


