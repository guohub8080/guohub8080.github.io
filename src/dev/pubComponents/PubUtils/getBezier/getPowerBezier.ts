import { isInteger } from "lodash";

/**
 * 幂次方缓动函数的贝塞尔曲线值映射表
 * 
 * 数据来源验证：
 * - easings.net (权威) : https://easings.net/
 * - Robert Penner's Easing Functions
 * - GreenSock (GSAP) Ease Visualizer
 */
const POWER_BEZIER_MAP = {
    // 二次方 (Quadratic) - 中等力度
    // 来源: easings.net - easeInQuad, easeOutQuad, easeInOutQuad
    2: {
        in: "0.55 0.085 0.68 0.53",      // easeInQuad
        out: "0.25 0.46 0.45 0.94",      // easeOutQuad
        inOut: "0.455 0.03 0.515 0.955", // easeInOutQuad
    },
    // 三次方 (Cubic) - 强力度
    // 来源: easings.net - easeInCubic, easeOutCubic, easeInOutCubic
    3: {
        in: "0.55 0.055 0.675 0.19",     // easeInCubic
        out: "0.215 0.61 0.355 1",       // easeOutCubic
        inOut: "0.645 0.045 0.355 1",    // easeInOutCubic
    },
    // 四次方 (Quartic) - 很强力度
    // 来源: easings.net - easeInQuart, easeOutQuart, easeInOutQuart
    4: {
        in: "0.895 0.03 0.685 0.22",     // easeInQuart
        out: "0.165 0.84 0.44 1",        // easeOutQuart
        inOut: "0.77 0 0.175 1",         // easeInOutQuart
    },
    // 五次方 (Quintic) - 极强力度
    // 来源: easings.net - easeInQuint, easeOutQuint, easeInOutQuint
    5: {
        in: "0.755 0.05 0.855 0.06",     // easeInQuint
        out: "0.23 1 0.32 1",            // easeOutQuint
        inOut: "0.86 0 0.07 1",          // easeInOutQuint
    },
} as const;

type PowerLevel = keyof typeof POWER_BEZIER_MAP;

/**
 * 获取幂次方缓动的贝塞尔曲线值
 * 
 * @description
 * 根据幂次和方向生成对应的贝塞尔曲线值
 * 幂次越高，缓动效果越强烈
 * 
 * 支持的幂次：
 * - power=1: linear（线性，无缓动）
 * - power=2: quad（二次方，中等力度）
 * - power=3: cubic（三次方，强力度）
 * - power=4: quart（四次方，很强力度）
 * - power=5: quint（五次方，极强力度）
 * 
 * 适用场景：
 * - linear (幂=1): 匀速运动、进度条
 * - quad (幂=2): 下拉刷新、列表项加载、卡片翻转
 * - cubic (幂=3): 火箭发射、强调动画、重要提示
 * - quart (幂=4): 戏剧性效果、游戏动画
 * - quint (幂=5): 极端强调、特殊视觉效果
 * 
 * @example
 * // linear: 无缓动
 * getPowerBezier({ power: 1 })
 * // => "0 0 1 1"
 * 
 * // quad-in-out（默认）
 * getPowerBezier({ power: 2 })
 * // => "0.455 0.03 0.515 0.955"
 * 
 * // cubic-in: 慢启动快加速
 * getPowerBezier({ power: 3, isIn: true, isOut: false })
 * // => "0.55 0.055 0.675 0.19"
 * 
 * // quart-out: 快启动慢减速
 * getPowerBezier({ power: 4, isIn: false, isOut: true })
 * // => "0.165 0.84 0.44 1"
 * 
 * // quint-in-out（显式指定）
 * getPowerBezier({ power: 5, isIn: true, isOut: true })
 * // => "0.86 0 0.07 1"
 */
export function getPowerBezier(options: {
    power: 1 | 2 | 3 | 4 | 5
    isIn?: boolean
    isOut?: boolean
}): string {
    const { power, isIn = false, isOut = false } = options;

    // 验证幂次范围：必须是 1-5
    if (power < 1 || power > 5 || !isInteger(power)) {
        throw new Error(`[getPowerBezier] 幂次必须是 1-5 的整数，当前值: ${power}`);
    }

    // 特殊处理：power=1 直接返回 linear
    if (power === 1) {
        return "0 0 1 1"; // linear，无缓动
    }

    // 检查幂次是否在映射表中（理论上不会到这里，因为已经验证了 1-5）
    if (!(power in POWER_BEZIER_MAP)) {
        throw new Error(`[getPowerBezier] 不支持的幂次: ${power}`);
    }

    const bezierMap = POWER_BEZIER_MAP[power as PowerLevel];

    // in: 缓慢启动后快速加速
    if (isIn && !isOut) {
        return bezierMap.in;
    }

    // out: 快速启动后缓慢减速
    if (!isIn && isOut) {
        return bezierMap.out;
    }

    // in-out（默认）：对称缓动，两头慢中间快
    // 当 isIn && isOut 或 !isIn && !isOut 时都返回这个
    return bezierMap.inOut;
}

/**
 * 幂次方缓动常量（便于直接使用）
 */
export const POWER_BEZIER = {
    quad: {
        in: POWER_BEZIER_MAP[2].in,
        out: POWER_BEZIER_MAP[2].out,
        inOut: POWER_BEZIER_MAP[2].inOut,
    },
    cubic: {
        in: POWER_BEZIER_MAP[3].in,
        out: POWER_BEZIER_MAP[3].out,
        inOut: POWER_BEZIER_MAP[3].inOut,
    },
    quart: {
        in: POWER_BEZIER_MAP[4].in,
        out: POWER_BEZIER_MAP[4].out,
        inOut: POWER_BEZIER_MAP[4].inOut,
    },
    quint: {
        in: POWER_BEZIER_MAP[5].in,
        out: POWER_BEZIER_MAP[5].out,
        inOut: POWER_BEZIER_MAP[5].inOut,
    },
} as const;

