/**
 * genAnimateSkewY 辅助函数和常量
 */

import { genAnimateSkewY } from './core.tsx';
import { SkewYAnimationConfig, SkewYTimelineSegment } from './types.ts';

/**
 * 垂直斜切角度常量
 */
export const SkewYAngle = {
  /** 无斜切 */
  NONE: 0,
  /** 轻微斜切 */
  LIGHT: 10,
  /** 中等斜切 */
  MEDIUM: 15,
  /** 强烈斜切 */
  STRONG: 25,
} as const;

/**
 * 创建简单的垂直斜切动画
 * @param toAngle 目标角度
 * @param duration 动画时长（秒），默认 1
 * @param options 其他选项
 * @returns animateTransform 元素
 */
export function genAnimateSkewYSimple(
  toValue: number,
  duration: number = 1,
  options: Omit<SkewYAnimationConfig, 'timeline'> = {}
) {
  return genAnimateSkewY({
    ...options,
    timeline: [{ timeSpanSec: duration, toValue }],
  });
}

/**
 * 创建往返循环垂直斜切动画
 * @param maxAngle 最大斜切角度
 * @param duration 单程时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 */
export function genAnimateSkewYLoop(
  maxAngle: number = 12,
  duration: number = 2,
  options: Omit<SkewYAnimationConfig, 'timeline' | 'loopCount'> = {}
) {
  return genAnimateSkewY({
    ...options,
    timeline: [
      { timeSpanSec: duration, toValue: maxAngle },
      { timeSpanSec: duration, toValue: 0 },
    ],
    loopCount: 0,
  });
}

/**
 * 创建上下摇摆斜切效果
 * @param amplitude 摇摆幅度（度数）
 * @param duration 完整周期时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 */
export function genAnimateSkewYSwing(
  amplitude: number = 15,
  duration: number = 2,
  options: Omit<SkewYAnimationConfig, 'timeline' | 'loopCount' | 'initAngle'> = {}
) {
  const halfDur = duration / 2;
  return genAnimateSkewY({
    initAngle: -amplitude,
    ...options,
    timeline: [
      { timeSpanSec: halfDur, toValue: amplitude, keySplines: '0.45 0 0.55 1' },
      { timeSpanSec: halfDur, toValue: -amplitude, keySplines: '0.45 0 0.55 1' },
    ],
    loopCount: 0,
  });
}

/**
 * 创建垂直斜切序列动画
 * @param angles 角度数组
 * @param totalDuration 总时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 */
export function genAnimateSkewYPath(
  angles: number[],
  totalDuration: number = 3,
  options: Omit<SkewYAnimationConfig, 'timeline'> = {}
) {
  if (angles.length < 1) {
    throw new Error('角度数组至少需要 1 个元素');
  }

  const segmentDuration = totalDuration / angles.length;
  const timeline: SkewYTimelineSegment[] = angles.map(angle => ({
    timeSpanSec: segmentDuration,
    toValue: angle,
  }));

  return genAnimateSkewY({
    ...options,
    timeline,
  });
}

