import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import {
    buildDebugMessage,
    LogType,
    type DebugMessage
} from '../../utils/debugLogBuilder.ts';
import type { NoteParsedStructure } from '../s7_note_parse/s7_types';
import type { ValidatedScoreStructure } from './s8_types';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_SKIP } from '../../types/commonTagTypes.ts';

// Re-export types for convenience
export type { ValidatedScoreStructure, ScoreValidationResult } from './s8_types';

/**
 * S8阶段主函数：乐谱验证
 * 
 * @description 
 * 这是TonicML编译器的第八个阶段（S8），负责乐谱验证。
 * 
 * @param s7Result - S7阶段的完整结果
 * @returns StageResult<ValidatedScoreStructure> 验证结果
 */
const s8_main_fn = (s7Result: StageResult<NoteParsedStructure>): StageResult<ValidatedScoreStructure> => {
    const warnings: DebugMessage[] = [];
    const errors: DebugMessage[] = [];
    const info: DebugMessage[] = [];
    
    if (!s7Result.is_valid || !s7Result.result) {
        errors.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S7_${stageIdentifier.s7}阶段失败，S8_${stageIdentifier.s8}阶段跳过处理。`
        }));
        return buildStageResult({
            stageId: 8,
            result: { 
                parts: [], 
                score_meta: {
                    title: null,
                    author: null,
                    date: null,
                    genre: null,
                    description: null,
                    tempo: null,
                    key: null,
                    octave: null,
                    time_signature: null,
                    score_comment: []
                }, 
                validation_info: {} 
            },
            isValid: false,
            log: [...errors, ...warnings, ...info]
        });
    }
    
    // TODO: 实现乐谱验证逻辑
    const result: ValidatedScoreStructure = {
        parts: [],
        score_meta: s7Result.result.score_meta,
        validation_info: {}
    };
    
    return buildStageResult({
        stageId: 8,
        result: result,
        isValid: true,
        log: [...errors, ...warnings, ...info]
    });
}

/**
 * S8阶段主函数的时间统计包装器
 * 
 * @description
 * 这是s8_main_fn的包装器，负责添加执行时间统计。
 * 保持原函数的逻辑不变，只在外层添加时间测量。
 * 
 * @param s7Result - S7阶段的完整结果
 * @returns StageResult<ValidatedScoreStructure> 包含duration_ms字段的完整结果
 */
const s8_main_fn_with_time = (s7Result: StageResult<NoteParsedStructure>): StageResult<ValidatedScoreStructure> => {
    const startTime = performance.now();
    
    // 调用原始的S8主函数
    const result = s8_main_fn(s7Result);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    };
};

export default s8_main_fn_with_time;
