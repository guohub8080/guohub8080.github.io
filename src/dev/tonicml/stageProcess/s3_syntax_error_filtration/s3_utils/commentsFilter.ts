// 注释Token初步验证器
// 
// 设计原则：在 S3 阶段验证注释的基本格式和 tag 合法性，拦截明显错误
// 
// 当前检查：
// 1. 检查大括号基本格式（匹配）
// 2. 验证命名注释 tag 是否在合法列表中（如 @unknown{} 会被拦截）
// 3. 验证区域注释语法糖格式（@~标识符）
// 4. 验证必须带参数的注释是否带了参数
// 
// 参数内容的具体验证留给后续阶段（S4、S5）处理
// 
import { Token, TokenType } from '../../s2_basic_token_recognition/s2_types';
import { FilterResult, FilterContext, parseAndValidateComment } from '../s3_types';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../../utils/debugLogBuilder.ts';
import byDefault from '../../../utils/byDefault.ts';

// 删除复杂的注解格式验证函数 - 这些属于后续阶段的职责

/**
 * 注释Token初步验证 - 检查基本格式和 comment tag 合法性
 */
export const commentsFilter = (token: Token, context?: FilterContext): FilterResult => {
  const logs: DebugMessage[] = [];
  
  // 防御性编程：检查token类型（S2/S3分发逻辑已保证此条件）
  if (token.type !== TokenType.COMMENT) {
    throw new Error('这个报错不应出现，该函数只能处理COMMENT类型的Token。');
  }
  if (!token.value.startsWith('@')) {
    throw new Error('这个报错不应出现，S2阶段已保证COMMENT token必须以@开头。');
  }
  
  const value = token.value;
  
  // 基本检查1：大括号匹配检查
  const openBraces = byDefault(value.match(/\{/g), []).length;
  const closeBraces = byDefault(value.match(/\}/g), []).length;
  
  if (openBraces !== closeBraces) {
    logs.push(buildDebugMessage({
      type: LogType.ERROR,
      tag: 'UNMATCHED_BRACES',
      message: `注释大括号不匹配：{${openBraces}个，}${closeBraces}个`,
      source: {
        line: token.position.line,
        column: token.position.column,
        offset: token.position.offset
      }
    }));
    return { logs, isValid: false };
  }
  
  // 基本检查2：验证 comment 格式和 tag 是否合法
  const parseResult = parseAndValidateComment(value);
  
  if (!parseResult.isValid) {
    logs.push(buildDebugMessage({
      type: LogType.ERROR,
      tag: 'INVALID_COMMENT_TAG',
      message: `${parseResult.errorReason || '未知的注释格式'}`,
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