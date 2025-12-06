/**
 * genAnimateSkewY - 垂直斜切动画生成器
 * 基于 genSvgKeys 的设计理念，支持复杂的时间线配置
 */

// 导出类型
export type {
  SkewYTimelineSegment,
  AnimateCalcMode,
  SkewYAnimationConfig,
} from './types.ts';

// 导出核心函数
export { genAnimateSkewY } from './core.tsx';

// 导出预设效果
export { skewYPresets } from './presets.tsx';

// 导出辅助函数和常量
export {
  SkewYAngle,
  genAnimateSkewYSimple,
  genAnimateSkewYLoop,
  genAnimateSkewYSwing,
  genAnimateSkewYPath,
} from './helpers.tsx';

