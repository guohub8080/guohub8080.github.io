/**
 * 圆形类缓动函数的贝塞尔曲线值
 * 
 * 基于圆形方程（sqrt(1-x²)）生成，速度变化类似物体沿圆形轨迹运动
 * 
 * 数据来源验证：
 * - easings.net (权威) : https://easings.net/
 * - Robert Penner's Easing Functions
 */
const CIRCLE_BEZIER_VALUES = {
    in: "0.6 0.04 0.98 0.335",         // easeInCirc: 开始缓慢，逐渐加速
    out: "0.075 0.82 0.165 1",         // easeOutCirc: 开始快速，逐渐减速
    inOut: "0.785 0.135 0.15 0.86",    // easeInOutCirc: 首尾平滑，中间加速
} as const;

/**
 * 获取圆形缓动的贝塞尔曲线值
 * 
 * @description
 * 基于圆形方程（sqrt(1-x²)）生成的缓动函数
 * 速度变化类似物体沿圆形轨迹运动
 * 
 * 运动特征：
 * - easeInCirc: 开始缓慢，逐渐加速，类似物体从圆形底部向上滑动
 * - easeOutCirc: 开始快速，逐渐减速，类似物体从圆形顶部向下滑动
 * - easeInOutCirc: 首尾平滑，中间加速，类似物体沿圆形轨迹完整运动一周
 * 
 * 适用场景：
 * - easeInCirc: 按钮按压效果、进度条填充
 * - easeOutCirc: 元素平滑落地、滑动卡片回收
 * - easeInOutCirc: 旋转动画、环形进度、圆形菜单展开
 * 
 * @example
 * // easeInOutCirc（默认）：首尾平滑，中间加速
 * getCircleBezier()
 * // => "0.785 0.135 0.15 0.86"
 * 
 * getCircleBezier({ isIn: false, isOut: false })
 * // => "0.785 0.135 0.15 0.86"
 * 
 * // easeInCirc: 开始缓慢，逐渐加速
 * getCircleBezier({ isIn: true, isOut: false })
 * // => "0.6 0.04 0.98 0.335"
 * 
 * // easeOutCirc: 开始快速，逐渐减速
 * getCircleBezier({ isIn: false, isOut: true })
 * // => "0.075 0.82 0.165 1"
 * 
 * // easeInOutCirc（显式指定）
 * getCircleBezier({ isIn: true, isOut: true })
 * // => "0.785 0.135 0.15 0.86"
 */
export function getCircleBezier(options?: {
    isIn?: boolean
    isOut?: boolean
}): string {
    const { isIn = false, isOut = false } = options || {};

    // in: 开始缓慢，逐渐加速
    if (isIn && !isOut) {
        return CIRCLE_BEZIER_VALUES.in;
    }

    // out: 开始快速，逐渐减速
    if (!isIn && isOut) {
        return CIRCLE_BEZIER_VALUES.out;
    }

    // in-out（默认）：首尾平滑，中间加速
    return CIRCLE_BEZIER_VALUES.inOut;
}

/**
 * 圆形缓动常量（便于直接使用）
 */
export const CIRCLE_BEZIER = {
    in: CIRCLE_BEZIER_VALUES.in,
    out: CIRCLE_BEZIER_VALUES.out,
    inOut: CIRCLE_BEZIER_VALUES.inOut,
} as const;

