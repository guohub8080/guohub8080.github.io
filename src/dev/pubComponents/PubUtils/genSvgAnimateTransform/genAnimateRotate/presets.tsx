/**
 * genAnimateRotate 预设效果
 */

import { genAnimateRotate } from './core.tsx';

/**
 * 预设的旋转动画效果
 */
export const rotatePresets = {
  /** 顺时针旋转（无限循环） */
  clockwise: (duration: number = 2) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: 360 }],
      loopCount: 0,
    }),

  /** 逆时针旋转（无限循环） */
  counterClockwise: (duration: number = 2) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: -360 }],
      loopCount: 0,
    }),

  /** 快速旋转（1秒一圈） */
  fast: () =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: 1, toValue: 360 }],
      loopCount: 0,
    }),

  /** 慢速旋转（4秒一圈） */
  slow: () =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: 4, toValue: 360 }],
      loopCount: 0,
    }),

  /** 摇摆效果（左右摇摆） */
  swing: (amplitude: number = 30, duration: number = 2) =>
    genAnimateRotate({
      initAngle: -amplitude,
      timeline: [
        { timeSpanSec: duration / 2, toValue: amplitude, keySplines: '0.45 0 0.55 1' },
        { timeSpanSec: duration / 2, toValue: -amplitude, keySplines: '0.45 0 0.55 1' },
      ],
      loopCount: 0,
    }),

  /** 180度翻转 */
  flip: (duration: number = 0.6) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: 180, keySplines: '0.68 -0.55 0.265 1.55' }],
      freeze: true,
    }),

  /** 360度翻转（执行一次） */
  spin: (duration: number = 0.8) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: 360, keySplines: '0.68 -0.55 0.265 1.55' }],
      freeze: true,
    }),

  /** 延迟旋转（延迟1秒后开始） */
  delayed: (delayTime: number = 1, duration: number = 2) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: 360 }],
      delay: delayTime,
      loopCount: 0,
    }),

  /** 点击触发旋转 */
  onClick: (angle: number = 360, duration: number = 1) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: angle }],
      isBeginWithClick: true,
      freeze: true,
    }),

  /** 阶梯旋转（分段跳转） */
  stepped: (steps: number[] = [90, 180, 270, 360], stepDuration: number = 0.5) =>
    genAnimateRotate({
      timeline: steps.map(angle => ({
        timeSpanSec: stepDuration,
        toValue: angle,
      })),
      calcMode: 'discrete',
    }),

  /** 弹性旋转（带回弹） */
  elastic: (angle: number = 360, duration: number = 1) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: angle, keySplines: '0.68 -0.55 0.265 1.55' }],
      freeze: true,
    }),

  /** 往返旋转 */
  backAndForth: (angle: number = 180, duration: number = 1.5) =>
    genAnimateRotate({
      timeline: [
        { timeSpanSec: duration, toValue: angle },
        { timeSpanSec: duration, toValue: 0 },
      ],
      loopCount: 0,
    }),

  /** 加速旋转 */
  accelerate: (duration: number = 2) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: 360, keySplines: '0.55 0.055 0.675 0.19' }],
      loopCount: 0,
    }),

  /** 减速旋转 */
  decelerate: (duration: number = 2) =>
    genAnimateRotate({
      timeline: [{ timeSpanSec: duration, toValue: 360, keySplines: '0.215 0.61 0.355 1' }],
      loopCount: 0,
    }),

  /** 钟摆效果 */
  pendulum: (maxAngle: number = 45, duration: number = 2) =>
    genAnimateRotate({
      initAngle: maxAngle,
      timeline: [
        { timeSpanSec: duration / 2, toValue: -maxAngle, keySplines: '0.42 0 0.58 1' },
        { timeSpanSec: duration / 2, toValue: maxAngle, keySplines: '0.42 0 0.58 1' },
      ],
      loopCount: 0,
    }),
};

