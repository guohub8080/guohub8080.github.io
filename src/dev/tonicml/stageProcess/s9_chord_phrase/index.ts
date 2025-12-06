import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import {
    buildDebugMessage,
    LogType,
    type DebugMessage
} from '../../utils/debugLogBuilder.ts';
import type { ValidatedScoreStructure } from '../s8_score_validation/s8_types';
import type { ChordPhraseStructure } from './s9_types';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_SKIP } from '../../types/commonTagTypes.ts';

// Re-export types for convenience
export type { ChordPhraseStructure, ChordPhraseResult } from './s9_types';

/**
 * S9阶段主函数：和弦短语分析
 * 
 * @description 
 * 这是TonicML编译器的第九个阶段（S9），负责和弦短语分析。
 * 
 * @param s8Result - S8阶段的完整结果
 * @returns StageResult<ChordPhraseStructure> 和弦短语分析结果
 */
const s9_main_fn = (s8Result: StageResult<ValidatedScoreStructure>): StageResult<ChordPhraseStructure> => {
    const warnings: DebugMessage[] = [];
    const errors: DebugMessage[] = [];
    const info: DebugMessage[] = [];
    
    if (!s8Result.is_valid || !s8Result.result) {
        errors.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S8_${stageIdentifier.s8}阶段失败，S9_${stageIdentifier.s9}阶段跳过处理。`
        }));
        return buildStageResult({
            stageId: 9,
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
                chord_analysis: {} 
            },
            isValid: false,
            log: [...errors, ...warnings, ...info]
        });
    }
    
    // TODO: 实现和弦短语分析逻辑
    const result: ChordPhraseStructure = {
        parts: [],
        score_meta: s8Result.result.score_meta,
        chord_analysis: {}
    };
    
    return buildStageResult({
        stageId: 9,
        result: result,
        isValid: true,
        log: [...errors, ...warnings, ...info]
    });
}

/**
 * S9阶段主函数的时间统计包装器
 * 
 * @description
 * 这是s9_main_fn的包装器，负责添加执行时间统计。
 * 保持原函数的逻辑不变，只在外层添加时间测量。
 * 
 * @param s8Result - S8阶段的完整结果
 * @returns StageResult<ChordPhraseStructure> 包含duration_ms字段的完整结果
 */
const s9_main_fn_with_time = (s8Result: StageResult<ValidatedScoreStructure>): StageResult<ChordPhraseStructure> => {
    const startTime = performance.now();
    
    // 调用原始的S9主函数
    const result = s9_main_fn(s8Result);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    };
};

export default s9_main_fn_with_time;
