/**
 * genAnimateScale 核心函数
 */

import React from 'react';
import { isUndefined, isArray } from 'lodash';
import { genSvgKeys, SvgTimelineSegment } from '../../svgKeySplines/genSvgKeys.ts';
import { ScaleAnimationConfig, ScaleOrigin } from './types.ts';
import { ElementBoundsType, getOriginNumByText } from '../utils/getElementBounds.ts';
import byDefault from '../../../../utils/common/byDefault.ts';
import { getEaseBezier } from '../../getBezier';

/**
 * 将快捷位置转换为具体坐标
 */
function resolveOriginShorthand(
  origin: ScaleOrigin,
  bounds?: ElementBoundsType
): [number, number] {
  // 如果是数组，直接返回自定义坐标
  if (isArray(origin)) {
    return origin;
  }

  // center: 如果有 bounds 就计算中心，否则返回 [0,0]（配合 CSS）
  if (origin === 'center' && !bounds) {
    return [0, 0];
  }

  // 其他快捷位置必须提供 bounds（除了 origin）
  if (origin !== 'origin' && !bounds) {
    throw new Error(
      `使用快捷位置 "${origin}" 需要提供 elementBounds 参数\n` +
      `例如：genAnimateScale({ origin: "${origin}", elementBounds: { w: 100, h: 100 } })`
    );
  }

  // 使用统一的工具函数
  return getOriginNumByText(origin, bounds!);
}

/**
 * 生成缩放动画的 animateTransform React 元素
 * 使用时间线配置方式，支持复杂的多段动画
 * 
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * // 简单的两段动画
 * genAnimateScale({
 *   initScale: 1,
 *   timeline: [
 *     { timeSpanSec: 1, toScale: 1.5 },
 *     { timeSpanSec: 1, toScale: 1 }
 *   ]
 * })
 * 
 * // 呼吸缩放（无限循环）
 * genAnimateScale({
 *   initScale: 1,
 *   timeline: [
 *     { timeSpanSec: 1.5, toScale: 1.2 },
 *     { timeSpanSec: 1.5, toScale: 1 }
 *   ],
 *   loopCount: 0
 * })
 * 
 * // 点击触发动画
 * genAnimateScale({
 *   timeline: [{ timeSpanSec: 1, toScale: 1.5 }],
 *   isBeginWithClick: true
 * })
 * 
 * // 点击后延迟 2 秒开始
 * genAnimateScale({
 *   timeline: [{ timeSpanSec: 1, toScale: 1.5 }],
 *   isBeginWithClick: true,
 *   delay: 2
 * })
 * 
 * // 保持缩放（延迟效果）
 * genAnimateScale({
 *   initScale: 1,
 *   timeline: [
 *     { timeSpanSec: 0.5, toScale: 1.3 },  // 放大
 *     { timeSpanSec: 2 },                   // 保持 2 秒
 *     { timeSpanSec: 0.5, toScale: 1 }     // 还原
 *   ],
 *   loopCount: 0
 * })
 * 
 * // 自定义缓动（弹性效果）
 * genAnimateScale({
 *   timeline: [
 *     { timeSpanSec: 1, toScale: 1.5, keySplines: '0.68 -0.55 0.265 1.55' }
 *   ]
 * })
 * ```
 */
export function genAnimateScale(config: ScaleAnimationConfig) {
  const {
    initScale = 1,
    timeline,
    delay = 0,
    additive = true,
    isBeginWithClick = false,
    calcMode,
    freeze = false,
    loopCount = 1,
    origin = 'center',
    elementBounds,
  } = config;

  // 参数验证
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    throw new Error('timeline 必须是非空数组');
  }

  // 解析缩放中心点
  const [centerX, centerY] = resolveOriginShorthand(origin, elementBounds);

  // 构建完整的缩放序列
  const scales: number[] = [initScale];
  let lastScale = initScale;

  timeline.forEach((segment) => {
    const newScale = !isUndefined(segment.toValue) ? segment.toValue : lastScale;
    scales.push(newScale);
    lastScale = newScale;
  });

  // 计算总时长
  const totalDuration = timeline.reduce((sum, segment) => sum + segment.timeSpanSec, 0);

  // 使用 genSvgKeys 生成动画参数
  const scaleTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: byDefault(segment.keySplines, getEaseBezier({ isIn: true, isOut: true })),
    toValue: scales[index + 1],
    timeSpanSec: segment.timeSpanSec,
  }));

  const scaleKeys = genSvgKeys({
    initValue: initScale,
    timeline: scaleTimeline,
  });

  // 基于时间轴构建各段 values
  // scale 使用 "sx sy"；为了围绕任意原点缩放，这里采用三段复合变换：
  // translate(cx, cy) -> scale(sx, sy) -> translate(-cx, -cy)
  const scaleValuesList = scaleKeys.values.split(';');
  const scaleValues = scaleValuesList.map(scale => `${scale} ${scale}`).join(';');
  const translateToValues = scaleValuesList.map(() => `${centerX} ${centerY}`).join(';');
  const translateBackValues = scaleValuesList.map(() => `${-centerX} ${-centerY}`).join(';');

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
    <>
      {/* 先平移到原点 */}
      <animateTransform
        attributeName="transform"
        type="translate"
        values={translateToValues}
        keyTimes={scaleKeys.keyTimes}
        dur={`${totalDuration}s`}
        calcMode={'linear'}
        repeatCount={repeatCountValue}
        begin={beginValue}
        fill={freeze ? 'freeze' : 'remove'}
        additive={'sum'}
      />
      {/* 中间做缩放 */}
      <animateTransform
        attributeName="transform"
        type="scale"
        values={scaleValues}
        keyTimes={scaleKeys.keyTimes}
        keySplines={finalCalcMode === 'spline' ? scaleKeys.keySplines : undefined}
        dur={`${totalDuration}s`}
        calcMode={finalCalcMode}
        repeatCount={repeatCountValue}
        begin={beginValue}
        fill={freeze ? 'freeze' : 'remove'}
        additive={'sum'}
      />
      {/* 再平移回去 */}
      <animateTransform
        attributeName="transform"
        type="translate"
        values={translateBackValues}
        keyTimes={scaleKeys.keyTimes}
        dur={`${totalDuration}s`}
        calcMode={'linear'}
        repeatCount={repeatCountValue}
        begin={beginValue}
        fill={freeze ? 'freeze' : 'remove'}
        additive={'sum'}
      />
    </>
  );
}

/**
 * 获取中心缩放的样式对象
 * 用于让缩放动画以元素中心为原点
 * @returns React CSSProperties 对象
 * @example
 * ```tsx
 * <g style={getCenterScaleStyle()}>
 *   {genAnimateScale({ ... })}
 *   <rect width="100" height="100" fill="red" />
 * </g>
 * ```
 */
export function getCenterScaleStyle(): React.CSSProperties {
  return {
    transformOrigin: 'center',
    transformBox: 'fill-box'
  };
}

