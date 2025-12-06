// S8乐谱验证类型定义
import { Position } from '../../s2_basic_token_recognition/s2_types';

// 乐谱验证错误类型
export interface ScoreValidationError {
  message: string;
  position?: Position;
  errorType: string;
  severity: 'error' | 'warning';
}

// 验证后的乐谱结构
export interface ValidatedScoreStructure {
  parts: ValidatedPart[];
  score_meta: any;
  validation_info: any;
}

export interface ValidatedPart {
  id: string;
  name?: string;
  instrument?: string;
  sections: ValidatedSection[];
  parsed_notes: any[];
  commands: any[];
  validation_status: any;
}

export interface ValidatedSection {
  id: string;
  name?: string;
  type: string;
  measures: ValidatedMeasure[];
  validation_status: any;
}

export interface ValidatedMeasure {
  id: string;
  number: number;
  notes: any[];
  timeSignature?: string;
  keySignature?: string;
  validation_status: any;
}

// 乐谱验证结果
export interface ScoreValidationResult {
  isValid: boolean;
  structure: ValidatedScoreStructure;
  errors: ScoreValidationError[];
  warnings: ScoreValidationError[];
}