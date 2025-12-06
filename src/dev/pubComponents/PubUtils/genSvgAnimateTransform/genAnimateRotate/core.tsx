/**
 * genAnimateRotate 核心函数
 */

import React from 'react';
import { isUndefined, isArray } from 'lodash';
import { genSvgKeys, SvgTimelineSegment } from '../../svgKeySplines/genSvgKeys.ts';
import { RotateAnimationConfig, RotateOrigin } from './types.ts';
import { ElementBoundsType, getOriginNumByText } from '../utils/getElementBounds.ts';
import byDefault from '../../../../utils/common/byDefault.ts';
import { getLinearBezier } from '../../getBezier';

/**
 * 将快捷位置转换为具体坐标
 */
function resolveOriginShorthand(
  origin: RotateOrigin,
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
      `例如：genAnimateRotate({ origin: "${origin}", elementBounds: { w: 100, h: 100 } })`
    );
  }

  // 使用统一的工具函数
  return getOriginNumByText(origin, bounds!);
}

/**
 * 生成旋转动画的 animateTransform React 元素
 * 使用时间线配置方式，支持复杂的多段动画
 * 
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * // 简单的两段动画（线性运动）
 * genAnimateRotate({
 *   initAngle: 0,
 *   timeline: [
 *     { timeSpanSec: 2, toAngle: 180 },
 *     { timeSpanSec: 1, toAngle: 360 }
 *   ]
 * })
 * 
 * // 往返旋转（无限循环）
 * genAnimateRotate({
 *   initAngle: 0,
 *   timeline: [
 *     { timeSpanSec: 1.5, toAngle: 180 },  // 转到 180°
 *     { timeSpanSec: 1.5, toAngle: 0 }     // 转回 0°
 *   ],
 *   loopCount: 0
 * })
 * 
 * // 保持角度（延迟效果）
 * genAnimateRotate({
 *   initAngle: 0,
 *   timeline: [
 *     { timeSpanSec: 1, toAngle: 360 },    // 旋转
 *     { timeSpanSec: 2 },                   // 保持 2 秒
 *     { timeSpanSec: 1, toAngle: 0 }       // 返回
 *   ],
 *   loopCount: 0
 * })
 * 
 * // 自定义缓动（弹性效果）
 * genAnimateRotate({
 *   timeline: [
 *     { timeSpanSec: 1, toAngle: 360, keySplines: '0.68 -0.55 0.265 1.55' }
 *   ]
 * })
 * ```
 */
export function genAnimateRotate(config: RotateAnimationConfig) {
  const {
    initAngle = 0,
    timeline,
    delay = 0,
    additive = true,
    isBeginWithClick = false,
    calcMode,
    freeze = false,
    loopCount = 1,
    isRelativeRotate = true,
    origin = 'center',
    elementBounds,
  } = config;

  // 参数验证
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    throw new Error('timeline 必须是非空数组');
  }

  // 解析旋转中心点
  const [centerX, centerY] = resolveOriginShorthand(origin, elementBounds);

  // 构建完整的角度序列
  const angles: number[] = [initAngle];
  let lastAngle = initAngle;

  timeline.forEach((segment) => {
    let newAngle: number;

    if (isRelativeRotate) {
      // 相对旋转模式：toValue 是增量角度，需要累加
      const deltaAngle = byDefault(segment.toValue, 0);
      newAngle = lastAngle + deltaAngle;
    } else {
      // 绝对旋转模式（默认）：toValue 是绝对角度
      newAngle = !isUndefined(segment.toValue) ? segment.toValue : lastAngle;
    }

    angles.push(newAngle);
    lastAngle = newAngle;
  });

  // 计算总时长
  const totalDuration = timeline.reduce((sum, segment) => sum + segment.timeSpanSec, 0);

  // 使用 genSvgKeys 生成动画参数
  const angleTimeline: SvgTimelineSegment[] = timeline.map((segment, index) => ({
    keySplines: byDefault(segment.keySplines, getLinearBezier()),
    toValue: angles[index + 1],
    timeSpanSec: segment.timeSpanSec,
  }));

  const angleKeys = genSvgKeys({
    initValue: initAngle,
    timeline: angleTimeline,
  });

  // 构建 values（格式："angle cx cy"）
  const angleValues = angleKeys.values.split(';');
  const values = angleValues.map(angle => `${angle} ${centerX} ${centerY}`).join(';');

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
      type="rotate"
      values={values}
      keyTimes={angleKeys.keyTimes}
      keySplines={finalCalcMode === 'spline' ? angleKeys.keySplines : undefined}
      dur={`${totalDuration}s`}
      calcMode={finalCalcMode}
      repeatCount={repeatCountValue}
      begin={beginValue}
      fill={freeze ? 'freeze' : 'remove'}
      additive={additive ? 'sum' : undefined}
    />
  );
}

/**
 * 获取中心旋转的样式对象
 * 
 * 为什么需要这个样式？
 * ----------------
 * SVG 的 animateTransform rotate 默认绕坐标原点 (0,0) 旋转。
 * 要绕元素中心旋转有两种方法：
 * 
 * 方法1（推荐）：使用 CSS transform-origin
 *   - 优点：代码简洁，自适应元素大小
 *   - 缺点：需要额外的 style 属性
 *   - 使用：配合 origin: 'center'
 * 
 * 方法2：手动计算中心坐标
 *   - 优点：纯 SVG 实现，兼容性更好
 *   - 缺点：需要明确知道元素位置和尺寸
 *   - 使用：origin: [cx, cy] 或快捷位置 + elementBounds
 * 
 * 此函数实现方法1，返回必需的 CSS 样式。
 * 
 * @returns React CSSProperties 对象
 * @example
 * ```tsx
 * // 方法1：使用 CSS（推荐）
 * <image style={getCenterRotateStyle()} x="0" y="0" width="100" height="100">
 *   {genAnimateRotate({ origin: 'center', ... })}
 * </image>
 * 
 * // 方法2：使用快捷位置
 * <image x="0" y="0" width="100" height="100">
 *   {genAnimateRotate({ 
 *     origin: 'topCenter',
 *     elementBounds: { x: 0, y: 0, width: 100, height: 100 },
 *     ...
 *   })}
 * </image>
 * 
 * // 方法3：手动计算坐标
 * <image x="0" y="0" width="100" height="100">
 *   {genAnimateRotate({ origin: [50, 50], ... })}
 * </image>
 * ```
 */
export function getCenterRotateStyle(): React.CSSProperties {
  return {
    transformOrigin: 'center',  // 设置变换原点为元素中心
    transformBox: 'fill-box'    // 基于元素的填充区域计算（而非 SVG 画布）
  };
}

