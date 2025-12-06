/* eslint-disable no-mixed-spaces-and-tabs */
import { useMemo } from "react";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import { genAnimateOpacity } from "../../../PubUtils/genSvgAnimateTransform/genAnimateOpacity";

/**
 * 假动作层组件
 * 用于交叉溶解循环时的视觉连接：在最后一张图淡出时，下面显示第一张图的假动作淡入
 */
const FadeSwitchGhostPicOne = (props: {
    viewBoxW: number
    viewBoxH: number
    url: string
    allSlides: { url: string; fadeDuration: number; stayDuration: number }[]
    // 始终为交叉溶解，移除开关
}) => {
    const { viewBoxW, viewBoxH, url, allSlides } = props;

    const opacityAnim = useMemo(() => {
        if (allSlides.length === 0) {
            return null;
        }

        const totalSlides = allSlides.length;

        // 统一采用 CoverOut 风格排程：总时长 = sum(stay+fade)
        const totalCycleDuration = allSlides.reduce(
            (acc, slide) => acc + slide.stayDuration + slide.fadeDuration, 
            0
        );

        // Ghost 出现时刻：最后一张开始退场的时刻
        let ghostAppearTime = 0;
        for (let i = 0; i < totalSlides - 1; i++) {
            ghostAppearTime += allSlides[i].stayDuration + allSlides[i].fadeDuration;
        }
        ghostAppearTime += allSlides[totalSlides - 1].stayDuration;

        const ghostDisappearTime = ghostAppearTime + allSlides[totalSlides - 1].fadeDuration;

        // 离散的不透明度切换，避免与主层重复溶解造成的叠加
        const keyTime2 = totalCycleDuration === 0 ? 0 : (ghostAppearTime / totalCycleDuration);
        const keyTime3 = totalCycleDuration === 0 ? 0 : (ghostDisappearTime / totalCycleDuration);

        const values = "0;0;1;1;0;0";
        const keyTimes = `0;${keyTime2};${keyTime2};${keyTime3};${keyTime3};1`;

        return (
            <animate
                attributeName="opacity"
                values={values}
                keyTimes={keyTimes}
                begin="0s"
                dur={`${totalCycleDuration}s`}
                fill="freeze"
                repeatCount="indefinite"
                calcMode="discrete"
            />
        );
    }, [allSlides]);

    // 如果不是交叉溶解模式，不渲染
    if (!opacityAnim) {
        return null;
    }

    return (
        <g name="ghost-layer" opacity={0}>
            <foreignObject 
                x={0} 
                y={0} 
                width={viewBoxW} 
                height={viewBoxH}
            >
                <SvgEx
                    style={{
                        display: "block",
                        backgroundImage: svgURL(url),
                        backgroundSize: "100% auto",
                        backgroundRepeat: "no-repeat",
                    }}
                    viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
                    width="100%"
                />
            </foreignObject>
            
            {/* 假动作层的opacity动画：淡入并保持 */}
            {opacityAnim}
        </g>
    );
};

export default FadeSwitchGhostPicOne;

