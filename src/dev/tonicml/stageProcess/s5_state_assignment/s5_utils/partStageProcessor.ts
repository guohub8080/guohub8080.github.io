// Part阶段处理器：处理各个part（声部）的tokens并赋值status
import { isString } from 'lodash';
import { EnhancedToken } from '../../s4_token_enhancement/s4_types';
import { isCoreElement } from '../../s2_basic_token_recognition/s2_types';
import { ScoreMeta, PartStatus, MusicalState, StateAssignedToken, StateAssignmentError, ProcessedPart, CoreElementState, PartMeta } from '../s5_types';

// Part处理结果接口
export interface PartStageResult {
  isValid: boolean;
  partResults: StateAssignedToken[][];        // 按part分组的token数组: [[part0_tokens], [part1_tokens], ...]
  partMetas: PartMeta[];                      // 每个part对应的元信息
  errors: StateAssignmentError[];
  warnings: StateAssignmentError[];
}

// 根据SET命令更新part状态 - 函数式版本
function updatePartStatus(token: EnhancedToken, status: PartStatus): PartStatus {
  const tokenType = 'token' in token ? token.token : token.type;
  const value = token.value;
  
  switch (tokenType) {
    case 'SET_KEY':
      return { ...status, key: value };
    case 'SET_BEAT':
      return { ...status, timeSignature: value };
    case 'SET_BPM':
      return { ...status, tempo: parseInt(value) };
    case 'SET_OCTAVE':
      const octaveValue = parseInt(value);
      if (!isNaN(octaveValue)) {
        return { ...status, octave: octaveValue };
      }
      return status;
    case 'SET_CLEF':
      return { ...status, clef: value };
    case 'SET_VOLUME':
      return { ...status, volume: parseInt(value) };
    // TODO: 添加其他状态更新规则
    default:
      return status;
  }
}

// 判断是否为SET状态token
function isSetToken(token: EnhancedToken): boolean {
  const tokenType = 'token' in token ? token.token : token.type;
  return isString(tokenType) && tokenType.startsWith('SET_');
}

// 判断是否需要保留的token（不消费，传递给下一层）
// 注意：现在大部分token都在主循环中直接处理，这个函数主要用于特殊情况
function shouldRetainToken(token: EnhancedToken): boolean {
  const tokenType = 'token' in token ? token.token : token.type;
  
  // 注释需要保留传递给下一层
  if (tokenType === 'COM_NORMAL' || tokenType === 'COM_SCORE') return true;
  
  // 其他需要传递给下一层的特殊token类型可以在这里添加
  
  return false;
}

// 创建默认的PartMeta结构（所有字段为null）
function createDefaultPartMeta(): PartMeta {
  return {
    name: null,
    abbr: null,
    instrument: null,
    midi_channel: null,
    midi_program: null,
    volume: null,
    pan: null
  };
}

// 从SET_PART_ATTR token中提取属性信息到part_meta - 函数式版本
function updatePartMeta(token: EnhancedToken, part_meta: PartMeta): PartMeta {
  const tokenType = 'token' in token ? token.token : token.type;
  const value = token.value;
  
  // 根据语法文档解析SET_PART_ATTR命令
  switch (tokenType) {
    case 'SET_PART_ATTR_NAME':
      return { ...part_meta, name: value };
    case 'SET_PART_ATTR_ABBR':
      return { ...part_meta, abbr: value };
    case 'SET_PART_ATTR_INSTRUMENT':
      return { ...part_meta, instrument: value };
    case 'SET_PART_ATTR_MIDI_CHANNEL':
      const midiChannel = parseInt(value);
      if (!isNaN(midiChannel) && midiChannel >= 1 && midiChannel <= 16) {
        return { ...part_meta, midi_channel: midiChannel };
      }
      return part_meta;
    case 'SET_PART_ATTR_MIDI_PROGRAM':
      const midiProgram = parseInt(value);
      if (!isNaN(midiProgram) && midiProgram >= 0 && midiProgram <= 127) {
        return { ...part_meta, midi_program: midiProgram };
      }
      return part_meta;
    case 'SET_PART_ATTR_VOLUME':
      const volume = parseInt(value);
      if (!isNaN(volume) && volume >= 0 && volume <= 127) {
        return { ...part_meta, volume: volume };
      }
      return part_meta;
    case 'SET_PART_ATTR_PAN':
      const pan = parseInt(value);
      if (!isNaN(pan) && pan >= -180 && pan <= 180) {
        return { ...part_meta, pan: pan };
      }
      return part_meta;
    // 其他SET_PART_ATTR类型可以在这里扩展
    default:
      // 未知的SET_PART_ATTR类型，忽略或记录警告
      return part_meta;
  }
}

