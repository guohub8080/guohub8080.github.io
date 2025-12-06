import SectionEx from '../../../PureHTML/basicEx/SectionEx.tsx'
import { mpBlank, mpGet, mpProps } from '../../../../styles/funcs/mp.ts'
import byDefault from '../../../../utils/common/byDefault.ts'
import type { CSSProperties, ReactNode } from 'react'
import ZeroHeightContainerThrough from './ZeroHeightContainerThrough.tsx'
import ZeroHeightContainerThroughPriority from './ZeroHeightContainerThroughPriority.tsx'
import ZeroHeightContainerPriority from './ZeroHeightContainerPriority.tsx'
import ZeroHeightContainer3D from './ZeroHeightContainer3D.tsx'

/**
 * ZeroHeightContainer 组件的 Props。
 *
 * @property {ReactNode} children 必填。要在容器中渲染的内容。
 * @property {mpProps} [mp] 可选。用于快速设置 margin/padding 的样式输入（会被解析并合并到外层容器）。
 */


/*
 * 零高度容器：内层设置 height: 0，使其本身不占据垂直高度，
 * 通常用于 SVG/绝对定位内容的包裹场景；外层负责对齐、用户选择行为与溢出控制。
 */
const ZeroHeightContainer = (props: {

    children: ReactNode,
    mp?: mpProps
    isEventPassThrough?: boolean
    isForcePriority?: boolean
    is3d?: boolean
}) => {
    /** 由 mp 参数解析得到的 margin/padding 样式对象 */
    const mpResult = mpGet(byDefault(props.mp, mpBlank))
    const isEventPassThrough = byDefault(props.isEventPassThrough, false)
    const isForcePriority = byDefault(props.isForcePriority, false)
    const is3d = byDefault(props.is3d, false)

    // 事件穿透模式，但没有开启强制优先
    if (isEventPassThrough && !isForcePriority) {
        return <ZeroHeightContainerThrough mpCss={mpResult}>{props.children}</ZeroHeightContainerThrough>
    }

    // 事件穿透 + 强制优先
    if (isEventPassThrough && isForcePriority) {
        return <ZeroHeightContainerThroughPriority mpCss={mpResult}>{props.children}</ZeroHeightContainerThroughPriority>
    }

    // 仅强制优先
    if (!isEventPassThrough && isForcePriority) {
        return <ZeroHeightContainerPriority mpCss={mpResult}>{props.children}</ZeroHeightContainerPriority>
    }

    // 3D 变换
    if (is3d) {
        return <ZeroHeightContainer3D mpCss={mpResult}>{props.children}</ZeroHeightContainer3D>
    }

    // 其他组合（如强制优先等）暂时返回普通模式
    return (
        <SectionEx data-label="zero-height-container" style={{ ...mpResult, ...outerStyle }}>
            <section style={innerStyle}>
                {props.children}
            </section>
        </SectionEx>
    )
}

export default ZeroHeightContainer


/**  ================================================== Style ===================================================== */
/**
 * 外层 Section 的基础样式：
 * - 禁用 iOS 长按呼出菜单；
 * - 允许文本选择；
 * - 居中对齐，隐藏溢出；
 * - 行高置 0 以避免垂直方向意外间距。
 */
const outerStyle = {
    WebkitTouchCallout: 'none',
    userSelect: 'text',
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 0,
} as CSSProperties

/**
 * 内层 section：高度设为 0、行高 0，宽度 100%，溢出可见，以便其子内容自行决定实际可视高度。
 */
const innerStyle: CSSProperties = {
    textAlign: 'center',
    height: 0,
    lineHeight: 0,
    width: '100%',
    margin: '0 auto',
    overflow: 'visible',
    marginTop: 0,
}
