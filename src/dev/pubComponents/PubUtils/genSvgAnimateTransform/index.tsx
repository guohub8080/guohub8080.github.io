/**
 * SVG 动画标签生成器（分发器）
 * @description 提供各种类型的 SVG 动画生成函数
 */

import React from 'react';

// ==================== 导入工具类型 ====================
import { 
  getElementBounds,
  getOriginNumByText,
  type ElementBoundsType,
  type OriginPosition
} from './utils/getElementBounds.ts';

// ==================== 导入 ====================
import { 
  genAnimateFloat, 
  type FloatOptions 
} from './genAnimateFloat.tsx';

import { floatingPresets } from './animatePresetFloat.tsx';

import {
  genAnimateFadeBlink,
  fadeBlinkPresets,
  type FadeBlinkOptions
} from './genAnimateFadeBlink.tsx';

import {
  genAnimateScale,
  scalePresets,
  getCenterScaleStyle,
  ScaleValue,
  genAnimateScaleSimple,
  genAnimateScaleLoop,
  genAnimateScalePulse,
  genAnimateScalePath,
  genAnimateScaleBounce,
  type ScaleAnimationConfig,
  type ScaleTimelineSegment,
} from './genAnimateScale';

import {
  genAnimateBreathe,
  breathePresets,
  getCenterBreatheStyle,
  type BreatheOptions
} from './genAnimateBreathe.tsx';

import {
  genAnimateRotate,
  rotatePresets,
  getCenterRotateStyle,
  RotateDirection,
  genAnimateRotateByAngle,
  genAnimateRotateLoop,
  genAnimateRotateSwing,
  genAnimateRotatePath,
  type RotateAnimationConfig,
  type RotateTimelineSegment,
  type RotateOrigin,
} from './genAnimateRotate';

import {
  genAnimateOpacity,
  opacityPresets,
  OpacityValue,
  genAnimateOpacityFade,
  genAnimateOpacityLoop,
  genAnimateOpacityBlink,
  genAnimateOpacityPath,
  type OpacityAnimationConfig,
  type OpacityTimelineSegment,
} from './genAnimateOpacity';

import {
  genAnimateSkewX,
  skewXPresets,
  SkewXAngle,
  genAnimateSkewXSimple,
  genAnimateSkewXLoop,
  genAnimateSkewXSwing,
  genAnimateSkewXPath,
  type SkewXAnimationConfig,
  type SkewXTimelineSegment,
} from './genAnimateSkewX';

import {
  genAnimateSkewY,
  skewYPresets,
  SkewYAngle,
  genAnimateSkewYSimple,
  genAnimateSkewYLoop,
  genAnimateSkewYSwing,
  genAnimateSkewYPath,
  type SkewYAnimationConfig,
  type SkewYTimelineSegment,
} from './genAnimateSkewY';

// ==================== 导出工具类型 ====================
export {
  getElementBounds,
  getOriginNumByText,
  type ElementBoundsType,
  type OriginPosition
};

// ==================== 导出浮动动画 ====================
export { 
  genAnimateFloat, 
  floatingPresets,
  type FloatOptions 
};

// ==================== 导出淡入淡出/闪烁动画 ====================
export {
  genAnimateFadeBlink,
  fadeBlinkPresets,
  type FadeBlinkOptions
};

// ==================== 导出缩放动画 ====================
export {
  genAnimateScale,
  scalePresets,
  getCenterScaleStyle,
  ScaleValue,
  genAnimateScaleSimple,
  genAnimateScaleLoop,
  genAnimateScalePulse,
  genAnimateScalePath,
  genAnimateScaleBounce,
  type ScaleAnimationConfig,
  type ScaleTimelineSegment,
};

// ==================== 导出呼吸动画 ====================
export {
  genAnimateBreathe,
  breathePresets,
  getCenterBreatheStyle,
  type BreatheOptions
};

// ==================== 导出旋转动画 ====================
export {
  genAnimateRotate,
  rotatePresets,
  getCenterRotateStyle,
  RotateDirection,
  genAnimateRotateByAngle,
  genAnimateRotateLoop,
  genAnimateRotateSwing,
  genAnimateRotatePath,
  type RotateAnimationConfig,
  type RotateTimelineSegment,
  type RotateOrigin,
};

