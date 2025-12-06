/**
 * genAnimateTranslate 辅助函数和常量
 */

import { genAnimateTranslate } from './core.tsx';
import { Point2D, TranslateAnimationConfig, TranslateTimelineSegment } from './types.ts';

/**
 * 方向常量，用于快速创建方向性移动
 */
export const TranslateDirection = {
  /** 向右 */
  RIGHT: { x: 1, y: 0 },
  /** 向左 */
  LEFT: { x: -1, y: 0 },
  /** 向下 */
  DOWN: { x: 0, y: 1 },
  /** 向上 */
  UP: { x: 0, y: -1 },
  /** 右下 */
  RIGHT_DOWN: { x: 1, y: 1 },
  /** 右上 */
  RIGHT_UP: { x: 1, y: -1 },
  /** 左下 */
  LEFT_DOWN: { x: -1, y: 1 },
  /** 左上 */
  LEFT_UP: { x: -1, y: -1 },
} as const;

/**
 * 根据方向和距离创建简单的平移动画
 * @param direction 方向对象 { x: number, y: number }
 * @param distance 移动距离（像素）
 * @param duration 动画时长（秒），默认 1
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateTranslateByDirection(TranslateDirection.RIGHT, 100, 2)
 * ```
 */
export function genAnimateTranslateByDirection(
  direction: { x: number; y: number },
  distance: number,
  duration: number = 1,
  options: Omit<TranslateAnimationConfig, 'timeline'> = {}
) {
  const toX = direction.x * distance;
  const toY = direction.y * distance;

  return genAnimateTranslate({
    ...options,
    timeline: [{ timeSpanSec: duration, toValue: { x: toX, y: toY } }],
  });
}

/**
 * 创建往返循环动画
 * @param x X 轴移动距离
 * @param y Y 轴移动距离
 * @param duration 单程时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateTranslateLoop(100, 0, 1.5)  // 水平往返
 * ```
 */
export function genAnimateTranslateLoop(
  x: number,
  y: number,
  duration: number = 2,
  options: Omit<TranslateAnimationConfig, 'timeline' | 'loopCount'> = {}
) {
  return genAnimateTranslate({
    ...options,
    timeline: [
      { timeSpanSec: duration, toValue: { x, y } },
      { timeSpanSec: duration, toValue: { x: 0, y: 0 } },
    ],
    loopCount: 0,
  });
}

/**
 * 创建路径动画
 * @param path 路径点数组 [{x, y}, ...]
 * @param totalDuration 总时长（秒）
 * @param options 其他选项
 * @returns animateTransform 元素
 * @example
 * ```tsx
 * genAnimateTranslatePath(
 *   [{ x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
 *   3
 * )
 * ```
 */
export function genAnimateTranslatePath(
  path: Point2D[],
  totalDuration: number = 3,
  options: Omit<TranslateAnimationConfig, 'timeline'> = {}
) {
  if (path.length < 1) {
    throw new Error('路径至少需要 1 个点');
  }

  const segmentDuration = totalDuration / path.length;
  const timeline: TranslateTimelineSegment[] = path.map(point => ({
    timeSpanSec: segmentDuration,
    toValue: point,
  }));

  return genAnimateTranslate({
    ...options,
    timeline,
  });
}

