/**
 * genAnimateTranslate 预设效果
 */

import { genAnimateTranslate } from './core.tsx';

/**
 * 预设的平移动画效果
 */
export const translatePresets = {
  /** 向右移动 */
  moveRight: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ timeSpanSec: duration, toValue: { x: distance } }],
    }),

  /** 向左移动 */
  moveLeft: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ timeSpanSec: duration, toValue: { x: -distance } }],
    }),

  /** 向下移动 */
  moveDown: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ timeSpanSec: duration, toValue: { y: distance } }],
    }),

  /** 向上移动 */
  moveUp: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ timeSpanSec: duration, toValue: { y: -distance } }],
    }),

  /** 水平往返（左右摇摆） */
  swingHorizontal: (distance: number = 50, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: duration, toValue: { x: distance }, keySplines: '0.42 0 0.58 1' },
        { timeSpanSec: duration, toValue: { x: -distance }, keySplines: '0.42 0 0.58 1' },
        { timeSpanSec: duration, toValue: { x: 0 }, keySplines: '0.42 0 0.58 1' },
      ],
      loopCount: 0,
    }),

  /** 垂直浮动（上下浮动） */
  floatVertical: (distance: number = 20, duration: number = 3) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: duration / 2, toValue: { y: -distance }, keySplines: '0.37 0 0.63 1' },
        { timeSpanSec: duration / 2, toValue: { y: 0 }, keySplines: '0.37 0 0.63 1' },
      ],
      loopCount: 0,
    }),

  /** S 形路径 */
  sPath: (width: number = 100, height: number = 50, duration: number = 3) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: duration / 2, toValue: { x: width / 2, y: -height }, keySplines: '0.42 0 0.58 1' },
        { timeSpanSec: duration / 2, toValue: { x: width, y: 0 }, keySplines: '0.42 0 0.58 1' },
      ],
    }),

  /** 圆形路径（近似） */
  circlePath: (radius: number = 50, duration: number = 4) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: duration / 4, toValue: { x: radius, y: 0 }, keySplines: '0.42 0 0.58 1' },
        { timeSpanSec: duration / 4, toValue: { x: radius, y: radius }, keySplines: '0.42 0 0.58 1' },
        { timeSpanSec: duration / 4, toValue: { x: 0, y: radius }, keySplines: '0.42 0 0.58 1' },
        { timeSpanSec: duration / 4, toValue: { x: 0, y: 0 }, keySplines: '0.42 0 0.58 1' },
      ],
      loopCount: 0,
    }),

  /** 延迟移动（移动-停留-返回） */
  delayedBounce: (distance: number = 100, moveDur: number = 1, stayDur: number = 2) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: moveDur, toValue: { x: distance }, keySplines: '0.42 0 0.58 1' },
        { timeSpanSec: stayDur }, // 保持位置
        { timeSpanSec: moveDur, toValue: { x: 0 }, keySplines: '0.42 0 0.58 1' },
      ],
      loopCount: 0,
    }),

  /** 弹性移动（带回弹效果） */
  elastic: (distance: number = 100, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: duration, toValue: { x: distance }, keySplines: '0.68 -0.55 0.265 1.55' },
      ],
      freeze: true,
    }),

  /** 阶梯移动（离散跳转） */
  stepped: (steps: number[] = [50, 100, 150, 200], stepDuration: number = 0.5) =>
    genAnimateTranslate({
      timeline: steps.map(x => ({
        timeSpanSec: stepDuration,
        toValue: { x },
      })),
      calcMode: 'discrete',
    }),

  /** 点击触发移动 */
  onClick: (x: number = 100, y: number = 0, duration: number = 1) =>
    genAnimateTranslate({
      timeline: [{ timeSpanSec: duration, toValue: { x, y } }],
      isBeginWithClick: true,
      freeze: true,
    }),

  /** Z 字形路径 */
  zPath: (width: number = 100, height: number = 100, duration: number = 3) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: duration / 3, toValue: { x: width }, keySplines: '0.5 0 0.5 1' },
        { timeSpanSec: duration / 3, toValue: { x: width, y: height }, keySplines: '0.5 0 0.5 1' },
        { timeSpanSec: duration / 3, toValue: { x: width * 2, y: height }, keySplines: '0.5 0 0.5 1' },
      ],
    }),

  /** 抛物线路径（模拟投掷效果） */
  parabola: (distance: number = 200, height: number = 100, duration: number = 2) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: duration / 2, toValue: { x: distance / 2, y: -height }, keySplines: '0.33 0.66 0.66 1' },
        { timeSpanSec: duration / 2, toValue: { x: distance, y: 0 }, keySplines: '0.33 0 0.66 0.33' },
      ],
    }),

  /** 无限滚动（水平） */
  scrollHorizontal: (distance: number = 100, duration: number = 2) =>
    genAnimateTranslate({
      timeline: [{ timeSpanSec: duration, toValue: { x: distance }, keySplines: '0 0 1 1' }],
      loopCount: 0,
      freeze: false,
    }),

  /** 抖动效果（快速左右） */
  shake: (intensity: number = 10, duration: number = 0.5) =>
    genAnimateTranslate({
      timeline: [
        { timeSpanSec: duration / 6, toValue: { x: -intensity } },
        { timeSpanSec: duration / 6, toValue: { x: intensity } },
        { timeSpanSec: duration / 6, toValue: { x: -intensity } },
        { timeSpanSec: duration / 6, toValue: { x: intensity } },
        { timeSpanSec: duration / 6, toValue: { x: -intensity } },
        { timeSpanSec: duration / 6, toValue: { x: 0 } },
      ],
      calcMode: 'linear',
    }),
};

