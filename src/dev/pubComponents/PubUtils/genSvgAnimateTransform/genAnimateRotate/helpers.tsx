/**
 * genAnimateRotate 辅助函数和常量
 */

import { genAnimateRotate } from './core.tsx';
import { RotateAnimationConfig, RotateTimelineSegment } from './types.ts';

/**
 * 旋转方向常量
 */
export const RotateDirection = {
  /** 顺时针 360° */
  CLOCKWISE_360: 360,
  /** 逆时针 360° */
  COUNTER_CLOCKWISE_360: -360,
  /** 顺时针 180° */
  CLOCKWISE_180: 180,
  /** 逆时针 180° */
  COUNTER_CLOCKWISE_180: -180,
  /** 顺时针 90° */
  CLOCKWISE_90: 90,
  /** 逆时针 90° */
  COUNTER_CLOCKWISE_90: -90,
} as const;

/**
 * 根据角度和时长创建简单的旋转动画
 * @param angle 旋转角度（正数顺时针，负数逆时针）
 * @param duration 动画时长（秒），默认 2
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateRotateByAngle(360, 2)  // 2秒旋转360度
 * genAnimateRotateByAngle(-180, 1) // 1秒逆时针旋转180度
 * ```
 */
export function genAnimateRotateByAngle(
  angle: number,
  duration: number = 2,
  options: Omit<RotateAnimationConfig, 'timeline'> = {}
) {
  return genAnimateRotate({
    ...options,
    timeline: [{ timeSpanSec: duration, toValue: angle }],
  });
}

/**
 * 创建往返循环旋转动画
 * @param angle 旋转角度
 * @param duration 单程时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateRotateLoop(180, 1.5)  // 0° ↔ 180° 往返
 * ```
 */
export function genAnimateRotateLoop(
  angle: number,
  duration: number = 2,
  options: Omit<RotateAnimationConfig, 'timeline' | 'loopCount'> = {}
) {
  return genAnimateRotate({
    ...options,
    timeline: [
      { timeSpanSec: duration, toValue: angle },
      { timeSpanSec: duration, toValue: 0 },
    ],
    loopCount: 0,
  });
}

/**
 * 创建摆动动画（左右摇摆）
 * @param amplitude 摆动幅度（度数）
 * @param duration 完整周期时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateRotateSwing(30, 2)  // -30° ↔ 30° 摆动
 * ```
 */
export function genAnimateRotateSwing(
  amplitude: number = 30,
  duration: number = 2,
  options: Omit<RotateAnimationConfig, 'timeline' | 'loopCount'> = {}
) {
  const halfDur = duration / 2;
  return genAnimateRotate({
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
 * 创建多角度序列动画
 * @param angles 角度数组
 * @param totalDuration 总时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateRotatePath(
 *   [90, 180, 270, 360],
 *   4
 * )
 * ```
 */
export function genAnimateRotatePath(
  angles: number[],
  totalDuration: number = 3,
  options: Omit<RotateAnimationConfig, 'timeline'> = {}
) {
  if (angles.length < 1) {
    throw new Error('角度数组至少需要 1 个元素');
  }

  const segmentDuration = totalDuration / angles.length;
  const timeline: RotateTimelineSegment[] = angles.map(angle => ({
    timeSpanSec: segmentDuration,
    toValue: angle,
  }));

  return genAnimateRotate({
    ...options,
    timeline,
  });
}

