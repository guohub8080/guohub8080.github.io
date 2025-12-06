import byDefault from "../../../../utils/common/byDefault.ts";
import { useEffect, useRef } from "react";
import { isNumber, isUndefined, isString, isArray } from "lodash";
import { CSSProperties } from "react";
import UnderImg from "./components/UnderImg.tsx";
import { outerContainerStyle, imgWrapperStyle, baseDescriptionBoxStyle } from "./styles";

interface ImgFrame1Props {
    src?: string;
    description?: string | string[];
    color?: string;
    maxWidth?: string | number;
    borderRadius?: number | string | [number, number, number, number];
    boxShadow?: string;
}

const ImgFrame1 = (props: ImgFrame1Props) => {
    const src = byDefault(props.src, "https://placehold.co/1000x600/png?text=PICTURE")
    const maxWidthValue = byDefault(props.maxWidth, "550px")
    const maxWidth = isNumber(maxWidthValue) ? `${maxWidthValue}px` : maxWidthValue
    const boxShadow = byDefault(props.boxShadow, "0 0 15px #efefef")
    
    // 处理 borderRadius props
    let commonRadius = 8;
    if (!isUndefined(props.borderRadius)) {
        if (isNumber(props.borderRadius)) {
            commonRadius = props.borderRadius;
        } else if (isString(props.borderRadius)) {
            // 如果是字符串，直接使用（稍后会用于样式）
            commonRadius = props.borderRadius as any;
        }
    }
    
    let imgBtmRadius: number | string = 0;
    if (isUndefined(props.description)) {
        imgBtmRadius = commonRadius;
    }
    const imgRef = useRef(null);
    const imgRef2 = useRef(null);
    
    useEffect(() => {
        if (imgRef) {
            imgRef.current.style.setProperty("width", "100%", "important")
            // imgRef.current.style.setProperty("min-width", "100%", "important")
            imgRef.current.style.setProperty("max-width", maxWidth, "important")
            imgRef.current.style.setProperty("object-fit", "contain", "important")
        }
        if (imgRef2) {
            imgRef2.current.style.setProperty("min-width", "100%", "important")
            imgRef2.current.style.setProperty("max-width", "100%", "important")
            imgRef2.current.style.setProperty("width", "100%", "important")
            imgRef2.current.style.setProperty("object-fit", "contain", "important")
        }
    }, [maxWidth])

    // 样式对象：描述框完整样式，继承基础样式并添加圆角
    const descriptionBoxStyle: CSSProperties = {
        ...baseDescriptionBoxStyle,
        borderRadius: commonRadius,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    };
    
    // 如果 borderRadius 是数组，特殊处理描述框的底部圆角
    if (isArray(props.borderRadius) && props.borderRadius.length === 4) {
        descriptionBoxStyle.borderBottomLeftRadius = props.borderRadius[3];
        descriptionBoxStyle.borderBottomRightRadius = props.borderRadius[2];
        descriptionBoxStyle.borderTopLeftRadius = 0;
        descriptionBoxStyle.borderTopRightRadius = 0;
    }
    
    // 样式对象：图片容器样式，设置圆角、溢出隐藏、背景色和阴影效果
    const imgContainerStyle: CSSProperties = {
        borderRadius: commonRadius,
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: boxShadow,
        margin: "0 auto"
    };

    // 样式对象：图片本身的样式，设置尺寸、填充方式和圆角（根据是否有描述动态调整底部圆角）
    const imgStyle: CSSProperties = {
        width: "100%",
        objectFit: "contain",
        margin: 0,
        padding: 0,
        height: "fit-content",
        borderTopRightRadius: commonRadius,
        borderTopLeftRadius: commonRadius,
        borderBottomLeftRadius: imgBtmRadius,
        borderBottomRightRadius: imgBtmRadius,
    };
    
    // 如果 borderRadius 是数组，特殊处理四个角
    if (isArray(props.borderRadius) && props.borderRadius.length === 4) {
        imgStyle.borderTopLeftRadius = props.borderRadius[0];
        imgStyle.borderTopRightRadius = props.borderRadius[1];
        imgStyle.borderBottomRightRadius = props.borderRadius[2];
        imgStyle.borderBottomLeftRadius = props.borderRadius[3];
    }

    // section: 组件根容器
    return <section>
        {/* section: 最外层容器，控制整体布局和边距 */}
        <section style={outerContainerStyle}>
            {/* section: 图片容器，带圆角和阴影效果，通过 ref 设置最大宽度 */}
            <section ref={imgRef} style={imgContainerStyle}>
                {/* section: 图片包裹层，使图片居中对齐 */}
                <section style={imgWrapperStyle}>
                    <img src={src} referrerPolicy="no-referrer" alt=""
                         ref={imgRef2}
                         style={imgStyle}/>
                </section>

                {/* 图片下方的描述框组件 */}
                <UnderImg 
                    description={props.description}
                    color={props.color}
                    descriptionBoxStyle={descriptionBoxStyle}
                />
            </section>

        </section>

    </section>
}

export default ImgFrame1

