/**
 * genAnimateTranslate - 平移动画生成器
 * 这是最基础的位移动画生成器，具有普遍基准意义
 * 基于 genSvgKeys 的设计理念，支持复杂的时间线配置
 */

// 导出类型
export type {
  Point2D,
  TranslateTimelineSegment,
  AnimateCalcMode,
  TranslateAnimationConfig,
} from './types.ts';

// 导出核心函数
export { genAnimateTranslate } from './core.tsx';

// 导出预设效果
export { translatePresets } from './presets.tsx';

// 导出辅助函数和常量
export {
  TranslateDirection,
  genAnimateTranslateByDirection,
  genAnimateTranslateLoop,
  genAnimateTranslatePath,
} from './helpers.tsx';

