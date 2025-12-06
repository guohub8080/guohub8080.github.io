import { isArray, isUndefined, isString } from "lodash";
import { CSSProperties } from "react";
import DescriptionOne from "./DescriptionOne.tsx";

// 组件：图片下方描述区域，根据 description 类型渲染单行或多行描述（提取到外部以优化性能）
const UnderImg = (props: {
    description?: string | string[],
    color?: string,
    descriptionBoxStyle: CSSProperties
}) => {
    if (isUndefined(props.description)) {
        return null
    }
    if (isString(props.description)) {
        // section: 单行描述容器
        return <section style={props.descriptionBoxStyle}>
            <DescriptionOne description={props.description}
                            color={props.color}/>
        </section>
    }
    if (isArray(props.description)) {
        // section: 多行描述容器
        return <section style={props.descriptionBoxStyle}>
            {props.description.map((x, y) => <DescriptionOne key={y}
                                                             description={x}
                                                             color={props.color}/>)}
        </section>
    }
    return null
};

export default UnderImg;

