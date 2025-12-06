// S5状态初步赋予类型定义 - 基于Part（声部）概念
import { EnhancedToken } from '../../s4_token_enhancement/s4_types';
import { Position } from '../../s2_basic_token_recognition/s2_types';

// 状态赋予错误类型
export interface StateAssignmentError {
  message: string;
  position?: Position;
  errorType: StateAssignmentErrorType;
  severity: 'error' | 'warning';
}

export enum StateAssignmentErrorType {
  INVALID_STATE_VALUE = 'INVALID_STATE_VALUE',
  CONFLICTING_STATE = 'CONFLICTING_STATE',
  MISSING_REQUIRED_STATE = 'MISSING_REQUIRED_STATE',
  STATE_INHERITANCE_ERROR = 'STATE_INHERITANCE_ERROR',
  UNSUPPORTED_STATE_COMBINATION = 'UNSUPPORTED_STATE_COMBINATION',
  DUPLICATE_META_INFO = 'DUPLICATE_META_INFO'
}

// 乐谱元信息
export interface ScoreMeta {
  title: string | null;           // 作品标题 $title{}
  author: string | null;          // 统一作者 $author{}
  date: string | null;           // 时间记录 $date{}
  genre: string | null;          // 曲风/流派 $style{} 或 $genre{}
  description: string | null;     // 描述信息 $description{}
  tempo: string | null;           // 速度信息 $bpm{} 或 $tempo{}
  key: string | null;             // 调性信息 $key{} (仅第一个生效)
  octave: number | null;          // 八度信息 $octave{} (全局默认八度)
  time_signature: string | null;  // 拍号信息 $beat{} 或 $time{} (全局默认拍号)
  score_comment: string[];        // 乐谱注释 @{} 或 @score{} (Head阶段的全局注释)
}

// Part（声部）状态信息
export interface PartStatus {
  // 基础音乐状态
  key?: string;                   // 调性（从meta继承，可独立更新）
  octave?: number;                // 八度
  timeSignature?: string;         // 拍号
  tempo?: number;                 // 速度（BPM数值）
  clef?: string;                  // 谱号
  
  // 音符状态
  defaultNoteDuration?: string;   // 默认音符时值
  volume?: number;                // 音量
  
  // 位置状态
  currentMeasure?: number;        // 当前小节
  currentBeat?: number;           // 当前拍
  
  // part的名称、乐器等信息由SET_PART和SET_PART_ATTR命令单独处理
}

// 音乐状态信息（扩展Part状态，添加更多音乐相关状态）
export interface MusicalState extends PartStatus {
  // 和弦状态
  currentChordMode?: string;      // 和弦模式
}

// 状态赋予规则
export interface StateAssignmentRule {
  tokenType: string;
  stateProperty: keyof MusicalState;
  validator?: (value: any) => boolean;
  transformer?: (value: any) => any;
}

// 状态继承策略
export enum StateInheritanceStrategy {
  INHERIT = 'INHERIT',        // 继承上级状态
  OVERRIDE = 'OVERRIDE',      // 覆盖上级状态
  MERGE = 'MERGE',           // 合并状态
  RESET = 'RESET'            // 重置为默认状态
}

// 状态作用域
export enum StateScope {
  GLOBAL = 'GLOBAL',         // 全局作用域
  PART = 'PART',            // 声部作用域
  SECTION = 'SECTION',       // 段落作用域
  PHRASE = 'PHRASE',         // 乐句作用域
  MEASURE = 'MEASURE',       // 小节作用域
  LOCAL = 'LOCAL'            // 局部作用域
}

// 状态赋予配置
export interface StateAssignmentConfig {
  inheritanceStrategy: StateInheritanceStrategy;
  defaultScope: StateScope;
  enableValidation: boolean;
  enableWarnings: boolean;
}

// 核心元素的状态字段（根据用户需求，只包含key和octave）
export interface CoreElementState {
  key: string;            // 调性
  octave: number;         // 八度
}

// 状态已赋予的Token
export interface StateAssignedToken {
  position: Position;      // 位置信息（保持）
  token: string;          // 保持原类型或增强类型
  value: string;          // 解析之后的内容
  character: string;      // 原始字符串内容
  stateData?: MusicalState; // 状态数据（只有音符类型token才有）
  state?: CoreElementState; // 核心元素的状态字段（只有核心元素才有）
}

// Part元信息（根据语法文档6.4节声部属性系统）
// 所有字段都显示，没有值的为null（固定结构）
export interface PartMeta {
  name: string | null;            // 声部完整显示名称 $p.name{} 或 $part{}的值
  abbr: string | null;            // 声部缩写名称 $p.abbr{}
  instrument: string | null;      // 主要乐器标识 $p.instrument{}
  midi_channel: number | null;    // MIDI通道分配 $p.midi-channel{} (1-16)
  midi_program: number | null;    // MIDI音色库ID $p.midi-program{} (0-127)
  volume: number | null;          // 声部音量控制 $p.volume{} (0-127)
  pan: number | null;             // 立体声声像位置 $p.pan{} (-180到180)
}

// 单个Part的结构
export interface ProcessedPart {
  tokens: StateAssignedToken[];   // 该part的tokens（已赋值状态）
  pid: number;                    // part标识符，从1开始计数
  is_explicit_part: boolean;      // 是否是通过SET_PART明确定义的声部
  part_meta: PartMeta;            // part级别的元信息（不再是可选）
}

// 状态赋予结果接口
export interface StateAssignmentResult {
  isValid: boolean;
  score_meta: ScoreMeta;          // 确定的Meta信息
  parts: ProcessedPart[];         // 各个part（tokens已按part分组）
  errors: StateAssignmentError[];
  warnings: StateAssignmentError[];
}
