import type { CSSProperties } from "react";
import getWechat300x300 from "../../../../api/placeHolderPic/getWechat300x300.ts"
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts"
import byDefault from "../../../../utils/common/byDefault.ts"
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx"
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx"
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx"
import svgURL from "../../../PubUtils/common/svgURL.ts"

/**
 * 背景图片组件
 * 
 * @description
 * 用于展示背景图片的组件，宽高比例由图片尺寸决定。
 * 支持单张装饰性背景和纵向重复平铺的全局背景。
 * 
 * @example
 * ```tsx
 * // 基础用法（单张背景）
 * <BgImg url="https://example.com/bg.jpg" />
 * 
 * // 指定尺寸
 * <BgImg url="..." w={1080} h={650} />
 * 
 * // 全局背景（纵向重复）
 * <BgImg url="..." isGlobal={true} />
 * 
 * // 带边距
 * <BgImg url="..." mp={{ mt: 10, mb: 10 }} />
 * ```
 * 
 * @param props - 组件属性
 * @param props.url - 图片地址
 * @param props.w - 图片宽度，默认从图片获取
 * @param props.h - 图片高度，默认从图片获取
 * @param props.mp - 边距配置（marginTop, marginBottom, marginLeft, marginRight）
 * @param props.isGlobal - 是否为全局背景（纵向重复平铺），默认 false
 * 
 * @returns React 组件
 */
const BgImg = (props: {
    url?: string
    w?: number
    h?: number
    mp?: mpProps
    isGlobal?: boolean
}) => {
    const url = byDefault(props.url, getWechat300x300(1))
    const mpResult = mpGet(byDefault(props.mp, mpBlank))
    const imgSize = getImgSizeByDefault(url, props.w, props.h)
    const isGlobal = byDefault(props.isGlobal, false)

    return (
        <SectionEx
            data-label={isGlobal ? "global-background-image" : "background-image"}
            style={{ ...rootSectionStyle, ...mpResult }}
        >
            <section style={innerSectionStyle}>
                <SvgEx
                    style={{
                        ...svgBaseStyle,
                        backgroundImage: svgURL(url),
                        backgroundRepeat: isGlobal ? 'repeat-y' : 'no-repeat'
                    }}
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                />
            </section>
        </SectionEx>
    )
}

export default BgImg;

/** ================================================== Style ===================================================== */
const rootSectionStyle: CSSProperties = {
    WebkitTouchCallout: 'none',
    userSelect: 'text',
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 0
};

const innerSectionStyle: CSSProperties = {
    textAlign: 'center',
    height: 0,
    lineHeight: 0,
    width: '100%',
    margin: '0px auto'
};

const svgBaseStyle: CSSProperties = {
    backgroundSize: '100%',
    display: 'block'
};
