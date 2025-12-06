import type { CSSProperties, ReactNode } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";

/**
 * 坍塌盒子组件
 * 
 * @description
 * 可点击展开/收起的SVG交互盒子，点击热区后盒子会坍塌收起。
 * 采用"展示层与控制层分离"的设计，可以接收任何React节点作为children。
 * 
 * @example
 * ```tsx
 * // 示例1: 普通图片
 * <CollapsibleBox viewBoxW={450} viewBoxH={750} hotAreaW={450} hotAreaH={750}>
 *   <img src={pic1} style={{ width: '100%' }} />
 * </CollapsibleBox>
 * 
 * // 示例2: React组件
 * <CollapsibleBox viewBoxW={450} viewBoxH={750} hotAreaW={450} hotAreaH={750}>
 *   <LongImgTouchSlideX url={pic2} exposedPercent={25} />
 * </CollapsibleBox>
 * 
 * // 示例3: SVG元素（需要自己包裹svg标签）
 * <CollapsibleBox viewBoxW={300} viewBoxH={300} hotAreaW={300} hotAreaH={300}>
 *   <svg viewBox="0 0 300 300">
 *     <rect x="0" y="0" width="300" height="300" fill="blue" />
 *     <circle cx="150" cy="150" r="80" fill="white" />
 *   </svg>
 * </CollapsibleBox>
 * 
 * // 示例4: 任何HTML内容
 * <CollapsibleBox viewBoxW={300} viewBoxH={200} hotAreaW={300} hotAreaH={200}>
 *   <div style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', 
 *                 width: '300px', height: '200px', color: 'white' }}>
 *     点击坍塌
 *   </div>
 * </CollapsibleBox>
 * ```
 * 
 * @param props - 组件属性
 * @param props.viewBoxW - viewBox 宽度（控制层SVG的坐标系统宽度），默认 100
 * @param props.viewBoxH - viewBox 高度（控制层SVG的坐标系统高度），默认 300
 * @param props.hotAreaX - 触摸热区横坐标，默认 0
 * @param props.hotAreaY - 触摸热区纵坐标，默认 0
 * @param props.hotAreaW - 触摸热区宽度，默认 50
 * @param props.hotAreaH - 触摸热区高度，默认 50
 * @param props.children - 要展示的内容（任何React节点：HTML、React组件、SVG等）
 * 
 * @returns React 组件
 */
