/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import byDefault from "../../../../utils/common/byDefault.ts";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import getWechat300x500 from "../../../../api/placeHolderPic/getWechat300x500.ts";
import { random, isNil } from "lodash";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";

/**
 * 滤镜图片组件 - 支持混合模式和多种滤镜效果
 * 
 * @param url - 图片 URL
 * @param viewBoxW - ViewBox 宽度
 * @param viewBoxH - ViewBox 高度
 * @param blendMode - 混合模式，默认为 'multiply'（正片叠底）
 * @param brightness0_2 - 亮度，默认 1（范围 0-2，1为原始亮度）
 * @param contrast0_2 - 对比度，默认 1（范围 0-2，1为原始对比度）
 * @param saturate0_2 - 饱和度，默认 1（范围 0-2，1为原始饱和度）
 * @param grayscale0_1 - 灰度，默认 0（范围 0-1，0为彩色，1为完全灰度）
 * @param sepia0_1 - 褐色，默认 0（范围 0-1，0为原色，1为完全褐色）
 * @param blurPx - 模糊，默认 0（单位 px）
 * @param hueRotate0_360 - 色相旋转，默认 0（单位 deg，范围 0-360）
 * @param invert0_1 - 反色，默认 0（范围 0-1，0为原色，1为完全反色）
 * @param opacity0_1 - 透明度，默认 1（范围 0-1）
 * @param mp - margin/padding 配置
 */
const FilterImg = (props: {
    url?: string
    viewBoxW?: number
    viewBoxH?: number
    // 混合模式
    blendMode?: 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'
    // 滤镜参数
    brightness0_2?: number    // 亮度 0-2
    contrast0_2?: number      // 对比度 0-2
    saturate0_2?: number      // 饱和度 0-2
    grayscale0_1?: number     // 灰度 0-1
    sepia0_1?: number         // 褐色 0-1
    blurPx?: number           // 模糊（px）
    hueRotate0_360?: number   // 色相旋转 0-360（deg）
    invert0_1?: number        // 反色 0-1
    opacity0_1?: number       // 透明度 0-1
    mp?: mpProps
}) => {
    const url = byDefault(props.url, getWechat300x500(random(1, 9)))
    const imgSize = getImgSizeByDefault(url, props.viewBoxW, props.viewBoxH)
    const mpResult = mpGet(byDefault(props.mp, mpBlank))
    const blendMode = byDefault(props.blendMode, 'multiply')

    // 构建 filter 字符串
    const filterParts: string[] = []
    if (!isNil(props.brightness0_2)) filterParts.push(`brightness(${props.brightness0_2})`)
    if (!isNil(props.contrast0_2)) filterParts.push(`contrast(${props.contrast0_2})`)
    if (!isNil(props.saturate0_2)) filterParts.push(`saturate(${props.saturate0_2})`)
    if (!isNil(props.grayscale0_1)) filterParts.push(`grayscale(${props.grayscale0_1})`)
    if (!isNil(props.sepia0_1)) filterParts.push(`sepia(${props.sepia0_1})`)
    if (!isNil(props.blurPx) && props.blurPx > 0) filterParts.push(`blur(${props.blurPx}px)`)
    if (!isNil(props.hueRotate0_360)) filterParts.push(`hue-rotate(${props.hueRotate0_360}deg)`)
    if (!isNil(props.invert0_1)) filterParts.push(`invert(${props.invert0_1})`)

    const filterString = filterParts.length > 0 ? filterParts.join(' ') : undefined

    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    };

    const svgStyle: CSSProperties = {
        ...svgBaseStyle,
        backgroundImage: svgURL(url),
        mixBlendMode: blendMode,
        filter: filterString,
        WebkitFilter: filterString,     // Safari/旧版 Chrome 兼容
        opacity: props.opacity0_1,
    };

    return (
        <SectionEx
            data-label="filter-img"
            style={rootStyle}
        >
            <SvgEx
                style={svgStyle}
                viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
            />
        </SectionEx>
    );
};

export default FilterImg;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
};

const svgBaseStyle: CSSProperties = {
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    display: "inline",
    lineHeight: 0,
    pointerEvents: "none", // 滤镜层不响应交互，成为纯视觉层
};

