/**
 * genAnimateScale 辅助函数和常量
 */

import { genAnimateScale } from './core.tsx';
import { ScaleAnimationConfig, ScaleTimelineSegment } from './types.ts';

/**
 * 缩放常量
 */
export const ScaleValue = {
  /** 正常大小 */
  NORMAL: 1,
  /** 放大 1.2 倍 */
  LARGE: 1.2,
  /** 放大 1.5 倍 */
  EXTRA_LARGE: 1.5,
  /** 缩小到 0.8 倍 */
  SMALL: 0.8,
  /** 缩小到 0.5 倍 */
  EXTRA_SMALL: 0.5,
  /** 消失（0） */
  ZERO: 0,
} as const;

/**
 * 创建简单的缩放动画
 * @param toScale 目标缩放比例
 * @param duration 动画时长（秒），默认 1
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateScaleSimple(1.5, 1)     // 放大到 1.5 倍
 * genAnimateScaleSimple(0.5, 0.5)   // 缩小到 0.5 倍
 * ```
 */
export function genAnimateScaleSimple(
  toValue: number,
  duration: number = 1,
  options: Omit<ScaleAnimationConfig, 'timeline'> = {}
) {
  return genAnimateScale({
    ...options,
    timeline: [{ timeSpanSec: duration, toScale }],
  });
}

/**
 * 创建往返循环缩放动画（呼吸效果）
 * @param minScale 最小缩放比例
 * @param maxScale 最大缩放比例
 * @param duration 单程时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateScaleLoop(0.8, 1.2, 1.5)  // 0.8 ↔ 1.2 往返
 * ```
 */
export function genAnimateScaleLoop(
  minScale: number = 0.9,
  maxScale: number = 1.1,
  duration: number = 2,
  options: Omit<ScaleAnimationConfig, 'timeline' | 'loopCount' | 'initScale'> = {}
) {
  return genAnimateScale({
    initScale: maxScale,
    ...options,
    timeline: [
      { timeSpanSec: duration, toValue: minScale },
      { timeSpanSec: duration, toValue: maxScale },
    ],
    loopCount: 0,
  });
}

/**
 * 创建脉冲缩放效果
 * @param pulseScale 脉冲时的缩放比例
 * @param pulseDuration 单次脉冲时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateScalePulse(1.3, 0.5)  // 快速放大缩小
 * ```
 */
export function genAnimateScalePulse(
  pulseScale: number = 1.2,
  pulseDuration: number = 0.5,
  options: Omit<ScaleAnimationConfig, 'timeline' | 'loopCount'> = {}
) {
  return genAnimateScale({
    ...options,
    timeline: [
      { timeSpanSec: pulseDuration / 2, toValue: pulseScale },
      { timeSpanSec: pulseDuration / 2, toValue: 1 },
    ],
    loopCount: 0,
  });
}

/**
 * 创建缩放序列动画
 * @param scales 缩放比例数组
 * @param totalDuration 总时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateScalePath(
 *   [1, 1.2, 1.5, 1.2, 1],
 *   4
 * )
 * ```
 */
export function genAnimateScalePath(
  scales: number[],
  totalDuration: number = 3,
  options: Omit<ScaleAnimationConfig, 'timeline'> = {}
) {
  if (scales.length < 1) {
    throw new Error('缩放数组至少需要 1 个元素');
  }

  const segmentDuration = totalDuration / scales.length;
  const timeline: ScaleTimelineSegment[] = scales.map(scale => ({
    timeSpanSec: segmentDuration,
    toValue: scale,
  }));

  return genAnimateScale({
    ...options,
    timeline,
  });
}

/**
 * 创建弹跳缩放效果
 * @param maxScale 最大缩放比例
 * @param duration 总时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateScaleBounce(1.5, 1)
 * ```
 */
export function genAnimateScaleBounce(
  maxScale: number = 1.5,
  duration: number = 1,
  options: Omit<ScaleAnimationConfig, 'timeline'> = {}
) {
  return genAnimateScale({
    ...options,
    timeline: [
      { 
        timeSpanSec: duration, 
        toValue: maxScale, 
        keySplines: '0.68 -0.55 0.265 1.55'  // 弹性曲线
      }
    ],
  });
}

