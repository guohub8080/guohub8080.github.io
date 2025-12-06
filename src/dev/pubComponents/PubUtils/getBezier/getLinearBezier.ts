/**
 * 获取线性缓动的贝塞尔曲线值
 * 
 * @description
 * 线性缓动：完全匀速运动，无加速或减速
 * 
 * @returns "0 0 1 1" - 线性贝塞尔曲线
 * 
 * @example
 * getLinearBezier()
 * // => "0 0 1 1"
 * 
 * // 用于 SVG
 * <animate keySplines={getLinearBezier()} />
 * 
 * // 用于 CSS
 * transition: cubic-bezier(0, 0, 1, 1)
 */
export function getLinearBezier(): string {
    return "0 0 1 1";
}