const CollapsibleBox = (props: {
    viewBoxW?: number
    viewBoxH?: number
    hotAreaX?: number
    hotAreaY?: number
    hotAreaW?: number
    hotAreaH?: number
    children?: ReactNode
    mp?: mpProps
}) => {
    const { children } = props;
    const viewBoxWidth = byDefault(props.viewBoxW, 100);
    const viewBoxHeight = byDefault(props.viewBoxH, 300);
    const hotAreaX = byDefault(props.hotAreaX, 0);
    const hotAreaY = byDefault(props.hotAreaY, 0);
    const hotAreaWidth = byDefault(props.hotAreaW, 50);
    const hotAreaHeight = byDefault(props.hotAreaH, 50);
    const mpResult = mpGet(byDefault(props.mp, mpBlank))

    return (
        <SectionEx data-label="collapsible-box" style={{...rootSectionStyle, ...mpResult}}>
            <section style={outerContainerStyle}>
                {/* 
                    顶部展示容器：用于展示内容（children，可以是任何React节点）
                    
                    【核心原理】：
                    - height: 0 使其不占据布局空间
                    - overflow: visible 允许内容溢出显示
                    
                    【为什么能接收任何东西】：
                    这个容器就像一个"隐形窗口"：
                    - 窗口本身高度为0（不占空间）
                    - 但从窗口"溢出"的内容都能看见
                    - children可以是：
                      ✅ HTML元素 (<img>, <div>...)
                      ✅ React组件 (<LongImgTouchSlideX>, <ClickSwitch>...)
                      ✅ SVG元素 (自己用<svg>包裹)
                      ✅ 任何React节点
                    
                    【与foreignObject的区别】：
                    - 这里不需要foreignObject！
                    - children直接放在section中，不受SVG的限制
                    - 完全的自由和灵活性
                */}
                <section style={topSvgContainerStyle}>
                    {children}
                </section>

                {/* 
                    交互层SVG：负责实现"坍塌"效果
                    - pointer-events: none 禁止整个容器的指针事件，只有rect热区可以响应点击
                    
                    【坍塌原理】：
                    1. 在SVG内部放置一个透明的rect矩形作为"热区"（opacity: 0，用户看不见）
                    2. rect的位置和尺寸由hotAreaX、hotAreaY、hotAreaW、hotAreaH控制
                    3. 当用户点击热区时（begin="click"），同时触发两个动画：
                       
                       a) SVG宽度动画：width从100%瞬间变为0
                          - 使用discrete离散模式，立即跳变，无过渡
                          - 效果：整个SVG容器在横向上消失
                       
                       b) rect高度动画：height从100%平滑缩小到0%
                          - 使用spline缓动函数，产生平滑过渡效果
                          - 虽然rect本身是透明的，但其坍塌动画会影响视觉效果
                    
                    4. 两个动画的fill="freeze"确保动画结束后保持在最终状态
                    5. restart="never"防止动画重复触发
                    
                    最终效果：点击热区 → SVG容器坍塌消失 → 顶部的内容（children）也随之消失
                */}
                <section style={mainContainerStyle}>
                    <SvgEx
                        x="0px"
                        y="0px"
                        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                        xmlSpace="preserve"
                        style={mainSvgStyle}
                    >
                        {/* 宽度坍塌动画：点击时整个SVG的宽度瞬间变为0 */}
                        <animate
                            attributeName="width"
                            fill="freeze"
                            values="100%;0;0"
                            keyTimes="0;0.00001;1"
                            dur="100s"
                            begin="click"
                            calcMode="discrete"
                        />
                        <g>
                            {/* 
                                透明热区：用户点击的触发区域
                                - opacity: 0 完全透明，用户看不见
                                - pointer-events: visiblePainted 允许接收点击事件
                                - 位置和尺寸由props控制，可以精确定位在图片的特定区域
                            */}
                            <rect
                                x={hotAreaX}
                                y={hotAreaY}
                                width={hotAreaWidth}
                                height={hotAreaHeight}
                                style={rectStyle}
                            >
                                {/* 
                                    高度坍塌动画：点击时rect的高度平滑缩小到0
                                    
                                    【动画参数详解】：
                                    
                                    1. dur="1000s"：动画总时长1000秒
                                    
                                    2. values="100%;0%;0%"：动画的三个关键值
                                       - 第1个值：100%（初始状态）
                                       - 第2个值：0%（坍塌后）
                                       - 第3个值：0%（保持坍塌）
                                    
                                    3. keyTimes="0;0.0001;1"：三个关键帧的时间点（0到1之间）
                                       - 0：动画开始时刻（0%）
                                       - 0.0001：动画0.01%时刻（0.0001 × 1000s = 0.1秒）
                                       - 1：动画结束时刻（100%，即1000秒后）
                                       
                                       【设计巧思】：
                                       - 实际坍塌动画在前0.1秒内完成（从100%变为0%）
                                       - 剩余999.9秒都保持在0%状态
                                       - 这样设计是为了确保动画执行后长时间保持坍塌状态
                                       
                                       【如果修改】：
                                       - 改大0.0001 → 坍塌动作变慢（如0.001=1秒，0.01=10秒）
                                       - 改小0.0001 → 坍塌动作更快（如0.00001=0.01秒）
                                    
                                    4. keySplines="0.42 0 0.58 1.0; 0.42 0 0.58 1.0"：缓动曲线
                                       - 因为有3个关键帧，需要2段曲线（n个帧需要n-1段曲线）
                                       - 第1段：0.42 0 0.58 1.0（从100%到0%的过渡）
                                       - 第2段：0.42 0 0.58 1.0（从0%到0%的过渡，实际无变化）
                                       
                                       【贝塞尔曲线解析】：
                                       - 四个数字代表：x1 y1 x2 y2（两个控制点）
                                       - 0.42 0 0.58 1.0 = ease-in-out缓动（慢→快→慢）
                                       - 这是CSS中标准的ease-in-out缓动函数
                                       
                                       【如果修改】：
                                       - "0 0 1 1" → 线性匀速（无缓动）
                                       - "0.42 0 1 1" → ease-in（慢→快）
                                       - "0 0 0.58 1" → ease-out（快→慢）
                                       - "0.68 -0.55 0.27 1.55" → 回弹效果
                                    
                                    5. calcMode="spline"：使用样条插值，启用keySplines缓动
                                */}
                                <animate
                                    attributeName="height"
                                    fill="freeze"
                                    restart="never"
                                    calcMode="spline"
                                    keySplines="0.42 0 0.58 1.0; 0.42 0 0.58 1.0"
                                    keyTimes="0;0.0001;1"
                                    values="100%;0%;0%"
                                    dur="1000s"
                                    begin="click"
                                />
                            </rect>
                        </g>
                    </SvgEx>
                </section>
            </section>
        </SectionEx>
    );
};

export default CollapsibleBox;

/** ================================================== Style ===================================================== */
const rootSectionStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0
};

const outerContainerStyle: CSSProperties = {
    display: "block",
    overflow: "hidden"
};

const topSvgContainerStyle: CSSProperties = {
    textAlign: "center",
    height: 0,
    lineHeight: 0,
    overflow: "visible"
};


const mainContainerStyle: CSSProperties = {
    display: "block",
    overflow: "hidden",
    transform: "scale(1)",
    pointerEvents: "none"
};

const mainSvgStyle: CSSProperties = {
    pointerEvents: "none",
    display: "block",
    lineHeight: 0
};

const rectStyle: CSSProperties = {
    pointerEvents: "visiblePainted",
    opacity: 0
};

