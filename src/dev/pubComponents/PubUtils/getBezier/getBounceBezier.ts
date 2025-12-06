/**
 * 反弹类缓动函数的贝塞尔曲线值生成器（单次反弹近似）
 * 
 * ⚠️ 重要说明：
 * 真正的反弹缓动模拟球落地后的多次递减反弹（3-4次跳跃）
 * 三次贝塞尔曲线无法精确表示多次反弹，这里提供的是单次反弹的近似效果
 * 
 * 适用场景：
 * - 微信公众号 SVG 动画（仅支持 keySplines）
 * - 需要类似球落地效果但无法使用 JavaScript 的环境
 * 
 * 如果你的环境支持 JavaScript，建议使用：
 * - GSAP、Anime.js 等动画库
 * - Web Animations API
 * - Robert Penner's Easing Functions
 * 
 * 数学原理：
 * - 通过让贝塞尔曲线的 y 值超出 [0, 1] 范围来实现反弹效果
 * - 与 Elastic（弹性）的区别：Bounce 更突然、更有撞击感
 * - Elastic 像弹簧拉伸，Bounce 像球落地
 */

/**
 * 计算反弹缓动的贝塞尔曲线控制点
 */
function calculateBounceBezier(
    type: 'in' | 'out' | 'inOut',
    intensity: number
): string {
    // 限制 intensity 在合理范围内
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    
    if (type === 'out') {
        // easeOutBounce: 结尾反弹（最常用）
        // 快速下落，撞击后弹起
        // 与 Elastic 的区别：x 值更陡峭，制造"撞击"感
        const y1 = -clampedIntensity;
        const y2 = 1 + clampedIntensity;
        return `0.75 ${y1} 0.22 ${y2}`;  // x 值比 Elastic 更陡峭
    }
    
    if (type === 'in') {
        // easeInBounce: 开头反弹
        // 从上方弹起，最后重重落下
        const y1 = -clampedIntensity;
        const y2 = 1 + clampedIntensity * 0.6;
        return `${0.78 - clampedIntensity * 0.08} ${y1} 0.71 ${y2}`;
    }
    
    // easeInOutBounce: 两端都反弹
    const y1 = -clampedIntensity;
    const y2 = 1 + clampedIntensity;
    return `0.75 ${y1} 0.22 ${y2}`;
}

/**
 * 获取反弹缓动的贝塞尔曲线值
 * 
 * @description
 * 生成模拟球落地反弹效果的贝塞尔曲线值（单次反弹近似）
 * 
 * 函数名说明：0_1 表示 intensity 参数范围为 0-1
 * 
 * 运动特征：
 * - easeOutBounce: 快速下落，撞击地面后弹起（最常用）
 * - easeInBounce: 从地面弹起，最后重重落下
 * - easeInOutBounce: 开头反弹，结尾也反弹
 * 
 * 适用场景：
 * - easeOutBounce: 元素落地效果、通知弹出、分数增加
 * - easeInBounce: 元素收缩、返回原位
 * - easeInOutBounce: 强调性动画、游戏特效
 * 
 * 参数 intensity 剧烈程度对比：
 * - intensity = 0.2 (低强度)：轻轻落地，几乎不弹起
 *   视觉：像羽毛球落地，温柔、克制
 *   场景：正式应用、微妙的反馈
 * 
 * - intensity = 0.5 (中等强度)：明显的弹跳
 *   视觉：像篮球落地，平衡的弹性
 *   场景：通用推荐、大多数场景
 * 
 * - intensity = 0.8 (高强度)：强烈的弹起
 *   视觉：像橡胶球落地，夸张、有活力
 *   场景：游戏、娱乐内容、儿童应用
 * 
 * @param options.isIn - 是否为缓入
 * @param options.isOut - 是否为缓出
 * @param options.intensity - 剧烈程度 (0-1)，默认 0.5
 *   - 0 = 无反弹（直接停下，退化为普通缓动）
 *   - 0.2 = 小反弹（轻轻落地，像羽毛球）
 *   - 0.5 = 中等反弹（标准效果，像篮球）✅ 推荐
 *   - 0.8 = 大反弹（强烈弹起，像橡胶球）
 *   - 1.0 = 极限反弹（可能过于夸张）
 * 
 * 与 Elastic 的区别：
 * - Elastic: 平滑的弹簧拉伸感，"0.68 -0.55 0.265 1.55"
 * - Bounce: 突然的撞击反弹感，"0.75 -0.5 0.22 1.5"
 *           ^^^^^^ 更陡峭的 x 值 ^^^^^ 制造撞击感
 * 
 * @example
 * // easeOutBounce（默认）：落地反弹，中等强度
 * getBounceBezier0_1({})
 * // => "0.75 -0.5 0.22 1.5"
 * 
 * // 低强度：轻轻落地
 * getBounceBezier0_1({ intensity: 0.2 })
 * // => "0.75 -0.2 0.22 1.2"
 * // 效果：像羽毛球，温柔克制
 * 
 * // 中等强度：标准效果
 * getBounceBezier0_1({ intensity: 0.5 })
 * // => "0.75 -0.5 0.22 1.5"
 * // 效果：像篮球，平衡自然
 * 
 * // 高强度：强烈弹起
 * getBounceBezier0_1({ intensity: 0.8 })
 * // => "0.75 -0.8 0.22 1.8"
 * // 效果：像橡胶球，夸张有活力
 * 
 * // easeInBounce: 开头反弹
 * getBounceBezier0_1({ isIn: true, isOut: false, intensity: 0.6 })
 * 
 * // easeInOutBounce: 两端反弹
 * getBounceBezier0_1({ isIn: true, isOut: true, intensity: 0.7 })
 * 
 * // 对比 Elastic（弹簧）和 Bounce（反弹）：
 * getElasticBezier0_1({ intensity: 0.5 })  // 平滑的弹簧感
 * getBounceBezier0_1({ intensity: 0.5 })   // 突然的撞击感
 */
export function getBounceBezier0_1(options: {
    isIn?: boolean
    isOut?: boolean
    intensity?: number
}): string {
    const { 
        isIn = false, 
        isOut = false, 
        intensity = 0.5  // 默认 50% 反弹（中等强度）
    } = options;

    // in: 开头反弹
    if (isIn && !isOut) {
        return calculateBounceBezier('in', intensity);
    }

    // out: 结尾反弹
    if (!isIn && isOut) {
        return calculateBounceBezier('out', intensity);
    }

    // in-out（默认）：两端都反弹
    return calculateBounceBezier('inOut', intensity);
}

/**
 * 反弹缓动常量（便于直接使用）
 * 使用标准反弹高度 (0.5)
 */
export const BOUNCE_BEZIER = {
    in: calculateBounceBezier('in', 0.5),
    out: calculateBounceBezier('out', 0.5),
    inOut: calculateBounceBezier('inOut', 0.5),
} as const;

/**
 * 反弹缓动预设（不同强度）
 */
export const BOUNCE_PRESETS = {
    soft: {  // 软反弹（像羽毛球）
        in: calculateBounceBezier('in', 0.2),
        out: calculateBounceBezier('out', 0.2),
        inOut: calculateBounceBezier('inOut', 0.2),
    },
    normal: {  // 标准反弹（像篮球）
        in: calculateBounceBezier('in', 0.5),
        out: calculateBounceBezier('out', 0.5),
        inOut: calculateBounceBezier('inOut', 0.5),
    },
    strong: {  // 强反弹（像橡胶球）
        in: calculateBounceBezier('in', 0.8),
        out: calculateBounceBezier('out', 0.8),
        inOut: calculateBounceBezier('inOut', 0.8),
    },
} as const;

