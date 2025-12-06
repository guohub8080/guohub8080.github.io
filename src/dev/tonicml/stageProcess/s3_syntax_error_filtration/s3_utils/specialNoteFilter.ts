// 特殊音符Token初步验证器
// 
// 设计原则：在 S3 阶段验证特殊音符的基本格式和 tag 合法性，拦截明显错误
// 
// 当前检查：
// 1. 验证特殊音符 tag 是否在合法列表中（如 &x{} 会被拦截）
// 2. 验证特殊音符格式是否正确（必须是单个字母标签）
// 
// 参数内容的具体验证留给后续阶段（S4、S5）处理
// 
import { Token, TokenType } from '../../s2_basic_token_recognition/s2_types';
import { FilterResult, FilterContext, parseAndValidateSpecialNote } from '../s3_types';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../../utils/debugLogBuilder.ts';

/**
 * 特殊音符Token初步验证 - 检查基本格式和特殊音符 tag 合法性
 */
export const specialNoteFilter = (token: Token, context?: FilterContext): FilterResult => {
  const logs: DebugMessage[] = [];
  
  // 防御性编程：检查token类型（S2/S3分发逻辑已保证此条件）
  if (token.type !== TokenType.SPECIAL_NOTE) {
    throw new Error('这个报错不应出现，该函数只能处理SPECIAL_NOTE类型的Token。');
  }
  if (!token.value.startsWith('&')) {
    throw new Error('这个报错不应出现，S2阶段已保证SPECIAL_NOTE token必须以&开头。');
  }
  
  const value = token.value;
  
  // 基本检查：验证特殊音符 tag 是否合法
  const parseResult = parseAndValidateSpecialNote(value);
  
  if (!parseResult.isValid) {
    logs.push(buildDebugMessage({
      type: LogType.ERROR,
      tag: 'INVALID_SPECIAL_NOTE_TAG',
      message: `${parseResult.errorReason || '未知的特殊音符'}`,
      source: {
        line: token.position.line,
        column: token.position.column,
        offset: token.position.offset
      }
    }));
    return { logs, isValid: false };
  }
  
  // 所有检查通过
  return { logs, isValid: true };
};