import type { CSSProperties, ReactNode } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getWechat300x500 from "../../../../api/placeHolderPic/getWechat300x500.ts";
import svgURL from "../../../PubUtils/common/svgURL.ts";

/**
 * 坍塌盒子组件 - GIF控制版本
 * 
 * @description
 * 可点击收起的SVG交互盒子，点击后内容坍塌消失（无淡入淡出动画）。
 * 与 CollapsibleBoxFade 的区别：没有 opacity 动画，适合控制 GIF 播放。
 * 
 * @example
 * ```tsx
 * // 点击后播放GIF 2秒再坍塌，并显示新图片
 * <CollapsibleBoxGif 
 *   viewBoxW={450} 
 *   viewBoxH={750}
 *   gifDuration={2}  // GIF播放2秒后坍塌
 *   afterSwitchImgUrl="https://example.com/pic.jpg"  // 点击后显示的图片
 * >
 *   <NormalSvgImg url={gifUrl} w={450} h={750} />
 * </CollapsibleBoxGif>
 * ```
 * 
 * @param props - 组件属性
 * @param props.viewBoxW - viewBox 宽度，默认 100
 * @param props.viewBoxH - viewBox 高度，默认 300
 * @param props.hotAreaX - 触摸热区横坐标，默认 0
 * @param props.hotAreaY - 触摸热区纵坐标，默认 0
 * @param props.hotAreaW - 触摸热区宽度，默认 100
 * @param props.hotAreaH - 触摸热区高度，默认 100
 * @param props.children - 要展示的内容（任何React节点：GIF、无缝图等）
 * @param props.afterSwitchImgUrl - 点击后显示的图片URL（可选）
 * @param props.gifDuration - GIF播放时长（秒），点击后延迟该时长才坍塌，默认 2
 * 
 * @returns React 组件
 */
const CollapsibleBoxGif = (props: {
    viewBoxW?: number
    viewBoxH?: number
    hotAreaX?: number
    hotAreaY?: number
    hotAreaW?: number
    hotAreaH?: number
    children?: ReactNode
    afterSwitchImgUrl?: string
    gifDuration?: number
    mp?: mpProps
}) => {
    const { children } = props;
    const viewBoxWidth = byDefault(props.viewBoxW, 100);
    const viewBoxHeight = byDefault(props.viewBoxH, 300);
    const hotAreaX = byDefault(props.hotAreaX, 0);
    const hotAreaY = byDefault(props.hotAreaY, 0);
    const hotAreaWidth = byDefault(props.hotAreaW, 100);
    const hotAreaHeight = byDefault(props.hotAreaH, 100);
    const gifDuration = byDefault(props.gifDuration, 2);
    const mpResult = mpGet(byDefault(props.mp, mpBlank));
    const imgBgUrl = byDefault(props.afterSwitchImgUrl, getWechat300x500(1));

    // 计算平移距离（使用负的 viewBoxWidth * 5，确保内容完全移出屏幕）
    const translateOffset = -viewBoxWidth * 5;

    return (
        <SectionEx data-label="collapsible-box-gif" style={{ ...rootSectionStyle, ...mpResult }}>
            <section style={outerContainerStyle}>
                {/* 
                    顶部展示容器：显示children内容
                    - height: 0 不占据布局空间
                    - overflow: visible 允许内容溢出显示
                    - children 可以是任何内容（GIF、无缝图等）
                    - children 由用户完全控制，不添加任何额外元素
                */}
                <section style={topContainerStyle}>
                    {children}
                </section>

                {/* 交互层SVG：负责实现"坍塌"效果（无淡入淡出） */}
                <section style={mainContainerStyle}>
                    <SvgEx
                        x="0px"
                        y="0px"
                        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                        xmlSpace="preserve"
                        style={mainSvgStyle}
                    >
                        {/* 
                            宽度坍塌动画：点击后延迟 gifDuration 秒，整个SVG的宽度瞬间变为0
                            - 使用discrete模式立即跳变
                            - begin="click+{gifDuration}s" 点击后延迟触发，让GIF有时间播放
                        */}
                        <animate
                            attributeName="width"
                            fill="freeze"
                            values="100%;0;0"
                            keyTimes="0;0.00001;1"
                            dur="100s"
                            begin={`click+${gifDuration}s`}
                            calcMode="discrete"
                        />

                        <g>
                            {/* 
                                平移动画：将内容移出屏幕
                                - translate从(0,0)瞬间移动到(translateOffset,0)
                                - 配合foreignObject的x={-translateOffset}，实现从屏幕外移入的效果
                            */}
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values={`0 0;${translateOffset} 0;${translateOffset} 0`}
                                dur="100s"
                                keyTimes="0;0.0000001;1"
                                begin="click"
                                fill="freeze"
                                calcMode="discrete"
                                restart="never"
                            />

                            {/* 
                                foreignObject：点击后显示的图片（可选）
                                - x={-translateOffset} 初始位置在屏幕外
                                - backgroundImage 使用 afterSwitchImgUrl
                            */}
                            <foreignObject x={-translateOffset} y="0" width="100%" height="100%">
                                <SvgEx
                                    style={{
                                        backgroundImage: svgURL(imgBgUrl),
                                        backgroundPosition: '0% 0%',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '100%'
                                    }}
                                    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                                    x="0px"
                                    y="0px"
                                />
                            </foreignObject>

                            {/* 
                                透明热区：用户点击的触发区域
                                - opacity: 0 完全透明
                                - pointer-events: visiblePainted 允许接收点击事件
                            */}
                            <rect
                                className="rect"
                                x={hotAreaX}
                                y={hotAreaY}
                                width={hotAreaWidth}
                                height={hotAreaHeight}
                                style={rectStyle}
                            >
                                {/* 
                                    高度坍塌动画：点击时rect的高度瞬间变为0
                                    - 使用discrete模式立即跳变
                                */}
                                <animate
                                    attributeName="height"
                                    fill="freeze"
                                    restart="never"
                                    calcMode="discrete"
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

export default CollapsibleBoxGif;

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

const topContainerStyle: CSSProperties = {
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

