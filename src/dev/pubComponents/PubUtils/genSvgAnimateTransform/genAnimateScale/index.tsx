/**
 * genAnimateScale - 缩放动画生成器
 * 基于 genSvgKeys 的设计理念，支持复杂的时间线配置
 */

// 导出类型
export type {
  ScaleTimelineSegment,
  AnimateCalcMode,
  ScaleAnimationConfig,
} from './types.ts';

// 导出核心函数
export { genAnimateScale, getCenterScaleStyle } from './core.tsx';

// 导出预设效果
export { scalePresets } from './presets.tsx';

// 导出辅助函数和常量
export {
  ScaleValue,
  genAnimateScaleSimple,
  genAnimateScaleLoop,
  genAnimateScalePulse,
  genAnimateScalePath,
  genAnimateScaleBounce,
} from './helpers.tsx';

