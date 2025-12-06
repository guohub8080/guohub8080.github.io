/**
 * S2阶段类型定义
 * 基础token识别阶段的所有类型定义
 */

// 位置信息
export interface Position {
  line: number;    // 行号（从1开始）
  column: number;  // 列号（从1开始）
  offset: number;  // 在原始文本中的绝对位置（从0开始）
  length: number;  // token的长度
}

// Token 类型定义
export interface Token {
  type: TokenType;
  value: string;
  position: Position; // 详细位置信息
}

export enum TokenType {
  ACTION = 'ACTION',        // 动作block：$ 开头
  COMMENT = 'COMMENT',        // 注释block：@ 开头  
  SPECIAL_NOTE = 'SPECIAL_NOTE', // 特殊音符block：& 开头
  CHORD_SCOPE_MARK = 'CHORD_SCOPE_MARK',  // 和弦作用域标记block：[ 开头
  NOTE = 'NOTE',              // 音符block：其他所有
  MEASURE_BREAK = 'MEASURE_BREAK', // 小节间断：逗号
  PHRASE_BREAK = 'PHRASE_BREAK',   // 乐句间断：分号
  TIE_START = 'TIE_START',     // 连线开始：左括号
  TIE_END = 'TIE_END',         // 连线结束：右括号
  NEWLINE = 'NEWLINE'         // 换行符
}

// ============================================================================
// 核心元素组定义 (Core Elements Group)
// ============================================================================

/**
 * 核心元素类型组 - 包含最常用的音乐内容元素
 * 这三个元素是TonicML最核心的音乐表达元素
 * 这三个元素是固定的，不允许做任何变动
 */
export const CoreElementTypes = [
  TokenType.NOTE,              // 普通音符
  TokenType.SPECIAL_NOTE,      // 特殊音符：&c{}, &t{} 等
  TokenType.CHORD_SCOPE_MARK   // 和弦作用域标记：[C]
] as const;

/**
 * 判断token是否为核心元素
 * @param tokenType - token类型
 * @returns 是否为核心元素
 */
export function isCoreElement(tokenType: TokenType): boolean {
  return CoreElementTypes.includes(tokenType as any);
}

/**
 * 判断token是否为核心元素 (token对象版本)
 * @param token - token对象
 * @returns 是否为核心元素
 */
export function isTokenCoreElement(token: Token): boolean {
  return isCoreElement(token.type);
}
