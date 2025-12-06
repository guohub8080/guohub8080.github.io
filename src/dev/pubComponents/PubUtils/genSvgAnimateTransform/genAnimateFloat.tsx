/**
 * 生成浮动动画的 animateTransform 标签
 */

import React from 'react';

export interface FloatOptions {
  /** Y轴浮动范围（像素），默认 20 */
  floatRangeY?: number;
  /** X轴浮动范围（像素），默认 0 */
  floatRangeX?: number;
  /** 动画时长（秒），默认 4 */
  duration?: number;
  /** 缓动曲线，默认 '0.24 0 0.24 1' (ease-in-out) */
  keySplines?: string;
  /** 重复次数，0 表示无限循环，默认 0 */
  repeatCount?: number;
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 是否点击触发，默认 false（自动开始） */
  isBeginWithClick?: boolean;
}

/**
 * 生成浮动动画的 animateTransform React 元素
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * <svg>
 *   <g>
 *     {genAnimateFloat({ floatRangeY: 20, duration: 4 })}
 *     <rect width="100" height="100" fill="red" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateFloat(options: FloatOptions = {}) {
  const {
    floatRangeY = 20,
    floatRangeX = 0,
    duration = 4,
    keySplines = '0.24 0 0.24 1',
    repeatCount = 0,
    delay = 0,
    isBeginWithClick = false,
  } = options;

  // 计算关键帧值
  const startValue = `${floatRangeX} ${floatRangeY}`;
  const midValue = `${-floatRangeX} ${-floatRangeY}`;
  const endValue = `${floatRangeX} ${floatRangeY}`;
  
  const values = `${startValue};${midValue};${endValue}`;
  
  // keySplines 需要 n-1 段（n 是关键帧数量）
  const keySplinesFull = `${keySplines};${keySplines}`;
  
  const repeatCountValue = repeatCount === 0 ? 'indefinite' : repeatCount;
  
  // 处理 begin 属性
  const beginValue = isBeginWithClick 
    ? (delay !== 0 ? `click+${delay}s` : 'click')
    : (delay !== 0 ? `${delay}s` : undefined);

  return (
    <animateTransform
      attributeName="transform"
      type="translate"
      values={values}
      repeatCount={repeatCountValue}
      calcMode="spline"
      keySplines={keySplinesFull}
      dur={`${duration}s`}
      begin={beginValue}
    />
  );
}
