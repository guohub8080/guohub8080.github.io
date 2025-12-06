import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import {
    buildDebugMessage,
    LogType,
    type DebugMessage
} from '../../utils/debugLogBuilder.ts';
import type { Token } from '../s2_basic_token_recognition/s2_types';
import { TokenType } from '../s2_basic_token_recognition/s2_types';
import type { FilterContext, ValidatorFunction } from './s3_types';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_START, STAGE_END, STAGE_ERROR, STAGE_SKIP } from '../../types/commonTagTypes.ts';
import byDefault from '../../utils/byDefault.ts';

// 导入所有初步验证函数
import { actionFilter } from './s3_utils/actionFilter.ts';
import { commentsFilter } from './s3_utils/commentsFilter.ts';
import { noteFilter } from './s3_utils/noteFilter.ts';
import { chordScopeMarkFilter } from './s3_utils/chordScopeMarkFilter.ts';
import { specialNoteFilter } from './s3_utils/specialNoteFilter.ts';

// Re-export types for convenience
export type { FilterContext, SyntaxError, ErrorFilterResult } from './s3_types';

/**
 * S3阶段：初步格式验证
 * 
 * 核心逻辑：
 * - 遍历所有Token，按类型分发到对应filter
 * - 收集错误和警告到filterLog
 * - 有错误就返回空数组阻止后续处理，无错误就返回S2原始数据
 * 
 * @param s2Result S2阶段结果
 * @returns 成功时返回与S2完全一致的Token数组，失败时返回空数组
 */
const s3_main_fn = (s2Result: StageResult<Token[]>): StageResult<Token[]> => {
    // S2结果验证
    const logs: DebugMessage[] = [];
    
    if (!s2Result.is_valid) {
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S2_${stageIdentifier.s2}阶段失败，S3_${stageIdentifier.s3}阶段跳过处理。`
        }));

        // S3只返回自己的调试信息，不继承S2的错误和警告
        return buildStageResult({
            stageId: 3,
            result: [],
            isValid: false,
            log: logs
        });
    }

    logs.push(buildDebugMessage({
        type: LogType.INFO,
        tag: STAGE_START,
        message: `S3_${stageIdentifier.s3} 开始。`
    }));

    const tokens = byDefault(s2Result.result, []);
    if (tokens.length === 0) {
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: "UNEXPECTED_ERROR",
            message: `S2_${stageIdentifier.s2}阶段声称成功但未产生任何Token，这是异常情况。`
        }));
        return buildStageResult({
            stageId: 3,
            result: [],
            isValid: false,
            log: logs
        });
    }


    // 逐Token验证
    let hasErrors = false;
    const filterLog = [] as DebugMessage[];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // 按Token类型分发验证
        switch (token.type) {
            case TokenType.MEASURE_BREAK:
            case TokenType.PHRASE_BREAK:
            case TokenType.TIE_START:
            case TokenType.TIE_END:
            case TokenType.NEWLINE:
                // 结构Token不需要验证
                break;

            case TokenType.ACTION:
                const actionResult = actionFilter(token);
                filterLog.push(...actionResult.logs);
                if (!actionResult.isValid) {
                    hasErrors = true;
                }
                break;

            case TokenType.COMMENT:
                const commentResult = commentsFilter(token);
                filterLog.push(...commentResult.logs);
                if (!commentResult.isValid) {
                    hasErrors = true;
                }
                break;

            case TokenType.NOTE:
                const noteResult = noteFilter(token);
                filterLog.push(...noteResult.logs);
                if (!noteResult.isValid) {
                    hasErrors = true;
                }
                break;

            case TokenType.CHORD_SCOPE_MARK:
                const chordResult = chordScopeMarkFilter(token);
                filterLog.push(...chordResult.logs);
                if (!chordResult.isValid) {
                    hasErrors = true;
                }
                break;

            case TokenType.SPECIAL_NOTE:
                const specialResult = specialNoteFilter(token);
                filterLog.push(...specialResult.logs);
                if (!specialResult.isValid) {
                    hasErrors = true;
                }
                break;

            default:
                filterLog.push(buildDebugMessage({
                    type: LogType.ERROR,
                    tag: 'UNEXPECTED_TOKEN',
                    message: `未知Token类型: ${token.type}`,
                    source: {
                        line: token.position.line,
                        column: token.position.column,
                        offset: token.position.offset
                    }
                }));
                hasErrors = true;
                break;
        }
    }

    logs.push(...filterLog);

    // 构建结果：有错误直接退出，无错误返回S2原始数据
    
    if (hasErrors) {
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_ERROR,
            message: '部分Token未通过初步规范过滤，阻止后续处理。'
        }));
        return buildStageResult({
            stageId: 3,
            result: [],
            isValid: false,
            log: logs
        });
    }

    logs.push(buildDebugMessage({
        type: LogType.INFO,
        tag: STAGE_END,
        message: `S3完成，所有Token通过初步验证，保持原始数据完整性。`
    }));

    return buildStageResult({
        stageId: 3,
        result: tokens,
        isValid: true,
        log: logs
    });

    // S3完成: 有错误返回[]，无错误返回S2原始数据
}

/**
 * S3阶段主函数（带时间统计）
 */
const s3_main_fn_with_time = (s2Result: StageResult<Token[]>): StageResult<Token[]> => {
    const startTime = performance.now();
    const result = s3_main_fn(s2Result);
    const endTime = performance.now();
    
    return {
        ...result,
        duration_ms: endTime - startTime
    };
};

export default s3_main_fn_with_time;