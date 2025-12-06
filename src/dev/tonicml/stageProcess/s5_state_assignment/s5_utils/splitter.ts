// Token拆分器：将enhancedTokens拆分为head部分和多个part（声部）部分
import { EnhancedToken } from '../../s4_token_enhancement/s4_types';
import { isCoreElement } from '../../s2_basic_token_recognition/s2_types';

// 拆分结果接口
export interface SplitResult {
  head_token_list: EnhancedToken[];           // head部分的token数组
  part_token_list: EnhancedToken[][];         // 多个part，每个part是token数组
}

// 判断是否为结构性注释（会结束head阶段）
function isStructuralComment(token: EnhancedToken): boolean {
  // 检查是否为结构性注释的token类型（S4阶段已经enhance过）
  const tokenType = 'token' in token ? token.token : token.type;
  return tokenType === 'COM_PART' ||
         tokenType === 'COM_SECTION' ||
         tokenType === 'COM_PHRASE' ||
         tokenType === 'COM_MEASURE';
}

// 判断是否为SET_PART命令（会结束head阶段）
function isSetPartCommand(token: EnhancedToken): boolean {
  const tokenType = 'token' in token ? token.token : token.type;
  return tokenType === 'SET_PART';
}

// 判断token是否应该结束head阶段
function shouldEndHeadStage(token: EnhancedToken): boolean {
  // 1. 核心元素中的任何一个
  if (isCoreElement(token as any)) {
    return true;
  }
  
  // 2. 结构性注释（@part、@section、@phrase、@measure）
  if (isStructuralComment(token)) {
    return true;
  }
  
  // 3. SET_PART命令（不包括SET_PART_ATTR）
  if (isSetPartCommand(token)) {
    return true;
  }
  
  return false;
}

// 将tokens按SET_PART进行进一步分组
function groupTokensIntoParts(nonHeadTokens: EnhancedToken[]): EnhancedToken[][] {
  const partGroups: EnhancedToken[][] = [];
  let currentPartTokens: EnhancedToken[] = [];
  
  for (let i = 0; i < nonHeadTokens.length; i++) {
    const token = nonHeadTokens[i];
    
    // 遇到SET_PART，开始新的part
    const tokenType = 'token' in token ? token.token : token.type;
    if (tokenType === 'SET_PART') {
      // 如果当前part有内容，保存它
      if (currentPartTokens.length > 0) {
        partGroups.push([...currentPartTokens]);
      }
      
      // 开始新的part，SET_PART作为第一个token
      currentPartTokens = [token];
    } else {
      // 将token添加到当前part - 函数式方式
      currentPartTokens = [...currentPartTokens, token];
    }
  }
  
  // 处理最后一个part
  if (currentPartTokens.length > 0) {
    partGroups.push(currentPartTokens);
  }
  
  // 如果没有任何part（没有SET_PART），创建一个默认part
  if (partGroups.length === 0 && nonHeadTokens.length > 0) {
    partGroups.push(nonHeadTokens);
  }
  
  return partGroups;
}

// 主拆分函数
export function splitTokensIntoHeadAndParts(enhancedTokens: EnhancedToken[]): SplitResult {
  let headTokens: EnhancedToken[] = [];
  let headEndIndex = 0;
  
  // 1. 从头开始找head部分
  for (let i = 0; i < enhancedTokens.length; i++) {
    const token = enhancedTokens[i];
    
    // 检查是否应该结束head阶段
    if (shouldEndHeadStage(token)) {
      headEndIndex = i; // 遇到的token不算head里的部分
      break;
    }
    
    // 将token添加到head - 函数式方式
    headTokens = [...headTokens, token];
    headEndIndex = i + 1;
  }
  
  // 2. 剩余的tokens作为part部分
  const nonHeadTokens = enhancedTokens.slice(headEndIndex);
  
  // 3. 将剩余tokens按part进行分组
  const partTokenGroups = groupTokensIntoParts(nonHeadTokens);
  
  return {
    head_token_list: headTokens,
    part_token_list: partTokenGroups
  };
}
