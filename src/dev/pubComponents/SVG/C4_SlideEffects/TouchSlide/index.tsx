/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useMemo } from "react";
import byDefault from "../../../../utils/common/byDefault.ts";
import TouchSlideT from "./TouchSlideT.tsx";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import { range } from "lodash";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import TouchSlideX from "./TouchSlideX.tsx";
import TouchSlideB from "./TouchSlideB.tsx";


const TouchSlide = (props: {
	pics?: { url: string, isTouchable?: boolean, mt?: number, mb?: number, ml?: number, mr?: number }[]
	viewBoxW?: number
	viewBoxH?: number
	isX?: boolean
	isY?: boolean
	isReverse?: boolean
	mp?: mpProps
}) => {
	let isX = byDefault(props.isX, false);
	const isY = byDefault(props.isY, false);
	const isReverse = byDefault(props.isReverse, false);
	//X方向优先
	if (!isX && !isY) { isX = true }

	const comps_mp = mpGet(byDefault(props.mp, mpBlank));

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

	// 公共：根据 viewBoxBase 与图片尺寸推导最终 viewBox 尺寸（允许 props 覆盖）

	const resolvedViewBox = getImgSizeByDefault(normalizedPics[0].url, props.viewBoxW, props.viewBoxH);
	if (isX) {
		return (
			<TouchSlideX pics={normalizedPics}
				viewBoxW={resolvedViewBox.w}
				viewBoxH={resolvedViewBox.h}
				mpResult={comps_mp}
				isReverse={isReverse}
			/>
		);
	}
	if (isReverse) return (<TouchSlideB pics={normalizedPics}
		viewBoxW={resolvedViewBox.w}
		viewBoxH={resolvedViewBox.h}
		mpResult={comps_mp}
	/>

	)
	return (
		<TouchSlideT pics={normalizedPics}
			viewBoxW={resolvedViewBox.w}
			viewBoxH={resolvedViewBox.h}
			mpResult={comps_mp}
		/>
	);

}

export default TouchSlide;
