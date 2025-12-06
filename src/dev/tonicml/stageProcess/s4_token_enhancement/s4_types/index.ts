// S4令牌增强器类型定义
import { Token, Position } from '../../s2_basic_token_recognition/s2_types';

// 增强错误类型枚举已移除，统一使用 debugLogBuilder

// token增强上下文
export interface TokenEnhanceContext {
  currentIndex: number;
  allTokens: Token[];
  previousEnhancedTokens: EnhancedToken[];
}

// token增强器接口
export interface TokenEnhancer {
  enhance(token: Token, context?: TokenEnhanceContext): EnhancedToken;
}

// EnhanceResult 和 TokenEnhanceResult 接口已移除，统一使用 StageResult<EnhancedToken[]>

// 增强的Token类型 - 兼容原始Token和增强后的Token  
export type EnhancedToken = Token | {
  position: Position;     // 位置信息（保持）
  token: EnhancedTokenType | string; // enhanced之后的类型，或保持原样的TokenType
  value: string;          // 解析之后的内容
  character: string;      // 原始字符串内容（源代码中的原始字符）
}

// 增强的Token类型枚举 - 只定义需要增强的token类型
export enum EnhancedTokenType {
  // 基础全局动作（保持SET_前缀）
  SET_TITLE = 'SET_TITLE',
  SET_AUTHOR = 'SET_AUTHOR',
  SET_DATE = 'SET_DATE',
  SET_GENRE = 'SET_GENRE',  // style和genre都映射到这里
  SET_DESCRIPTION = 'SET_DESCRIPTION',  // description描述信息
  
  // 音乐设置动作
  SET_KEY = 'SET_KEY',
  SET_OCTAVE = 'SET_OCTAVE',
  SET_BPM = 'SET_BPM',  // tempo和bpm都映射到这里
  SET_BEAT = 'SET_BEAT',  // time和beat都映射到这里
  SET_CLEF = 'SET_CLEF',
  
  // 声部相关动作
  SET_PART = 'SET_PART',  // 定义声部
  SET_PART_ATTR_NAME = 'SET_PART_ATTR_NAME',
  SET_PART_ATTR_ABBR = 'SET_PART_ATTR_ABBR',
  SET_PART_ATTR_INSTRUMENT = 'SET_PART_ATTR_INSTRUMENT',
  SET_PART_ATTR_MIDI_CHANNEL = 'SET_PART_ATTR_MIDI_CHANNEL',
  SET_PART_ATTR_MIDI_PROGRAM = 'SET_PART_ATTR_MIDI_PROGRAM',
  SET_PART_ATTR_VOLUME = 'SET_PART_ATTR_VOLUME',
  SET_PART_ATTR_PAN = 'SET_PART_ATTR_PAN',
  SET_PART_ATTR_CLEF = 'SET_PART_ATTR_CLEF',
  
  // 通用
  UNKNOWN_ACTION = 'UNKNOWN_ACTION',
  
  // 注释相关
  COM_NORMAL = 'COM_NORMAL',            // @{内容} 普通注释
  COM_SCORE = 'COM_SCORE',              // @score{内容} 全局注释
  COM_PART = 'COM_PART',                // @part 段落注释
  COM_SECTION = 'COM_SECTION',          // @~xxx{} @section{} 区域注释
  COM_PHRASE = 'COM_PHRASE',            // @phrase 乐句标记
  COM_MEASURE = 'COM_MEASURE',          // @measure 小节标记
  
  // 特殊音符相关
  SP_NOTE_CHORD = 'SP_NOTE_CHORD',                     // &c{} 和弦
  SP_NOTE_TUPLET = 'SP_NOTE_TUPLET',                   // &t{} 连音（三连音、五连音等）
  
  // 和弦相关
  CHORD_ANNOTATION = 'CHORD_ANNOTATION'                // [C Am F G] 和弦标注
  
  // 注意：不再定义不需要增强的类型，如 MEASURE_BREAK, PHRASE_BREAK, NEWLINE 等
  // 这些token保持原来的TokenType
}

// 具体的增强数据结构

// 动作数据
export interface ActionData {
  actionType: string;
  originalValue: string;        // 存储原始完整字符串
  isValid: boolean;
}

// 音符数据
export interface NoteData {
  pitch?: string;           // 音高 (C, D, E, etc. or 1, 2, 3, etc.)
  accidental?: string;      // 变音符号 (#, b)
  octave?: number;          // 八度
  duration?: string;        // 时值
  lyrics?: string;          // 歌词 {}
  annotation?: string;      // 注释 @{}
  isRest: boolean;          // 是否为休止符
  hasAccent?: boolean;      // 重音 >
  hasReverseAccent?: boolean; // 反重音 <
  hasStaccato?: boolean;    // 断音 .
  hasTie?: boolean;         // 连音线相关
}

// 和弦数据
export interface ChordData {
  chords: string[];         // 和弦列表
  startPosition: Position;
  endPosition?: Position;
}

// 特殊音符数据
export interface SpecialNoteData {
  noteType: string;         // 特殊音符类型 (chord, triplet等)
  originalPrefix: string;   // 原始前缀 (&c, &t等)
  value: string;           // 去掉前缀后的内容
}
