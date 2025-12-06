// S9和弦短语分析类型定义
import { Position } from '../../s2_basic_token_recognition/s2_types';

// 和弦分析错误类型
export interface ChordAnalysisError {
  message: string;
  position?: Position;
  errorType: string;
  severity: 'error' | 'warning';
}

// 和弦短语结构
export interface ChordPhraseStructure {
  parts: ChordAnalyzedPart[];
  score_meta: any;
  chord_analysis: any;
}

export interface ChordAnalyzedPart {
  id: string;
  name?: string;
  instrument?: string;
  sections: ChordAnalyzedSection[];
  chord_progressions: any[];
  commands: any[];
}

export interface ChordAnalyzedSection {
  id: string;
  name?: string;
  type: string;
  phrases: ChordPhrase[];
}

export interface ChordPhrase {
  id: string;
  measures: ChordMeasure[];
  harmonic_function: string;
}

export interface ChordMeasure {
  id: string;
  number: number;
  chords: any[];
  key?: string;
}

// 和弦短语分析结果
export interface ChordPhraseResult {
  isValid: boolean;
  structure: ChordPhraseStructure;
  errors: ChordAnalysisError[];
  warnings: ChordAnalysisError[];
}
