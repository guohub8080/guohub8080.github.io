import type { BlockWithPosition } from '../s1_types';
import { buildDebugMessage, LogType, type DebugMessage } from '../../../utils/debugLogBuilder.ts';
import { AUTO_PROCESS } from '../../../types/commonTagTypes.ts';
import { includes } from 'lodash';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 分块结果接口
 */
export interface SplitResult {
  blocks: BlockWithPosition[];
  warnings: DebugMessage[];
}

/**
 * 分块解析状态
 * 函数式设计：所有操作都返回新的状态对象，不修改原对象
 */
interface BlockSplitState {
  // 结果数据
  blocks: BlockWithPosition[];
  
  // 当前块信息
  currentBlock: string;
  currentBlockStartLine: number;
  currentBlockStartColumn: number;
  currentBlockStartOffset: number;
  
  // 当前扫描位置
  currentLine: number;
  currentColumn: number;
  
  // 花括号状态
  insideBraces: boolean;
  braceDepth: number;
  
  // 警告信息
  warnings: DebugMessage[];
}

// ============================================================================
// 状态管理工具函数
// ============================================================================

/**
 * 创建初始分块状态
 */
const createInitialSplitState = (): BlockSplitState => ({
  blocks: [],
  currentBlock: '',
  currentBlockStartLine: 1,
  currentBlockStartColumn: 1,
  currentBlockStartOffset: 0,
  currentLine: 1,
  currentColumn: 1,
  insideBraces: false,
  braceDepth: 0,
  warnings: []
});

// ============================================================================
// 基础操作工具函数
// ============================================================================

/**
 * 保存当前块到结果中（如果当前块不为空）
 * 函数式：返回新的状态对象
 */
const saveCurrentBlock = (state: BlockSplitState): BlockSplitState => {
  if (state.currentBlock === '') {
    return state;
  }

  // 检查块的第一个字符是否为中文
  const trimmedBlock = state.currentBlock.trim();
  if (trimmedBlock.length > 0) {
    const firstChar = trimmedBlock[0];
    const isChineseChar = /[\u4e00-\u9fff]/.test(firstChar);
    
    if (isChineseChar) {
      // 发现中文字符，添加错误并跳过保存这个块
      const warning = buildDebugMessage({
        type: LogType.ERROR,
        message: `疑似注释"${trimmedBlock}"，需要以花括号{}包裹。`,
        tag: 'INVALID_TEXT',
        source: { 
          line: state.currentBlockStartLine, 
          column: state.currentBlockStartColumn, 
          offset: state.currentBlockStartOffset 
        },
        extra_data: null
      });
      
      return {
        ...state,
        warnings: [...state.warnings, warning],
        currentBlock: '' // 清空当前块但不保存
      };
    }
  }

  const block: BlockWithPosition = {
    value: state.currentBlock,
    line: state.currentBlockStartLine,
    column: state.currentBlockStartColumn,
    offset: state.currentBlockStartOffset,
    length: state.currentBlock.length,
    contains_braces: state.currentBlock.split('').some(c => includes(['{', '}'], c))
  };

  return {
    ...state,
    blocks: [...state.blocks, block],
    currentBlock: ''
  };
};

/**
 * 创建单字符块并添加到结果中
 * 函数式：返回新的状态对象
 */
const createSingleCharBlock = (
  state: BlockSplitState, 
  char: string, 
  offset: number
): BlockSplitState => {
  const block: BlockWithPosition = {
    value: char,
    line: state.currentLine,
    column: state.currentColumn,
    offset: offset,
    length: 1,
    contains_braces: includes(['{', '}'], char)
  };

  return {
    ...state,
    blocks: [...state.blocks, block]
  };
};

/**
 * 记录新块的起始位置（仅在当前块为空时）
 * 函数式：返回新的状态对象
 */
const recordBlockStartIfNeeded = (state: BlockSplitState, offset: number): BlockSplitState => {
  if (state.currentBlock === '') {
    return {
      ...state,
      currentBlockStartLine: state.currentLine,
      currentBlockStartColumn: state.currentColumn,
      currentBlockStartOffset: offset
    };
  }
  return state;
};

