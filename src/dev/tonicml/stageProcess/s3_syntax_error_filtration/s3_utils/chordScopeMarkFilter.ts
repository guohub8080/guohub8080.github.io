// 和弦标记Token初步验证器
// 
// 设计原则：只检查过于非法的写法，具体格式验证留给后续阶段
// 
// 当前检查：
// 1. 确保方括号配对
// 2. 确保内容不为空
// 
import { Token, TokenType } from '../../s2_basic_token_recognition/s2_types';
import { FilterResult, FilterContext } from '../s3_types';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../../utils/debugLogBuilder.ts';

/**
 * 和弦标记Token初步验证 - 只检查最基本的格式问题
 */
export const chordScopeMarkFilter = (token: Token, context?: FilterContext): FilterResult => {
  const logs: DebugMessage[] = [];
  
  // 防御性编程检查
  if (token.type !== TokenType.CHORD_SCOPE_MARK) {
    throw new Error('这个报错不应出现，该函数只能处理CHORD_SCOPE_MARK类型的Token。');
  }
  if (!token.value.startsWith('[') || !token.value.endsWith(']')) {
    throw new Error('这个报错不应出现，CHORD_SCOPE_MARK的Token必须以[]包围。');
  }
  
  const value = token.value;
  const chordContent = value.slice(1, -1).trim(); // 去掉[]，S2已保证方括号格式
  
  // 基本检查：内容不能为空
  if (chordContent.length === 0) {
    logs.push(buildDebugMessage({
      type: LogType.ERROR,
      tag: 'EMPTY_CHORD_CONTENT',
      message: `和弦标记内容不能为空。`,
      source: {
        line: token.position.line,
        column: token.position.column,
        offset: token.position.offset
      }
    }));
    return { logs, isValid: false };
  }
  
  // 基本检查：嵌套方括号（明显错误）
  if (chordContent.includes('[') || chordContent.includes(']')) {
    logs.push(buildDebugMessage({
      type: LogType.ERROR,
      tag: 'NESTED_BRACKETS',
      message: `和弦标记不能包含嵌套的方括号。`,
      source: {
        line: token.position.line,
        column: token.position.column,
        offset: token.position.offset
      }
    }));
    return { logs, isValid: false };
  }
  
  // 具体的和弦理论验证、字符合法性等留给后续阶段处理
  return { logs, isValid: true };
};