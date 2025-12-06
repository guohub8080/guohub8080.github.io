/**
 * 正弦类缓动函数的贝塞尔曲线值
 * 
 * 基于正弦曲线（sin(x)）生成，速度变化平滑自然
 * 
 * 数据来源验证：
 * - easings.net (权威) : https://easings.net/
 * - Robert Penner's Easing Functions
 */
const SINE_BEZIER_VALUES = {
    in: "0.47 0 0.745 0.715",         // easeInSine: 开始缓慢，逐渐加速
    out: "0.39 0.575 0.565 1",        // easeOutSine: 开始快速，逐渐减速
    inOut: "0.445 0.05 0.55 0.95",    // easeInOutSine: 首尾平滑，中间加速
} as const;

/**
 * 获取正弦缓动的贝塞尔曲线值
 * 
 * @description
 * 基于正弦曲线生成的缓动函数，速度变化平滑自然
 * 类似物理世界中的自然运动（物体滚落斜坡、钟摆运动等）
 * 
 * 运动特征：
 * - easeInSine: 开始缓慢，逐渐加速，类似物体从斜坡滚落
 * - easeOutSine: 开始快速，逐渐减速，类似物体冲上斜坡后停下
 * - easeInOutSine: 首尾平滑，中间加速，类似钟摆运动
 * 
 * 适用场景：
 * - easeInSine: 元素平滑进入视野、图片渐显
 * - easeOutSine: 元素平滑退出视野、滑动停止
 * - easeInOutSine: 页面过渡、模态框动画、自然的往返运动
 * 
 * @example
 * // easeInOutSine（默认）：首尾平滑，中间加速
 * getSineBezier()
 * // => "0.445 0.05 0.55 0.95"
 * 
 * getSineBezier({ isIn: false, isOut: false })
 * // => "0.445 0.05 0.55 0.95"
 * 
 * // easeInSine: 开始缓慢，逐渐加速
 * getSineBezier({ isIn: true, isOut: false })
 * // => "0.47 0 0.745 0.715"
 * 
 * // easeOutSine: 开始快速，逐渐减速
 * getSineBezier({ isIn: false, isOut: true })
 * // => "0.39 0.575 0.565 1"
 * 
 * // easeInOutSine（显式指定）
 * getSineBezier({ isIn: true, isOut: true })
 * // => "0.445 0.05 0.55 0.95"
 */
export function getSineBezier(options?: {
    isIn?: boolean
    isOut?: boolean
}): string {
    const { isIn = false, isOut = false } = options || {};

    // in: 开始缓慢，逐渐加速
    if (isIn && !isOut) {
        return SINE_BEZIER_VALUES.in;
    }

    // out: 开始快速，逐渐减速
    if (!isIn && isOut) {
        return SINE_BEZIER_VALUES.out;
    }

    // in-out（默认）：首尾平滑，中间加速，类似钟摆运动
    // 当 isIn && isOut 或 !isIn && !isOut 时都返回这个
    return SINE_BEZIER_VALUES.inOut;
}

/**
 * 正弦缓动常量（便于直接使用）
 */
export const SINE_BEZIER = {
    in: SINE_BEZIER_VALUES.in,
    out: SINE_BEZIER_VALUES.out,
    inOut: SINE_BEZIER_VALUES.inOut,
} as const;

