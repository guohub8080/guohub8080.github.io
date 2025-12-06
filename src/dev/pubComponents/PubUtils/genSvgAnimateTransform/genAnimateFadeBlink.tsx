/**
 * 生成淡入淡出/闪烁动画的 animate 标签
 */

import React from 'react';

export interface FadeBlinkOptions {
  /** 最大透明度，默认 1 */
  maxOpacity?: number;
  /** 最小透明度，默认 0.2 */
  minOpacity?: number;
  /** 动画时长（秒），默认 1.2 */
  duration?: number;
  /** 缓动曲线，默认 '0.45 0 0.55 1' (ease-in-out) */
  keySplines?: string;
  /** 重复次数，0 表示无限循环，默认 0 */
  repeatCount?: number;
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 是否点击触发，默认 false（自动开始） */
  isBeginWithClick?: boolean;
}

/**
 * 生成淡入淡出/闪烁动画的 animate React 元素
 * @returns 返回 React <animate> 元素
 * @example
 * ```tsx
 * <svg>
 *   <g>
 *     {genAnimateFadeBlink({ duration: 1.2 })}
 *     <rect width="100" height="100" fill="red" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateFadeBlink(options: FadeBlinkOptions = {}) {
  const {
    maxOpacity = 1,
    minOpacity = 0.2,
    duration = 1.2,
    keySplines = '0.45 0 0.55 1',
    repeatCount = 0,
    delay = 0,
    isBeginWithClick = false,
  } = options;

  // 计算关键帧值：完全显示 -> 淡出 -> 完全显示
  const values = `${maxOpacity};${minOpacity};${maxOpacity}`;
  
  // keySplines 需要 n-1 段（n 是关键帧数量）
  const keySplinesFull = `${keySplines};${keySplines}`;
  
  const repeatCountValue = repeatCount === 0 ? 'indefinite' : repeatCount;
  
  // 处理 begin 属性
  const beginValue = isBeginWithClick 
    ? (delay !== 0 ? `click+${delay}s` : 'click')
    : (delay !== 0 ? `${delay}s` : undefined);

  return (
    <animate
      attributeName="opacity"
      values={values}
      repeatCount={repeatCountValue}
      calcMode="spline"
      keySplines={keySplinesFull}
      dur={`${duration}s`}
      begin={beginValue}
    />
  );
}

/**
 * 预设的淡入淡出/闪烁效果
 */
export const fadeBlinkPresets = {
  /** 轻柔淡入淡出 */
  gentle: () => genAnimateFadeBlink({ minOpacity: 0.5, duration: 2 }),
  
  /** 标准淡入淡出 */
  normal: () => genAnimateFadeBlink({ minOpacity: 0.2, duration: 1.2 }),
  
  /** 深度淡化 */
  deep: () => genAnimateFadeBlink({ minOpacity: 0.1, duration: 2.5 }),
  
  /** 快速闪烁 */
  fast: () => genAnimateFadeBlink({ minOpacity: 0.3, duration: 0.8 }),
  
  /** 慢速淡化 */
  slow: () => genAnimateFadeBlink({ minOpacity: 0.2, duration: 3 }),
  
  /** 微弱淡化 */
  subtle: () => genAnimateFadeBlink({ minOpacity: 0.7, duration: 2 }),
  
  /** 闪烁效果 */
  blink: () => genAnimateFadeBlink({ minOpacity: 0, duration: 0.5 }),
};

