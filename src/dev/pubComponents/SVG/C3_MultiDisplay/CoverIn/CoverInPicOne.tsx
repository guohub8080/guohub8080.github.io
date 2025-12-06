/* eslint-disable no-mixed-spaces-and-tabs */
import { useMemo } from "react";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import { isUndefined, defaultTo } from "lodash";

/**
 * 单张图片组件
 * 负责渲染单张图片及其滑入覆盖动画
 */
const CoverInPicOne = (props: {
    viewBoxW: number
    viewBoxH: number
    url: string
    duration: number
    direction: "T" | "B" | "L" | "R"  // 滑入方向：T-从下往上, B-从上往下, L-从右往左, R-从左往右
    groupType: "initialStatic" | "loopSlide"  // 组类型：初始静止图 or 循环滑入图
    animationMode: "once" | "loop"  // 动画模式：一次性 or 循环
    keySplines: string  // 贝塞尔曲线
    // 初始静止图专用参数
    initialStaticLastDuration?: number  // 初始静止图的停留时间
    // 循环滑入图专用参数
    slideIndex?: number      // 循环滑入图的索引（0开始）
    allSlides?: { url: string; coverInDuration: number; stayDuration: number; direction: "T" | "B" | "L" | "R"; keySplines: string }[]  // 所有滑入图的信息
    firstRoundDuration?: number  // 第一轮的总时长（仅循环模式需要）
    timeOffset?: number  // 时间偏移量（第一轮滑入图从这个时刻开始）
}) => {
    const { viewBoxW, viewBoxH, url, duration, direction, groupType, animationMode, keySplines, initialStaticLastDuration, slideIndex, allSlides, firstRoundDuration, timeOffset } = props;

    // 计算动画参数
    const animationParams = useMemo(() => {
        // 初始静止图：不需要滑动动画
        if (groupType === "initialStatic") {
            return null;
        }
        
        // 循环滑入图的动画参数
        if (!allSlides || isUndefined(slideIndex)) {
            return null;
        }
        
        const currentIndex = slideIndex;
        const currentSlide = allSlides[currentIndex];
        
        // 计算滑入开始时间：累加前面所有图的 coverInDuration + stayDuration
        let slideInStartTime = defaultTo(timeOffset, 0); // 从timeOffset开始（第一轮需要）
        for (let i = 0; i < currentIndex; i++) {
            slideInStartTime += allSlides[i].coverInDuration + allSlides[i].stayDuration;
        }

        const slideInEndTime = slideInStartTime + currentSlide.coverInDuration;
        
        // 根据动画模式计算 keyTimes
        let keyTime1, keyTime2, keyTime3, keyTime4, keyTime5;
        let beginTime;
        let repeatCount;
        
        if (animationMode === "once") {
            // 一次性动画：从0开始，不重置
            keyTime1 = 0; // 初始位置
            keyTime2 = slideInStartTime / duration; // 滑入开始
            keyTime3 = slideInEndTime / duration; // 滑入结束
            keyTime4 = 1; // 保持到结束
            keyTime5 = undefined; // 不需要重置
            
            // 边界处理：确保 keyTimes 单调递增
            if (keyTime3 > 1) keyTime3 = 1;
            if (keyTime2 > keyTime3) {
                // 如果滑入开始时间已经超过了结束时间（逻辑错误），使用离散跳变
                keyTime2 = keyTime3;
            }
            // 允许 keyTime2 === keyTime3（表示瞬间滑入，coverInDuration = 0）
            
            beginTime = "0s";
            repeatCount = "1";
        } else {
            // 循环动画：从第一轮结束后开始，需要在t=1时刻重置
            keyTime1 = 0; // 初始位置
            keyTime2 = slideInStartTime / duration; // 滑入开始
            keyTime3 = slideInEndTime / duration; // 滑入结束
            keyTime4 = 1; // 保持到循环结束
            keyTime5 = 1; // 在t=1时刻重置（重复keyTime实现离散跳变）
            
            // 边界处理：确保 keyTimes 单调递增
            if (keyTime3 > 1) keyTime3 = 1;
            if (keyTime2 > keyTime3) {
                // 如果滑入开始时间已经超过了结束时间（逻辑错误），使用离散跳变
                keyTime2 = keyTime3;
            }
            // 允许 keyTime2 === keyTime3（表示瞬间滑入，coverInDuration = 0）
            
            beginTime = `${defaultTo(firstRoundDuration, 0)}s`; // 在第一轮结束后开始
            repeatCount = "indefinite";
        }

        // 根据方向计算位移
        let translateOffset: string;
        let initialY = 0;
        let initialX = 0;

        switch (direction) {
            case "T": // 从下往上
                initialY = viewBoxH + 1;
                translateOffset = `0 ${-(viewBoxH + 1)}`;
                break;
            case "B": // 从上往下（默认）
                initialY = -(viewBoxH + 1);
                translateOffset = `0 ${viewBoxH + 1}`;
                break;
            case "L": // 从右往左
                initialX = viewBoxW + 1;
                translateOffset = `${-(viewBoxW + 1)} 0`;
                break;
            case "R": // 从左往右
                initialX = -(viewBoxW + 1);
                translateOffset = `${viewBoxW + 1} 0`;
                break;
        }

        // values 和 keyTimes：根据动画模式决定
        let valuesArray, keyTimesArray;
        
        if (animationMode === "once") {
            // 一次性动画：初始位置 → 等待 → 滑入 → 保持（4个点）
            valuesArray = [
                "0 0",              // 1. 初始位置
                "0 0",              // 2. 等待滑入
                translateOffset,    // 3. 滑入完成
                translateOffset     // 4. 保持显示
            ];
            keyTimesArray = [keyTime1, keyTime2, keyTime3, keyTime4];
        } else {
            // 循环动画：初始位置 → 等待 → 滑入 → 保持 → 重置（5个点）
            valuesArray = [
                "0 0",              // 1. 初始位置
                "0 0",              // 2. 等待滑入
                translateOffset,    // 3. 滑入完成
                translateOffset,    // 4. 保持显示
                "0 0"               // 5. 重置
            ];
            keyTimesArray = [keyTime1, keyTime2, keyTime3, keyTime4, keyTime5];
        }
        
        const values = valuesArray.join(";");
        const keyTimes = keyTimesArray.join(";");
        
        // keySplines: 每段动画的缓动曲线（n个关键点 = n-1段动画）
        const splineCount = valuesArray.length - 1;
        const keySplinesString = new Array(splineCount)
            .fill(keySplines)  // 使用传入的贝塞尔曲线
            .join(";");

        return { values, keyTimes, keySplines: keySplinesString, initialX, initialY, beginTime, repeatCount };
    }, [groupType, slideIndex, allSlides, duration, direction, viewBoxH, viewBoxW, animationMode, firstRoundDuration, timeOffset, keySplines]);

    // 如果是初始静止图，渲染带淡出动画的图
    if (groupType === "initialStatic") {
        // 计算淡出时间：图1的stayDuration结束时开始淡出
        const fadeOutTime = defaultTo(initialStaticLastDuration, 0.5);
        const fadeOutTimeRatio = fadeOutTime / duration;
        
        return (
            <g name="initial-static">
                <foreignObject x={0} y={0} width={viewBoxW} height={viewBoxH}>
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
                {/* 在图1的stayDuration结束时开始淡出，只运行一次 */}
                <animate
                    attributeName="opacity"
                    values={`1;1;0`}
                    keyTimes={`0;${fadeOutTimeRatio};${Math.min(fadeOutTimeRatio + 0.01, 1)}`}
                    begin="0s"
                    dur={`${duration}s`}
                    repeatCount="1"
                    fill="freeze"
                />
            </g>
        );
    }

    // 循环滑入图
    return (
        <g name={`slide-${slideIndex}`}>
            <foreignObject 
                x={defaultTo(animationParams?.initialX, 0)} 
                y={defaultTo(animationParams?.initialY, 0)} 
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
            
            {/* 滑入动画 */}
            {animationParams && (
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={animationParams.values}
                    keyTimes={animationParams.keyTimes}
                    begin={animationParams.beginTime}
                    fill="freeze"
                    dur={`${duration}s`}
                    calcMode="spline"
                    keySplines={animationParams.keySplines}
                    repeatCount={animationParams.repeatCount}
                />
            )}
        </g>
    );
};

export default CoverInPicOne;

