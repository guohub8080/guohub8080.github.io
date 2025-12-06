/**
 * genSvgKeys - SVG 动画参数生成器
 * 
 * 根据初始值和时间线配置，生成 SVG animate 标签所需的 keyTimes、keySplines 和 values
 */

import { round } from 'lodash'

export interface SvgTimelineSegment {
  /** 贝塞尔缓动参数（格式："x1 y1 x2 y2"） */
  keySplines: string;
  /** 目标值 */
  toValue: string | number;
  /** 时间跨度（秒） */
  timeSpanSec: number;
}

export interface SvgTimeline {
  /** 初始值 */
  initValue: string | number;
  /** 时间线段数组 */
  timeline: SvgTimelineSegment[];
}

export interface SvgKeysResult {
  /** 相对时间比例字符串（分号分隔的 0~1 数字） */
  keyTimes: string;
  /** 贝塞尔参数字符串（分号分隔的贝塞尔组） */
  keySplines: string;
  /** 关键值字符串（分号分隔的 value） */
  values: string;
  /** 动画总时长（秒） */
  totalDuration: number;
}

/**
 * 生成 SVG 动画参数
 * 
 * @param input - 包含初始值和时间线的配置对象
 * @returns SVG 动画所需的 keyTimes、keySplines、values 和总时长
 * 
 * @example
 * ```typescript
 * const result = genSvgKeys({
 *   initValue: 0,
 *   timeline: [
 *     { keySplines: '0.42 0 0.58 1', toValue: 100, timeSpanSec: 2 },
 *     { keySplines: '0 0 0.58 1', toValue: 200, timeSpanSec: 3 }
 *   ]
 * });
 * 
 * // result:
 * // {
 * //   keyTimes: '0;0.4;1',
 * //   keySplines: '0.42 0 0.58 1;0 0 0.58 1',
 * //   values: '0;100;200',
 * //   totalDuration: 5
 * // }
 * ```
 */
export function genSvgKeys(input: SvgTimeline): SvgKeysResult {
  const { initValue, timeline } = input;

  // 参数验证
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    throw new Error('timeline 必须是非空数组');
  }

  // 计算总时长
  const totalDuration = timeline.reduce((sum, segment) => sum + segment.timeSpanSec, 0);

  if (totalDuration <= 0) {
    throw new Error('总时长必须大于 0');
  }

  // 构建 values 数组（包含初始值）
  const values: (string | number)[] = [initValue];
  timeline.forEach(segment => {
    values.push(segment.toValue);
  });

  // 构建 keyTimes 数组
  const keyTimes: number[] = [0];
  let accumulatedTime = 0;
  timeline.forEach(segment => {
    accumulatedTime += segment.timeSpanSec;
    const relativeTime = accumulatedTime / totalDuration;
    keyTimes.push(relativeTime);
  });

  // 构建 keySplines 数组
  const keySplines: string[] = timeline.map(segment => segment.keySplines);

  // 验证 keySplines 格式
  keySplines.forEach((spline, index) => {
    if (!isValidKeySpline(spline)) {
      throw new Error(`第 ${index} 个 keySplines 格式不正确: "${spline}". 应为 "x1 y1 x2 y2" 格式，例如 "0.42 0 0.58 1"`);
    }
  });

  return {
    keyTimes: keyTimes.map(t => round(t, 6)).join(';'),
    keySplines: keySplines.join(';'),
    values: values.join(';'),
    totalDuration
  };
}

/**
 * 验证 keySplines 格式是否正确
 * 应为 "x1 y1 x2 y2" 格式，4 个数字用空格分隔
 */
function isValidKeySpline(spline: string): boolean {
  const parts = spline.trim().split(/\s+/);
  if (parts.length !== 4) {
    return false;
  }
  return parts.every(part => {
    const num = parseFloat(part);
    return !isNaN(num) && isFinite(num);
  });
}


