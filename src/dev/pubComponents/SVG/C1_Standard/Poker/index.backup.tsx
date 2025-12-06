import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import { useMemo } from "react";
import { range } from "lodash";

/**
 * 扑克滑动3图（React重构，先写死数据）
 * 说明：基于原始SVG/SMIL动画移植，保持视觉与时序一致
 *
 * 动画结构与数量：
 * - 背景淡入层：C1/C2/C3 共3组；每组1个不连续不透明度动画（opacity）→ 3个动画
 * - 前景滑动层：G1/G2/G3 共3组；每组包含3个子层（对应3张图不同位相）
 *   - 每个子层包含：scale动画1个、translate动画1个、opacity动画1个 → 3个/子层
 *   - 组级别还有1个整体opacity动画 → 1个/组
 *   - 因此每组动画数：3子层×3 + 1 = 10个；三组共 30 个
 * - 全部动画节点合计：背景3 + 前景30 = 33 个
 *
 * 图片顺序：输入为 [1,2,3]，在组件初始化用 useMemo 反转为 [3,2,1] 后使用。
 *
 * 舞台（stage）与卡牌比例说明：
 * - 卡牌尺寸由 picW/picH 描述（本例：1080x1776）。
 * - 舞台尺寸由 viewBox 决定：stageW = picW + padX，stageH = picH。
 *   因为加了 padX 侧向缓冲区，舞台比卡牌更宽；只有当 padX=0 时，舞台比例才与卡牌比例一致。
 * - 当前取值：picW=1080, picH=1776, padX=100 → stageW=1180, stageH=1776。
 *   因此舞台宽高比为 1180:1776（≈0.664），卡牌为 1080:1776（≈0.608），舞台更宽是为了给滑出动画留空间。
 * - 如果希望舞台与卡牌比例一致：将 padX 设为 0；或让 padX 随尺寸按比例缩放（例如相对 picW 的百分比）。
 * - 外部容器宽度不固定时，viewBox 会等比缩放整个动画；可按需设置 preserveAspectRatio="xMidYMid meet" 防止拉伸、保持居中。
 */
