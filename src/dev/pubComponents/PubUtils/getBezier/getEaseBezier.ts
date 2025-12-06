/**
 * 标准 Ease 缓动函数的贝塞尔曲线值生成器
 * 
 * @description
 * CSS 标准的 ease 缓动曲线，最常用的基础缓动
 * 
 * 四种形式：
 * - ease: CSS 标准 ease 曲线（默认）
 * - ease-in: 开始慢，逐渐加速
 * - ease-out: 开始快，逐渐减速
 * - ease-in-out: 两端慢，中间快
 * 
 * 适用场景：
 * - 大多数常规动画的首选
 * - 符合用户直觉的自然运动
 * - 跨平台一致性最好（CSS 标准）
 */

/**
 * 计算 Ease 缓动的贝塞尔曲线控制点
 */
function calculateEaseBezier(
    type: 'ease' | 'in' | 'out' | 'inOut'
): string {
    if (type === 'in') {
        // ease-in: 开始慢，逐渐加速
        return "0.42 0 1 1";
    }
    
    if (type === 'out') {
        // ease-out: 开始快，逐渐减速
        return "0 0 0.58 1";
    }
    
    if (type === 'inOut') {
        // ease-in-out: 两端慢，中间快
        return "0.42 0 0.58 1";
    }
    
    // ease: CSS 标准 ease 曲线（默认）
    return "0.25 0.1 0.25 1";
}

/**
 * 获取 Ease 缓动的贝塞尔曲线值
 * 
 * @description
 * 生成 CSS 标准的 ease 缓动曲线
 * 
 * @param options.isIn - 是否为缓入
 * @param options.isOut - 是否为缓出
 * 
 * @example
 * // ease（默认）：CSS 标准 ease 曲线
 * getEaseBezier({})
 * // => "0.25 0.1 0.25 1"
 * 
 * // ease-in: 开始慢，逐渐加速
 * getEaseBezier({ isIn: true, isOut: false })
 * // => "0.42 0 1 1"
 * 
 * // ease-out: 开始快，逐渐减速
 * getEaseBezier({ isIn: false, isOut: true })
 * // => "0 0 0.58 1"
 * 
 * // ease-in-out: 两端慢，中间快
 * getEaseBezier({ isIn: true, isOut: true })
 * // => "0.42 0 0.58 1"
 * 
 * // 用于 SVG
 * <animate keySplines={getEaseBezier({ isOut: true })} />
 * 
 * // 用于 CSS
 * transition: cubic-bezier(0, 0, 0.58, 1)
 */
export function getEaseBezier(options: {
    isIn?: boolean
    isOut?: boolean
} = {}): string {
    const { isIn = false, isOut = false } = options;

    // ease-in-out: 两端慢，中间快
    if (isIn && isOut) {
        return calculateEaseBezier('inOut');
    }

    // ease-in: 开始慢，逐渐加速
    if (isIn && !isOut) {
        return calculateEaseBezier('in');
    }

    // ease-out: 开始快，逐渐减速
    if (!isIn && isOut) {
        return calculateEaseBezier('out');
    }

    // ease（默认）: CSS 标准 ease 曲线
    return calculateEaseBezier('ease');
}

/**
 * Ease 缓动常量（便于直接使用）
 */
export const EASE_BEZIER = {
    ease: calculateEaseBezier('ease'),       // CSS 标准 ease
    in: calculateEaseBezier('in'),           // ease-in
    out: calculateEaseBezier('out'),         // ease-out
    inOut: calculateEaseBezier('inOut'),     // ease-in-out
} as const;

