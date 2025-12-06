// ACTION Token初步验证器
// 
// 设计原则：在 S3 阶段验证 action 的基本格式和 tag 合法性，拦截明显错误
// 
// 当前检查：
// 1. 确保命令不为空
// 2. 检查大括号基本格式（匹配、不重复）
// 3. 验证 action tag 是否在合法列表中（如 $titleName{} 会被拦截）
// 4. 验证声部属性格式是否正确（$p.xxx{} 或 $part.xxx{}）
// 
// 参数内容的具体验证留给后续阶段（S4、S5）处理
// 
import { Token, TokenType } from '../../s2_basic_token_recognition/s2_types';
import { FilterResult, FilterContext, parseAndValidateAction } from '../s3_types';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../../utils/debugLogBuilder.ts';
import byDefault from '../../../utils/byDefault.ts';

/**
 * ACTION Token初步验证 - 检查基本格式和 action tag 合法性
 */
export const actionFilter = (token: Token, context?: FilterContext): FilterResult => {
  const logs: DebugMessage[] = [];
  
  // 防御性编程：检查token类型（S2/S3分发逻辑已保证此条件）
  if (token.type !== TokenType.ACTION) {
    throw new Error('这个报错不应出现，该函数只能处理ACTION类型的Token。');
  }
  if (!token.value.startsWith('$')) {
    throw new Error('这个报错不应出现，S2阶段已保证ACTION token必须以$开头。');
  }
  
  const value = token.value;
  
  // 基本检查1：大括号匹配检查
  const openBraces = byDefault(value.match(/\{/g), []).length;
  const closeBraces = byDefault(value.match(/\}/g), []).length;
  
  if (openBraces !== closeBraces) {
    logs.push(buildDebugMessage({
      type: LogType.ERROR,
      tag: 'UNMATCHED_BRACES',
      message: `大括号不匹配：{${openBraces}个，}${closeBraces}个`,
      source: {
        line: token.position.line,
        column: token.position.column,
        offset: token.position.offset
      }
    }));
    return { isValid: false, logs };
  }
  
  // 基本检查2：多个大括号对（明显错误）
  if (openBraces > 1) {
    logs.push(buildDebugMessage({
      type: LogType.ERROR,
      tag: 'MULTIPLE_BRACES',
      message: `ACTION命令包含多个大括号对，格式错误`,
      source: {
        line: token.position.line,
        column: token.position.column,
        offset: token.position.offset
      }
    }));
    return { isValid: false, logs };
  }
  
  // 基本检查3：验证 action tag 是否合法
  const parseResult = parseAndValidateAction(value);
  
  if (!parseResult.isValid) {
    logs.push(buildDebugMessage({
      type: LogType.ERROR,
      tag: 'INVALID_ACTION_TAG',
      message: `${parseResult.errorReason || '未知的 ACTION 命令'}`,
      source: {
        line: token.position.line,
        column: token.position.column,
        offset: token.position.offset
      }
    }));
    return { isValid: false, logs };
  }
  
  // 所有检查通过
  return { logs, isValid: true };
};
