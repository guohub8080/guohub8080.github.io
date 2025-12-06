/* eslint-disable no-mixed-spaces-and-tabs */
import { useMemo } from "react";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";

/**
 * 假动作层组件
 * 用于循环时的视觉连接：在最后一张图滑出时，下面显示第一张图的假动作
 */
const CoverOutGhostPicOne = (props: {
    viewBoxW: number
    viewBoxH: number
    url: string
    allSlides: { url: string; coverOutDuration: number; stayDuration: number; direction: "T" | "B" | "L" | "R"; keySplines: string }[]
}) => {
    const { viewBoxW, viewBoxH, url, allSlides } = props;

    const animationParams = useMemo(() => {
        const totalSlides = allSlides.length;

        // 计算整个循环的总时长
        const totalCycleDuration = allSlides.reduce(
            (acc, slide) => acc + slide.stayDuration + slide.coverOutDuration, 
            0
        );

        // 假动作出现时间 = 图1到图(n-1)的(last+out) + 图n的last
        // 即：在最后一张图开始滑出时，假动作层出现
        let ghostAppearTime = 0;
        for (let i = 0; i < totalSlides - 1; i++) {
            ghostAppearTime += allSlides[i].stayDuration + allSlides[i].coverOutDuration;
        }
        ghostAppearTime += allSlides[totalSlides - 1].stayDuration;

        // 假动作消失时间 = 出现时间 + 最后一张图的out时间
        const lastSlideCoverOutDuration = allSlides[totalSlides - 1].coverOutDuration;
        const ghostDisappearTime = ghostAppearTime + lastSlideCoverOutDuration;

        // 计算 keyTimes（相对于整个循环周期）
        const keyTime1 = 0; // 循环开始：隐藏
        const keyTime2 = ghostAppearTime / totalCycleDuration; // 出现时刻
        const keyTime3 = ghostDisappearTime / totalCycleDuration; // 消失时刻
        const keyTime4 = 1; // 循环结束：隐藏

        console.log('[CoverOutGhost] 总周期:', totalCycleDuration, 
                    '出现:', ghostAppearTime, '消失:', ghostDisappearTime,
                    'keyTimes:', [keyTime1, keyTime2, keyTime3, keyTime4]);

        return {
            totalDuration: totalCycleDuration,
            values: "0;0;1;1;0;0", // 隐藏->隐藏->显示->显示->隐藏->隐藏
            keyTimes: `0;${keyTime2};${keyTime2};${keyTime3};${keyTime3};1`,
        };
    }, [allSlides]);

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
            
            {/* 假动作层的opacity动画：瞬间出现、持续显示、瞬间消失 */}
            <animate
                attributeName="opacity"
                values={animationParams.values}
                keyTimes={animationParams.keyTimes}
                begin="0s"
                dur={`${animationParams.totalDuration}s`}
                fill="freeze"
                repeatCount="indefinite"
                calcMode="discrete"
            />
        </g>
    );
};

export default CoverOutGhostPicOne;

