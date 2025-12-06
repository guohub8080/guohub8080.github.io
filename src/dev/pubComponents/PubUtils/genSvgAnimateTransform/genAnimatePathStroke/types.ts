/**
 * genAnimatePathStroke 类型定义
 */

/** 路径描边时间线段 */
export interface PathStrokeTimelineSegment {
  /** 该段的持续时间（秒） */
  timeSpanSec: number;
  /** 目标偏移量（可选，如果不提供则保持上一段的偏移量） */
  toValue?: number;
  /** 贝塞尔缓动参数（格式："x1 y1 x2 y2"），默认 "0 0 1 1" (线性) */
  keySplines?: string;
}

/** 动画计算模式 */
export type AnimateCalcMode = 'spline' | 'linear' | 'discrete' | 'paced';

/** 路径描边动画配置 */
export interface PathStrokeAnimationConfig {
  /** 路径总长度，默认 996 */
  pathLength?: number;
  /** 初始偏移量，默认为 pathLength（完全隐藏） */
  initOffset?: number;
  /** 时间线段数组 */
  timeline: PathStrokeTimelineSegment[];
  /** 初始延迟（秒），默认 0 */
  delay?: number;
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
  /** 是否保持最终状态，默认 true */
  freeze?: boolean;
  /** 循环次数，0 表示无限循环，默认 1 */
  loopCount?: number;
  /** 是否允许重启，默认 'always'，点击触发时建议用 'never' */
  restart?: 'always' | 'whenNotActive' | 'never';
}

