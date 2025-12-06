import type { BlockWithPosition } from '../s1_types';
import { buildDebugMessage, LogType, type DebugMessage } from '../../../utils/debugLogBuilder.ts';
import { AUTO_PROCESS } from '../../../types/commonTagTypes.ts';
import { includes } from 'lodash';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 过滤结果接口
 */
export interface FilterResult {
  blocks: BlockWithPosition[];
  warnings: DebugMessage[];
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检查是否为需要过滤的特殊字符
 */
const isFilterableChar = (block: BlockWithPosition): boolean => {
  return includes(['\n', ',', ';', ' ', '\t'], block.value);
};

/**
 * 判断两个块是否为相同的特殊字符
 */
const isSameFilterableChar = (block1: BlockWithPosition, block2: BlockWithPosition): boolean => {
  return isFilterableChar(block1) && isFilterableChar(block2) && block1.value === block2.value;
};

/**
 * 生成开头过滤的合并警告
 */
const createLeadingFilterWarning = (removedBlocks: BlockWithPosition[]): DebugMessage => {
  const positions = removedBlocks.map(block => `${block.line}行${block.column}列`).join('、');
  
  return buildDebugMessage({
    type: LogType.INFO,
    message: `检测到开头为空白，已自动过滤掉${removedBlocks.length}个无效字符（换行/空格/逗号/分号）。被自动过滤的字符分别在${positions}。`,
    tag: AUTO_PROCESS,
    source: null,
    extra_data: {
      filteredCount: removedBlocks.length,
      filteredPositions: removedBlocks.map(block => ({
        line: block.line,
        column: block.column,
        char: block.value
      }))
    }
  });
};

/**
 * 生成连续换行的合并信息
 */
const createConsecutiveNewlineInfo = (removedBlocks: BlockWithPosition[]): DebugMessage => {
  const positions = removedBlocks.map(block => `${block.line}行${block.column}列`).join('、');
  
  return buildDebugMessage({
    type: LogType.INFO,
    message: `检测到多个换行，已自动过滤掉${removedBlocks.length}个换行。被自动过滤的换行代码分别在${positions}。`,
    tag: AUTO_PROCESS,
    source: null,
    extra_data: {
      filteredCount: removedBlocks.length,
      filteredPositions: removedBlocks.map(block => ({
        line: block.line,
        column: block.column
      }))
    }
  });
};

/**
 * 生成连续逗号的合并警告
 */
const createConsecutiveCommaWarning = (removedBlocks: BlockWithPosition[]): DebugMessage => {
  const positions = removedBlocks.map(block => `${block.line}行${block.column}列`).join('、');
  
  return buildDebugMessage({
    type: LogType.WARNING,
    message: `已自动过滤掉${removedBlocks.length}个多余的逗号。被自动过滤的代码分别在${positions}。`,
    tag: AUTO_PROCESS,
    source: null,
    extra_data: {
      filteredCount: removedBlocks.length,
      filteredPositions: removedBlocks.map(block => ({
        line: block.line,
        column: block.column
      }))
    }
  });
};

/**
 * 生成连续分号的合并警告
 */
const createConsecutiveSemicolonWarning = (removedBlocks: BlockWithPosition[]): DebugMessage => {
  const positions = removedBlocks.map(block => `${block.line}行${block.column}列`).join('、');
  
  return buildDebugMessage({
    type: LogType.WARNING,
    message: `已自动过滤掉${removedBlocks.length}个多余的分号。被自动过滤的代码分别在${positions}。`,
    tag: AUTO_PROCESS,
    source: null,
    extra_data: {
      filteredCount: removedBlocks.length,
      filteredPositions: removedBlocks.map(block => ({
        line: block.line,
        column: block.column
      }))
    }
  });
};

/**
 * 生成连续空格的合并信息
 */
const createConsecutiveSpaceInfo = (removedBlocks: BlockWithPosition[]): DebugMessage => {
  const positions = removedBlocks.map(block => `${block.line}行${block.column}列`).join('、');
  
  return buildDebugMessage({
    type: LogType.INFO,
    message: `检测到多个空格，已自动过滤掉${removedBlocks.length}个空格。被自动过滤的空格代码分别在${positions}。`,
    tag: AUTO_PROCESS,
    source: null,
    extra_data: {
      filteredCount: removedBlocks.length,
      filteredPositions: removedBlocks.map(block => ({
        line: block.line,
        column: block.column
      }))
    }
  });
};

// ============================================================================
// 主导出函数
// ============================================================================

/**
 * 冗余块过滤器：移除多余的空白、逗号和分号
 * 
 * @description
 * 接收第一步分块的结果，进行以下过滤：
 * 1. 移除开头的所有换行符、空格、Tab、逗号、分号
 * 2. 移除连续的换行符、空格、Tab、逗号、分号（只保留第一个）
 * 
 * @warning_strategy
 * 采用合并警告策略，最多生成5个日志：
 * - 1个开头过滤的INFO（如果有开头字符被移除）
 * - 1个连续逗号的WARNING（如果有连续逗号被移除）
 * - 1个连续分号的WARNING（如果有连续分号被移除）
 * - 1个连续换行的INFO（如果有连续换行被移除）
 * - 1个连续空格的INFO（如果有连续空格被移除）
 * 
 * @param blocks - 第一步分块的结果
 * @returns FilterResult - 过滤后的块数组和警告信息
 * 
 * @rules
 * 1. 开头过滤：移除数组开头的所有 \n、空格、Tab、, 和 ; 字符
 * 2. 连续过滤：连续的相同特殊字符只保留第一个
 * 3. 保留其他：所有其他类型的块保持不变
 * 
 * @example
 * ```typescript
 * // 开头过滤示例
 * filterRedundantBlocks(["\n", " ", ",", "a", "b"])
 * // 返回: { blocks: ["a", "b"], warnings: [1个开头过滤INFO] }
 * 
 * // 连续换行示例  
 * filterRedundantBlocks(["a", "\n", "\n", "\n", "b"])
 * // 返回: { blocks: ["a", "\n", "b"], warnings: [1个连续换行INFO] }
 * 
 * // 连续空格示例
 * filterRedundantBlocks(["a", " ", " ", " ", "b"])
 * // 返回: { blocks: ["a", " ", "b"], warnings: [1个连续空格INFO] }
 * 
 * // 连续逗号示例
 * filterRedundantBlocks(["a", ",", ",", ",", "b"])
 * // 返回: { blocks: ["a", ",", "b"], warnings: [1个连续逗号WARNING] }
 * 
 * // 混合但非连续示例（不过滤）
 * filterRedundantBlocks(["a", ",", ";", ",", "b"])
 * // 返回: { blocks: ["a", ",", ";", ",", "b"], warnings: [] }
 * 
 * // 完整示例
 * filterRedundantBlocks(["\n", " ", ",", "a", ",", ",", "b", "\n", "\n", "c", ";", ";"])
 * // 返回: { blocks: ["a", ",", "b", "\n", "c", ";"], 
 * //         warnings: [开头过滤INFO, 连续逗号WARNING, 连续换行INFO, 连续分号WARNING] }
 * ```
 */
export const filterRedundantBlocks = (blocks: BlockWithPosition[]): FilterResult => {
  const warnings: DebugMessage[] = [];
  const filteredBlocks: BlockWithPosition[] = [];
  
  // 收集被移除的块用于合并警告
  const removedLeadingBlocks: BlockWithPosition[] = [];
  const removedConsecutiveNewlines: BlockWithPosition[] = [];
  const removedConsecutiveCommas: BlockWithPosition[] = [];
  const removedConsecutiveSemicolons: BlockWithPosition[] = [];
  const removedConsecutiveSpaces: BlockWithPosition[] = [];
  
  // ==================================================================================
  // 第一阶段第一步：移除开头的特殊字符
  // ==================================================================================
  
  let startIndex = 0;
  
  // 找到第一个非特殊字符的位置，收集被移除的开头字符
  while (startIndex < blocks.length && isFilterableChar(blocks[startIndex])) {
    removedLeadingBlocks.push(blocks[startIndex]);
    startIndex++;
  }
  
  // ==================================================================================
  // 第一阶段第二步：处理剩余块，移除连续的特殊字符
  // ==================================================================================
  
  for (let i = startIndex; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    const lastBlock = filteredBlocks[filteredBlocks.length - 1];
    
    // 检查是否为连续的相同特殊字符
    if (lastBlock && isSameFilterableChar(currentBlock, lastBlock)) {
      // 连续相同特殊字符：跳过当前块，按类型收集
      if (currentBlock.value === '\n') {
        removedConsecutiveNewlines.push(currentBlock);
      } else if (currentBlock.value === ',') {
        removedConsecutiveCommas.push(currentBlock);
      } else if (currentBlock.value === ';') {
        removedConsecutiveSemicolons.push(currentBlock);
      } else if (includes([' ', '\t'], currentBlock.value)) {
        removedConsecutiveSpaces.push(currentBlock);
      }
    } else {
      // 非连续或非特殊字符：添加到结果中
      filteredBlocks.push(currentBlock);
    }
  }
  
  // ==================================================================================
  // 第一阶段第三步：生成合并的警告信息
  // ==================================================================================
  
  // 生成开头过滤警告（如果有被移除的开头字符）
  if (removedLeadingBlocks.length > 0) {
    warnings.push(createLeadingFilterWarning(removedLeadingBlocks));
  }
  
  // 生成连续逗号警告（如果有被移除的连续逗号）
  if (removedConsecutiveCommas.length > 0) {
    warnings.push(createConsecutiveCommaWarning(removedConsecutiveCommas));
  }
  
  // 生成连续分号警告（如果有被移除的连续分号）
  if (removedConsecutiveSemicolons.length > 0) {
    warnings.push(createConsecutiveSemicolonWarning(removedConsecutiveSemicolons));
  }
  
  // 生成连续换行信息（如果有被移除的连续换行）
  if (removedConsecutiveNewlines.length > 0) {
    warnings.push(createConsecutiveNewlineInfo(removedConsecutiveNewlines));
  }
  
  // 生成连续空格信息（如果有被移除的连续空格）
  if (removedConsecutiveSpaces.length > 0) {
    warnings.push(createConsecutiveSpaceInfo(removedConsecutiveSpaces));
  }
  
  return {
    blocks: filteredBlocks,
    warnings: warnings
  };
};

// 默认导出主函数
export default filterRedundantBlocks;
