import SectionEx from '../../../PureHTML/basicEx/SectionEx.tsx'
import type { CSSProperties, ReactNode } from 'react'

/**
 * 零高度容器（3D 变换版）
 *
 * 该组件专门用于需要 3D 变换效果的场景。
 * 通过 `transform-style: preserve-3d` 保留子元素的 3D 位置，
 * 使得内部元素可以进行旋转、透视等 3D 变换效果。
 *
 * @example
 * ```tsx
 * <ZeroHeightContainer3D mpCss={marginPaddingStyles}>
 *   <div style={{ transform: 'rotateY(45deg)' }}>
 *     <img src="3d-card.png" />
 *   </div>
 * </ZeroHeightContainer3D>
 * ```
 *
 * 应用场景：
 * - 3D 卡片翻转效果
 * - 透视变换展示
 * - 需要保持子元素 3D 空间位置的复杂动画
 * - 立体层叠效果
 */
const ZeroHeightContainer3D = (props: {
    children: ReactNode
    mpCss: CSSProperties
}) => {
    return (
        <SectionEx
            data-label="zero-height-container-3d"
            style={{ ...props.mpCss, ...outerStyle }}
        >
            <section style={innerStyle3D}>
                {props.children}
            </section>
        </SectionEx>
    )
}

export default ZeroHeightContainer3D

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
 * 内层容器样式（3D 变换版）：
 * - 高度设为 0、行高 0，宽度 100%
 * - marginTop 为 0（使用 0vw 单位保持响应式）
 * - 溢出可见，允许 3D 变换的元素超出容器边界
 * - **关键**：`transformStyle: 'preserve-3d'` 保留子元素在 3D 空间中的位置
 *   这使得子元素可以进行 rotateX、rotateY、rotateZ 等 3D 变换
 */
const innerStyle3D: CSSProperties = {
    textAlign: 'center',
    height: 0,
    lineHeight: 0,
    width: '100%',
    margin: '0 auto',
    overflow: 'visible',
    marginTop: 0,
    transformStyle: 'preserve-3d',
}