// ============================================================================
// 字符处理器（核心分块逻辑）
// ============================================================================

/**
 * 处理换行符
 * 1. 保存当前块
 * 2. 创建换行符块（统一为 \n）
 * 3. 更新位置到下一行
 * 4. 重置花括号状态
 * 
 * @note 所有换行符（\n, \r, \r\n）都统一转换为 \n
 */
const processNewlineChar = (state: BlockSplitState, offset: number, char: string, nextChar?: string): BlockSplitState => {
  // 1. 保存当前块
  let newState = saveCurrentBlock(state);
  
  // 2. 创建换行符块（统一为 \n）
  newState = createSingleCharBlock(newState, '\n', offset);
  
  // 3. 更新位置：下一行，列重置为1
  newState = {
    ...newState,
    currentLine: newState.currentLine + 1,
    currentColumn: 1
  };
  
  // 4. 重置花括号状态
  newState = {
    ...newState,
    insideBraces: false,
    braceDepth: 0
  };
  
  return newState;
};

/**
 * 处理空格和Tab字符
 * 根据花括号状态决定是分割还是累积
 */
const processWhitespaceChar = (
  state: BlockSplitState, 
  char: string, 
  offset: number
): BlockSplitState => {
  if (state.insideBraces) {
    // 在花括号内：空格是内容的一部分，累积到当前块
    let newState = recordBlockStartIfNeeded(state, offset);
    newState = {
      ...newState,
      currentBlock: newState.currentBlock + char,
      currentColumn: newState.currentColumn + 1
    };
    return newState;
  } else {
    // 在花括号外：空格作为分隔符，保存当前块
    let newState = saveCurrentBlock(state);
    newState = {
      ...newState,
      currentColumn: newState.currentColumn + 1
    };
    return newState;
  }
};

/**
 * 处理逗号和分号：在花括号外强制分割
 * 1. 保存当前块（如果有）
 * 2. 创建逗号/分号的单字符块
 * 3. 更新列位置
 * 4. 如果是中文标点，添加警告
 */
const processCommaOrSemicolon = (
  state: BlockSplitState, 
  char: string, 
  offset: number,
  isChinesePunctuation = false
): BlockSplitState => {
  // 1. 保存当前块
  let newState = saveCurrentBlock(state);
  
  // 2. 创建逗号/分号块（中文标点自动转换为英文）
  const normalizedChar = isChinesePunctuation ? (char === '，' ? ',' : ';') : char;
  newState = createSingleCharBlock(newState, normalizedChar, offset);
  
  // 3. 更新列位置
  newState = {
    ...newState,
    currentColumn: newState.currentColumn + 1
  };
  
  // 4. 如果是中文标点，添加警告
  if (isChinesePunctuation) {
    const warning = buildDebugMessage({
      type: LogType.WARNING,
      message: `中文标点符号"${char}"，已自动转换为英文标点"${normalizedChar}"。建议直接使用英文标点符号。`,
      tag: AUTO_PROCESS,
      source: {
        line: newState.currentLine,
        column: newState.currentColumn - 1,
        offset: offset,
        character: char
      },
      extra_data: {
        originalChar: char,
        normalizedChar: normalizedChar,
        suggestion: `使用英文标点 "${normalizedChar}" 替代中文标点 "${char}"`
      }
    });
    
    newState = {
      ...newState,
      warnings: [...newState.warnings, warning]
    };
  }
  
  return newState;
};

/**
 * 处理普通字符（非换行、非空格、非逗号分号）
 * 1. 跟踪花括号状态
 * 2. 记录块起始位置（如果需要）
 * 3. 累积字符到当前块
 * 4. 更新列位置
 */
