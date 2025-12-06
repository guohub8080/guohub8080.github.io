/* eslint-disable no-mixed-spaces-and-tabs */
import { useMemo } from "react";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import { genAnimateOpacity } from "../../../PubUtils/genSvgAnimateTransform/genAnimateOpacity";

/**
 * 单张图片组件 - 主循环层
 * 负责渲染单张图片及其淡入淡出动画
 */
const FadeSwitchPicOne = (props: {
    viewBoxW: number
    viewBoxH: number
    url: string
    totalDuration: number      // 整个循环的总时长
    fadeDuration: number       // 淡入/淡出的时长
    stayDuration: number       // 完全显示停留的时长
    picIndex: number           // 当前图片索引
    allPics: {
        url: string
        fadeDuration: number
        stayDuration: number
    }[]
    isCrossDissolve: boolean   // 固定为交叉溶解
}) => {
    const { viewBoxW, viewBoxH, url, totalDuration, fadeDuration, stayDuration, picIndex, allPics, isCrossDissolve } = props;

    // 计算动画参数
    const { opacityAnim } = useMemo(() => {
        if (isCrossDissolve) {
            // 交叉模式：与 CoverOut 对齐，当前图仅负责“退场”，下一图在其退场期间“入场”
            // 这里用 opacity 来模拟 CoverOut 的滑出：保持 -> 退场 -> 屏外保持
            // 退场开始时间 = sum_{i<idx}(stay+fade) + stay[idx]
            let fadeOutStart = 0;
            for (let i = 0; i < picIndex; i++) {
                fadeOutStart += allPics[i].stayDuration + allPics[i].fadeDuration;
            }
            fadeOutStart += stayDuration;

            const fadeOutEnd = fadeOutStart + fadeDuration;
            const waitEnd = Math.max(0, totalDuration - fadeOutEnd);

            const timeline = [] as { timeSpanSec: number; toValue: number }[];
            if (fadeOutStart > 0) timeline.push({ timeSpanSec: fadeOutStart, toValue: 1 }); // 保持可见直到退场开始
            if (fadeDuration > 0) timeline.push({ timeSpanSec: fadeDuration, toValue: 0 }); // 退场（淡出）
            if (waitEnd > 0) timeline.push({ timeSpanSec: waitEnd, toValue: 0 }); // 屏外等待到周期结束

            return {
                opacityAnim: genAnimateOpacity({
                    initOpacity: fadeOutStart > 0 ? 1 : (fadeDuration > 0 ? 1 : 0),
                    timeline,
                    loopCount: 0,
                    freeze: true
                })
            };
        } else {
            // 非交叉：完整的 淡入-保持-淡出-等待 调度
            let fadeInStart = 0;
            for (let i = 0; i < picIndex; i++) {
                fadeInStart += allPics[i].fadeDuration + allPics[i].stayDuration;
            }

            const fadeOutStart = fadeInStart + fadeDuration + stayDuration;
            const waitEnd = Math.max(0, totalDuration - fadeOutStart - fadeDuration);

            const timeline = [] as { timeSpanSec: number; toValue: number }[];
            if (fadeInStart > 0) timeline.push({ timeSpanSec: fadeInStart, toValue: 0 });
            if (fadeDuration > 0) timeline.push({ timeSpanSec: fadeDuration, toValue: 1 });
            timeline.push({ timeSpanSec: stayDuration, toValue: 1 });
            if (fadeDuration > 0) timeline.push({ timeSpanSec: fadeDuration, toValue: 0 });
            if (waitEnd > 0) timeline.push({ timeSpanSec: waitEnd, toValue: 0 });

            return {
                opacityAnim: genAnimateOpacity({
                    initOpacity: fadeInStart > 0 || fadeDuration > 0 ? 0 : 1,
                    timeline,
                    loopCount: 0,
                    freeze: true
                })
            };
        }
    }, [totalDuration, fadeDuration, stayDuration, picIndex, allPics, isCrossDissolve]);

    return (
        <g name={`fade-pic-${picIndex}`} opacity="0">
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
            
            {/* 淡入淡出动画 */}
            {opacityAnim}
        </g>
    );
};

export default FadeSwitchPicOne;

