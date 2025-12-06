/**
 * genAnimatePathStroke 核心函数
 */

import React from 'react';
import { isUndefined } from 'lodash';
import { genSvgKeys, SvgTimelineSegment } from '../../svgKeySplines/genSvgKeys.ts';
import { PathStrokeAnimationConfig } from './types.ts';
import byDefault from '../../../../utils/common/byDefault.ts';
import { getLinearBezier } from '../../getBezier';

/**
 * 生成路径描边动画的 <g> 容器及 <animate> 元素
 * 使用时间线配置方式，支持复杂的多段动画
 * 
 * @param config 路径描边动画配置
 * @param children 路径元素（<path>、<line>、<polyline> 等）
 * @returns 返回带有描边动画的 <g> 容器
 * @example
 * ```tsx
 * // 基础描边动画（自动播放）
 * {genAnimatePathStroke(
 *   {
 *     pathLength: 996,
 *     timeline: [
 *       { timeSpanSec: 2, toValue: 0 }
 *     ]
 *   },
 *   <path d="M10,10 L290,490" stroke="red" strokeWidth="2" fill="none" />
 * )}
 * 
 * // 点击触发的描边动画
 * {genAnimatePathStroke(
 *   {
 *     pathLength: 996,
 *     isBeginWithClick: true,
 *     restart: 'never',
 *     timeline: [
 *       { timeSpanSec: 2, toValue: 0 } // 点击后绘制
 *     ]
 *   },
 *   <path d="M..." stroke="blue" strokeWidth="3" fill="none" />
 * )}
 * ```
 */
export function genAnimatePathStroke(
  config: PathStrokeAnimationConfig,
  children: React.ReactNode,
  clickableAreaSize?: { width: number; height: number }
) {
  const {
    pathLength = 996,
    initOffset,
    timeline,
    delay = 0,
    isBeginWithClick = false,
    calcMode,
    freeze = true,
    loopCount = 1,
    restart = 'always',
  } = config;

  // 参数验证
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    throw new Error('timeline 必须是非空数组');
  }

  // 初始偏移量默认为路径长度（完全隐藏）
  const initialOffset = byDefault(initOffset, pathLength);

  // 构建完整的偏移量序列
  const offsets: number[] = [initialOffset];
  let lastOffset = initialOffset;

  timeline.forEach((segment) => {
    const newOffset = !isUndefined(segment.toValue) ? segment.toValue : lastOffset;
    offsets.push(newOffset);
    lastOffset = newOffset;
  });

  // 计算总时长
  const totalDuration = timeline.reduce((sum, segment) => sum + segment.timeSpanSec, 0);

  // 使用 genSvgKeys 生成动画参数
  const offsetTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: byDefault(segment.keySplines, getLinearBezier()),
    toValue: offsets[index + 1],
    timeSpanSec: segment.timeSpanSec,
  }));

  const offsetKeys = genSvgKeys({
    initValue: initialOffset,
    timeline: offsetTimeline,
  });

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
    <g
      strokeDasharray={`${pathLength},${pathLength}`}
      strokeDashoffset={pathLength}
      style={isBeginWithClick ? { cursor: 'pointer' } : undefined}
    >
      <animate
        attributeType="CSS"
        attributeName="stroke-dashoffset"
        values={offsetKeys.values}
        keyTimes={offsetKeys.keyTimes}
        keySplines={finalCalcMode === 'spline' ? offsetKeys.keySplines : undefined}
        dur={`${totalDuration}s`}
        calcMode={finalCalcMode}
        begin={beginValue}
        fill={freeze ? 'freeze' : 'remove'}
        repeatCount={repeatCountValue}
        restart={restart}
      />
      {/* 点击触发时添加透明覆盖层，让整个区域都可点击 */}
      {isBeginWithClick && clickableAreaSize && (
        <rect
          x="0"
          y="0"
          width={clickableAreaSize.width}
          height={clickableAreaSize.height}
          fill="transparent"
        />
      )}
      {children}
    </g>
  );
}