const processRegularChar = (
  state: BlockSplitState, 
  char: string, 
  offset: number
): BlockSplitState => {
  let newState = state;
  
  // 1. 跟踪花括号状态
  if (char === '{') {
    const newDepth = newState.braceDepth + 1;
    newState = {
      ...newState,
      braceDepth: newDepth,
      insideBraces: true
    };
  } else if (char === '}') {
    const newDepth = Math.max(0, newState.braceDepth - 1);
    newState = {
      ...newState,
      braceDepth: newDepth,
      insideBraces: newDepth > 0
    };
  }
  
  // 2. 记录块起始位置
  newState = recordBlockStartIfNeeded(newState, offset);
  
  // 3. 累积字符到当前块
  newState = {
    ...newState,
    currentBlock: newState.currentBlock + char,
    currentColumn: newState.currentColumn + 1
  };
  
  return newState;
};

/**
 * 完成解析：保存最后的块（如果有）
 */
const finalizeSplitting = (state: BlockSplitState): BlockSplitState => {
  return saveCurrentBlock(state);
};

// ============================================================================
// 主导出函数
// ============================================================================

/**
 * 粗糙分块器：将原始文本按基本规则分割成块
 * 
 * @description
 * 纯粹的分块逻辑，不进行任何验证或错误检查。
 * 按照花括号感知的规则将文本分割成带位置信息的块数组。
 * 
 * @param rawText - 原始输入文本
 * @returns SplitResult - 包含分割后的块数组和警告信息
 * 
 * @rules
 * 1. 换行符(\n, \r, \r\n)：强制分割，统一转换为 \n 并成为独立块
 * 2. 空格/Tab：在{}外分割，在{}内作为内容一部分
 * 3. 逗号/分号(,;)：在{}外强制分割，在{}内作为内容一部分
 * 4. 中文逗号/分号(，；)：在{}外强制分割并生成警告，在{}内作为内容一部分
 * 5. 普通字符：累积到当前块，同时跟踪花括号状态
 * 6. 位置追踪：每个块都记录准确的行号、列号、偏移量
 * 
 * @note 
 * - 所有换行符（\n, \r, \r\n）都统一转换为 \n，确保跨平台一致性
 * - Windows 的 \r\n 会被识别为单个 \n 块
 * - 旧版 Mac 的 \r 也会被识别为 \n 块
 * 
 * @example
 * ```typescript
 * splitRoughBlocks("cdf,a b{x,y};c")
 * // 返回: { blocks: ["cdf", ",", "a", "b{x,y}", ";", "c"], warnings: [] }
 * 
 * splitRoughBlocks("cdf，a b{x，y}；c")  
 * // 返回: { blocks: ["cdf", ",", "a", "b{x，y}", ";", "c"], warnings: [警告×2] }
 * // 注意: {}外的中文逗号分号会自动转为英文并警告，{}内的保持原样
 * ```
 */
export const splitRoughBlocks = (rawText: string): SplitResult => {
  let state = createInitialSplitState();
  
  // 逐字符处理
  for (let i = 0; i < rawText.length; i++) {
    const char = rawText[i];
    const nextChar = i + 1 < rawText.length ? rawText[i + 1] : undefined;
    
    // 处理换行符：\n, \r, \r\n 都统一为 \n
    if (char === '\n') {
      state = processNewlineChar(state, i, char, nextChar);
    } else if (char === '\r') {
      // \r 后面跟着 \n 的情况：跳过 \r，只处理 \n
      if (nextChar === '\n') {
        // 跳过 \r，下一次循环会处理 \n
        continue;
      } else {
        // 单独的 \r：当作换行符处理
        state = processNewlineChar(state, i, char, nextChar);
      }
    } else if (includes([' ', '\t'], char)) {
      state = processWhitespaceChar(state, char, i);
    } else if (includes([',', ';'], char) && !state.insideBraces) {
      // 英文逗号和分号在花括号外：强制分割
      state = processCommaOrSemicolon(state, char, i, false);
    } else if (includes(['，', '；'], char) && !state.insideBraces) {
      // 中文逗号和分号在花括号外：强制分割并警告
      state = processCommaOrSemicolon(state, char, i, true);
    } else {
      // 其他字符（包括花括号内的逗号分号）：正常累积
      state = processRegularChar(state, char, i);
    }
  }
  
  // 完成解析，保存最后的块
  state = finalizeSplitting(state);
  
  return {
    blocks: state.blocks,
    warnings: state.warnings
  };
};

// 默认导出主函数
export default splitRoughBlocks;
