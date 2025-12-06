/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, useMemo } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import CoverInPicOne from "./CoverInPicOne.tsx";
import { getEaseBezier } from "../../../PubUtils/getBezier";

/**
 * 层层覆盖组件（CoverIn）
 * 多张图片依次滑入覆盖，形成层层刷新的效果
 * 
 * @description
 * 支持任意数量的图片（假设有 n 张图片）：
 * 
 * - 第一轮（一次性）：
 *   1. 第1张图静止显示（stayDuration）
 *   2. 第2张图飞入(coverInDuration) + 停留(stayDuration)
 *   3. 第3张图飞入(coverInDuration) + 停留(stayDuration)
 *   4. ...
 *   n. 第n张图飞入(coverInDuration) + 停留(stayDuration)
 * 
 * - 第二轮开始（无限循环）：
 *   1. 第1张图飞入(coverInDuration) + 停留(stayDuration)
 *   2. 第2张图飞入(coverInDuration) + 停留(stayDuration)
 *   3. 第3张图飞入(coverInDuration) + 停留(stayDuration)
 *   4. ...
 *   n. 第n张图飞入(coverInDuration) + 停留(stayDuration)
 *   然后回到步骤1，无限循环
 * 
 * - 每张图可独立控制滑入方向、滑入时长和停留时长
 * - 两组动画无缝衔接，实现平滑循环效果
 */
const CoverIn = (props: {
    pics?: {
        url: string
        coverInDuration?: number   // 该图滑入的时长（秒），默认 0.5
        stayDuration?: number      // 该图停留的时长（秒），默认 0.5
        direction?: "T" | "B" | "L" | "R"  // 该图滑入方向：T-从下往上, B-从上往下, L-从右往左, R-从左往右，默认 B
        keySplines?: string        // 该图的贝塞尔曲线，默认使用 getEaseBezier({})
    }[]
    viewBoxW?: number  // viewBox 宽度（统一）
    viewBoxH?: number  // viewBox 高度（统一）
    mp?: mpProps
}) => {
    const mpResult = mpGet(byDefault(props.mp, mpBlank));
    const defaultKeySplines = getEaseBezier({ isIn: true, isOut: true });

    // 处理图片：至少需要1张，确保每张图都有默认参数
    const pics = useMemo(() => {
        const inputPics = byDefault(props.pics, []);

        // 如果没有图片，使用占位图
        if (inputPics.length === 0) {
            const placeholder = getTextImgPic1(450, 450, "CoverIn");
            return [{
                url: placeholder,
                coverInDuration: 0.5,
                stayDuration: 0.5,
                direction: "B" as const,
                keySplines: defaultKeySplines
            }];
        }

        // 返回用户提供的图片，并设置默认参数
        return inputPics.map(x => ({
            url: x.url,
            coverInDuration: byDefault(x.coverInDuration, 0.5),
            stayDuration: byDefault(x.stayDuration, 0.5),
            direction: byDefault(x.direction, "B" as const),
            keySplines: byDefault(x.keySplines, defaultKeySplines)
        }));
    }, [props.pics]);

    // 获取统一的 viewBox 尺寸（基于第一张图）
    const imgSize = getImgSizeByDefault(pics[0].url, props.viewBoxW, props.viewBoxH);

    // 准备渲染的图片列表：两组动画
    // 第一组动画（一次性）：initialStatic(图1静止) + firstRoundSlides(图2/3/4滑入)
    // 第二组动画（循环）：loopSlides(图1/2/3/4循环滑入)
    const renderPics = useMemo(() => {
        if (pics.length === 1) {
            // 只有1张图：初始静止 + 循环滑入
            return {
                initialStatic: pics[0],
                firstRoundSlides: [pics[0]],
                loopSlides: [pics[0]]
            };
        }

        // 多张图：初始图1 + 第一轮滑入（图2、图3、图4） + 循环滑入（图1、图2、图3、图4）
        return {
            initialStatic: pics[0],                     // 图1静止
            firstRoundSlides: pics.slice(1),            // 第一轮：图2、图3、图4
            loopSlides: pics                            // 循环：图1、图2、图3、图4
        };
    }, [pics]);

    // 计算时长
    const durations = useMemo(() => {
        // 第一轮的总时长 = 图1的stayDuration + 图2/3/4的(coverIn+last)
        const firstRoundDuration = renderPics.initialStatic.stayDuration +
            renderPics.firstRoundSlides.reduce((total, slide) => {
                return total + slide.coverInDuration + slide.stayDuration;
            }, 0);

        // 循环的总时长（图1/2/3/4的 coverIn+last）
        const loopDuration = renderPics.loopSlides.reduce((total, slide) => {
            return total + slide.coverInDuration + slide.stayDuration;
        }, 0);

        return { firstRoundDuration, loopDuration };
    }, [renderPics.initialStatic, renderPics.firstRoundSlides, renderPics.loopSlides]);

    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    };

    return (
        <SectionEx data-label="cover-in" style={rootStyle}>
            <section style={innerStyle}>
                <SvgEx
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                    style={svgStyle}
                    width="100%"
                >
                    {/* ========== 第一组动画（一次性）========== */}
                    {/* 初始静止图，在图1的stayDuration结束后开始淡出 */}
                    <CoverInPicOne
                        viewBoxW={imgSize.w}
                        viewBoxH={imgSize.h}
                        url={renderPics.initialStatic.url}
                        duration={durations.firstRoundDuration}
                        direction="B"
                        groupType="initialStatic"
                        animationMode="once"
                        initialStaticLastDuration={renderPics.initialStatic.stayDuration}
                        keySplines={renderPics.initialStatic.keySplines}
                    />

                    {/* 第一轮滑入序列（图2、图3、图4），一次性，从图1的stayDuration后开始 */}
                    {renderPics.firstRoundSlides.map((pic, index) => (
                        <CoverInPicOne
                            key={`first-${index}`}
                            viewBoxW={imgSize.w}
                            viewBoxH={imgSize.h}
                            url={pic.url}
                            duration={durations.firstRoundDuration}
                            direction={pic.direction}
                            groupType="loopSlide"
                            animationMode="once"
                            slideIndex={index}
                            allSlides={renderPics.firstRoundSlides}
                            timeOffset={renderPics.initialStatic.stayDuration}
                            keySplines={pic.keySplines}
                        />
                    ))}

                    {/* ========== 第二组动画（循环）========== */}
                    {/* 循环滑入序列（图1、图2、图3、图4），无限循环 */}
                    {renderPics.loopSlides.map((pic, index) => (
                        <CoverInPicOne
                            key={`loop-${index}`}
                            viewBoxW={imgSize.w}
                            viewBoxH={imgSize.h}
                            url={pic.url}
                            duration={durations.loopDuration}
                            direction={pic.direction}
                            groupType="loopSlide"
                            animationMode="loop"
                            slideIndex={index}
                            allSlides={renderPics.loopSlides}
                            firstRoundDuration={durations.firstRoundDuration}
                            keySplines={pic.keySplines}
                        />
                    ))}
                </SvgEx>
            </section>
        </SectionEx>
    );
};

export default CoverIn;


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
    margin: 0, // 原始代码为 marginTop: -1px，改为 margin: 0
};

const svgStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
};

