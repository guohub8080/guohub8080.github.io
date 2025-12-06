/**
 * 指数类缓动函数的贝塞尔曲线值
 * 
 * 基于指数函数（2^x）生成，速度变化呈指数级增长或衰减
 * 
 * 数据来源验证：
 * - easings.net (权威) : https://easings.net/
 * - Robert Penner's Easing Functions
 */
const EXPO_BEZIER_VALUES = {
    in: "0.95 0.05 0.795 0.035",       // easeInExpo: 开始几乎静止，随后瞬间加速至极限
    out: "0.19 1 0.22 1",              // easeOutExpo: 开始速度极高，随后瞬间停止
    inOut: "1 0 0 1",                  // easeInOutExpo: 先指数加速，再指数减速
} as const;

/**
 * 获取指数缓动的贝塞尔曲线值
 * 
 * @description
 * 基于指数函数（2^x）生成的缓动函数，速度变化呈指数级增长或衰减
 * 效果极其强烈，适合需要戏剧性效果的场景
 * 
 * 运动特征：
 * - easeInExpo: 开始几乎静止，随后瞬间加速至极限（类似核反应启动）
 * - easeOutExpo: 开始速度极高，随后瞬间停止（类似激光束突然关闭）
 * - easeInOutExpo: 先指数加速，再指数减速，首尾几乎无运动
 * 
 * 适用场景：
 * - easeInExpo: 强调"瞬间爆发"的动画，如炸弹爆炸、能量蓄积释放
 * - easeOutExpo: 元素瞬间消失、数据加载完成提示、闪电特效
 * - easeInOutExpo: 极端的戏剧性效果、游戏技能释放、科幻界面
 * 
 * ⚠️ 注意：
 * 指数缓动效果非常强烈，可能造成视觉冲击
 * 建议谨慎使用，避免在用户体验关键路径上使用
 * 
 * @example
 * // easeInOutExpo（默认）：先指数加速，再指数减速
 * getExpoBezier()
 * // => "1 0 0 1"
 * 
 * getExpoBezier({ isIn: false, isOut: false })
 * // => "1 0 0 1"
 * 
 * // easeInExpo: 开始静止，瞬间爆发
 * getExpoBezier({ isIn: true, isOut: false })
 * // => "0.95 0.05 0.795 0.035"
 * 
 * // easeOutExpo: 极速启动，瞬间停止
 * getExpoBezier({ isIn: false, isOut: true })
 * // => "0.19 1 0.22 1"
 * 
 * // easeInOutExpo（显式指定）
 * getExpoBezier({ isIn: true, isOut: true })
 * // => "1 0 0 1"
 */
export function getExpoBezier(options?: {
    isIn?: boolean
    isOut?: boolean
}): string {
    const { isIn = false, isOut = false } = options || {};

    // in: 开始几乎静止，随后瞬间加速至极限
    if (isIn && !isOut) {
        return EXPO_BEZIER_VALUES.in;
    }

    // out: 开始速度极高，随后瞬间停止
    if (!isIn && isOut) {
        return EXPO_BEZIER_VALUES.out;
    }

    // in-out（默认）：先指数加速，再指数减速，首尾几乎无运动
    return EXPO_BEZIER_VALUES.inOut;
}

/**
 * 指数缓动常量（便于直接使用）
 */
export const EXPO_BEZIER = {
    in: EXPO_BEZIER_VALUES.in,
    out: EXPO_BEZIER_VALUES.out,
    inOut: EXPO_BEZIER_VALUES.inOut,
} as const;

