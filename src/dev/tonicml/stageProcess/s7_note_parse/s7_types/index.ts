// S7音符解析类型定义
import { Position } from '../../s2_basic_token_recognition/s2_types';

// 音符解析错误类型
export interface NoteParsingError {
  message: string;
  position?: Position;
  errorType: string;
  severity: 'error' | 'warning';
}

// 解析后的音符结构
export interface NoteParsedStructure {
  parts: ParsedPart[];
  score_meta: any;
}

export interface ParsedPart {
  id: string;
  name?: string;
  instrument?: string;
  sections: ParsedSection[];
  parsed_notes: any[];
  commands: any[];
  tokens: any[];  // 添加 tokens 字段以支持 s7 的处理流程
}

export interface ParsedSection {
  id: string;
  name?: string;
  type: string;
  measures: ParsedMeasure[];
}

export interface ParsedMeasure {
  id: string;
  number: number;
  notes: any[];
  timeSignature?: string;
  keySignature?: string;
}

// 音符解析结果
export interface NoteParsingResult {
  isValid: boolean;
  structure: NoteParsedStructure;
  errors: NoteParsingError[];
  warnings: NoteParsingError[];
}