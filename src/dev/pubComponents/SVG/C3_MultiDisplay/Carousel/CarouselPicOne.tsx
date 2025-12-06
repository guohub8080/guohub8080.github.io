/* eslint-disable no-mixed-spaces-and-tabs */
import { useMemo } from "react";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import SeamlessImg from "../../C1_Standard/SeamlessImg";

/**
 * 单张图片组件
 * 负责渲染单张图片及其动画
 */
const CarouselPicOne = (props: {
    viewBoxW?: number
    viewBoxH?: number
    url: string
    duration: number
    isTouchable: boolean
    direction: "L" | "R" | "T" | "B"
    currentIndex: number  // 当前第N张
    lastIndex: number     // 总共多少张
    keySplines: string    // 自定义贝塞尔曲线
}) => {
    const moveStep: string = useMemo(() => {
        if (props.direction === "L") {
            return `${props.viewBoxW} 0;0 0;` + new Array(props.lastIndex).fill(`${props.viewBoxW * -1} 0;`).join('')
        }
        if (props.direction === "R") {
            return `${props.viewBoxW * -1} 0;0 0;` + new Array(props.lastIndex).fill(`${props.viewBoxW} 0;`).join('')
        }
        if (props.direction === "T") {
            return `0 ${props.viewBoxH};0 0;` + new Array(props.lastIndex).fill(`0 ${props.viewBoxH * -1};`).join('')
        }
        if (props.direction === "B") {
            return `0 ${props.viewBoxH * -1};0 0;` + new Array(props.lastIndex).fill(`0 ${props.viewBoxH};`).join('')
        }
        console.error("direction is not valid", props.direction)
    }, [props.direction, props.lastIndex, props.viewBoxH, props.viewBoxW])

    // 计算 keyTimes 和 keySplines
    const { keyTimes, keySplines } = useMemo(() => {
        // values 有 lastIndex + 2 个值（初始位置 + 中心 + lastIndex个移出位置）
        const totalFrames = props.lastIndex + 2
        const times: number[] = []
        const splines: string[] = []
        
        // 生成均匀分布的 keyTimes
        for (let i = 0; i < totalFrames; i++) {
            times.push(i / (totalFrames - 1))
        }
        
        // 生成 keySplines（需要 totalFrames - 1 个）
        // 使用用户传入的贝塞尔曲线，
        const splineValue = props.keySplines
        for (let i = 0; i < totalFrames - 1; i++) {
            splines.push(splineValue)
        }
        
        return {
            keyTimes: times.join(';'),
            keySplines: splines.join(';')
        }
    }, [props.lastIndex, props.keySplines])

    return <g>
        <foreignObject x={0} y={0} width={props.viewBoxW + 1} height={props.viewBoxH + 1}>
            {!props.isTouchable && <SvgEx
                style={{
                    display: "block",
                    backgroundImage: svgURL(props.url),
                    backgroundSize: "100% auto",
                    backgroundRepeat: "no-repeat",
                }}
                viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
                width="100%"
            />}
            {props.isTouchable && <SeamlessImg url={props.url} />}
        </foreignObject>
        <animateTransform
            attributeName="transform"
            type="translate"
            repeatCount="indefinite"
            values={moveStep}
            calcMode="spline"
            keyTimes={keyTimes}
            keySplines={keySplines}
            fill="freeze"
            begin={`${(props.lastIndex - props.currentIndex) * -1 * props.duration}s`}
            dur={`${props.duration * (props.lastIndex + 1)}s`}
        />
    </g>
}

export default CarouselPicOne;

