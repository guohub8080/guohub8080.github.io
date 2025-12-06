/**
 * genAnimateOpacity - 不透明度动画生成器
 * 基于 genSvgKeys 的设计理念，支持复杂的时间线配置
 */

// 导出类型
export type {
  OpacityTimelineSegment,
  AnimateCalcMode,
  OpacityAnimationConfig,
} from './types.ts';

// 导出核心函数
export { genAnimateOpacity } from './core.tsx';

// 导出预设效果
export { opacityPresets } from './presets.tsx';

// 导出辅助函数和常量
export {
  OpacityValue,
  genAnimateOpacityFade,
  genAnimateOpacityLoop,
  genAnimateOpacityBlink,
  genAnimateOpacityPath,
} from './helpers.tsx';

