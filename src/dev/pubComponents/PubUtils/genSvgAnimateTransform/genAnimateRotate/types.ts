/**
 * genAnimateRotate 类型定义
 */

import { ElementBoundsType, OriginPosition } from '../utils/getElementBounds.ts';

/** 旋转时间线段 */
export interface RotateTimelineSegment {
  /** 贝塞尔缓动参数（格式："x1 y1 x2 y2"），默认 "0 0 1 1" (线性) */
  keySplines?: string;
  /** 该段的持续时间（秒） */
  timeSpanSec: number;
  /** 目标角度（可选，如果不提供则保持上一段的角度） */
  toValue?: number;
}

/** 动画计算模式 */
export type AnimateCalcMode = 'spline' | 'linear' | 'discrete' | 'paced';

/** 
 * 旋转原点配置
 * 
 * 'center' 有两种用法：
 * 1. 提供 elementBounds：自动计算中心坐标（纯 SVG，推荐）
 * 2. 不提供 elementBounds：配合 getCenterRotateStyle() 使用 CSS（需要样式支持）
 * 
 * 其他快捷位置：必须提供 elementBounds
 */
export type RotateOrigin = 
  | OriginPosition    // 快捷位置（9种 + origin）
  | [number, number]; // 自定义坐标 [x, y]

/** 旋转动画配置 */
export interface RotateAnimationConfig {
  /** 初始角度，默认 0 */
  initAngle?: number;
  /** 时间线段数组 */
  timeline: RotateTimelineSegment[];
  /** 初始延迟（秒），默认 0 */
  delay?: number;
  /** 
   * 是否累加变换（与其他变换组合），默认 true
   * - true: 与其他动画叠加（推荐）
   * - false: 替换其他变换
   */
  additive?: boolean;
  /** 是否点击触发，默认 false（自动开始） */
  isBeginWithClick?: boolean;
  /** 
   * 动画计算模式，默认根据 keySplines 自动判断
   * - 'spline': 使用贝塞尔缓动（需要 keySplines）
   * - 'linear': 线性插值
   * - 'discrete': 跳转（无过渡）
   * - 'paced': 等速（忽略 keyTimes）
   */
  calcMode?: AnimateCalcMode;
  /** 是否保持最终状态，默认 false */
  freeze?: boolean;
  /** 循环次数，0 表示无限循环，默认 1 */
  loopCount?: number;
  /**
   * 是否使用相对旋转（增量模式），默认 true
   * - true: 每个阶段的 toValue 是相对于上一阶段的增量角度
   * - false: 每个阶段的 toValue 是绝对角度
   * 
   * @example
   * // 相对旋转模式 (isRelativeRotate: true, 默认)
   * timeline: [
   *   { toValue: 90, timeSpanSec: 1 },   // 旋转90度
   *   { toValue: 0, timeSpanSec: 1 },    // 保持不动
   *   { toValue: 45, timeSpanSec: 1 }    // 再旋转45度（总共135度）
   * ]
   * 
   * // 绝对旋转模式 (isRelativeRotate: false)
   * timeline: [
   *   { toValue: 90, timeSpanSec: 1 },   // 旋转到90度
   *   { toValue: 90, timeSpanSec: 1 },   // 保持在90度
   *   { toValue: 135, timeSpanSec: 1 }   // 旋转到135度
   * ]
   */
  isRelativeRotate?: boolean;
  /** 
   * 旋转中心点，默认 'center'
   * - 'center': 元素中心（推荐提供 elementBounds，否则需配合 getCenterRotateStyle）
   * - 'origin': 坐标原点 (0, 0)
   * - 'topLeft', 'topCenter' 等：快捷位置（需提供 elementBounds）
   * - [x, y]: 自定义坐标
   */
  origin?: RotateOrigin;
  /**
   * 元素边界信息 { x?, y?, w, h }
   * 
   * 作用：提供元素位置和尺寸，用于自动计算快捷位置的实际坐标
   * 
   * 何时需要：
   * ✅ origin 使用快捷位置时（topCenter、bottomLeft 等）必须提供
   * ✅ origin 为 'center' 时推荐提供（纯 SVG 实现，无需 CSS）
   * 
   * 何时可以省略：
   * ⭕ origin 为 'origin' 时（固定 [0, 0]）
   * ⭕ origin 为 [x, y] 数组时（已手动指定坐标）
   * ⭕ origin 为 'center' 且配合 getCenterRotateStyle() 使用 CSS 时
   * 
   * @example
   * // 图片位于 (100, 50)，尺寸 200x150
   * elementBounds: { x: 100, y: 50, w: 200, h: 150 }
   * // origin: 'center' → 自动计算为 [200, 125]
   * // origin: 'topCenter' → 自动计算为 [200, 50]
   * 
   * // x, y 可选（默认为 0）
   * elementBounds: { w: 200, h: 150 }  // x=0, y=0
   */
  elementBounds?: ElementBoundsType;
}