// 清理NEWLINE token的函数
function cleanupNewlineTokens(tokens: StateAssignedToken[]): StateAssignedToken[] {
  // 1. 去掉开头和结尾的NEWLINE token（类似字符串的trim）
  let startIndex = 0;
  let endIndex = tokens.length - 1;
  
  // 找到第一个非NEWLINE token的位置
  while (startIndex < tokens.length && tokens[startIndex].token === 'NEWLINE') {
    startIndex++;
  }
  
  // 找到最后一个非NEWLINE token的位置
  while (endIndex >= 0 && tokens[endIndex].token === 'NEWLINE') {
    endIndex--;
  }
  
  // 如果所有token都是NEWLINE，返回空数组
  if (startIndex > endIndex) {
    return [];
  }
  
  // 截取掉开头和结尾的NEWLINE
  const trimmedTokens = tokens.slice(startIndex, endIndex + 1);
  
  // 2. 在中间，多个连续的NEWLINE只保留第一个
  const cleanedTokens: StateAssignedToken[] = [];
  let lastWasNewline = false;
  
  for (const token of trimmedTokens) {
    if (token.token === 'NEWLINE') {
      // 如果上一个token不是NEWLINE，保留当前NEWLINE
      if (!lastWasNewline) {
        cleanedTokens.push(token);
        lastWasNewline = true;
      }
      // 如果上一个token是NEWLINE，跳过当前NEWLINE（去重）
    } else {
      // 非NEWLINE token，直接保留
      cleanedTokens.push(token);
      lastWasNewline = false;
    }
  }
  
  return cleanedTokens;
}

