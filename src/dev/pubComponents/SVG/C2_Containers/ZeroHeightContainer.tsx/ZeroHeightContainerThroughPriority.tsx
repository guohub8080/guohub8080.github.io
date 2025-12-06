import SectionEx from '../../../PureHTML/basicEx/SectionEx.tsx'
import type { CSSProperties, ReactNode } from 'react'

/**
 * 零高度容器（事件穿透 + 强制优先级版）
 *
 * 该组件结合了事件穿透和强制优先级两种特性：
 * - **事件穿透**：`pointer-events: none` 使点击事件穿透到下层元素
 * - **强制优先级**：`transform: scale(1)` 和 `isolation: isolate` 创建新的层叠上下文，确保元素在渲染层级中的优先显示
 *
 * @example
 * ```tsx
 * <ZeroHeightContainerThroughPriority mpCss={marginPaddingStyles}>
 *   <img src="overlay.png" />
 * </ZeroHeightContainerThroughPriority>
 * ```
 *
 * 应用场景：
 * - 需要显示在最上层但不阻挡交互的装饰元素
 * - 优先级高的水印或遮罩效果
 * - 解决层叠上下文冲突问题
 */
const ZeroHeightContainerThroughPriority = (props: {
    children: ReactNode
    mpCss: CSSProperties
}) => {
    return (
        <SectionEx
            data-label="zero-height-container-through-priority"
            style={{ ...props.mpCss, ...outerStyle }}
        >
            <section style={innerStyleThroughPriority}>
                {props.children}
            </section>
        </SectionEx>
    )
}

export default ZeroHeightContainerThroughPriority

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
 * 内层容器样式（事件穿透 + 强制优先级版）：
 * - 高度设为 0、行高 0，宽度 100%
 * - marginTop 为 0
 * - **事件穿透**：`pointerEvents: 'none'` 使事件穿透
 * - **强制优先级**：`transform: 'scale(1)'` 触发硬件加速并创建新的层叠上下文
 * - **隔离渲染**：`isolation: 'isolate'` 创建独立的层叠上下文，防止被其他元素覆盖
 */
const innerStyleThroughPriority: CSSProperties = {
    textAlign: 'center',
    height: 0,
    lineHeight: 0,
    width: '100%',
    marginTop: 0,
    transform: 'scale(1)',
    pointerEvents: 'none',
    isolation: 'isolate',
}

