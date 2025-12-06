import getWechat300x300 from "../../../../api/placeHolderPic/getWechat300x300.ts"
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts"
import byDefault from "../../../../utils/common/byDefault.ts"
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx"
import SeamlessImg1 from "./SeamlessImg1.tsx"
import SeamlessImg2 from "./SeamlessImg2.tsx"
import SeamlessImg3 from "./SeamlessImg3.tsx"
import SeamlessImg4 from "./SeamlessImg4.tsx"
import SeamlessImg5 from "./SeamlessImg5.tsx"
import SeamlessImg6 from "./SeamlessImg6.tsx"
import SeamlessImg7 from "./SeamlessImg7.tsx"

/**
 * 无缝图组件 - 用于显示无缝背景图片，支持深色模式对抗
 * 
 * @description 
 * 根据不同的配置参数，返回6种不同的无缝图实现方式。
 * 优先级顺序（从高到低）：发布后可替换 > 强制可触摸 > 可弹出 > 事件穿透 > 自然优先级 > 默认深色对抗
 * 
 * @param {Object} props - 组件属性
 * @param {string} [props.url] - 图片URL，默认使用300x300占位图
 * @param {mpProps} [props.mp] - 公众号样式属性（margin, padding等）
 * @param {number} [props.w] - 图片宽度，默认为0（自动获取）
 * @param {number} [props.h] - 图片高度，默认为0（自动获取）
 * @param {boolean} [props.isReplaceableAfterPublish=false] - 是否支持发布后替换（使用data-src属性）- SeamlessImg6
 * @param {boolean} [props.isTouchForced=false] - 是否强制可触摸（pointerEvents: visible）- SeamlessImg5
 * @param {boolean} [props.isPopable=false] - 是否可弹出查看（使用foreignObject + img标签）- SeamlessImg4
 * @param {boolean} [props.isEventThrough=false] - 是否事件穿透（pointerEvents: none）- SeamlessImg3
 * @param {boolean} [props.isNaturalPriority=false] - 是否自然优先级（无transform）- SeamlessImg2
 * @param {boolean} [props.isLongPressOnly=false] - 是否仅支持长按识别（不可弹出但可长按保存）- SeamlessImg7
 * 
 * @returns {JSX.Element} 返回对应的无缝图组件
 * 
 * @example
 * // 默认深色对抗模式
 * <SeamlessImg url="https://example.com/image.jpg" />
 * 
 * @example
 * // 可弹出模式
 * <SeamlessImg url="https://example.com/image.jpg" isPopable={true} />
 * 
 * @example
 * // 发布后可替换模式
 * <SeamlessImg url="https://example.com/image.jpg" isReplaceableAfterPublish={true} />
 */
const SeamlessImg = (props: {
    url?: string
    mp?: mpProps
    w?: number
    h?: number
    isNaturalPriority?: boolean
    isEventThrough?: boolean
    isPopable?: boolean
    isTouchForced?: boolean
    isReplaceableAfterPublish?: boolean
    isLongPressOnly?: boolean
}) => {
    const mpResult = mpGet(byDefault(props.mp, mpBlank))
    const isNaturalPriority = byDefault(props.isNaturalPriority, false)
    const isEventThrough = byDefault(props.isEventThrough, false)
    const isPopable = byDefault(props.isPopable, false)
    const isTouchForced = byDefault(props.isTouchForced, false)
    const isReplaceableAfterPublish = byDefault(props.isReplaceableAfterPublish, false)
    const isLongPressOnly = byDefault(props.isLongPressOnly, false)


    //定义图片和尺寸
    const imgURL = byDefault(props.url, getWechat300x300(1))
    const imgSize = getImgSizeByDefault(imgURL, props.w, props.h)


    //仅长按识别 - SeamlessImg7
    if (isLongPressOnly) {
        return <SeamlessImg7 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //发布后可替换 - SeamlessImg6
    if (isReplaceableAfterPublish) {
        return <SeamlessImg6 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //强制可触摸 - SeamlessImg5
    if (isTouchForced) {
        return <SeamlessImg5 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //可弹出 - SeamlessImg4
    if (isPopable) {
        return <SeamlessImg4 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //事件穿透 - SeamlessImg3
    if (isEventThrough) {
        return <SeamlessImg3 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //自然优先级 - SeamlessImg2
    if (isNaturalPriority) {
        return <SeamlessImg2 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
    }
    //深色模式高亮（深色对抗，默认）- SeamlessImg1
    return <SeamlessImg1 w={imgSize.w} h={imgSize.h} url={imgURL} mpResult={mpResult} />
}

export default SeamlessImg
