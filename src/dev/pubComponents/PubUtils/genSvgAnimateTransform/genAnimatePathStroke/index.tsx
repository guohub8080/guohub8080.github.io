/**
 * genAnimatePathStroke - 路径描边动画生成器
 * 
 * 用于生成 SVG 路径的描边绘制动画效果
 */

export { genAnimatePathStroke } from './core.tsx';
export type { PathStrokeAnimationConfig, PathStrokeTimelineSegment } from './types.ts';
export { 
  genAnimatePathStrokeDraw, 
  genAnimatePathStrokeDrawClick,
  genAnimatePathStrokeErase,
  genAnimatePathStrokeLoop
} from './helpers.tsx';

