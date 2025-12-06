import SectionEx from '../../../PureHTML/basicEx/SectionEx.tsx'
import type { CSSProperties, ReactNode } from 'react'

/**
 * 零高度容器（仅强制优先级版）
 *
 * 该组件专注于强制优先级特性，不包含事件穿透功能。
 * 通过 `transform: scale(1)` 和 `isolation: isolate` 创建新的层叠上下文，
 * 确保元素在渲染层级中的优先显示，同时保留正常的事件交互能力。
 *
 * @example
 * ```tsx
 * <ZeroHeightContainerPriority mpCss={marginPaddingStyles}>
 *   <img src="important-content.png" />
 * </ZeroHeightContainerPriority>
 * ```
 *
 * 应用场景：
 * - 需要优先显示且可交互的内容
 * - 解决层叠上下文冲突，确保元素显示在上层
 * - 关键信息展示，需要触发硬件加速优化渲染性能
 */
const ZeroHeightContainerPriority = (props: {
    children: ReactNode
    mpCss: CSSProperties
}) => {
    return (
        <SectionEx
            data-label="zero-height-container-priority"
            style={{ ...props.mpCss, ...outerStyle }}
        >
            <section style={innerStylePriority}>
                {props.children}
            </section>
        </SectionEx>
    )
}

export default ZeroHeightContainerPriority

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
 * 内层容器样式（仅强制优先级版）：
 * - 高度设为 0、行高 0，宽度 100%
 * - marginTop 为 0
 * - **强制优先级**：`transform: 'scale(1)'` 触发硬件加速并创建新的层叠上下文
 * - **隔离渲染**：`isolation: 'isolate'` 创建独立的层叠上下文，防止被其他元素覆盖
 * - 注意：没有 `pointerEvents: 'none'`，保留正常的事件交互
 */
const innerStylePriority: CSSProperties = {
    textAlign: 'center',
    height: 0,
    lineHeight: 0,
    width: '100%',
    marginTop: 0,
    transform: 'scale(1)',
    isolation: 'isolate',
}

