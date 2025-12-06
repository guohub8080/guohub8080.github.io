import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import {
    buildDebugMessage,
    LogType,
    type DebugMessage
} from '../../utils/debugLogBuilder.ts';
import type { ChordPhraseStructure } from '../s9_chord_phrase/s9_types';
import type { FinalBuildStructure } from './s10_types';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_SKIP } from '../../types/commonTagTypes.ts';

// Re-export types for convenience
export type { FinalBuildStructure, FinalBuildResult } from './s10_types';

/**
 * S10阶段主函数：最终构建
 * 
 * @description 
 * 这是TonicML编译器的第十个阶段（S10），负责最终构建。
 * 
 * @param s9Result - S9阶段的完整结果
 * @returns StageResult<FinalBuildStructure> 最终构建结果
 */
const s10_main_fn = (s9Result: StageResult<ChordPhraseStructure>): StageResult<FinalBuildStructure> => {
    const warnings: DebugMessage[] = [];
    const errors: DebugMessage[] = [];
    const info: DebugMessage[] = [];
    
    if (!s9Result.is_valid || !s9Result.result) {
        errors.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S9_${stageIdentifier.s9}阶段失败，S10_${stageIdentifier.s10}阶段跳过处理。`
        }));
        return buildStageResult({
            stageId: 10,
            result: { 
                score: {}, 
                metadata: {
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
                output_formats: [] 
            },
            isValid: false,
            log: [...errors, ...warnings, ...info]
        });
    }
    
    // TODO: 实现最终构建逻辑
    const result: FinalBuildStructure = {
        score: {},
        metadata: s9Result.result.score_meta,
        output_formats: []
    };
    
    return buildStageResult({
        stageId: 10,
        result: result,
        isValid: true,
        log: [...errors, ...warnings, ...info]
    });
}

/**
 * S10阶段主函数的时间统计包装器
 * 
 * @description
 * 这是s10_main_fn的包装器，负责添加执行时间统计。
 * 保持原函数的逻辑不变，只在外层添加时间测量。
 * 
 * @param s9Result - S9阶段的完整结果
 * @returns StageResult<FinalBuildStructure> 包含duration_ms字段的完整结果
 */
const s10_main_fn_with_time = (s9Result: StageResult<ChordPhraseStructure>): StageResult<FinalBuildStructure> => {
    const startTime = performance.now();
    
    // 调用原始的S10主函数
    const result = s10_main_fn(s9Result);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    };
};

export default s10_main_fn_with_time;
