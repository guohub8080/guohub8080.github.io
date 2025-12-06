/**
 * genAnimateOpacity 辅助函数和常量
 */

import { genAnimateOpacity } from './core.tsx';
import { OpacityAnimationConfig, OpacityTimelineSegment } from './types.ts';

/**
 * 不透明度常量
 */
export const OpacityValue = {
  /** 完全不透明 */
  OPAQUE: 1,
  /** 完全透明 */
  TRANSPARENT: 0,
  /** 半透明 */
  SEMI_TRANSPARENT: 0.5,
} as const;

/**
 * 创建简单的淡入或淡出动画
 * @param toOpacity 目标不透明度
 * @param duration 动画时长（秒），默认 1
 * @param options 其他选项
 * @returns animate 元素
 * @example
 * ```tsx
 * genAnimateOpacityFade(0, 1)     // 1秒淡出到透明
 * genAnimateOpacityFade(1, 0.5)   // 0.5秒淡入到不透明
 * ```
 */
export function genAnimateOpacityFade(
  toOpacity: number,
  duration: number = 1,
  options: Omit<OpacityAnimationConfig, 'timeline'> = {}
) {
  return genAnimateOpacity({
    ...options,
    timeline: [{ timeSpanSec: duration, toValue: toOpacity }],
  });
}

/**
 * 创建往返循环透明度动画（如呼吸效果）
 * @param minOpacity 最小不透明度
 * @param maxOpacity 最大不透明度
 * @param duration 单程时长（秒）
 * @param options 其他选项
 * @returns animate 元素
 * @example
 * ```tsx
 * genAnimateOpacityLoop(0.3, 1, 2)  // 0.3 ↔ 1 往返
 * ```
 */
export function genAnimateOpacityLoop(
  minOpacity: number = 0.3,
  maxOpacity: number = 1,
  duration: number = 2,
  options: Omit<OpacityAnimationConfig, 'timeline' | 'loopCount' | 'initOpacity'> = {}
) {
  return genAnimateOpacity({
    initOpacity: maxOpacity,
    ...options,
    timeline: [
      { timeSpanSec: duration, toValue: minOpacity },
      { timeSpanSec: duration, toValue: maxOpacity },
    ],
    loopCount: 0,
  });
}

/**
 * 创建闪烁效果
 * @param blinkCount 闪烁次数
 * @param duration 总时长（秒）
 * @param options 其他选项
 * @returns animate 元素
 * @example
 * ```tsx
 * genAnimateOpacityBlink(3, 1.5)  // 1.5秒内闪烁3次
 * ```
 */
export function genAnimateOpacityBlink(
  blinkCount: number = 3,
  duration: number = 1.5,
  options: Omit<OpacityAnimationConfig, 'timeline' | 'loopCount'> = {}
) {
  const singleBlinkDuration = duration / blinkCount / 2;
  const timeline: OpacityTimelineSegment[] = [];
  
  for (let i = 0; i < blinkCount; i++) {
    timeline.push(
      { timeSpanSec: singleBlinkDuration, toValue: 0 },
      { timeSpanSec: singleBlinkDuration, toValue: 1 }
    );
  }

  return genAnimateOpacity({
    ...options,
    timeline,
    loopCount: options.loopCount ?? 1,
  });
}

/**
 * 创建不透明度序列动画
 * @param opacities 不透明度数组
 * @param totalDuration 总时长（秒）
 * @param options 其他选项
 * @returns animate 元素
 * @example
 * ```tsx
 * genAnimateOpacityPath(
 *   [1, 0.5, 0, 0.5, 1],
 *   4
 * )
 * ```
 */
export function genAnimateOpacityPath(
  opacities: number[],
  totalDuration: number = 3,
  options: Omit<OpacityAnimationConfig, 'timeline'> = {}
) {
  if (opacities.length < 1) {
    throw new Error('不透明度数组至少需要 1 个元素');
  }

  const segmentDuration = totalDuration / opacities.length;
  const timeline: OpacityTimelineSegment[] = opacities.map(opacity => ({
    timeSpanSec: segmentDuration,
    toValue: opacity,
  }));

  return genAnimateOpacity({
    ...options,
    timeline,
  });
}

