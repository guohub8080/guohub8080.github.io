/**
 * genAnimateTranslate 核心函数
 */

import React from 'react';
import { isUndefined } from 'lodash';
import { genSvgKeys, SvgTimelineSegment } from '../../svgKeySplines/genSvgKeys.ts';
import { Point2D, TranslateAnimationConfig } from './types.ts';
import byDefault from '../../../../utils/common/byDefault.ts';

/**
 * 生成平移动画的 animateTransform React 元素
 * 使用时间线配置方式，支持复杂的多段动画
 * 
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * // 简单的两段动画
 * genAnimateTranslate({
 *   initValue: { x: 0, y: 0 },
 *   timeline: [
 *     { timeSpanSec: 2, toValue: { x: 100, y: 50 }, keySplines: '0.42 0 0.58 1' },
 *     { timeSpanSec: 1, toValue: { x: 200, y: 0 }, keySplines: '0 0 0.58 1' }
 *   ]
 * })
 * 
 * // 往返动画
 * genAnimateTranslate({
 *   initValue: { x: 0, y: 0 },
 *   timeline: [
 *     { timeSpanSec: 1.5, toValue: { x: 100 } },  // 向右
 *     { timeSpanSec: 1.5, toValue: { x: 0 } }     // 向左
 *   ],
 *   loopCount: 0  // 无限循环
 * })
 * 
 * // 保持位置（延迟效果）
 * genAnimateTranslate({
 *   initValue: { x: 0, y: 0 },
 *   timeline: [
 *     { timeSpanSec: 1, toValue: { x: 100 } },    // 移动
 *     { timeSpanSec: 2 },                          // 保持 2 秒
 *     { timeSpanSec: 1, toValue: { x: 0 } }       // 返回
 *   ],
 *   loopCount: 0
 * })
 * ```
 */
export function genAnimateTranslate(config: TranslateAnimationConfig) {
  const {
    initValue = {},
    timeline,
    delay = 0,
    additive = true,
    isBeginWithClick = false,
    calcMode,
    freeze = false,
    loopCount = 1,
    isRelativeMove = true,
  } = config;

  // 提取初始坐标
  const initX = byDefault(initValue.x, 0);
  const initY = byDefault(initValue.y, 0);

  // 参数验证
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    throw new Error('timeline 必须是非空数组');
  }

  // 构建完整的坐标序列
  const coordinates: Point2D[] = [{ x: initX, y: initY }];
  let lastX = initX;
  let lastY = initY;

  timeline.forEach((segment, index) => {
    let newX: number;
    let newY: number;

    if (isRelativeMove) {
      // 相对移动模式：toValue 是增量，需要累加
      const deltaX = byDefault(segment.toValue?.x, 0);
      const deltaY = byDefault(segment.toValue?.y, 0);
      newX = lastX + deltaX;
      newY = lastY + deltaY;
    } else {
      // 累积移动模式（默认）：toValue 是绝对坐标
      newX = !isUndefined(segment.toValue?.x) ? segment.toValue.x : lastX;
      newY = !isUndefined(segment.toValue?.y) ? segment.toValue.y : lastY;
    }

    coordinates.push({ x: newX, y: newY });
    lastX = newX;
    lastY = newY;
  });

  // 计算总时长
  const totalDuration = timeline.reduce((sum, segment) => sum + segment.timeSpanSec, 0);

  // 使用 genSvgKeys 分别生成 X 和 Y 的动画参数
  const xTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: byDefault(segment.keySplines, '0.42 0 0.58 1'),
    toValue: coordinates[index + 1].x,
    timeSpanSec: segment.timeSpanSec,
  }));

  const yTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: byDefault(segment.keySplines, '0.42 0 0.58 1'),
    toValue: coordinates[index + 1].y,
    timeSpanSec: segment.timeSpanSec,
  }));

  const xKeys = genSvgKeys({
    initValue: initX,
    timeline: xTimeline,
  });

  const yKeys = genSvgKeys({
    initValue: initY,
    timeline: yTimeline,
  });

  // 合并 X 和 Y 的 values
  const xValues = xKeys.values.split(';');
  const yValues = yKeys.values.split(';');
  const xyCombinedValues = xValues.map((v, i) => `${v} ${yValues[i]}`).join(';');

  // 确定 calcMode
  const hasKeySplines = timeline.some(seg => seg.keySplines);
  const finalCalcMode = byDefault(calcMode, hasKeySplines ? 'spline' : 'linear');

  // 处理 begin 属性
  const beginValue = isBeginWithClick 
    ? (delay !== 0 ? `click+${delay}s` : 'click')
    : (delay !== 0 ? `${delay}s` : undefined);

  // 处理 repeatCount
  const repeatCountValue = loopCount === 0 ? 'indefinite' : loopCount;

  return (
    <animateTransform
      attributeName="transform"
      type="translate"
      values={xyCombinedValues}
      keyTimes={xKeys.keyTimes}
      keySplines={finalCalcMode === 'spline' ? xKeys.keySplines : undefined}
      dur={`${totalDuration}s`}
      calcMode={finalCalcMode}
      repeatCount={repeatCountValue}
      begin={beginValue}
      fill={freeze ? 'freeze' : 'remove'}
      additive={additive ? 'sum' : undefined}
    />
  );
}

