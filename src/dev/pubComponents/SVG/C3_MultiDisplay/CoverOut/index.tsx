/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, useMemo } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import CoverOutPicOne from "./CoverOutPicOne.tsx";
import CoverOutGhostPicOne from "./CoverOutGhostPicOne.tsx";
import { getEaseBezier } from "../../../PubUtils/getBezier";

/**
 * 层层退出组件（CoverOut）
 * 多张图片叠加显示，依次滑出退场，露出下层图片
 * 
 * @description
 * - 所有图片叠加在一起（图1在最上，图n在最下）
 * - 依次滑出退场，露出下层图片
 * - 所有图在循环结束时同时重置，实现无缝循环
 * - 每张图可独立设置滑出方向、时长和停留时长
 */
const CoverOut = (props: {
    pics?: { 
        url: string
        coverOutDuration?: number   // 该图滑出的时长（秒），默认 0.5
        stayDuration?: number       // 该图停留的时长（秒），默认 0.5
        direction?: "T" | "B" | "L" | "R"  // 该图滑出方向：T-往上退出, B-往下退出, L-往左退出, R-往右退出，默认 B
        keySplines?: string        // 该图的贝塞尔曲线，默认使用 getEaseBezier({ isIn: true, isOut: true })
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
            const placeholder = getTextImgPic1(450, 450, "CoverOut");
            return [{ 
                url: placeholder,
                coverOutDuration: 0.5,
                stayDuration: 0.5,
                direction: "B" as const,
                keySplines: defaultKeySplines
            }];
        }

        // 返回用户提供的图片，并设置默认参数
        return inputPics.map(x => ({
            url: x.url,
            coverOutDuration: byDefault(x.coverOutDuration, 0.5),
            stayDuration: byDefault(x.stayDuration, 0.5),
            direction: byDefault(x.direction, "B" as const),
            keySplines: byDefault(x.keySplines, defaultKeySplines)
        }));
    }, [props.pics, defaultKeySplines]);

    // 获取统一的 viewBox 尺寸（基于第一张图）
    const imgSize = getImgSizeByDefault(pics[0].url, props.viewBoxW, props.viewBoxH);

    // 总动画时长：所有图片的 last + out 累加
    const totalDuration = useMemo(() => {
        return pics.reduce((acc, pic) => acc + pic.stayDuration + pic.coverOutDuration, 0);
    }, [pics]);

    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    };

    return (
        <SectionEx data-label="cover-out" style={rootStyle}>
            <section style={innerStyle}>
                <SvgEx
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                    style={svgStyle}
                    width="100%"
                >
                    {pics.length > 0 && (() => {
                        // 渲染顺序：图片倒序（图n在最下，图1在最上）
                        const renderOrder = [...Array(pics.length).keys()].reverse();

                        // 假动作层：第一张图的Ghost版本，放在最下面
                        const ghostNode = (
                            <CoverOutGhostPicOne
                                key="ghost-layer"
                                viewBoxW={imgSize.w}
                                viewBoxH={imgSize.h}
                                url={pics[0].url}
                                allSlides={pics}
                            />
                        );

                        // 主循环层：所有图片正常循环
                        const loopNodes = renderOrder.map((origIdx) => {
                            const pic = pics[origIdx];
                            return (
                                <CoverOutPicOne
                                    key={`loop-${origIdx}`}
                                    viewBoxW={imgSize.w}
                                    viewBoxH={imgSize.h}
                                    url={pic.url}
                                    duration={totalDuration}
                                    direction={pic.direction}
                                    slideIndex={origIdx}
                                    allSlides={pics}
                                    keySplines={pic.keySplines}
                                />
                            );
                        });

                        // 渲染顺序：假动作层在最下面，然后是主循环层（倒序）
                        return [ghostNode, ...loopNodes];
                    })()}
                </SvgEx>
            </section>
        </SectionEx>
    );
};

export default CoverOut;


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

