/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import byDefault from "../../../../utils/common/byDefault.ts";
import { CSSProperties, ReactNode } from "react";

/**
 * 置顶框架组件
 * 
 * @description
 * 通过 CSS 层叠上下文（isolation + transform）实现内容"浮"在页面其他元素之上的置顶效果。
 * 支持三种模式：普通模式、事件穿透模式、加强模式（3D变换）。
 * 
 * **核心原理：**
 * - `isolation: isolate` - 创建独立的层叠上下文，隔离 z-index 层级
 * - `transform: scale(1)` - 普通模式，创建普通层叠上下文
 * - `transform: translateZ(0.01px)` - 加强模式，3D变换触发 GPU 合成层，层级优先级更高
 * - `pointer-events: none` - 事件穿透模式，让内容不响应交互事件
 * 
 * @example
 * ```tsx
 * // 普通模式
 * <TopPinedFrame>
 *   <SeamlessImg url="image.jpg" />
 * </TopPinedFrame>
 * 
 * // 事件穿透模式（装饰性内容，不拦截点击）
 * <TopPinedFrame isEventPassThrough={true}>
 *   <SeamlessImg url="watermark.png" />
 * </TopPinedFrame>
 * 
 * // 加强模式（使用3D变换增强层级）
 * <TopPinedFrame isEnhanced={true}>
 *   <SeamlessImg url="important-content.jpg" />
 * </TopPinedFrame>
 * 
 * // 带边距
 * <TopPinedFrame mp={{ mt: 10, mb: 10 }}>
 *   {children}
 * </TopPinedFrame>
 * ```
 * 
 * @param props - 组件属性
 * @param props.children - 框架内的内容
 * @param props.mp - 边距配置（marginTop, marginBottom, marginLeft, marginRight）
 *                   注意：不要传递 marginLeft/marginRight，会被内层的 auto 覆盖
 * @param props.isEventPassThrough - 是否开启事件穿透模式（默认 false）
 *                                    开启后内容不响应点击等交互事件
 * @param props.isEnhanced - 是否开启加强模式（默认 false）
 *                           使用 translateZ 3D变换，层级优先级更高
 * 
 * @returns React 组件
 */
const TopPinedFrame = (props: {
    children?: ReactNode
    mp?: mpProps
    isEventPassThrough?: boolean
    isEnhanced?: boolean
}) => {
    const mpResult = mpGet(byDefault(props.mp, mpBlank));
    const isEventPassThrough = byDefault(props.isEventPassThrough, false);
    const isEnhanced = byDefault(props.isEnhanced, false);
    // 提醒：marginLeft或者Right 会被覆盖为auto，所以不要传 margin 相关的 mp
    // 动态样式
    const rootStyle: CSSProperties = {
        ...mpResult,
        ...rootBaseStyle
    };

    // 加强模式（使用3D变换）
    if (isEnhanced) {
        return (
            <SectionEx style={rootStyle} data-label="top-pined-frame-enhanced">
                <SectionEx style={innerEnhancedStyle}>
                    {props.children}
                </SectionEx>
            </SectionEx>
        );
    }

    // 事件穿透模式
    if (isEventPassThrough) {
        return (
            <SectionEx style={rootStyle} data-label="top-pined-frame-passthrough">
                <SectionEx style={innerPassThroughStyle}>
                    {props.children}
                </SectionEx>
            </SectionEx>
        );
    }

    // 普通模式
    return (
        <SectionEx style={rootStyle} data-label="top-pined-frame">
            <SectionEx style={innerSectionStyle}>
                {props.children}
            </SectionEx>
        </SectionEx>
    );
}

export default TopPinedFrame;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0
};

const innerSectionStyle: CSSProperties = {
    textAlign: "center",
    lineHeight: 0,
    marginTop: 0, // 原始代码有 marginTop: -1px，这里改为 0
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
    transform: "scale(1)",
    isolation: "isolate" as any
};

const innerPassThroughStyle: CSSProperties = {
    ...innerSectionStyle,
    pointerEvents: "none"
};

const innerEnhancedStyle: CSSProperties = {
    textAlign: "center",
    lineHeight: 0,
    marginTop: 0,
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
    transform: "translateZ(0.01px)", // 3D变换，增强层级优先级
    isolation: "isolate" as any
};

