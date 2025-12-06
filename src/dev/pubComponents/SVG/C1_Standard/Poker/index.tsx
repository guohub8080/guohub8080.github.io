import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import { useMemo } from "react";
import { round } from "lodash";
import svgURL from "../../../PubUtils/common/svgURL.ts";

// 精确移植 e2CoolSvg/多图展示/扑克滑动3图.html（仅 3 张），并提取“单卡移出时长(moveSec)”与“静止展示时长(holdSec)”
const PokerSlideThree = (props: { moveSec?: number; holdSec?: number }) => {
    const picW = 1080
    const picH = 1776
    const stageW = 1180
    const stageH = 1776
    const minScale = 0.8
    // 单卡两段时长：静止展示 + 移出；总时长 = (holdSec + moveSec) * 卡片数量
    const holdSec = props?.holdSec ?? (4 / 3)
    const moveSec = props?.moveSec ?? (8 / 3)
    const cardNum = 3
    const step = holdSec + moveSec
    const totalCycleSec = cardNum * step

    // 将单卡时长拆成 6 段：hold 2 段、move 4 段（与原 values 配置一致）
    const keyTimes = useMemo(() => {
        const t0 = 0
        const t1 = (holdSec / 2) / totalCycleSec
        const t2 = (holdSec) / totalCycleSec
        const seg = (moveSec / 4) / totalCycleSec
        const t3 = t2 + seg
        const t4 = t3 + seg
        const t5 = t4 + seg
        const t6 = 1
        return [t0, t1, t2, t3, t4, t5, t6].map(v => round(v, 9)).join(';')
    }, [holdSec, moveSec, totalCycleSec])
    const cubic = "0.42 0 0.58 1.0"
    const keySplines = useMemo(() => Array.from({ length: 6 }, () => cubic).join(";"), [])
    const scaleValues = "1;1;1.125;1.125;1.25;1.25;1.25"
    const translateValues = "0 0;0 0;-50 0;-50 0;-100 0;-100 0;-1180 0"

    // 原始三图（保持与 HTML 一致的顺序与映射）
    const urlA = getTextImgPic1(1080, 1776, "1")
    const urlB = getTextImgPic1(1080, 1776, "2")
    const urlC = getTextImgPic1(1080, 1776, "3")
    const urls = [urlA, urlB, urlC]

    // 背景淡入层对应图片顺序（C1→urlC, C2→urlB, C3→urlA）
    const bgUrls = [urlC, urlB, urlA]

    // 三组前景的开始时间（G3, G2, G1）与每组子层相对偏移（按 step 锁定）
    const groupBegins = [2 * step, 1 * step, 0]
    const childBeginOffsets = [0, -1 * step, -2 * step]
    const childOpacityValues = [
        "1;1;1;0;0;0;0",
        "0;0;1;1;1;0;0",
        "0;0;0;0;1;1;1",
    ]

    const rotateRight = (arr: string[], k: number) => {
        const n = arr.length
        const s = ((k % n) + n) % n
        if (s === 0) return arr
        return [...arr.slice(n - s), ...arr.slice(0, n - s)]
    }

    return (
        <SectionEx
            data-label="poker-slide-three"
            style={{
                WebkitTouchCallout: "none",
                userSelect: "text",
                overflow: "hidden",
                textAlign: "center",
                lineHeight: 0,
                marginBottom: 0,
            }}
        >
            <SvgEx
                style={{
                    display: "inline-block",
                    width: "100%",
                    verticalAlign: "top",
                    WebkitTapHighlightColor: "transparent",
                    WebkitUserSelect: "none",
                }}
                viewBox={`0 0 ${stageW} ${stageH}`}
                data-label="扑克滑动_默认3图"
            >
                {/* 背景淡入层：C1(0s), C2(1*step), C3(2*step) */}
                {bgUrls.map((bgUrl, i) => {
                    const begin = i * step
                    console.log("fade-begin",begin,i,bgUrl)
                    return (
                        <g data-name={`C${i + 1}-fade`} key={`bg-${i}`}>
                            <g transform={`translate(${stageW},${picH / 2}) scale(${minScale})`}>
                                <animate
                                    attributeName="opacity"
                                    values="0;1;0;0;0;0;0"
                                    begin={`${begin}s`}
                                    dur={`${totalCycleSec}s`}
                                    keyTimes={keyTimes}
                                    calcMode="discrete"
                                    repeatCount="indefinite"
                                />
                                <g transform={`translate(-${picW},-${picH / 2})`} data-name={`C${i + 1}`}>
                                    <foreignObject width={picW} height={picH}>
                                        <SvgEx
                                            data-label="扑克滑动_默认3图"
                                            style={{
                                                backgroundImage: svgURL(bgUrl),
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                display: "block",
                                                lineHeight: 0,
                                                marginTop: 0,
                                            }}
                                            viewBox={`0 0 ${picW} ${picH}`}
                                        />
                                    </foreignObject>
                                </g>
                            </g>
                        </g>
                    )
                })}

                {/* 前景滑动层：G3, G2, G1 与精确子层时序 */}
                {groupBegins.map((groupBegin, groupIdx) => {
                    // 每组的图片顺序：G1→[A,B,C]，G2→右旋1位 [C,A,B]，G3→右旋2位 [B,C,A]
                    const groupUrls = rotateRight(urls, 2 - groupIdx)
                    console.log("slide-brgin",groupBegin,groupIdx)
                    return (
                        <g data-name={`G${3 - groupIdx}`} transform={`translate(100,0)`} key={`fg-${groupIdx}`}>
                            <animate
                                attributeName="opacity"
                                values="1;1;1;0;0;0;0"
                                begin={`${groupBegin}s`}
                                dur={`${totalCycleSec}s`}
                                keyTimes={keyTimes}
                                calcMode="discrete"
                                repeatCount="indefinite"
                            />
                            {groupUrls.map((url, j) => {
                                const childBegin = groupBegin + childBeginOffsets[j]
                                console.log("child-begin",childBegin,url)
                                return (
                                    <g key={`fg-${groupIdx}-child-${j}`}>
                                        <g transform={`translate(${picW},${picH / 2}) scale(${minScale})`}>
                                            <animateTransform
                                                attributeName="transform"
                                                type="scale"
                                                values={scaleValues}
                                                begin={`${childBegin}s`}
                                                dur={`${totalCycleSec}s`}
                                                keyTimes={keyTimes}
                                                additive="sum"
                                                calcMode="spline"
                                                keySplines={keySplines}
                                                repeatCount="indefinite"
                                            />
                                            <animateTransform
                                                attributeName="transform"
                                                type="translate"
                                                values={translateValues}
                                                begin={`${childBegin}s`}
                                                dur={`${totalCycleSec}s`}
                                                keyTimes={keyTimes}
                                                additive="sum"
                                                calcMode="spline"
                                                keySplines={keySplines}
                                                repeatCount="indefinite"
                                            />
                                            <animate
                                                attributeName="opacity"
                                                values={childOpacityValues[j]}
                                                begin={`${childBegin}s`}
                                                dur={`${totalCycleSec}s`}
                                                keyTimes={keyTimes}
                                                calcMode="discrete"
                                                repeatCount="indefinite"
                                            />
                                            <g transform={`translate(-${picW},-${picH / 2})`} data-name={`C${j + 1}`}>
                                                <foreignObject width={picW} height={picH}>
                                                    <SvgEx
                                                        data-label="扑克滑动_默认3图"
                                                        style={{
                                                            backgroundImage: svgURL(url),
                                                            backgroundSize: "cover",
                                                            backgroundRepeat: "no-repeat",
                                                            display: "block",
                                                            lineHeight: 0,
                                                            marginTop: 0,
                                                        }}
                                                        viewBox={`0 0 ${picW} ${picH}`}
                                                    />
                                                </foreignObject>
                                            </g>
                                        </g>
                                    </g>
                                )
                            })}
                        </g>
                    )
                })}
            </SvgEx>
        </SectionEx>
    );
};

export default PokerSlideThree;

