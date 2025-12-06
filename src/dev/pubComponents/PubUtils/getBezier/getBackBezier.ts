/**
 * 后退类缓动函数的贝塞尔曲线值生成器
 * 
 * 运动特征：
 * 模拟物体运动前的轻微回退（类似拉弓蓄力）或运动后的轻微过冲（类似汽车刹车前倾）
 * 
 * 与 Elastic/Bounce 的区别：
 * - Back: 单次回退/过冲，更克制、更优雅（适合正式应用）
 * - Elastic: 弹簧振荡感，更有弹性（适合强调弹性）
 * - Bounce: 多次反弹感，更有撞击感（适合强调撞击）
 * 
 * 适用场景：
 * - 微信公众号 SVG 动画（仅支持 keySplines）
 * - 需要"蓄力感"或"过冲感"的动画
 * - 正式应用中的优雅过渡效果
 * 
 * 数学原理：
 * - 通过让贝塞尔曲线的 y 值超出 [0, 1] 范围来实现回退/过冲效果
 * - y < 0: 动画值会低于起始值（回退）
 * - y > 1: 动画值会超过目标值（过冲）
 */

/**
 * 计算后退缓动的贝塞尔曲线控制点
 */
function calculateBackBezier(
    type: 'in' | 'out' | 'inOut',
    intensity: number
): string {
    // 限制 intensity 在合理范围内
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    
    if (type === 'out') {
        // easeOutBack: 结尾过冲
        // 快速向前，超过目标后回退停下（像汽车刹车前倾）
        // 标准值: (0.175, 0.885, 0.32, 1.275)
        // intensity 控制 y2 的过冲幅度 (1 + 0.275 * intensity/0.55)
        const overshoot = 0.5 * clampedIntensity;  // 最大过冲 0.5
        const y2 = 1 + overshoot;
        return `0.175 0.885 0.32 ${y2}`;
    }
    
    if (type === 'in') {
        // easeInBack: 开头回退
        // 先向后回退，再向前加速（像拉弓蓄力）
        // 标准值: (0.6, -0.28, 0.735, 0.045)
        // intensity 控制 y1 的回退幅度
        const pullback = -0.5 * clampedIntensity;  // 最大回退 -0.5
        return `0.6 ${pullback} 0.735 0.045`;
    }
    
    // easeInOutBack: 两端都有回退/过冲
    // 开头回退，结尾过冲
    // 标准值: (0.68, -0.55, 0.265, 1.55)
    const pullback = -clampedIntensity;
    const overshoot = 1 + clampedIntensity;
    return `0.68 ${pullback} 0.265 ${overshoot}`;
}

