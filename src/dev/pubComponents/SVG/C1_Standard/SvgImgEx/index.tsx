import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts"
import byDefault from "../../../../utils/common/byDefault.ts"
import NormalSvgImg from "./NormalSvgImg.tsx"
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx"
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react"
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts"
import UnpopButCanLongPress from "./UnpopButCanLongPress.tsx"
import OnlyDisplayImg from "./OnlyDisplayImg.tsx"
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx"


const SvgImgEx = (props: {
    url?: string
    isPopAllowed?: boolean
    isLongPressedRecongitionAllowed?: boolean
    mp?: mpProps,
    style?: CSSProperties
    w?: number
    h?: number
}) => {
    const mpResult = mpGet(byDefault(props.mp, mpBlank))
    const url = byDefault(props.url, getTextImgPic1(300, 400, "pic"))
    const isPopAllowed = byDefault(props.isPopAllowed, true)
    const isLongPressedRecongitionAllowed = byDefault(props.isLongPressedRecongitionAllowed, true)

    //获取size，如果svg定位需要size
    const imgSize = getImgSizeByDefault(url, props.w, props.h)
    //普通的图片，允许点击弹出，也允许长按保存。
    if (isPopAllowed) {
        return <SectionEx
            data-label="svg-img-ex-popable"
            important={[["max-width", "100%"], ["width", "100%"], ["height", "auto"],["line-height","0"],["font-size","0"]]}
            style={{ ...mpResult, ...props.style,fontSize:0,lineHeight:0 }} >
            <NormalSvgImg url={url} />
        </ SectionEx>
    }

    // 不允许点击弹出但允许长按保存。
    if (!isPopAllowed && isLongPressedRecongitionAllowed) {
        return <SectionEx
            data-label="svg-img-ex-long-press-only"
            important={[["max-width", "100%"], ["width", "100%"], ["height", "auto"]]}
            style={{ ...mpResult, ...props.style }} >
            <UnpopButCanLongPress url={url} w={imgSize.w} h={imgSize.h} />
        </ SectionEx>
    }

    // 不允许点击弹出也不允许长按保存，就是仅展示的固态图片了。
    return <SectionEx
        data-label="svg-img-ex-display-only"
        important={[["max-width", "100%"], ["width", "100%"], ["height", "auto"]]}
        style={{ ...mpResult, ...props.style }} >
        <OnlyDisplayImg url={url} w={imgSize.w} h={imgSize.h} />
    </ SectionEx>
}

export default SvgImgEx

