/**
 * genAnimateScale 预设效果
 */

import { genAnimateScale } from './core.tsx';

/**
 * 预设的缩放动画效果
 */
export const scalePresets = {
  /** 点击放大（轻微） */
  growGentle: (duration: number = 0.3) =>
    genAnimateScale({
      timeline: [{ timeSpanSec: duration, toValue: 1.1 }],
      isBeginWithClick: true,
      freeze: true,
    }),

  /** 点击放大（标准） */
  growNormal: (duration: number = 0.5) =>
    genAnimateScale({
      timeline: [{ timeSpanSec: duration, toValue: 1.2 }],
      isBeginWithClick: true,
      freeze: true,
    }),

  /** 点击放大（强烈） */
  growStrong: (duration: number = 0.8) =>
    genAnimateScale({
      timeline: [{ timeSpanSec: duration, toValue: 1.5 }],
      isBeginWithClick: true,
      freeze: true,
    }),

  /** 快速放大 */
  growFast: () =>
    genAnimateScale({
      timeline: [{ timeSpanSec: 0.2, toValue: 1.3 }],
      isBeginWithClick: true,
      freeze: true,
    }),

  /** 点击缩小 */
  shrink: (duration: number = 0.5) =>
    genAnimateScale({
      timeline: [{ timeSpanSec: duration, toValue: 0.8 }],
      isBeginWithClick: true,
      freeze: true,
    }),

  /** 弹性放大（带回弹） */
  bounce: (duration: number = 0.6) =>
    genAnimateScale({
      timeline: [{ 
        timeSpanSec: duration, 
        toValue: 1.3, 
        keySplines: '0.68 -0.55 0.265 1.55' 
      }],
      isBeginWithClick: true,
      freeze: true,
    }),

  /** 自动放大（延迟开始） */
  autoGrow: (delayTime: number = 0.5, duration: number = 1) =>
    genAnimateScale({
      timeline: [{ timeSpanSec: duration, toValue: 1.2 }],
      delay: delayTime,
      freeze: true,
    }),

  /** 呼吸缩放（无限循环） */
  breathe: (minScale: number = 0.95, maxScale: number = 1.05, duration: number = 2) =>
    genAnimateScale({
      initScale: maxScale,
      timeline: [
        { timeSpanSec: duration, toValue: minScale },
        { timeSpanSec: duration, toValue: maxScale },
      ],
      loopCount: 0,
    }),

  /** 脉冲效果（快速放大缩小） */
  pulse: (pulseScale: number = 1.2, duration: number = 0.5) =>
    genAnimateScale({
      timeline: [
        { timeSpanSec: duration / 2, toValue: pulseScale },
        { timeSpanSec: duration / 2, toValue: 1 },
      ],
      loopCount: 0,
    }),

  /** 心跳效果 */
  heartbeat: () =>
    genAnimateScale({
      timeline: [
        { timeSpanSec: 0.15, toValue: 1.2 },
        { timeSpanSec: 0.15, toValue: 1 },
        { timeSpanSec: 0.15, toValue: 1.2 },
        { timeSpanSec: 0.15, toValue: 1 },
        { timeSpanSec: 0.8 },  // 停顿
      ],
      loopCount: 0,
    }),

  /** 缩小到消失 */
  shrinkToZero: (duration: number = 0.5) =>
    genAnimateScale({
      timeline: [{ timeSpanSec: duration, toValue: 0 }],
      freeze: true,
    }),

  /** 从消失放大 */
  growFromZero: (duration: number = 0.5) =>
    genAnimateScale({
      initScale: 0,
      timeline: [{ timeSpanSec: duration, toValue: 1 }],
      freeze: true,
    }),

  /** 弹跳入场 */
  bounceIn: (duration: number = 0.8) =>
    genAnimateScale({
      initScale: 0,
      timeline: [{ 
        timeSpanSec: duration, 
        toValue: 1, 
        keySplines: '0.68 -0.55 0.265 1.55' 
      }],
      freeze: true,
    }),

  /** 弹跳出场 */
  bounceOut: (duration: number = 0.5) =>
    genAnimateScale({
      timeline: [{ 
        timeSpanSec: duration, 
        toValue: 0, 
        keySplines: '0.6 0.04 0.98 0.335' 
      }],
      freeze: true,
    }),

  /** 震动效果 */
  shake: (intensity: number = 0.1, duration: number = 0.5) =>
    genAnimateScale({
      timeline: [
        { timeSpanSec: duration / 6, toValue: 1 - intensity },
        { timeSpanSec: duration / 6, toValue: 1 + intensity },
        { timeSpanSec: duration / 6, toValue: 1 - intensity },
        { timeSpanSec: duration / 6, toValue: 1 + intensity },
        { timeSpanSec: duration / 6, toValue: 1 - intensity },
        { timeSpanSec: duration / 6, toValue: 1 },
      ],
      calcMode: 'linear',
    }),

  /** 波浪缩放 */
  wave: (duration: number = 4) =>
    genAnimateScale({
      timeline: [
        { timeSpanSec: duration / 4, toValue: 1.1 },
        { timeSpanSec: duration / 4, toValue: 0.9 },
        { timeSpanSec: duration / 4, toValue: 1.1 },
        { timeSpanSec: duration / 4, toValue: 1 },
      ],
      loopCount: 0,
    }),

  /** 放大后停留再还原 */
  growStayShrink: (growDur: number = 0.5, stayDur: number = 2, shrinkDur: number = 0.5) =>
    genAnimateScale({
      timeline: [
        { timeSpanSec: growDur, toValue: 1.3 },
        { timeSpanSec: stayDur },  // 保持放大
        { timeSpanSec: shrinkDur, toValue: 1 },
      ],
      loopCount: 0,
    }),

  /** 快速闪现 */
  flash: () =>
    genAnimateScale({
      timeline: [
        { timeSpanSec: 0.1, toValue: 1.5 },
        { timeSpanSec: 0.1, toValue: 1 },
        { timeSpanSec: 0.1, toValue: 1.5 },
        { timeSpanSec: 0.1, toValue: 1 },
      ],
    }),

  /** 渐进放大（多段） */
  progressiveGrow: (duration: number = 2) =>
    genAnimateScale({
      timeline: [
        { timeSpanSec: duration / 3, toValue: 1.1 },
        { timeSpanSec: duration / 3, toValue: 1.3 },
        { timeSpanSec: duration / 3, toValue: 1.5 },
      ],
      freeze: true,
    }),

  /** 渐进缩小（多段） */
  progressiveShrink: (duration: number = 2) =>
    genAnimateScale({
      timeline: [
        { timeSpanSec: duration / 3, toValue: 0.9 },
        { timeSpanSec: duration / 3, toValue: 0.7 },
        { timeSpanSec: duration / 3, toValue: 0.5 },
      ],
      freeze: true,
    }),
};

