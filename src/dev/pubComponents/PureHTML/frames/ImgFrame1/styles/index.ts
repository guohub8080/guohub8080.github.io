import { CSSProperties } from "react";

// 样式常量对象：最外层容器样式，用于设置图片组件的整体布局和间距
export const outerContainerStyle: CSSProperties = {
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: "auto",
    marginRight: "auto"
};

// 样式常量对象：图片包裹层样式，用于将图片居中显示
export const imgWrapperStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 0,
    margin: 0
};

// 样式常量对象：描述框基础样式，定义图片下方描述文字区域的基本样式
export const baseDescriptionBoxStyle: CSSProperties = {
    paddingTop: 5,
    paddingBottom: 10,
    border: "1px #d1d5db solid",
    borderTop: 0
};

// 样式常量对象：描述文字基础样式，定义文字大小、对齐、行高和内边距
export const baseDescriptionTextStyle: CSSProperties = {
    width: "100%",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 1.3,
    paddingTop: 3,
    paddingLeft: 10,
    paddingRight: 10
};

