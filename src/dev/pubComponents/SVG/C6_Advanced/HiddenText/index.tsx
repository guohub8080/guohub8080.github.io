/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import byDefault from "../../../../utils/common/byDefault.ts";

/**
 * 隐藏文本组件
 * 用于显示对用户不可见、但对搜索引擎和屏幕阅读器可见的文本
 * 常用于 SEO 优化和无障碍支持
 */
const HiddenText = (props: {
    text?: string
    width?: number
    mp?: mpProps
}) => {
    const text = byDefault(props.text, "如图文未加载，请刷新重试")
    const width = byDefault(props.width, 0)
    const mpResult = mpGet(byDefault(props.mp, mpBlank))

    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    };

    const innerStyle: CSSProperties = {
        ...innerBaseStyle,
        width: `${width}px`
    };

    return (
        <SectionEx data-label="hidden-text"
            important={[["height", "0"], ["margin", "0"], ["padding", "0"], ["max-width", "0"], ["max-height", "0"], ["overflow", "hidden"], ["width", "0"]]}
            style={rootStyle}>
            <SectionEx

                style={innerStyle}
            >
                <p style={textStyle}>{text}</p>
            </SectionEx>
        </SectionEx>
    );
};

export default HiddenText;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
};

const innerBaseStyle: CSSProperties = {
    height: 0,
    margin: 0,
    overflow: "hidden",
};

const textStyle: CSSProperties = {
    textAlign: "center",
};

