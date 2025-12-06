import { max } from "lodash"
import { ReactNode } from "react"
import byDefault from "../../../../utils/common/byDefault.ts"

/**
 * HotArea - 热区组件
 * 返回内容元素 + 透明可点击矩形，直接放在 SVG 容器中使用
 * 
 * @param children - SVG 子元素（如 circle、image 等）
 * @param viewBoxW - 视图宽度（用于计算移出视野距离）
 * @param viewBoxH - 视图高度（用于计算移出视野距离）
 * @param x - 热区 X 坐标（默认 0）
 * @param y - 热区 Y 坐标（默认 0）
 * @param width - 热区宽度（默认全宽）
 * @param height - 热区高度（默认全高）
 * 
 * @example
 * ```tsx
 * <svg viewBox="0 0 450 750">
 *   <HotArea viewBoxW={450} viewBoxH={750}>
 *     <image href="..." />
 *     <circle cx="225" cy="375" r="50" />
 *   </HotArea>
 * </svg>
 * ```
 */
const HotArea = (props: {
    children?: ReactNode,
    viewBoxW: number,
    viewBoxH: number,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
}) => {
    const hotX = byDefault(props.x, 0)
    const hotY = byDefault(props.y, 0)
    const hotW = byDefault(props.width, props.viewBoxW)
    const hotH = byDefault(props.height, props.viewBoxH)
    
    // 计算移出视野的距离：取宽高最大值的50倍
    const maxDimension = byDefault(max([props.viewBoxW, props.viewBoxH]), props.viewBoxW)
    const outOfView = maxDimension * 50
    
    return (
        <>
            {/* 内容元素 */}
            {props.children}
            
            {/* 热区矩形（放在最后，覆盖在内容上） */}
            <rect 
                x={hotX}
                y={hotY}
                width={hotW}
                height={hotH}
                opacity={0}
                style={{ pointerEvents: "painted" }}
            >
                {/* 点击后立即将热区移出视野 */}
                <animate 
                    attributeName="x"
                    begin="click+0s"
                    dur="1ms"
                    values={outOfView.toString()}
                    fill="freeze"
                    restart="whenNotActive"
                />
                {/* 点击后隐藏热区 */}
                <set 
                    attributeName="visibility"
                    to="hidden"
                    begin="click+0s"
                    dur="1ms"
                    fill="freeze"
                    restart="never"
                />
            </rect>
        </>
    )
}

export default HotArea
