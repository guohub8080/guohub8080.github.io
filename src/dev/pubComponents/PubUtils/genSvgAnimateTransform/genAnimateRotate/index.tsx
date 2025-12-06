/**
 * genAnimateRotate - 旋转动画生成器
 * 基于 genSvgKeys 的设计理念，支持复杂的时间线配置
 */

// 导出类型
export type {
  RotateTimelineSegment,
  AnimateCalcMode,
  RotateOrigin,
  RotateAnimationConfig,
} from './types.ts';

// 导出核心函数
export { genAnimateRotate, getCenterRotateStyle } from './core.tsx';

// 导出预设效果
export { rotatePresets } from './presets.tsx';

// 导出辅助函数和常量
export {
  RotateDirection,
  genAnimateRotateByAngle,
  genAnimateRotateLoop,
  genAnimateRotateSwing,
  genAnimateRotatePath,
} from './helpers.tsx';

