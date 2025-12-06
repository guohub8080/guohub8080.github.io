import byDefault from "../../../../utils/common/byDefault.ts"
import { ReactNode } from "react"
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx"

/**
 * 穿透框架组件
 * 
 * @param isFrame - 是否启用穿透框架模式
 *   - true: 启用 pointer-events: none，点击会穿透到下层元素
 *   - false: 正常模式
 * 
 * 穿透原理：
 * 通过 CSS 属性 pointer-events: none 使该元素及其 children 对鼠标/触摸事件"透明"
 * 用户点击时，事件会穿透这个框架，触发下层（z-index 更低）的元素
 * 
 * 使用场景：
 * - 在图片上方覆盖一个装饰层，但不想阻止用户点击下方的图片
 * - 制作浮水印或遮罩效果，同时保持下层内容可交互
 */
const PassThroughFrame = (props: {
    children?: ReactNode
}) => {
    return (
        <SectionEx
            data-label="passthrough-frame"
            style={{
                WebkitTouchCallout: 'none',
                userSelect: 'text',
                overflow: 'hidden',
                textAlign: 'center',
                lineHeight: 0
            }}
        >
            <section
                style={{
                    textAlign: 'center',
                    lineHeight: 0,
                    margin: '0 auto',
                    display: 'block',
                    marginTop: '0px',
                    pointerEvents: 'none'  // 这里是穿透的关键：让所有点击事件穿透到下层
                }}
            >
                {props.children}
            </section>
        </SectionEx>
    )
}


export default PassThroughFrame
