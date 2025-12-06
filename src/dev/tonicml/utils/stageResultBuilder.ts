// 阶段结果构建器 - 统一构建各阶段的结果格式

import stageIdentifiers, { StageIdentifier, STAGE_TO_IDENTIFIER } from '../types/stageIdentifier.ts';
import type { DebugMessage } from './debugLogBuilder.ts';

// 统一的阶段结果接口 - 重构后使用统一的log字段
// TResult: 泛型，表示不同阶段返回的结果类型（如数组、对象等）
export interface StageResult<TResult> {
  is_valid: boolean;
  stage_id: number;
  stage_identifier: StageIdentifier;
  result: TResult;
  log: DebugMessage[];                  // 统一的日志数组，包含所有类型的调试信息
  duration_ms: number;                  // 阶段处理耗时，以毫秒为单位
}

// 阶段ID类型
export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// 构建阶段结果的参数接口
// TResult: 泛型，与StageResult的TResult对应，确保类型一致性
export interface BuildStageResultParams<TResult> {
  stageId: StageId;
  result: TResult;
  isValid?: boolean;
  log?: DebugMessage[];
  duration_ms?: number;  // 可选：主函数不需要关心时间统计
}

// 阶段ID到标识符的映射
const STAGE_ID_TO_IDENTIFIER: Record<StageId, StageIdentifier> = {
  1: STAGE_TO_IDENTIFIER.s1,
  2: STAGE_TO_IDENTIFIER.s2,
  3: STAGE_TO_IDENTIFIER.s3,
  4: STAGE_TO_IDENTIFIER.s4,
  5: STAGE_TO_IDENTIFIER.s5,
  6: STAGE_TO_IDENTIFIER.s6,
  7: STAGE_TO_IDENTIFIER.s7,
  8: STAGE_TO_IDENTIFIER.s8,
  9: STAGE_TO_IDENTIFIER.s9,
  10: STAGE_TO_IDENTIFIER.s10
};

// 构建阶段结果的抽象函数 - 重构后使用统一的log字段
// TResult: 泛型，指定当前阶段的结果类型，使用时需明确指定类型
export function buildStageResult<TResult>(
  params: BuildStageResultParams<TResult>
): StageResult<TResult> {
  const { stageId, result, isValid = true, log = [], duration_ms = 0 } = params;
  
  const stageResult: StageResult<TResult> = {
    is_valid: isValid,
    stage_id: stageId,
    stage_identifier: STAGE_ID_TO_IDENTIFIER[stageId],
    result: result,
    log: log,
    duration_ms: duration_ms
  };

  return stageResult;
}

// 便捷函数：构建错误阶段结果
export function buildErrorStageResult<TResult>(
  stageId: StageId,
  result: TResult,
  log: DebugMessage[],
  duration_ms: number
): StageResult<TResult> {
  return buildStageResult({
    stageId,
    result,
    isValid: false,
    log,
    duration_ms
  });
}

