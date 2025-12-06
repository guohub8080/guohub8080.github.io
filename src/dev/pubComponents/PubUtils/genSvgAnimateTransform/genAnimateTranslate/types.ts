/**
 * genAnimateTranslate 类型定义
 */

/** 二维坐标 */
export interface Point2D {
  x: number;
  y: number;
}

/** 平移时间线段 */
export interface TranslateTimelineSegment {
  /** 贝塞尔缓动参数（格式："x1 y1 x2 y2"），默认 "0.42 0 0.58 1" */
  keySplines?: string;
  /** 该段的持续时间（秒） */
  timeSpanSec: number;
  /** 
   * 目标位置（可选，如果不提供则保持上一段的位置）
   * 如果只提供 x 或 y，另一个维度保持不变
   */
  toValue?: Partial<Point2D>;
}

/** 动画计算模式 */
export type AnimateCalcMode = 'spline' | 'linear' | 'discrete' | 'paced';

/** 平移动画配置 */
export interface TranslateAnimationConfig {
  /** 初始坐标，默认 { x: 0, y: 0 } */
  initValue?: Partial<Point2D>;
  /** 时间线段数组 */
  timeline: TranslateTimelineSegment[];
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
   * 是否使用相对移动（增量模式），默认 true
   * - true: 每个阶段的 toValue 是相对于上一阶段的增量位移（推荐）
   * - false: 每个阶段的 toValue 是相对于初始位置的累积位移
   * 
   * @example
   * // 相对移动模式 (isRelativeMove: true, 默认)
   * timeline: [
   *   { toValue: { x: 100, y: 0 } },  // 移动到 (100, 0)
   *   { toValue: { x: 0, y: 0 } },    // 保持在 (100, 0)，不移动
   *   { toValue: { x: 50, y: 0 } }    // 移动到 (150, 0)，增量为 (50, 0)
   * ]
   * 
   * // 累积移动模式 (isRelativeMove: false)
   * timeline: [
   *   { toValue: { x: 100, y: 0 } },  // 移动到 (100, 0)
   *   { toValue: { x: 100, y: 0 } },  // 保持在 (100, 0)
   *   { toValue: { x: 150, y: 0 } }   // 移动到 (150, 0)，绝对坐标
   * ]
   */
  isRelativeMove?: boolean;
}

