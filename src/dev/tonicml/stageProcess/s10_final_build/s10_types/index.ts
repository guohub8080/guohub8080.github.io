// S10最终构建类型定义
import { Position } from '../../s2_basic_token_recognition/s2_types';

// 最终构建错误类型
export interface FinalBuildError {
  message: string;
  position?: Position;
  errorType: string;
  severity: 'error' | 'warning';
}

// 最终构建结构
export interface FinalBuildStructure {
  score: any;
  metadata: any;
  output_formats: OutputFormat[];
}

export interface OutputFormat {
  format: string;
  data: any;
  options: any;
}

// 最终构建结果
export interface FinalBuildResult {
  isValid: boolean;
  structure: FinalBuildStructure;
  errors: FinalBuildError[];
  warnings: FinalBuildError[];
}
