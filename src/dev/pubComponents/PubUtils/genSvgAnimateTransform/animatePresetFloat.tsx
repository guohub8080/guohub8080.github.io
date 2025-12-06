/**
 * 浮动动画的预设效果
 */

import { genAnimateFloat } from './genAnimateFloat.tsx';

/**
 * 预设的浮动效果
 */
export const floatingPresets = {
  /** 轻微浮动 */
  gentle: () => genAnimateFloat({ floatRangeY: 10, duration: 3 }),
  
  /** 标准浮动 */
  normal: () => genAnimateFloat({ floatRangeY: 20, duration: 4 }),
  
  /** 强烈浮动 */
  strong: () => genAnimateFloat({ floatRangeY: 40, duration: 5 }),
  
  /** 快速浮动 */
  fast: () => genAnimateFloat({ floatRangeY: 20, duration: 2 }),
  
  /** 慢速浮动 */
  slow: () => genAnimateFloat({ floatRangeY: 20, duration: 6 }),
  
  /** 左右摇摆 */
  sway: () => genAnimateFloat({ floatRangeX: 30, floatRangeY: 0, duration: 3 }),
  
  /** 对角线浮动 */
  diagonal: () => genAnimateFloat({ floatRangeX: 15, floatRangeY: 15, duration: 4 }),
};

