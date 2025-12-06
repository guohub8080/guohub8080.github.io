/**
 * genAnimateSkewX - 水平斜切动画生成器
 * 基于 genSvgKeys 的设计理念，支持复杂的时间线配置
 */

// 导出类型
export type {
  SkewXTimelineSegment,
  AnimateCalcMode,
  SkewXAnimationConfig,
} from './types.ts';

// 导出核心函数
export { genAnimateSkewX } from './core.tsx';

// 导出预设效果
export { skewXPresets } from './presets.tsx';

// 导出辅助函数和常量
export {
  SkewXAngle,
  genAnimateSkewXSimple,
  genAnimateSkewXLoop,
  genAnimateSkewXSwing,
  genAnimateSkewXPath,
} from './helpers.tsx';

