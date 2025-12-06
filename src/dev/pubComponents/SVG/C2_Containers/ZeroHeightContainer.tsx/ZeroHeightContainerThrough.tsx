import SectionEx from '../../../PureHTML/basicEx/SectionEx.tsx'
import type { CSSProperties, ReactNode } from 'react'

/**
 * 零高度容器（事件穿透版）
 *
 * 该组件是 ZeroHeightContainer 的变体，专门用于需要事件穿透的场景。
 * 内层设置 `pointer-events: none`，使得点击/触摸事件可以穿透到下层元素。
 *
 * @example
 * ```tsx
 * <ZeroHeightContainerThrough mpCss={marginPaddingStyles}>
 *   <img src="overlay.png" />
 * </ZeroHeightContainerThrough>
 * ```
 *
 * 应用场景：
 * - 覆盖层装饰图片，不阻挡底层交互
 * - 水印或遮罩效果
 * - 需要视觉展示但不影响用户操作的元素
 */
const ZeroHeightContainerThrough = (props: {
    children: ReactNode
    mpCss: CSSProperties
}) => {
    return (
        <SectionEx data-label="zero-height-container-through"
            style={{ ...props.mpCss, ...outerStyle }}
        >
            <section style={innerStyleThrough}>
                {props.children}
            </section>
        </SectionEx>
    )
}

export default ZeroHeightContainerThrough

/** ================================================== Style ===================================================== */

/**
 * 外层容器样式：
 * - 禁用 iOS 长按呼出菜单
 * - 允许文本选择
 * - 居中对齐，隐藏溢出
 * - 行高置 0 避免垂直间距
 */
const outerStyle: CSSProperties = {
    WebkitTouchCallout: 'none',
    userSelect: 'text',
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 0,
}

/**
 * 内层容器样式（事件穿透版）：
 * - 高度设为 0、行高 0，宽度 100%
 * - marginTop 为 0（与普通版本的 -1 不同）
 * - 溢出可见
 * - **关键**：`pointerEvents: 'none'` 实现事件穿透
 */
const innerStyleThrough: CSSProperties = {
    textAlign: 'center',
    height: 0,
    lineHeight: 0,
    width: '100%',
    margin: '0 auto',
    marginTop: 0,
    pointerEvents: 'none',
}

