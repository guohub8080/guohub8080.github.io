// 音符Token验证器
// 
// 验证规则：
// 1. 最多有一个@{...}和一个{...}，这两个可以共存；验证后需要把这个字符串replace去掉
// 2. 剩下的字符串里，支持数字0-7，而8和9不能出现
// 3. 支持cdefgabr，不区分大小写，其他字母会报错
// 4. 支持井号#、小数点.这个符号
// 5. 支持英文括号()，最多支持一个，但是不能同时出现
// 6. 支持<>，不限数量
// 7. 如果还有其他字符一律报错
// 
import { Token, TokenType } from '../../s2_basic_token_recognition/s2_types';
import { FilterResult, FilterContext } from '../s3_types';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../../utils/debugLogBuilder.ts';
import byDefault from '../../../utils/byDefault.ts';

/**
 * 音符Token验证 - 根据新的验证规则进行检查
 * 
 * 验证流程：
 * 1. 验证花括号格式（数量、匹配、嵌套等），收集所有错误
 * 2. 如果花括号格式正确，移除@{...}和{...}，继续验证剩余内容
 * 3. 验证剩余字符串中的数字、字母、符号等，继续收集错误
 * 4. 统一返回所有收集到的错误
 */
export const noteFilter = (token: Token): FilterResult => {
  const logs: DebugMessage[] = [];
  let hasCriticalBraceError = false; // 标记是否有严重的花括号错误，影响后续验证
  
  // 防御性编程检查
  if (token.type !== TokenType.NOTE) {
    throw new Error('这个报错不应出现，该函数只能处理NOTE类型的Token。');
  }
  
  const value = token.value;
  
  // 防御性编程：检查是否为空（理论上S1和S2不应该产生空的NOTE）
  if (!value.trim()) {
    throw new Error('这个报错不应出现，NOTE的Token不应该为空或只包含空格。');
  }
  
  // ==================== 第一阶段：验证花括号格式 ====================
  
  // 1.1 检查基本的花括号数量匹配
  const openBraceMatches = value.match(/\{/g);
  const closeBraceMatches = value.match(/\}/g);
  
  // 只有当存在花括号时才进行所有花括号相关的检查
  if (openBraceMatches || closeBraceMatches) {
    // 1.1 检查基本的花括号数量匹配
    const openBraces = byDefault(openBraceMatches?.length, 0);
    const closeBraces = byDefault(closeBraceMatches?.length, 0);
    
    if (openBraces !== closeBraces) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'UNMATCHED_BRACES',
        message: `花括号不匹配：{${openBraces}个，}${closeBraces}个。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
      hasCriticalBraceError = true;
    }
    
    // 1.2 检查花括号嵌套情况
    let braceDepth = 0;
    let hasNesting = false;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === '{') {
        braceDepth++;
        if (braceDepth > 1) {
          hasNesting = true;
          break;
        }
      } else if (value[i] === '}') {
        braceDepth--;
      }
    }
    
    if (hasNesting) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'NESTED_BRACES',
        message: `花括号不能嵌套。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
      hasCriticalBraceError = true;
    }
    
    // 1.3 检查@{...}的数量和完整性
    const atBracePattern = /@\{([^{}]*)\}/g;
    const atBraceMatches = [...value.matchAll(atBracePattern)];
    
    if (atBraceMatches.length > 1) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'TOO_MANY_AT_BRACES',
        message: `@{...}最多只能有一个，当前有${atBraceMatches.length}个。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
    }
    
    // 1.4 检查{...}的数量和完整性（排除@{...}）
    const bracePattern = /(?<!@)\{([^{}]*)\}/g;
    const braceMatches = [...value.matchAll(bracePattern)];
    
    if (braceMatches.length > 1) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'TOO_MANY_BRACES',
        message: `{...}最多只能有一个，当前有${braceMatches.length}个。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
    }
    
    // 1.5 检查是否有未完整匹配的@{...}或{...}模式
    const incompleteAtBrace = /@\{[^}]*$|@\{[^}]*\{/.test(value);
    const incompleteBrace = /(?<!@)\{[^}]*$|(?<!@)\{[^}]*\{/.test(value);
    
    if (incompleteAtBrace) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'INCOMPLETE_AT_BRACE',
        message: `@{...}格式不完整或包含嵌套花括号。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
      hasCriticalBraceError = true;
    }
    
    if (incompleteBrace) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'INCOMPLETE_BRACE',
        message: `{...}格式不完整或包含嵌套花括号。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
      hasCriticalBraceError = true;
    }
  }
  
  // ==================== 第二阶段：验证剩余字符串内容 ====================
  
  // 只有在花括号格式正确的情况下，才进行后续验证
  // 如果花括号有严重错误，跳过后续验证以避免误报
  if (!hasCriticalBraceError) {
    // 2.1 移除@{...}和{...}，获取需要验证的剩余字符串
    let remainingValue = value;
    remainingValue = remainingValue.replace(/@\{[^}]*\}/g, ''); // 移除@{...}
    remainingValue = remainingValue.replace(/(?<!@)\{[^}]*\}/g, ''); // 移除{...}（不包括@{...}）
    
    // 2.2 检查数字8和9（不允许，只允许0-7）
    const invalidNumbers = remainingValue.match(/[89]/g);
    if (invalidNumbers) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'INVALID_NUMBERS',
        message: `8和9为非法标记，发现：${invalidNumbers.join(', ')}。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
    }
    
    // 2.3 检查非法字母（只允许cdefgabr，不区分大小写）
    const invalidLetters = remainingValue.match(/[a-zA-Z]/g)?.filter(letter => 
      !/^[cdefgabr]$/i.test(letter)
    );
    if (invalidLetters && invalidLetters.length > 0) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'INVALID_LETTERS',
        message: `未识别的音符标记：${[...new Set(invalidLetters)].join(', ')}。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
    }
    
    // 2.4 检查英文括号()（最多支持一个，但不能同时出现左右括号）
    const leftParens = byDefault(remainingValue.match(/\(/g), []).length;
    const rightParens = byDefault(remainingValue.match(/\)/g), []).length;
    
    if (leftParens > 1 || rightParens > 1) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'TOO_MANY_PARENTHESES',
        message: `英文括号最多只能有一个，当前有左括号${leftParens}个，右括号${rightParens}个。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
    }
    
    if (leftParens > 0 && rightParens > 0) {
      logs.push(buildDebugMessage({
        type: LogType.ERROR,
        tag: 'BOTH_PARENTHESES',
        message: `英文括号不能同时出现左括号和右括号。`,
        source: {
          line: token.position.line,
          column: token.position.column,
          offset: token.position.offset
        }
      }));
    }
    
    // 2.5 检查其他非法字符
    // 允许的字符：0-7数字、cdefgabr字母、#井号、.小数点、()英文括号、<>尖括号
    const allowedCharsRegex = /^[0-7cdefgabr#.<>()]*$/i;
    if (!allowedCharsRegex.test(remainingValue)) {
      // 找出具体是哪些非法字符
      const invalidChars = remainingValue.split('').filter(char => 
        !/^[0-7cdefgabr#.<>()]$/i.test(char)
      );
      if (invalidChars.length > 0) {
        logs.push(buildDebugMessage({
          type: LogType.ERROR,
          tag: 'INVALID_CHARACTERS',
          message: `包含非法字符：${[...new Set(invalidChars)].join(', ')}。`,
          source: {
            line: token.position.line,
            column: token.position.column,
            offset: token.position.offset
          }
        }));
      }
    }
  }
  
  // ==================== 第三阶段：统一返回验证结果 ====================
  
  // 如果收集到任何错误，则验证失败；否则验证成功
  const isValid = logs.length === 0;
  
  return { logs, isValid };
};