import type { BlockWithPosition } from '../../s1_text_to_blocks/s1_types';
import type { Token, TokenType, Position } from '../s2_types';
import { TokenType as TT } from '../s2_types';

/**
 * 解析单个block为token
 * @param block - 带位置信息的块
 * @returns 解析后的token
 */
export const parseBlock = (block: BlockWithPosition): Token => {
  const position: Position = {
    line: block.line,
    column: block.column,
    offset: block.offset,
    length: block.length
  };
  
  // 换行符（处理 \n 和 \r）
  // Windows 风格换行符 \r\n 可能被S1分割成两个block，需要同时处理 \r
  if (['\n', '\r'].includes(block.value)) {
    return { type: TT.NEWLINE, value: block.value, position };
  }
  
  // 单独的逗号（小节间断）
  if (block.value === ',') {
    return { type: TT.MEASURE_BREAK, value: block.value, position };
  }
  
  // 单独的分号（乐句间断）
  if (block.value === ';') {
    return { type: TT.PHRASE_BREAK, value: block.value, position };
  }

  // 单独的左括号（连线开始）
  if (block.value === '(') {
    return { type: TT.TIE_START, value: block.value, position };
  }

  // 单独的右括号（连线结束）
  if (block.value === ')') {
    return { type: TT.TIE_END, value: block.value, position };
  }
  
  // 命令block（$开头）
  if (block.value.startsWith('$')) {
    return { type: TT.ACTION, value: block.value, position };
  }
  
  // 注释block（@开头）
  if (block.value.startsWith('@')) {
    return { type: TT.COMMENT, value: block.value, position };
  }
  
  // 特殊音符block（&开头）
  if (block.value.startsWith('&')) {
    return { type: TT.SPECIAL_NOTE, value: block.value, position };
  }
  
  // 和弦作用域标记block（[开头）
  if (block.value.startsWith('[')) {
    return { type: TT.CHORD_SCOPE_MARK, value: block.value, position };
  }
  
  // 音符block（其他所有）
  return { type: TT.NOTE, value: block.value, position };
};