const PokerSlideThree = (props: { direction?: 'L' | 'R' | 'T' | 'D' }) => {
    // 基础尺寸与舞台参数（舞台更宽：为横向滑出预留 padX 缓冲区）
    // 卡牌单张实际宽度（像素）
    const picW = 1080
    // 卡牌单张实际高度（像素）
    const picH = 1776
    // 舞台相对卡牌额外预留的左右缓冲（像素），可按比例与卡牌宽度关联
    const padX = 100
    const direction = props?.direction ?? 'L'
    // 舞台几何派生：宽/高与中心点（依赖 picW/picH/padX/direction）
    const { stageW, stageH, centerX, centerY, groupOffset } = useMemo(() => {
        const isHorizontal = direction === 'L' || direction === 'R'
        const stageW = isHorizontal ? (picW + padX) : picW
        const stageH = isHorizontal ? picH : (picH + padX)
        // 当向右(R)时，卡牌贴左，所以 centerX=picW，组偏移=0；向左(L)时 centerX=stageW，组偏移=padX
        // 纵向同理：向上(T)贴底，向下(D)贴顶
        const centerX = isHorizontal ? (direction === 'R' ? picW : stageW) : picW
        const centerY = isHorizontal ? (picH / 2) : (direction === 'D' ? picH : stageH)
        const groupOffset = isHorizontal
            ? (direction === 'R' ? `translate(0,0)` : `translate(${padX},0)`)
            : (direction === 'D' ? `translate(0,0)` : `translate(0,${padX})`)
        return { stageW, stageH, centerX, centerY, groupOffset }
    }, [picW, picH, padX, direction])
    // 位移派生：半程/全程/移出 以及 translate 动画 values（依赖 picW/picH/padX/direction）
    const { moveHalf, moveFull, moveOff } = useMemo(() => {
        const isHorizontal = direction === 'L' || direction === 'R'
        const sign = (direction === 'L' || direction === 'T') ? -1 : 1
        // R 时向右抽：从左边贴边起步；L 时向左抽：从右边贴边起步
        // 因此半程/全程用与方向一致的正负号
        const half = sign * (padX / 2)
        const full = sign * padX
        // 为保证 L/R 视觉对称，离场距离取整段舞台尺寸（stageW 或 stageH）
        const off = sign * (isHorizontal ? stageW : stageH)
        return { moveHalf: half, moveFull: full, moveOff: off }
    }, [picW, picH, padX, stageW, stageH, direction])

    // 缩放/内容定位锚点：决定卡片初始可见侧（依赖 picW/picH/direction）
    const { scaleAnchorX, scaleAnchorY } = useMemo(() => {
        const isHorizontal = direction === 'L' || direction === 'R'
        if (isHorizontal) {
            // 水平：R 贴左（0），L 贴右（picW）
            return { scaleAnchorX: direction === 'R' ? 0 : picW, scaleAnchorY: picH / 2 }
        }
        // 垂直：D 贴顶（0），T 贴底（picH）
        return { scaleAnchorX: picW, scaleAnchorY: direction === 'D' ? 0 : picH }
    }, [picW, picH, direction])

    // 总体动画时长（秒）。所有 SMIL 动画的 dur 建议取自该值
    const durationSec = 4

    // 最小缩放比例（基线），所有卡片初始按该比例显示
    const minScale = 0.8
    // 依赖 minScale 与 keyCount 的派生量：最大倍率/中间倍率/scale 动画 values（长度与 keyCount 一致）
    // 分段规则（按 t=i/(keyCount-1)）：[0,1/3)→1，[1/3,2/3)→mid，[2/3,1)→max，末帧固定为 max
    const getScaleValues = (keyCountLocal: number) => {
        const maxMul = 1 / minScale
        const midMul = (1 + maxMul) / 2
        const K = keyCountLocal
        const vals: number[] = []
        for (let i = 0; i < K; i++) {
            const t = K === 1 ? 1 : i / (K - 1)
            let v = 1
            if (t >= 2 / 3) v = maxMul
            else if (t >= 1 / 3) v = midMul
            else v = 1
            vals.push(v)
        }
        return vals.join(';')
    }

    const baseUrls = useMemo(() => [
        getTextImgPic1(1080, 1776, "1"),
        getTextImgPic1(1080, 1776, "2"),
        getTextImgPic1(1080, 1776, "3"),
    ], [])
    const urls = useMemo(() => {
        return [...baseUrls].reverse()
    }, [baseUrls])
    // 卡牌数量（按基础数组长度计算）
    const cardNum = baseUrls.length

    // 通用时序/曲线（从 HTML 还原，统一使用 cubic-bezier(0.42, 0, 0.58, 1.0)）
    // 为避免卡片数增大时可见窗口冲突：keyCount 至少为 cardNum+2（且不小于 7 以兼容原视觉节奏）
    const keyCount = Math.max(7, cardNum + 2)
    const intervalCount = keyCount - 1
    const keyTimesStr = useMemo(() => Array.from({ length: keyCount }, (_, k) => (k / intervalCount)).join(';'), [])
    const cubic = "0.42 0 0.58 1.0"
    const keySplines6 = useMemo(() => Array.from({ length: intervalCount }, () => cubic).join(';'), [])

    // 构造序列 [0..cardNum-1] 与其逆序，注意避免 reverse() 的原地变异
    const cardNumArray = useMemo(() => range(cardNum), [cardNum])
    const cardNumArrayReverse = useMemo(() => [...cardNumArray].reverse(), [cardNumArray])

    // 由公式生成每个子层的不透明度离散序列（长度=keyCount），窗口可见段长度为 3
    const childOpacityValuesList = useMemo(() => {
        const windowLen = 3
        const lastStart = keyCount - windowLen
        if (cardNum <= 1) {
            return [Array.from({ length: keyCount }, () => '1').join(';')]
        }
        return cardNumArray.map((j) => {
            // 按比例将窗口均匀铺满 0..lastStart（对齐 HTML 的 0,2,4 模式）
            const start = Math.round((lastStart * j) / (cardNum - 1))
            const seq = Array.from({ length: keyCount }, () => '0')
            for (let k = start; k < start + windowLen; k++) {
                seq[k] = '1'
            }
            return seq.join(';')
        })
        // 依赖 cardNumArray/keyCount
    }, [cardNumArray, keyCount])

    // 背景层不透明度序列（长度=keyCount）：仅第二个关键帧为 1，其余为 0
    const bgOpacityValues = useMemo(() => {
        if (keyCount <= 1) return '1'
        const seq = Array.from({ length: keyCount }, () => '0')
        seq[1] = '1'
        return seq.join(';')
    }, [keyCount])

    // 动态生成与 keyCount 对齐的 scale/translate values 字符串
    const scaleValues = useMemo(() => getScaleValues(keyCount), [keyCount, minScale])
    const translateValues = useMemo(() => {
        const K = keyCount
        const vals: string[] = []
        for (let i = 0; i < K; i++) {
            if (i === K - 1) {
                // 末帧离场
                vals.push(`${(direction === 'L' || direction === 'R') ? moveOff + ' 0' : '0 ' + moveOff}`)
                continue
            }
            const t = K === 1 ? 1 : i / (K - 1)
            let v = 0
            if (t >= 2 / 3) v = moveFull
            else if (t >= 1 / 3) v = moveHalf
            else v = 0
            vals.push(`${(direction === 'L' || direction === 'R') ? v + ' 0' : '0 ' + v}`)
        }
        return vals.join(';')
    }, [keyCount, moveHalf, moveFull, moveOff, direction])

    return (
        <SectionEx
            style={{
                WebkitTouchCallout: "none",
                userSelect: "text",
                overflow: "hidden",
                textAlign: "center",
                lineHeight: 0,
                marginBottom: 0,
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
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
                {/* 背景淡入淡出层（map 生成，按 cardNum 均分时序） */}
                {cardNumArray.map((_, i) => {
                    const step = durationSec / cardNum
                    // 与原 HTML 一致（按名称）：C1→0s, C2→1*step, C3→2*step
                    const begin = i * step
                    return (
                        <g data-name={`C${i + 1}-fade`} key={`bg-${i}`}>
                            <g transform={`translate(${centerX},${centerY}) scale(${minScale})`}>
                                <animate
                                    attributeName="opacity"
                                    values="0;1;0;0;0;0;0"
                                    begin={begin + 's'}
                                    dur={`${durationSec}s`}
                                    keyTimes={keyTimesStr}
                                    calcMode="discrete"
                                    repeatCount="indefinite"
                                />
                                <g transform={`translate(-${scaleAnchorX},-${scaleAnchorY})`} data-name={`C${i + 1}`}>
                                    <foreignObject width={picW} height={picH}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            data-label="扑克滑动_默认3图"
                                            style={{
                                                backgroundImage: `url(${urls[i % urls.length]})`,
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

                {/* 前景滑动与缩放层（map 生成：G{cardNum} → ... → G1） */}
                {/* {cardNumArrayReverse.map((g) => {
                    const step = durationSec / cardNum
                    const groupBegin = g * step
                    // 统一使用与 HTML 一致的贝塞尔曲线；无需硬编码 g === 2
                    return (
                        <g data-name={`G${g + 1}`} transform={groupOffset} key={`fg-${g}`}>
                            <animate
                                attributeName="opacity"
                                values="1;1;1;0;0;0;0"
                                begin={`${groupBegin}s`}
                dur={`${durationSec}s`}
                                keyTimes={keyTimesStr}
                                calcMode="discrete"
                                repeatCount="indefinite"
                            />
                            {Array.from({ length: cardNum }).map((_, j) => {
                                // 与原 HTML 一致：允许负 begin，用于跨组对齐相位
                                const childBegin = (g - j) * step
                                const urlIdx = (j - g + cardNum) % cardNum
                                return (
                                    <g key={`fg-${g}-child-${j}`}>
                        <g transform={`translate(${scaleAnchorX},${scaleAnchorY}) scale(${minScale})`}>
              <animateTransform
                                attributeName="transform"
                                type="scale"
                values={scaleValues}
                                                begin={`${childBegin}s`}
                dur={`${durationSec}s`}
                                                keyTimes={keyTimesStr}
                                additive="sum"
                calcMode="spline"
                                                keySplines={keySplines6}
                                repeatCount="indefinite"
                            />
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values={translateValues}
                                                begin={`${childBegin}s`}
                dur={`${durationSec}s`}
                                                keyTimes={keyTimesStr}
                                additive="sum"
                calcMode="spline"
                                                keySplines={keySplines6}
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="opacity"
                                                values={childOpacityValuesList[j]}
                                                begin={`${childBegin}s`}
                dur={`${durationSec}s`}
                                                keyTimes={keyTimesStr}
                                calcMode="discrete"
                                repeatCount="indefinite"
                            />
                                            <g transform={`translate(-${scaleAnchorX},-${scaleAnchorY})`} data-name={`C${j + 1}`}>
                                <foreignObject width={picW} height={picH}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        data-label="扑克滑动_默认3图"
                                        style={{
                                                            backgroundImage: `url(${urls[urlIdx]})`,
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
                })} */}
            </svg>
        </SectionEx>
    );
};

export default PokerSlideThree;