/**
 * 获取后退缓动的贝塞尔曲线值
 * 
 * @description
 * 生成模拟后退/过冲效果的贝塞尔曲线值
 * 
 * 函数名说明：0_1 表示 intensity 参数范围为 0-1
 * 
 * 运动特征：
 * - easeOutBack: 快速向前，超过目标后回退（最常用）
 * - easeInBack: 先回退，再向前加速
 * - easeInOutBack: 开头回退，结尾过冲
 * 
 * 适用场景：
 * - easeOutBack: 元素滑动停止、页面切换、卡片展开
 * - easeInBack: 按钮点击、元素收缩、蓄力动画
 * - easeInOutBack: 强调性动画、过渡效果
 * 
 * 参数 intensity 剧烈程度对比：
 * - intensity = 0.3 (低强度)：轻微的回退/过冲
 *   视觉：克制、优雅、专业
 *   场景：正式应用、商务场景
 * 
 * - intensity = 0.55 (中等强度)：明显的回退/过冲
 *   视觉：平衡、自然、有张力
 *   场景：通用推荐、大多数场景 ✅
 * 
 * - intensity = 0.8 (高强度)：强烈的回退/过冲
 *   视觉：夸张、有活力、戏剧化
 *   场景：游戏、娱乐内容、需要强调的动画
 * 
 * @param options.isIn - 是否为缓入
 * @param options.isOut - 是否为缓出
 * @param options.intensity - 剧烈程度 (0-1)，默认 0.55
 *   - 0 = 无回退/过冲（退化为普通缓动）
 *   - 0.3 = 轻微回退/过冲（优雅克制）
 *   - 0.55 = 标准回退/过冲（推荐）✅
 *   - 0.8 = 强烈回退/过冲（夸张有力）
 *   - 1.0 = 极限回退/过冲（可能过于夸张）
 * 
 * 与其他缓动的区别：
 * - Back: 单次回退/过冲，优雅克制
 *   "0.175 0.885 0.32 1.275" - 轻微过冲
 * - Elastic: 弹簧振荡，平滑有弹性
 *   "0.68 -0.55 0.265 1.55" - 弹簧感
 * - Bounce: 撞击反弹，突然有冲击
 *   "0.75 -0.5 0.22 1.5" - 撞击感
 * 
 * @example
 * // easeOutBack（默认）：结尾过冲，中等强度
 * getBackBezier0_1({})
 * // => "0.175 0.885 0.32 1.275"
 * 
 * // 低强度：轻微过冲
 * getBackBezier0_1({ intensity: 0.3 })
 * // => "0.175 0.885 0.32 1.15"
 * // 效果：优雅克制，适合正式场景
 * 
 * // 中等强度：标准效果
 * getBackBezier0_1({ intensity: 0.55 })
 * // => "0.175 0.885 0.32 1.275"
 * // 效果：平衡自然，通用推荐
 * 
 * // 高强度：强烈过冲
 * getBackBezier0_1({ intensity: 0.8 })
 * // => "0.175 0.885 0.32 1.4"
 * // 效果：夸张有力，适合娱乐场景
 * 
 * // easeInBack: 开头回退（蓄力感）
 * getBackBezier0_1({ isIn: true, isOut: false, intensity: 0.55 })
 * // => "0.6 -0.275 0.735 0.045"
 * 
 * // easeInOutBack: 两端都有
 * getBackBezier0_1({ isIn: true, isOut: true, intensity: 0.55 })
 * // => "0.68 -0.55 0.265 1.55"
 * 
 * // 对比三种缓动：
 * getBackBezier0_1({ intensity: 0.55 })     // 单次过冲，优雅
 * getElasticBezier0_1({ intensity: 0.55 })  // 弹簧感，有弹性
 * getBounceBezier0_1({ intensity: 0.5 })    // 撞击感，有冲击
 */
export function getBackBezier0_1(options: {
    isIn?: boolean
    isOut?: boolean
    intensity?: number
}): string {
    const { 
        isIn = false, 
        isOut = false, 
        intensity = 0.55  // 默认 55% 强度
    } = options;

    // in: 开头回退
    if (isIn && !isOut) {
        return calculateBackBezier('in', intensity);
    }

    // out: 结尾过冲
    if (!isIn && isOut) {
        return calculateBackBezier('out', intensity);
    }

    // in-out（默认）: 两端都有
    return calculateBackBezier('inOut', intensity);
}

/**
 * 后退缓动常量（便于直接使用）
 * 使用标准强度 (0.55)
 */
export const BACK_BEZIER = {
    in: calculateBackBezier('in', 0.55),
    out: calculateBackBezier('out', 0.55),
    inOut: calculateBackBezier('inOut', 0.55),
} as const;

/**
 * 后退缓动预设（不同强度）
 */
export const BACK_PRESETS = {
    subtle: {  // 轻微回退/过冲（优雅克制）
        in: calculateBackBezier('in', 0.3),
        out: calculateBackBezier('out', 0.3),
        inOut: calculateBackBezier('inOut', 0.3),
    },
    normal: {  // 标准回退/过冲（平衡自然）
        in: calculateBackBezier('in', 0.55),
        out: calculateBackBezier('out', 0.55),
        inOut: calculateBackBezier('inOut', 0.55),
    },
    strong: {  // 强烈回退/过冲（夸张有力）
        in: calculateBackBezier('in', 0.8),
        out: calculateBackBezier('out', 0.8),
        inOut: calculateBackBezier('inOut', 0.8),
    },
} as const;

