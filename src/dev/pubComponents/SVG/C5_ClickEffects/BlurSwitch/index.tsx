/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import byDefault from "../../../../utils/common/byDefault.ts";
import { CSSProperties } from "react";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";

/**
 * 虚焦切换组件 - 模拟相机对焦效果
 * 
 * 原理：
 * 1. 底层：清晰图片（零高度叠层）
 * 2. 中层：模糊遮罩层（backdrop-filter: blur）
 * 3. 顶层：双图横向排列，点击时淡出→平移→淡入
 * 
 * 效果：清晰→失焦（模糊）→重新对焦（清晰）
 * 
 * @param beforeUrl - 切换前的图片 URL
 * @param afterUrl - 切换后的图片 URL
 * @param blurAmount - 模糊程度（px），默认 10
 * @param fadeDuration - 淡入淡出时长（秒），默认 2
 * @param viewBoxW - ViewBox 宽度
 * @param viewBoxH - ViewBox 高度
 * @param mp - margin/padding 配置
 */
const BlurSwitch = (props: {
    beforeUrl?: string
    afterUrl?: string
    blurAmount?: number
    fadeDuration?: number
    viewBoxW?: number
    viewBoxH?: number
    mp?: mpProps
}) => {
    const beforeUrl = byDefault(props.beforeUrl, getTextImgPic1(600, 800, "切换前"))
    const afterUrl = byDefault(props.afterUrl, getTextImgPic1(600, 800, "切换后"))
    const blurAmount = byDefault(props.blurAmount, 10)
    const fadeDuration = byDefault(props.fadeDuration, 2)
    const mpResult = mpGet(byDefault(props.mp, mpBlank))

    // 计算 viewBox 尺寸
    const imgSize = getImgSizeByDefault(beforeUrl, props.viewBoxW, props.viewBoxH)

    // 平移切换的时间点：在淡出到一半时
    const translateStartTime = fadeDuration / 2

    // 动态样式：需要计算的部分
    const rootStyle: CSSProperties = {
        ...frameStyle,
        ...mpResult
    };

    const layer1SvgStyle: CSSProperties = {
        ...layer1SvgBaseStyle,
        backgroundImage: svgURL(beforeUrl),
    };

    const layer2Style: CSSProperties = {
        ...layer2BaseStyle,
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        WebkitFilter: `blur(${blurAmount}px)`,
        filter: `blur(${blurAmount}px)`,
    };

    return (
        <SectionEx data-label="blur-switch" style={rootStyle}>
            {/* 第1层：底层清晰图片（零高度叠层） */}
            <SectionEx style={layer1Style}>
                <svg style={layer1SvgStyle}
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                />
            </SectionEx>

            {/* 第2层：模糊遮罩层 */}
            <SectionEx style={layer2Style}>
                <svg style={layer2SvgStyle}
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                />
            </SectionEx>

            {/* 第3层：可切换的双图层 */}
            <SectionEx style={layer3Style}>
                <SectionEx style={layer3InnerStyle}>
                    <svg style={layer3SvgStyle}
                        viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                    >
                        <g>
                            {/* 淡入淡出动画：清晰→透明→清晰 */}
                            <animate
                                attributeName="opacity"
                                begin="click"
                                values="1;0;1"
                                dur={`${fadeDuration}s`}
                                fill="freeze"
                                restart="never"
                            />

                            {/* 平移动画：在透明瞬间切换图片 */}
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values={`0 0;-${imgSize.w} 0;-${imgSize.w} 0`}
                                dur="100s"
                                keyTimes="0;0.0000001;1"
                                begin={`click+${translateStartTime}s`}
                                fill="freeze"
                                calcMode="discrete"
                                restart="never"
                            />

                            {/* 切换前图片：初始在屏幕内 */}
                            <foreignObject
                                x="0"
                                y="0"
                                height="100%"
                                width="100%"
                            >
                                <SvgEx
                                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                                    style={{
                                        ...foreignObjectSvgStyle,
                                        backgroundImage: svgURL(beforeUrl),
                                    }}
                                    width="100%"
                                />
                            </foreignObject>

                            {/* 切换后图片：初始在屏幕外右侧 */}
                            <foreignObject
                                x="100%"
                                y="0"
                                height="100%"
                                width="100%"
                            >
                                <SvgEx
                                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                                    style={{
                                        ...foreignObjectSvgStyle,
                                        backgroundImage: svgURL(afterUrl),
                                        pointerEvents: "none",
                                    }}
                                    width="100%"
                                />
                            </foreignObject>
                        </g>
                    </SvgEx>
                </SectionEx>
            </SectionEx>
        </SectionEx>
    );
};

export default BlurSwitch;


/** ================================================== Styles ===================================================== */
const frameStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
    marginBottom: 0,
};

const layer1Style: CSSProperties = {
    textAlign: "center",
    height: 0,
    lineHeight: 0,
    width: "100%",
    margin: "0px auto",
    zIndex: 0,
};

const layer1SvgBaseStyle: CSSProperties = {
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    display: "block",
};

const layer2BaseStyle: CSSProperties = {
    textAlign: "center",
    lineHeight: 0,
    width: "100%",
    margin: "0px auto",
    overflow: "visible",
    marginTop: "0px",
    pointerEvents: "none",
};

const layer2SvgStyle: CSSProperties = {
    display: "block",
    lineHeight: 0,
};

const layer3Style: CSSProperties = {
    textAlign: "center",
    height: 0,
    lineHeight: 0,
    width: "100%",
    margin: "0px auto",
    transform: "rotate(180deg)",
    pointerEvents: "none",
};

const layer3InnerStyle: CSSProperties = {
    transform: "rotate(180deg)",
    pointerEvents: "none",
};

const layer3SvgStyle: CSSProperties = {
    display: "block",
};

const foreignObjectSvgStyle: CSSProperties = {
    overflow: "visible",
    backgroundPosition: "0% 0%",
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    display: "inline-block",
    verticalAlign: "top",
    pointerEvents: "visible",
};
