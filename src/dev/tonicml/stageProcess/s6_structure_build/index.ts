import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../utils/debugLogBuilder.ts';
import type { ProcessedPart, ScoreMeta } from '../s5_state_assignment/s5_types';
import type { StructureAssignedToken, MusicalStructure } from './s6_types';
import { assignStructureIds } from './s6_utils/structureBuilders.ts';
import { processScopeMarkers } from './s6_utils/scopeMarker.ts';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_SKIP } from '../../types/commonTagTypes.ts';

// Re-export types for convenience
export type { StructureAssignedToken, MusicalStructure } from './s6_types';

/**
 * S6阶段主函数：为S5的tokens分配结构ID
 */
const s6_main_fn = (s5Result: StageResult<{score_meta: ScoreMeta, parts: ProcessedPart[]}>): StageResult<{score_meta: ScoreMeta, parts: Array<{tokens: StructureAssignedToken[], pid: number, is_explicit_part: boolean, part_meta: any}>}> => {
    const warnings: DebugMessage[] = [];
    const errors: DebugMessage[] = [];
    const info: DebugMessage[] = [];
    
    // 验证S5结果
    if (!s5Result.is_valid || !s5Result.result) {
        errors.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S5_${stageIdentifier.s5}阶段失败，S6_${stageIdentifier.s6}阶段跳过处理。`
        }));
        return buildStageResult({
            stageId: 6,
            result: { 
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
                parts: [] 
            },
            isValid: false,
            log: [...errors, ...warnings, ...info]
        });
    }
    
    const { score_meta, parts } = s5Result.result;
    
    // 为每个part的tokens分配结构ID
    const processedParts = parts.map(part => {
        // 解构复制一份part，tokens字段设为空数组
        const processedPart = {
            ...part,
            tokens: [] as any[]
        };
        
        // 第一步：分配结构ID（sid, phid, mid, nid）
        const { tokens: structuredTokens, errors: structureErrors } = assignStructureIds(part.tokens);
        errors.push(...structureErrors);
        
        // 第二步：处理作用域标记 - 遍历每个token并处理scope
        const { tokens: scopedTokens, errors: scopeErrors, warnings: scopeWarnings } = processScopeMarkers(structuredTokens, part.pid);
        errors.push(...scopeErrors);
        errors.push(...scopeWarnings);  // warnings作为errors处理
        
        // 将处理完的tokens添加到新的数组中
        processedPart.tokens = scopedTokens;
        
        return {
            tokens: processedPart.tokens,
            pid: processedPart.pid,
            is_explicit_part: processedPart.is_explicit_part,
            part_meta: processedPart.part_meta
        };
    });
    
    
    const isValid = errors.length === 0;
    return buildStageResult({
        stageId: 6,
        result: { score_meta, parts: processedParts },
        isValid: isValid,
        log: [...errors, ...warnings, ...info]
    });
}

/**
 * S6阶段主函数的时间统计包装器
 */
const s6_main_fn_with_time = (s5Result: StageResult<{score_meta: ScoreMeta, parts: ProcessedPart[]}>): StageResult<{score_meta: ScoreMeta, parts: Array<{tokens: StructureAssignedToken[], pid: number, is_explicit_part: boolean, part_meta: any}>}> => {
    const startTime = performance.now();
    
    // 调用原始的S6主函数
    const result = s6_main_fn(s5Result);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    };
};

export default s6_main_fn_with_time;
