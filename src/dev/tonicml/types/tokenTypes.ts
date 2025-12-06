/**
 * TonicML编译器Token字符串类型系统
 * 三层分离设计：Common（贯穿始终）+ Basic（S2→S4消失）+ Enhanced（S4新增）
 */

// ============================================================================
// 1. Common Token Types（通用Token类型）
// 在所有编译阶段都保持不变，直接透传的token类型
// ============================================================================
export type CommonTokenType = 
  | 'NEWLINE'           // 换行符
  | 'MEASURE_BREAK'     // 小节间断：逗号
  | 'PHRASE_BREAK'      // 乐句间断：分号
  | 'TIE_START'         // 连线开始：左括号
  | 'TIE_END'           // 连线结束：右括号
  | 'NOTE';             // 基础音符（S4不处理，直接透传）

// ============================================================================
// 2. Basic Token Types（基础Token类型 - S2产生，S4消费）
// S2阶段产生，但在S4阶段会被处理掉/转换为Enhanced类型的token
// ============================================================================
export type BasicTokenType = 
  | 'ACTION'            // 动作指令：$ 开头 → S4转换为SET_*系列
  | 'COMMENT'           // 注释：@ 开头 → S4转换为COM_*系列  
  | 'SPECIAL_NOTE'      // 特殊音符：& 开头 → S4转换为SP_NOTE_*系列
  | 'CHORD_SCOPE_MARK'; // 和弦作用域标记：[ 开头 → S4转换为CHORD_ANNOTATION

// ============================================================================
// 2. Enhanced Token Types（增强Token类型 - S4阶段新增）
// S4阶段将部分Basic Token增强为更具体的语义类型
// ============================================================================
export type EnhancedTokenType = 
  // 基础全局动作（保持SET_前缀）
  | 'SET_TITLE'
  | 'SET_AUTHOR'
  | 'SET_DATE'
  | 'SET_GENRE'
  | 'SET_DESCRIPTION'
  // 音乐设置动作
  | 'SET_KEY'
  | 'SET_OCTAVE'
  | 'SET_BPM'
  | 'SET_BEAT'
  | 'SET_CLEF'
  // 声部相关动作
  | 'SET_PART'
  | 'SET_PART_ATTR_NAME'
  | 'SET_PART_ATTR_ABBR'
  | 'SET_PART_ATTR_INSTRUMENT'
  | 'SET_PART_ATTR_MIDI_CHANNEL'
  | 'SET_PART_ATTR_MIDI_PROGRAM'
  | 'SET_PART_ATTR_VOLUME'
  | 'SET_PART_ATTR_PAN'
  | 'SET_PART_ATTR_CLEF'
  // 通用
  | 'UNKNOWN_ACTION'
  // 注释相关
  | 'COM_NORMAL'
  | 'COM_SCORE'
  | 'COM_PART'
  | 'COM_SECTION'
  | 'COM_PHRASE'
  | 'COM_MEASURE'
  // 特殊音符相关
  | 'SP_NOTE_CHORD'
  | 'SP_NOTE_TUPLET'
  // 和弦相关
  | 'CHORD_ANNOTATION';

// ============================================================================
// 3. 联合类型定义（用于不同编译阶段的类型约束）
// ============================================================================

// S2阶段产生的token类型：Common + Basic
export type S2TokenType = CommonTokenType | BasicTokenType;

// S4阶段输入的token类型：Common + Basic（来自S2）
export type S4InputTokenType = CommonTokenType | BasicTokenType;

// S4阶段输出的token类型：Common + Enhanced（Basic被消费转换）
export type S4OutputTokenType = CommonTokenType | EnhancedTokenType;

// 所有可能的token类型（用于完整类型检查）
export type AllTokenType = CommonTokenType | BasicTokenType | EnhancedTokenType;

// ============================================================================
// 4. 类型守卫函数
// ============================================================================

const COMMON_TOKEN_VALUES: CommonTokenType[] = [
  'NEWLINE', 'MEASURE_BREAK', 'PHRASE_BREAK', 'TIE_START', 'TIE_END', 'NOTE'
];

const BASIC_TOKEN_VALUES: BasicTokenType[] = [
  'ACTION', 'COMMENT', 'SPECIAL_NOTE', 'CHORD_SCOPE_MARK'
];

const ENHANCED_TOKEN_VALUES: EnhancedTokenType[] = [
  'SET_TITLE', 'SET_AUTHOR', 'SET_DATE', 'SET_GENRE', 'SET_DESCRIPTION',
  'SET_KEY', 'SET_OCTAVE', 'SET_BPM', 'SET_BEAT', 'SET_CLEF',
  'SET_PART', 'SET_PART_ATTR_NAME', 'SET_PART_ATTR_ABBR', 'SET_PART_ATTR_INSTRUMENT',
  'SET_PART_ATTR_MIDI_CHANNEL', 'SET_PART_ATTR_MIDI_PROGRAM', 'SET_PART_ATTR_VOLUME',
  'SET_PART_ATTR_PAN', 'SET_PART_ATTR_CLEF', 'UNKNOWN_ACTION',
  'COM_NORMAL', 'COM_SCORE', 'COM_PART', 'COM_SECTION', 'COM_PHRASE', 'COM_MEASURE',
  'SP_NOTE_CHORD', 'SP_NOTE_TUPLET', 'CHORD_ANNOTATION'
];

export function isCommonTokenType(type: string): type is CommonTokenType {
  return COMMON_TOKEN_VALUES.includes(type as CommonTokenType);
}

export function isBasicTokenType(type: string): type is BasicTokenType {
  return BASIC_TOKEN_VALUES.includes(type as BasicTokenType);
}

export function isEnhancedTokenType(type: string): type is EnhancedTokenType {
  return ENHANCED_TOKEN_VALUES.includes(type as EnhancedTokenType);
}

// S2阶段类型检查：产生Common + Basic
export function isS2TokenType(type: string): type is S2TokenType {
  return isCommonTokenType(type) || isBasicTokenType(type);
}

// S4阶段输入类型检查：接受Common + Basic
export function isS4InputTokenType(type: string): type is S4InputTokenType {
  return isCommonTokenType(type) || isBasicTokenType(type);
}

// S4阶段输出类型检查：产生Common + Enhanced
export function isS4OutputTokenType(type: string): type is S4OutputTokenType {
  return isCommonTokenType(type) || isEnhancedTokenType(type);
}

// ============================================================================
// 5. 核心元素组定义（保持与原有逻辑兼容）
// ============================================================================

/**
 * 核心元素类型组 - 包含最常用的音乐内容元素
 */
export const CoreElementTypes: (CommonTokenType | BasicTokenType)[] = [
  'NOTE',              // 普通音符（Common类型）
  'SPECIAL_NOTE',      // 特殊音符：&c{}, &t{} 等（Basic类型）
  'CHORD_SCOPE_MARK'   // 和弦作用域标记：[C]（Basic类型）
];

/**
 * 判断token类型是否为核心元素
 */
export function isCoreElementType(type: string): boolean {
  return CoreElementTypes.includes(type as CommonTokenType | BasicTokenType);
}

// ============================================================================
// 6. 兼容性类型别名（平滑迁移）
// ============================================================================

// 为了与现有代码兼容，提供旧的类型别名
export type TokenType = AllTokenType;
