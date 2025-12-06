/**
 * 弹性缓动函数的贝塞尔曲线值生成器（单次过冲近似）
 * 
 * ⚠️ 重要说明：
 * 真正的弹性缓动基于正弦振荡和指数衰减（sin + pow），包含多次来回弹跳
 * 三次贝塞尔曲线无法精确表示周期性振荡，这里提供的是单次过冲的近似效果
 * 
 * 适用场景：
 * - 微信公众号 SVG 动画（仅支持 keySplines）
 * - 需要类似弹簧效果但无法使用 JavaScript 的环境
 * 
 * 如果你的环境支持 JavaScript，建议使用：
 * - GSAP、Anime.js 等动画库
 * - Web Animations API
 * - Robert Penner's Easing Functions
 * 
 * 数学原理：
 * - 通过让贝塞尔曲线的 y 值超出 [0, 1] 范围来实现过冲效果
 * - y > 1: 动画值会超过目标值（正向过冲）
 * - y < 0: 动画值会低于起始值（负向过冲/回退）
 */

/**
 * 计算弹性缓动的贝塞尔曲线控制点
 */
function calculateElasticBezier(
    type: 'in' | 'out' | 'inOut',
    intensity: number
): string {
    // 限制 intensity 在合理范围内
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    
    if (type === 'out') {
        // easeOutElastic: 结尾过冲
        // 开始正常，结尾超过目标值后回弹
        const y1 = -clampedIntensity;
        const y2 = 1 + clampedIntensity;
        return `0.68 ${y1} 0.265 ${y2}`;
    }
    
    if (type === 'in') {
        // easeInElastic: 开头回退
        // 开始时先回退（负值），然后冲向目标
        const y1 = -clampedIntensity;
        const y2 = 1 + clampedIntensity * 0.5; // in 的结尾过冲较小
        return `${0.6 - clampedIntensity * 0.1} ${y1} 0.735 ${y2}`;
    }
    
    // easeInOutElastic: 两端都有过冲
    // 开头回退，结尾过冲
    const y1 = -clampedIntensity;
    const y2 = 1 + clampedIntensity;
    return `0.68 ${y1} 0.265 ${y2}`;
}

/**
 * 获取弹性缓动的贝塞尔曲线值
 * 
 * @description
 * 生成模拟弹簧过冲效果的贝塞尔曲线值（单次过冲近似）
 * 
 * 函数名说明：0_1 表示 intensity 参数范围为 0-1
 * 
 * 运动特征：
 * - easeOutElastic: 元素超过目标位置后回弹（常见）
 * - easeInElastic: 元素先回退再冲向目标
 * - easeInOutElastic: 开头回退，结尾过冲
 * 
 * 适用场景：
 * - easeOutElastic: 弹出菜单、通知提示、按钮反馈
 * - easeInElastic: 元素收缩效果、返回动画
 * - easeInOutElastic: 强调性动画、游戏特效
 * 
 * 强度建议：
 * - 0.3 = 温和弹性（30%过冲）- 适合正式场景
 * - 0.55 = 标准弹性（55%过冲）- 默认值，平衡效果
 * - 0.8 = 强烈弹性（80%过冲）- 适合游戏或娱乐场景
 * 
 * @param options.isIn - 是否为缓入
 * @param options.isOut - 是否为缓出
 * @param options.intensity - 剧烈程度 (0-1)，默认 0.55
 *   - 0 = 无过冲（退化为普通缓动）
 *   - 0.3 = 温和弹性
 *   - 0.55 = 标准弹性（推荐）
 *   - 0.8 = 强烈弹性
 *   - 1 = 极限弹性（可能过于夸张）
 * 
 * @example
 * // easeOutElastic（默认）：结尾过冲，标准强度
 * getElasticBezier0_1({})
 * // => "0.68 -0.55 0.265 1.55"
 * 
 * // 温和的 easeOutElastic
 * getElasticBezier0_1({ intensity: 0.3 })
 * // => "0.68 -0.3 0.265 1.3"
 * 
 * // 强烈的 easeOutElastic
 * getElasticBezier0_1({ intensity: 0.8 })
 * // => "0.68 -0.8 0.265 1.8"
 * 
 * // easeInElastic: 开头回退
 * getElasticBezier0_1({ isIn: true, isOut: false })
 * 
 * // easeInOutElastic: 两端过冲
 * getElasticBezier0_1({ isIn: true, isOut: true, intensity: 0.6 })
 * 
 * // 无过冲（退化为普通缓动）
 * getElasticBezier0_1({ intensity: 0 })
 * // => "0.68 0 0.265 1"
 */
export function getElasticBezier0_1(options: {
    isIn?: boolean
    isOut?: boolean
    intensity?: number
}): string {
    const { 
        isIn = false, 
        isOut = false, 
        intensity = 0.55  // 默认 55% 过冲
    } = options;

    // in: 开头回退
    if (isIn && !isOut) {
        return calculateElasticBezier('in', intensity);
    }

    // out: 结尾过冲
    if (!isIn && isOut) {
        return calculateElasticBezier('out', intensity);
    }

    // in-out（默认）：两端都有过冲
    return calculateElasticBezier('inOut', intensity);
}

/**
 * 弹性缓动常量（便于直接使用）
 * 使用标准过冲幅度 (0.55)
 */
export const ELASTIC_BEZIER = {
    in: calculateElasticBezier('in', 0.55),
    out: calculateElasticBezier('out', 0.55),
    inOut: calculateElasticBezier('inOut', 0.55),
} as const;

/**
 * 弹性缓动预设（不同强度）
 */
export const ELASTIC_PRESETS = {
    mild: {
        in: calculateElasticBezier('in', 0.3),
        out: calculateElasticBezier('out', 0.3),
        inOut: calculateElasticBezier('inOut', 0.3),
    },
    normal: {
        in: calculateElasticBezier('in', 0.55),
        out: calculateElasticBezier('out', 0.55),
        inOut: calculateElasticBezier('inOut', 0.55),
    },
    strong: {
        in: calculateElasticBezier('in', 0.8),
        out: calculateElasticBezier('out', 0.8),
        inOut: calculateElasticBezier('inOut', 0.8),
    },
} as const;

