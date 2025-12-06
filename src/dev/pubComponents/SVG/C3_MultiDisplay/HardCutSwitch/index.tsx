/* eslint-disable no-mixed-spaces-and-tabs */
import { CSSProperties, useMemo } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import HardCutPicOne from "./HardCutPicOne.tsx";

/**
 * 硬切切换组件（HardCutSwitch）
 * 多张图片通过不透明度的离散跳变进行切换（无过渡缓动）
 * 
 * @description
 * 每张图片的完整循环：
 * 1. 完全显示（stayDuration）
 * 2. 瞬间隐藏，等待其他图片展示完毕
 */
const HardCutSwitch = (props: {
    pics?: {
        url: string
        stayDuration?: number      // 完全显示停留的时长（秒），默认 2
    }[]
    viewBoxW?: number  // viewBox 宽度（统一）
    viewBoxH?: number  // viewBox 高度（统一）
    mp?: mpProps
}) => {
    const mpResult = mpGet(byDefault(props.mp, mpBlank));

    // 处理图片：至少需要1张
    const pics = useMemo(() => {
        const inputPics = byDefault(props.pics, []);

        // 如果没有图片，使用占位图
        if (inputPics.length === 0) {
            return [
                { url: getTextImgPic1(450, 450, "HardCut 1"), stayDuration: 2 },
                { url: getTextImgPic1(450, 450, "HardCut 2"), stayDuration: 2 },
                { url: getTextImgPic1(450, 450, "HardCut 3"), stayDuration: 2 },
            ];
        }

        // 如果只有一张图，复制一份
        if (inputPics.length === 1) {
            const normalized = {
                url: inputPics[0].url,
                stayDuration: byDefault(inputPics[0].stayDuration, 2)
            };
            return [normalized, normalized];
        }

        // 返回用户提供的图片，并设置默认参数
        return inputPics.map(x => ({
            url: x.url,
            stayDuration: byDefault(x.stayDuration, 2)
        }));
    }, [props.pics]);

    // 获取统一的 viewBox 尺寸（基于第一张图）
    const imgSize = getImgSizeByDefault(pics[0].url, props.viewBoxW, props.viewBoxH);

    // 计算总时长：所有停留时长之和
    const totalDuration = useMemo(() => {
        return pics.reduce((total, pic) => total + pic.stayDuration, 0);
    }, [pics]);

    const rootStyle: CSSProperties = {
        ...rootBaseStyle,
        ...mpResult
    };

    return (
        <SectionEx data-label="hard-cut-switch" style={rootStyle}>
            <section style={innerStyle}>
                <SvgEx
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                    style={svgStyle}
                    width="100%"
                >
                    {pics.map((pic, index) => (
                        <HardCutPicOne
                            key={`hc-${index}`}
                            viewBoxW={imgSize.w}
                            viewBoxH={imgSize.h}
                            url={pic.url}
                            totalDuration={totalDuration}
                            stayDuration={pic.stayDuration}
                            picIndex={index}
                            allPics={pics}
                        />
                    ))}
                </SvgEx>
            </section>
        </SectionEx>
    );
};

export default HardCutSwitch;


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


