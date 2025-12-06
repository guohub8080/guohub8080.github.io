/* eslint-disable no-mixed-spaces-and-tabs */
import byDefault from "../../../../utils/common/byDefault.ts";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import { CSSProperties, useMemo } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import CarouselPicOne from "./CarouselPicOne.tsx";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import { getEaseBezier } from "@/dev/utils/getBezier/getEaseBezier.ts";

/**
 * 轮播图组件
 * 支持左右上下四个方向的轮播动画
 */
const Carousel = (props: {
    pics?: { url: string, isTouchable?: boolean }[]
    duration?: number
    direction?: "L" | "R" | "T" | "B"
    viewBoxW?: number
    viewBoxH?: number
    mp?:mpProps
    keySplines?: string  // 贝塞尔曲线，例如 "0.42 0 0.58 1"（ease-in-out）
}) => {
    const duration = byDefault(props.duration, 3)
    const comp_mpResult= mpGet(byDefault(props.mp, mpBlank))
    const keySplines = byDefault(props.keySplines, getEaseBezier({isIn:true,isOut:true}))
    
    // 方向：向左/向右/向上/向下
    let direction = byDefault(props.direction, "L")
    if (!["L", "R", "T", "B"].includes(props.direction)) direction = "L"

    // 因为滚动至少需要3张图，所以如果没有输入图或者只输入一张图，那么就自动复制一份变成两张
    const pics = useMemo(() => {
        const middleValue = byDefault(props.pics, false)
        if (middleValue && middleValue.length > 1) return middleValue.map((x) => {
            return {url: x.url, isTouchable: byDefault(x?.isTouchable, false)}
        })
        if (middleValue && middleValue.length === 1) return [...middleValue, ...middleValue].map((x => {
            return {url: x.url, isTouchable: byDefault(x?.isTouchable, false)}
        }))
        return [{url: getTextImgPic1(600, 800, "Carousel"), isTouchable: false},
            {url: getTextImgPic1(600, 800, "Carousel"), isTouchable: false},
        ]
    }, [props.pics])
    

    // 获取基准图片的真实尺寸（宽高，按照第一张图片的尺寸）
    const imgSizeAsViewBox = getImgSizeByDefault(pics[0].url, props.viewBoxW, props.viewBoxH)
    
    
    const rootStyle: CSSProperties = {
        ...frameStyle,
        ...comp_mpResult
    };

    return <SectionEx data-label="carousel" style={rootStyle}>
        <SectionEx style={{overflow: "hidden", lineHeight: 0, margin: 0}}>
            <SvgEx viewBox={`0 0 ${imgSizeAsViewBox.w} ${imgSizeAsViewBox.h}`}
                 style={{display: "block", margin: "0 auto",}} width="100%">
                {pics.map((x, y) => {
                    return <CarouselPicOne key={y} viewBoxW={imgSizeAsViewBox.w}
                                       viewBoxH={imgSizeAsViewBox.h}
                                       url={x.url} duration={duration}
                                       currentIndex={y} lastIndex={pics.length - 1}
                                       isTouchable={x.isTouchable}
                                       direction={direction}
                                       keySplines={keySplines}/>
                })}
            </SvgEx>
        </SectionEx>
    </SectionEx>
}

export default Carousel;


/** ================================================== Styles ===================================================== */
const frameStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
    marginBottom: 0,
};