// 处理单个part的tokens（根据用户需求重新实现）- 函数式版本
function processSinglePart(
  partTokens: EnhancedToken[], 
  initialPartStatus: PartStatus, 
  part_index: number,
  score_meta: ScoreMeta
): { tokens: StateAssignedToken[], part_meta: PartMeta } {
  const stateAssignedTokens: StateAssignedToken[] = []; // 用户建议的空数组，用于遍历和过滤
  
  // 创建可变的状态副本（函数式编程）
  let partStatus = { ...initialPartStatus };
  
  // 初始化part_meta - 所有字段都设为null（固定结构）
  let part_meta: PartMeta = createDefaultPartMeta();
  
  // 根据用户需求：在开始时复制一份score meta的状态
  let currentKey = score_meta.key || 'C';
  let currentOctave = score_meta.octave || 4;
  
  for (let i = 0; i < partTokens.length; i++) {
    const token = partTokens[i];
    const tokenType = 'token' in token ? token.token : token.type;
    
    // 根据用户建议：SET_PART处理完后直接过滤掉，不传递给下一层
    if (tokenType === 'SET_PART') {
      // SET_PART的信息已经在上层处理partMeta时用过了，这里直接过滤掉
      continue;
    }
    
    // 根据用户建议：SET_PART_ATTR类型（如$part.abbr{}）处理完后直接过滤掉
    if (isString(tokenType) && tokenType.startsWith('SET_PART_ATTR_')) {
      // 解析属性设置到part_meta中 - 函数式更新
      part_meta = updatePartMeta(token, part_meta);
      // 设置完属性后直接过滤掉，不传递给下一层
      continue;
    }
    
    // 根据用户需求：如果遇到SET_KEY或SET_OCTAVE，更新复制的状态，但保留token传递给下一层
    if (tokenType === 'SET_KEY') {
      currentKey = token.value;
      // 保留SET_KEY token传递给下一层
      const stateAssignedToken: StateAssignedToken = {
        position: token.position,
        token: tokenType,
        value: token.value,
        character: 'character' in token ? token.character : token.value
      };
      stateAssignedTokens.push(stateAssignedToken);
      continue;
    }
    
    if (tokenType === 'SET_OCTAVE') {
      const octaveValue = parseInt(token.value);
      if (!isNaN(octaveValue)) {
        currentOctave = octaveValue;
      }
      // 保留SET_OCTAVE token传递给下一层
      const stateAssignedToken: StateAssignedToken = {
        position: token.position,
        token: tokenType,
        value: token.value,
        character: 'character' in token ? token.character : token.value
      };
      stateAssignedTokens.push(stateAssignedToken);
      continue;
    }
    
    // 处理其他SET命令：更新part状态（用于stateData），并保留token传递给下一层
    if (isSetToken(token)) {
      partStatus = updatePartStatus(token, partStatus);
      
      // 保留所有其他SET类型token传递给下一层
      const stateAssignedToken: StateAssignedToken = {
        position: token.position,
        token: tokenType,
        value: token.value,
        character: 'character' in token ? token.character : token.value
      };
      stateAssignedTokens.push(stateAssignedToken);
      continue;
    }
    
    // 根据用户需求：处理核心元素，在根层级添加state字段
    if (isCoreElement(tokenType as any)) {
      // 根据用户需求：在根层级添加state字段，只包含key和octave
      const state: CoreElementState = {
        key: currentKey,
        octave: currentOctave
      };
      
      const stateAssignedToken: StateAssignedToken = {
        position: token.position,
        token: tokenType,
        value: token.value,
        character: 'character' in token ? token.character : token.value,
        state: state // 核心元素的状态字段
      };
      
      stateAssignedTokens.push(stateAssignedToken);
      continue;
    }
    
    // 其他token（注释、结构性标记等）：直接保留
    const stateAssignedToken: StateAssignedToken = {
      position: token.position,
      token: tokenType,
      value: token.value,
      character: 'character' in token ? token.character : token.value
    };
    stateAssignedTokens.push(stateAssignedToken);
  }
  
  // 根据用户需求：清理NEWLINE token
  const cleanedTokens = cleanupNewlineTokens(stateAssignedTokens);
  
  return { tokens: cleanedTokens, part_meta };
}

// 处理所有parts
export function processPartStages(
  partTokenGroups: EnhancedToken[][], 
  score_meta: ScoreMeta,
  headErrors: StateAssignmentError[],
  headWarnings: StateAssignmentError[]
): PartStageResult {
  const partResults: StateAssignedToken[][] = [];  // 按part分组的结果
  const partMetas: PartMeta[] = [];                // 每个part的元信息
  const errors: StateAssignmentError[] = [...headErrors]; // 继承head的错误
  const warnings: StateAssignmentError[] = [...headWarnings]; // 继承head的警告
  
  // 为每个part创建初始状态（从meta继承）
  const basePartStatus: PartStatus = {
    key: score_meta.key || 'C',
    octave: score_meta.octave || 4,
    tempo: parseInt(score_meta.tempo || '100'),
    timeSignature: score_meta.time_signature || '4/4'
  };
  
  // 处理每个part
  for (let partIndex = 0; partIndex < partTokenGroups.length; partIndex++) {
    const partTokens = partTokenGroups[partIndex];
    
    // 每个part都从基础状态开始（独立继承）
    const partStatus = { ...basePartStatus };
    
    try {
      const result = processSinglePart(partTokens, partStatus, partIndex, score_meta);
      partResults.push(result.tokens);     // 保存tokens
      partMetas.push(result.part_meta);    // 保存part_meta
    } catch (error: any) {
      const processError: StateAssignmentError = {
        message: `Part ${partIndex + 1} 处理失败: ${error.message}`,
        errorType: 'STATE_INHERITANCE_ERROR' as any,
        severity: 'error'
      };
      errors.push(processError);
      partResults.push([]);             // 即使失败也要保持索引对应
      partMetas.push(createDefaultPartMeta()); // 失败时也保持完整结构的part_meta
    }
  }
  
  return {
    isValid: errors.length === 0,
    partResults: partResults,
    partMetas: partMetas,
    errors,
    warnings
  };
}
