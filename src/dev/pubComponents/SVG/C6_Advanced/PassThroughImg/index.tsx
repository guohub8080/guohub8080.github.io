import type { CSSProperties } from "react"
import getWechat300x300 from "../../../../api/placeHolderPic/getWechat300x300.ts"
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts"
import byDefault from "../../../../utils/common/byDefault.ts"
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx"
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx"
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx"
import svgURL from "../../../PubUtils/common/svgURL.ts"
/**
 * 穿透图片组件
 * 
 * @param url - 图片地址
 * @param w - 图片宽度
 * @param h - 图片高度
 * @param isNaturalPriority - 是否启用自然优先级模式
 *   - false (默认): 使用 transform: scale(1) 和 margin: 0，适合需要动画的场景
 *   - true: 使用 margin: 0，更自然的布局（无 transform）
 * @param isForceLoad - 是否强制加载模式
 *   - false (默认): 使用 SVG + backgroundImage
 *   - true: 使用原生 <img> 标签，强制立即加载图片，同时设置 src 和 data-src
 * 
 * 穿透原理：
 * 通过 pointer-events: none 使图片对点击事件"透明"
 * 用户点击时，事件会穿透图片，触发下层元素
 * 
 * 三种模式对比：
 * 
 * 1. 【默认模式】- 适合需要动画的场景
 *    - 图片渲染：SVG + backgroundImage
 *    - 内层样式：transform: scale(1), margin: 0
 *    - 加载方式：懒加载
 * 
 * 2. 【自然优先级模式】- 适合静态展示
 *    - 图片渲染：SVG + backgroundImage
 *    - 内层样式：margin: 0 (无 transform)
 *    - 加载方式：懒加载
 * 
 * 3. 【强制加载模式】- 适合首屏关键图片
 *    - 图片渲染：原生 <img> 标签
 *    - 内层样式：margin: 0
 *    - 加载方式：立即加载（src + data-src）
 * 
 * 与 BgImg 组件的核心区别：
 * 
 * 1. 【点击穿透】
 *    - BgImg: 无穿透，可正常交互
 *    - PassThroughImg: 双层 pointer-events: none，完全穿透
 * 
 * 2. 【内层容器样式】
 *    - BgImg: height: 0, textAlign: 'center', margin: '0px auto', width: '100%'
 *    - PassThroughImg (默认): display: 'block', transform: 'scale(1)', margin: 0
 *    - PassThroughImg (自然优先级): display: 'block', margin: 0
 *    - PassThroughImg (强制加载): display: 'block', margin: 0
 * 
 * 3. 【图片渲染方式】
 *    - BgImg: SVG + backgroundImage
 *    - PassThroughImg (默认/自然): SVG + backgroundImage
 *    - PassThroughImg (强制加载): 原生 <img>
 * 
 * 使用场景：
 * - 在可点击元素上覆盖装饰图，但不阻止点击
 * - 制作浮水印效果，保持下层内容可交互
 * - 首屏关键图片需要立即加载（强制加载模式）
 */
const PassThroughImg = (props: {
    url?: string
    w?: number
    h?: number
    isNaturalPriority?: boolean
    isForceLoad?: boolean
    mp?: mpProps
}) => {
    const url = byDefault(props.url, getWechat300x300(1))
    const imgSize = getImgSizeByDefault(url, props.w, props.h)
    const isNaturalPriority = byDefault(props.isNaturalPriority, false)
    const isForceLoad = byDefault(props.isForceLoad, false)
    const mpResult = mpGet(byDefault(props.mp, mpBlank))

    const svgStyle: CSSProperties = {
        ...svgBaseStyle,
        backgroundImage: svgURL(url)
    }

    const rootStyleAfterMp = {
        ...rootStyle,
        ...mpResult
    }

    if (isNaturalPriority) {
        return (
            <SectionEx data-label="passthrough-image-natural-priority" style={rootStyleAfterMp}>
                <section style={innerSectionNaturalStyle}>
                    <SvgEx style={svgStyle} viewBox={`0 0 ${imgSize.w} ${imgSize.h}`} />
                </section>
            </SectionEx>
        )
    }

    if (isForceLoad) {
        return (
            <SectionEx data-label="passthrough-image-force-load" style={rootStyleAfterMp}>
                <section style={innerSectionForceLoadStyle}>
                    <img
                        data-src={url}
                        src={url}
                        style={imgStyle}
                        alt=""
                    />
                </section>
            </SectionEx>
        )
    }

    return (
        <SectionEx data-label="passthrough-image" style={rootStyleAfterMp}>
            <section style={innerSectionStyle}>
                <SvgEx style={svgStyle} viewBox={`0 0 ${imgSize.w} ${imgSize.h}`} />
            </section>
        </SectionEx>
    )
}

export default PassThroughImg




/**  ================================================== Style ===================================================== */
const rootStyle: CSSProperties = {
    WebkitTouchCallout: 'none',
    userSelect: 'text',
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 0
}

// 默认模式：内层 section 样式（带 transform 动画预留）
const innerSectionStyle: CSSProperties = {
    lineHeight: 0,
    display: 'block',
    pointerEvents: 'none',
    transform: 'scale(1)',
    margin: 0
}

// 自然优先级模式：内层 section 样式
const innerSectionNaturalStyle: CSSProperties = {
    lineHeight: 0,
    display: 'block',
    pointerEvents: 'none',
    margin: 0
}

// 强制加载模式：内层 section 样式
const innerSectionForceLoadStyle: CSSProperties = {
    lineHeight: 0,
    display: 'block',
    pointerEvents: 'none',
    margin: 0
}

const svgBaseStyle: CSSProperties = {
    pointerEvents: 'none',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    display: 'inline',
    lineHeight: 0
}

// 强制加载模式：img 标签样式
const imgStyle: CSSProperties = {
    width: '100%',
    pointerEvents: 'none'
}
