/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, useMemo } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import FadeSwitchPicOne from "./FadeSwitchPicOne.tsx";
import FadeSwitchGhostPicOne from "./FadeSwitchGhostPicOne.tsx";

/**
 * 多图渐变切换组件（FadeSwitch）
 * 多张图片通过淡入淡出效果循环切换
 * 
 * @description
 * 每张图片的完整循环：
 * 1. 淡入显示（fadeDuration）
 * 2. 完全显示停留（stayDuration）
 * 3. 开始淡出（下一张图淡入时同时淡出）
 * 
 * 图片叠加在同一位置，通过opacity控制显示/隐藏
 */
const FadeSwitch = (props: {
    pics?: {
        url: string
        fadeDuration?: number      // 淡入/淡出的时长（秒），默认 0.5（内部规范化为>=epsilon）
        stayDuration?: number      // 完全显示停留的时长（秒），默认 2
    }[]
    viewBoxW?: number  // viewBox 宽度（统一）
    viewBoxH?: number  // viewBox 高度（统一）
    mp?: mpProps
}) => {
    const mpResult = mpGet(byDefault(props.mp, mpBlank));
    const epsilon = 0.01; // 最小淡入淡出时长，避免硬切

    // 处理图片：至少需要1张
    const pics = useMemo(() => {
        const inputPics = byDefault(props.pics, []);

        // 如果没有图片，使用占位图
        if (inputPics.length === 0) {
            return [
                { url: getTextImgPic1(450, 450, "Fade 1"), fadeDuration: 0.5, stayDuration: 2 },
                { url: getTextImgPic1(450, 450, "Fade 2"), fadeDuration: 0.5, stayDuration: 2 },
                { url: getTextImgPic1(450, 450, "Fade 3"), fadeDuration: 0.5, stayDuration: 2 },
            ];
        }

        // 如果只有一张图，复制一份
        if (inputPics.length === 1) {
            const normalized = {
                url: inputPics[0].url,
                fadeDuration: byDefault(inputPics[0].fadeDuration, 0.5),
                stayDuration: byDefault(inputPics[0].stayDuration, 2)
            };
            return [normalized, normalized];
        }

        // 返回用户提供的图片，并设置默认参数（且规范化淡入淡出时长）
        return inputPics.map(x => ({
            url: x.url,
            fadeDuration: Math.max(byDefault(x.fadeDuration, 0.5), epsilon),
            stayDuration: byDefault(x.stayDuration, 2)
        }));
    }, [props.pics]);

    // 获取统一的 viewBox 尺寸（基于第一张图）
    const imgSize = getImgSizeByDefault(pics[0].url, props.viewBoxW, props.viewBoxH);

    // 计算总时长
    const totalDuration = useMemo(() => {
        // 统一采用 CoverOut 风格的排程：总时长 = 所有 (stayDuration + fadeDuration) 之和
        return pics.reduce((total, pic) => total + pic.fadeDuration + pic.stayDuration, 0);
    }, [pics]);

    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    };

    return (
        <SectionEx data-label="fade-switch" style={rootStyle}>
            <section style={innerStyle}>
                <SvgEx
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                    style={svgStyle}
                    width="100%"
                >
                    {/* 假动作层：用于循环收尾的视觉连接（放在最下层） */}
                    <FadeSwitchGhostPicOne
                        viewBoxW={imgSize.w}
                        viewBoxH={imgSize.h}
                        url={pics[0].url}
                        allSlides={pics}
                    />

                    {/* 主循环层 */}
                    {(() => {
                        // 交叉溶解时，采用与 CoverOut 相同的图层顺序：图1在最上，图n在最下
                        const renderOrder = [...Array(pics.length).keys()].reverse(); // 先渲染底层（图n），最后渲染最上层（图1）

                        return renderOrder.map((origIdx) => {
                            const pic = pics[origIdx];
                            return (
                                <FadeSwitchPicOne
                                    key={origIdx}
                                    viewBoxW={imgSize.w}
                                    viewBoxH={imgSize.h}
                                    url={pic.url}
                                    totalDuration={totalDuration}
                                    fadeDuration={pic.fadeDuration}
                                    stayDuration={pic.stayDuration}
                                    picIndex={origIdx}
                                    allPics={pics}
                                    isCrossDissolve={true}
                                />
                            );
                        });
                    })()}
                </SvgEx>
            </section>
        </SectionEx>
    );
};

export default FadeSwitch;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
};

const innerStyle: CSSProperties = {
    overflow: "hidden",
    lineHeight: 0,
    margin: 0,
};

const svgStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
};