// ==================== 导出不透明度动画 ====================
export {
  genAnimateOpacity,
  opacityPresets,
  OpacityValue,
  genAnimateOpacityFade,
  genAnimateOpacityLoop,
  genAnimateOpacityBlink,
  genAnimateOpacityPath,
  type OpacityAnimationConfig,
  type OpacityTimelineSegment,
};

// ==================== 导出水平斜切动画 ====================
export {
  genAnimateSkewX,
  skewXPresets,
  SkewXAngle,
  genAnimateSkewXSimple,
  genAnimateSkewXLoop,
  genAnimateSkewXSwing,
  genAnimateSkewXPath,
  type SkewXAnimationConfig,
  type SkewXTimelineSegment,
};

// ==================== 导出垂直斜切动画 ====================
export {
  genAnimateSkewY,
  skewYPresets,
  SkewYAngle,
  genAnimateSkewYSimple,
  genAnimateSkewYLoop,
  genAnimateSkewYSwing,
  genAnimateSkewYPath,
  type SkewYAnimationConfig,
  type SkewYTimelineSegment,
};

// ==================== 自定义变换 ====================

export interface CustomTransformOptions {
  /** 变换类型，默认 'translate' */
  type?: 'translate' | 'rotate' | 'scale' | 'skewX' | 'skewY';
  /** 关键帧值数组（必填） */
  values: string[];
  /** 动画时长（秒），默认 4 */
  duration?: number;
  /** 贝塞尔曲线数组（长度应为 values.length - 1） */
  keySplines?: string[];
  /** 重复次数，0 表示无限循环，默认 0 */
  repeatCount?: number;
  /** 初始延迟（秒），默认 0 */
  delay?: number;
}

/**
 * 生成自定义关键帧的 animateTransform React 元素
 * @returns 返回 React <animateTransform> 元素
 * @example
 * ```tsx
 * <svg>
 *   <g>
 *     {genAnimateCustom({
 *       type: 'translate',
 *       values: ['0 0', '100 50', '0 0'],
 *       duration: 3,
 *     })}
 *     <rect width="100" height="100" fill="blue" />
 *   </g>
 * </svg>
 * ```
 */
export function genAnimateCustom(options: CustomTransformOptions) {
  const {
    type = 'translate',
    values,
    duration = 4,
    keySplines,
    repeatCount = 0,
    delay = 0,
  } = options;

  const valuesStr = values.join(';');
  const keySplinesStr = keySplines?.join(';');
  const repeatCountValue = repeatCount === 0 ? 'indefinite' : repeatCount;

  return (
    <animateTransform
      attributeName="transform"
      type={type}
      values={valuesStr}
      repeatCount={repeatCountValue}
      {...(keySplines && { calcMode: 'spline' as const, keySplines: keySplinesStr })}
      dur={`${duration}s`}
      {...(delay !== 0 && { begin: `${delay}s` })}
    />
  );
}

// ==================== 默认导出 ====================

export default {
  // 工具函数
  getElementBounds,
  getOriginNumByText,
  // 动画生成器
  genAnimateFloat,
  genAnimateCustom,
  genAnimateFadeBlink,
  genAnimateScale,
  getCenterScaleStyle,
  ScaleValue,
  genAnimateScaleSimple,
  genAnimateScaleLoop,
  genAnimateScalePulse,
  genAnimateScalePath,
  genAnimateScaleBounce,
  genAnimateBreathe,
  getCenterBreatheStyle,
  genAnimateRotate,
  getCenterRotateStyle,
  RotateDirection,
  genAnimateRotateByAngle,
  genAnimateRotateLoop,
  genAnimateRotateSwing,
  genAnimateRotatePath,
  genAnimateOpacity,
  OpacityValue,
  genAnimateOpacityFade,
  genAnimateOpacityLoop,
  genAnimateOpacityBlink,
  genAnimateOpacityPath,
  genAnimateSkewX,
  SkewXAngle,
  genAnimateSkewXSimple,
  genAnimateSkewXLoop,
  genAnimateSkewXSwing,
  genAnimateSkewXPath,
  genAnimateSkewY,
  SkewYAngle,
  genAnimateSkewYSimple,
  genAnimateSkewYLoop,
  genAnimateSkewYSwing,
  genAnimateSkewYPath,
  floatingPresets,
  fadeBlinkPresets,
  scalePresets,
  breathePresets,
  rotatePresets,
  opacityPresets,
  skewXPresets,
  skewYPresets,
};
