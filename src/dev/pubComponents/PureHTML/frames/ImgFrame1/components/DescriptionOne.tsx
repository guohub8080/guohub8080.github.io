import byDefault from "../../../../../utils/common/byDefault.ts";
import { CSSProperties } from "react";
import { baseDescriptionTextStyle } from "../styles";

// 组件：单行描述文字组件，用于渲染图片下方的一行描述文字
const DescriptionOne = (props: { description: string, color?: string }) => {
    // 样式对象：描述文字完整样式，继承基础样式并添加动态颜色
    const descriptionTextStyle: CSSProperties = {
        ...baseDescriptionTextStyle,
        color: byDefault(props.color, "#5d5d5d")
    };

    // section: 单行描述文字容器
    return <section style={descriptionTextStyle}>
        {props.description}
    </section>
}

export default DescriptionOne;

