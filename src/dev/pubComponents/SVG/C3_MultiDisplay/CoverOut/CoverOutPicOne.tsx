/* eslint-disable no-mixed-spaces-and-tabs */
import { useMemo } from "react";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";

/**
 * 单张图片组件 - 主循环层
 * 负责渲染单张图片及其滑出退场动画
 */
const CoverOutPicOne = (props: {
    viewBoxW: number
    viewBoxH: number
    url: string
    duration: number
    direction: "T" | "B" | "L" | "R"  // 滑出方向：T-往上退出, B-往下退出, L-往左退出, R-往右退出
    slideIndex: number       // 图片索引（0开始）
    allSlides: { url: string; coverOutDuration: number; stayDuration: number; direction: "T" | "B" | "L" | "R"; keySplines: string }[]  // 所有图片信息
    keySplines: string  // 贝塞尔曲线
}) => {
    const {
        viewBoxW,
        viewBoxH,
        url,
        duration,
        direction,
        slideIndex,
        allSlides,
        keySplines,
    } = props;

    const animationParams = useMemo(() => {
        const currentIndex = slideIndex;
        const currentSlide = allSlides[currentIndex];

        // 主循环层逻辑：图i的coverOut开始时间 = sum(stayDuration[0..i-1] + coverOutDuration[0..i-1]) + stayDuration[i]
        let slideOutStartTime = 0;
        for (let i = 0; i < currentIndex; i++) {
            slideOutStartTime += allSlides[i].stayDuration + allSlides[i].coverOutDuration;
        }
        slideOutStartTime += currentSlide.stayDuration;

        const slideOutEndTime = slideOutStartTime + currentSlide.coverOutDuration;
        
        // 计算 keyTimes（时间点在总时长中的比例）
        const epsilon = 1e-6;
        const keyTime1 = 0; // 初始位置（视口内）
        let keyTime2 = slideOutStartTime / duration; // 滑出开始
        let keyTime3 = slideOutEndTime / duration;   // 滑出结束（到达屏幕外）

        // 确保keyTime的顺序正确
        if (keyTime2 <= keyTime1) {
            keyTime2 = keyTime1 + epsilon;
        }
        if (keyTime3 <= keyTime2) {
            keyTime3 = keyTime2 + epsilon;
        }
        
        // 确保不超过1
        if (keyTime3 > 1) {
            keyTime3 = 1;
        }
        if (keyTime2 >= keyTime3) {
            keyTime2 = keyTime3 - epsilon;
        }

        // 根据方向计算滑出位移（从 0,0 滑出到屏幕外）
        let translateOffset: string;

        switch (direction) {
            case "T": // 往上退出
                translateOffset = `0 ${-(viewBoxH + 1)}`;
                break;
            case "B": // 往下退出（默认）
                translateOffset = `0 ${viewBoxH + 1}`;
                break;
            case "L": // 往左退出
                translateOffset = `${-(viewBoxW + 1)} 0`;
                break;
            case "R": // 往右退出
                translateOffset = `${viewBoxW + 1} 0`;
                break;
        }

        // values/keyTimes逻辑：在t=1时保持在屏外
        // 通过repeatCount="indefinite"自动从t=0重新开始，实现循环
        const valuesArray = [
            "0 0",           // t=0: 初始在视口
            "0 0",           // t=keyTime2: 等待到滑出开始
            translateOffset, // t=keyTime3: 滑出完成，在屏外
            translateOffset, // t=1: 保持在屏外（会repeat回到t=0）
        ];
        const keyTimesArray = [keyTime1, keyTime2, keyTime3, 1];

        const values = valuesArray.join(";");
        const keyTimes = keyTimesArray.join(";");

        // keySplines: 每段动画的缓动曲线（4个关键点 = 3段动画）
        const keySplinesString = [
            "0 0 1 1",        // 第1段：静止等待
            keySplines,       // 第2段：滑出动画，使用传入的贝塞尔曲线
            "0 0 1 1",        // 第3段：保持在屏外
        ].join(";");

        return { 
            values, 
            keyTimes, 
            keySplines: keySplinesString, 
        };
    }, [slideIndex, allSlides, duration, direction, viewBoxH, viewBoxW, keySplines]);

    return (
        <g name={`slide-${slideIndex}`}>
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
            
            {/* 滑出动画 */}
            <animateTransform
                attributeName="transform"
                type="translate"
                values={animationParams.values}
                keyTimes={animationParams.keyTimes}
                begin="0s"
                fill="freeze"
                dur={`${duration}s`}
                calcMode="spline"
                keySplines={animationParams.keySplines}
                repeatCount="indefinite"
            />
        </g>
    );
};

export default CoverOutPicOne;

