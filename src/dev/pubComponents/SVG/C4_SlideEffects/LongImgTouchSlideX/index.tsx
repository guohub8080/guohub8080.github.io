
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import byDefault from "../../../../utils/common/byDefault.ts";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";

/**
 * 横向长图滑动组件
 * 
 * @description
 * 用于展示横向长图的可滑动组件。图片会被逆时针旋转90度显示，用户可以左右滑动查看完整内容。
 * 
 * **重要提示：** 
 * - 需要上传**横向的长图**（宽度 > 高度）
 * - 上传前请将图片**顺时针旋转90度**
 * - 组件会自动将图片逆时针旋转回来并支持横向滑动
 * 
 * @example
 * ```tsx
 * // 基础用法（默认露出25%）
 * <LongImgTouchSlideX url="https://example.com/long-image.jpg" />
 * 
 * // 露出50%的内容（需要滑动2屏）
 * <LongImgTouchSlideX url="..." exposedPercent={50} />
 * 
 * // 从右向左滑动
 * <LongImgTouchSlideX url="..." isReverse={true} />
 * 
 * // 带边距
 * <LongImgTouchSlideX 
 *   url="..." 
 *   mp={{ mt: 10, mb: 10 }} 
 * />
 * ```
 * 
 * @param props - 组件属性
 * @param props.url - 图片URL（需要是顺时针旋转90度后的横向长图）
 * @param props.exposedPercent - 默认露出的百分比（数字，如 25 表示 25%），默认值 25
 * @param props.isReverse - 是否反向滑动（true: 从右向左，false: 从左向右），默认 false
 * @param props.w - 图片宽度（像素），可选，会自动从图片获取
 * @param props.h - 图片高度（像素），可选，会自动从图片获取
 * @param props.mp - 边距配置（marginTop, marginBottom, marginLeft, marginRight）
 * 
 * @returns React 组件
 */
const LongImgTouchSlideX = (props: {
    url?: string
    mp?: mpProps
    w?: number
    h?: number
    exposedPercent?: number
    isReverse?: boolean
}) => {

    const exposedPercent = byDefault(props.exposedPercent, 25)  // 默认露出25%
    const isReverse = byDefault(props.isReverse, false)
    const imgURL = byDefault(props.url, LONG_PIC_WECHAT_EXAMPLE_URL)

    const imgSize = getImgSizeByDefault(imgURL, props.w, props.h)
    const mpResult = mpGet(byDefault(props.mp, mpBlank))

    // 将"露出百分比"转换为"实际slideW"
    // 公式：slideW = 100% / 露出比例
    const slideW = useMemo(() => {
        if (exposedPercent > 0) {
            return `${100 / exposedPercent * 100}%`
        }
        return "400%"
    }, [exposedPercent])


    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    }

    const scrollStyle: CSSProperties = {
        ...scrollBaseStyle,
        direction: isReverse ? "rtl" : "ltr"
    }

    const contentStyle: CSSProperties = {
        flex: "none",
        minWidth: slideW,
        width: slideW
    }

    const innerImgStyle: CSSProperties = {
        ...innerImgBaseStyle,
        backgroundImage: svgURL(imgURL)
    }

    return (<SectionEx data-label="long-img-touch-slide-x" style={rootStyle}>
        <section style={scrollStyle}>
            <section style={contentStyle}>
                <SectionEx important={[["min-width", "100%"], ["width", "100%"]]}
                    style={innerWrapperStyle}
                >
                    <SvgEx style={svgStyle} viewBox={`0 0 ${imgSize.h} ${imgSize.w}`}>
                        <g transform={`translate(0,${imgSize.w})`}>
                            <g transform="rotate(-90)">
                                <foreignObject width={imgSize.w} height={imgSize.h} x="0" y="0">
                                    <SvgEx style={innerImgStyle}
                                        viewBox={`0 0 ${imgSize.w} ${imgSize.h}`} />
                                </foreignObject>
                            </g>
                        </g>
                    </SvgEx>
                </SectionEx>
            </section>
        </section>
    </SectionEx>)

}

export default LongImgTouchSlideX;




/**  ================================================== Style ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0
}

const scrollBaseStyle: CSSProperties = {
    display: "flex",
    flexWrap: "nowrap",
    overflow: "scroll hidden",
    width: "100%",
    overscrollBehaviorX: "none",
    WebkitOverflowScrolling: "touch",
    margin: 0
}

const innerWrapperStyle: CSSProperties = {
    textAlign: "center",
    lineHeight: 0,
    pointerEvents: "none",
    transformStyle: "preserve-3d",
    marginTop: "0vw",
    transformOrigin: "center center",
    minWidth: "100%",
    width: "100%",
    direction: "ltr"
}

const svgStyle: CSSProperties = {
    display: "block",
    pointerEvents: "none"
}

const innerImgBaseStyle: CSSProperties = {
    overflow: "hidden",
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    pointerEvents: "none"
}

const LONG_PIC_WECHAT_EXAMPLE_URL = "https://mmbiz.qpic.cn/sz_mmbiz_jpg/plQCOAicD7wRTKicrj3ibj6qJ8IHz1nT8XUJibbFufcEOGwBJ2J576laXkpA9ZiaCJlT8U8wsIVfIGzYm5icB9nYBa7w/640?wx_fmt=jpeg&amp;from=appmsg"
