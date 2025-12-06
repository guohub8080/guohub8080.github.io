/**
 * 生成呼吸动画的 animateTransform 标签
 * 呼吸动画是一种自动循环的缩放效果，用于吸引注意力
 */

import React from 'react';
import { isString, isArray } from 'lodash';

export interface BreatheOptions {
  /** 初始缩放比例，默认 1 */
  fromScale?: number;
  /** 目标缩放比例，默认 1.1 */
  toScale?: number;
  /** 动画时长（秒），默认 2 */
  duration?: number;
  /** 
   * 缓动曲线，支持字符串或数组
   * - string: 两个阶段使用相同曲线
   * - [string]: 两个阶段使用相同曲线
   * - [string, string]: 第一个用于放大，第二个用于缩小
   * - 三个及以上: 抛出错误
   * @default '0.42 0 0.58 1' (ease-in-out)
   */
  keySplines?: string | string[];
  /** 重复次数，0 表示无限循环，默认 0 */
  repeatCount?: number;
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 
   * 变换原点，默认 'center'
   * - 'center': 以图形中心为原点（推荐）
   * - 'origin': 以坐标原点(0,0)为原点
   * - 自定义: 如 '50% 50%' 或 '100 100'
   */
  transformOrigin?: 'center' | 'origin' | string;
  /** 
   * 是否累加变换（与其他变换组合），默认 true
   * - true: 与其他动画叠加（推荐，可以同时使用多个动画）
   * - false: 替换其他变换
   */
  additive?: boolean;
  /** 是否点击触发，默认 false（自动开始） */
  isBeginWithClick?: boolean;
}

/**
 * 生成呼吸动画的 animateTransform React 元素
 * 呼吸动画会自动开始并循环播放
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * <svg width="200" height="200">
 *   <g style={getCenterScaleStyle()}>
 *     {genAnimateBreathe()}
 *     <rect width="100" height="100" fill="red" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateBreathe(options: BreatheOptions = {}) {
  const {
    fromScale = 1,
    toScale = 1.1,
    duration = 2,
    keySplines = '0.42 0 0.58 1',
    repeatCount = 0,
    delay = 0,
    transformOrigin = 'center',
    additive = true,
    isBeginWithClick = false,
  } = options;

  // 计算关键帧值：原始大小 -> 放大 -> 原始大小
  const values = `${fromScale};${toScale};${fromScale}`;
  
  // 处理 keySplines：支持字符串或数组
  let keySplinesFull: string;
  if (isString(keySplines)) {
    // 字符串：来回都用同一个
    keySplinesFull = `${keySplines};${keySplines}`;
  } else if (isArray(keySplines)) {
    if (keySplines.length === 1) {
      // 数组只有一个元素：来回都用同一个
      keySplinesFull = `${keySplines[0]};${keySplines[0]}`;
    } else if (keySplines.length === 2) {
      // 数组有两个元素：第一个用于放大，第二个用于缩小
      keySplinesFull = `${keySplines[0]};${keySplines[1]}`;
    } else {
      // 三个及以上：报错
      throw new Error(`keySplines 数组长度必须是 1 或 2，当前长度为 ${keySplines.length}`);
    }
  } else {
    throw new Error(`keySplines 必须是 string 或 string[]`);
  }
  
  const repeatCountValue = repeatCount === 0 ? 'indefinite' : repeatCount;
  
  // 处理 begin 属性
  const beginValue = isBeginWithClick 
    ? (delay !== 0 ? `click+${delay}s` : 'click')
    : (delay !== 0 ? `${delay}s` : undefined);

  return (
    <animateTransform
      attributeName="transform"
      type="scale"
      values={values}
      dur={`${duration}s`}
      repeatCount={repeatCountValue}
      calcMode="spline"
      keySplines={keySplinesFull}
      begin={beginValue}
      additive={additive ? 'sum' : undefined}
    />
  );
}

/**
 * 预设的呼吸动画效果
 */
export const breathePresets = {
  /** 标准呼吸（2秒） */
  normal: () => genAnimateBreathe(),
  
  /** 快速呼吸（1秒） */
  fast: () => genAnimateBreathe({ 
    duration: 1,
    toScale: 1.15
  }),
  
  /** 慢速呼吸（3秒） */
  slow: () => genAnimateBreathe({ 
    duration: 3,
    toScale: 1.08,
    keySplines: '0.37 0 0.63 1'
  }),
  
  /** 轻微呼吸（2.5秒，小幅度） */
  gentle: () => genAnimateBreathe({ 
    duration: 2.5,
    toScale: 1.05
  }),
  
  /** 强烈呼吸（1.5秒，大幅度） */
  strong: () => genAnimateBreathe({ 
    duration: 1.5,
    toScale: 1.2
  }),
  
  /** 延迟呼吸（延迟1秒后开始） */
  delayed: () => genAnimateBreathe({ 
    delay: 1
  }),
};

/**
 * 获取中心缩放的样式对象
 * 用于让缩放动画以元素中心为原点
 * @returns React CSSProperties 对象
 * @example
 * ```tsx
 * <g style={getCenterScaleStyle()}>
 *   {genAnimateBreathe()}
 *   <rect width="100" height="100" fill="red" />
 * </g>
 * ```
 */
export function getCenterBreatheStyle(): React.CSSProperties {
  return {
    transformOrigin: 'center',
    transformBox: 'fill-box'
  };
}

