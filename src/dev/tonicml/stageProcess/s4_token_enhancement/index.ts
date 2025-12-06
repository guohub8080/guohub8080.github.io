import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import {
    buildDebugMessage,
    LogType,
    type DebugMessage
} from '../../utils/debugLogBuilder.ts';
import type { Token } from '../s2_basic_token_recognition/s2_types';
import { TokenType } from '../s2_basic_token_recognition/s2_types';
import type { EnhancedToken } from './s4_types';
import { enhanceAction } from './s4_utils/actionEnhancer.ts';
import { enhanceComment } from './s4_utils/commentEnhancer.ts';
import { enhanceSpecialNote } from './s4_utils/specialNoteEnhancer.ts';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_START, STAGE_END, STAGE_ERROR, STAGE_SKIP } from '../../types/commonTagTypes.ts';

// Re-export types for convenience
export type { EnhancedToken, EnhancedTokenType } from './s4_types';

/**
 * S4阶段主函数：对S3过滤后的Token数组进行令牌增强
 * 
 * @description 
 * 这是TonicML编译器的第四个阶段（S4），负责对S3阶段过滤后的Token数组进行令牌增强。
 * 对于需要增强的Token（如动作、注释、特殊音符），会将其转换为增强后的Token，
 * 提取更详细的语义信息，为后续阶段提供更丰富的数据结构。
 * 
 * @param s3Result - S3阶段的完整结果，包含过滤后的Token数组和状态信息
 * 
 * @returns StageResult<EnhancedToken[]> 包含以下信息的阶段结果：
 *   - result: EnhancedToken[] - 增强后的Token数组
 *   - is_valid: boolean - 增强是否成功
 *   - stage_id: number - 阶段ID（固定为4）
 *   - stage_identifier: string - 阶段标识符
 *   - warning: DebugMessage[] - 警告信息数组
 *   - error: DebugMessage[] - 错误信息数组
 *   - info: DebugMessage[] - 调试信息数组
 * 
 * @example
 * ```typescript
 * const s3Result = s3_main_fn(s2Result);
 * const s4Result = s4_main_fn(s3Result);
 * // 返回增强后的Token数组，包含更丰富的语义信息
 * ```
 * 
 * @processing_rules
 * 1. **选择性增强**：只对需要增强的Token类型进行处理
 * 2. **语义提取**：从Token值中提取具体的语义信息
 * 3. **类型转换**：将原始Token转换为EnhancedToken
 * 4. **数据保留**：保留原始Token信息以供调试使用
 * 5. **错误收集**：收集增强过程中的错误和警告
 * 
 * @validation_checks
 * - S3结果验证：如果S3失败，直接返回失败结果
 * - 空Token数组：如果S3成功但没有Token，报错
 * - 增强错误检查：收集每个Token增强过程中的问题
 * 
 * @error_handling
 * - S3失败时直接返回失败结果
 * - S4只返回自己的调试信息，不继承S3的错误和警告
 * - 增强错误不会阻止整个流程，而是记录为警告
 * 
 * @performance
 * - 时间复杂度：O(n) 其中n是Token数量
 * - 空间复杂度：O(n) 用于存储增强结果
 * 
 * @since S4阶段重构后
 * @author guohub8080
 */
const s4_main_fn = (s3Result: StageResult<Token[]>): StageResult<EnhancedToken[]> => {
    // ==================================================================================
    // 第四阶段第一步：S3结果验证和准备工作
    // ==================================================================================
    
    /** 步骤4.1：初始化统一的调试信息收集器 */
    const logs: DebugMessage[] = [];
    
    /** 步骤4.2：验证S3阶段结果的有效性 */
    // 如果S3阶段失败，直接返回失败状态，不进行任何处理
    if (!s3Result.is_valid) {
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S3_${stageIdentifier.s3}阶段失败，S4_${stageIdentifier.s4}阶段跳过处理。`
        }));
        
        // S4只返回自己的调试信息，不继承S3的错误和警告
        return buildStageResult({
            stageId: 4,
            result: [],
            isValid: false,
            log: logs
        });
    }

    // 记录阶段开始（只有S3有效时才开始）
    logs.push(buildDebugMessage({
        type: LogType.INFO,
        tag: STAGE_START,
        message: `S4_${stageIdentifier.s4} 开始。`
    }));
    
    /** 步骤4.3：提取S3的Token数组并记录基本信息 */
    const tokens = s3Result.result || [];
    
    // 如果S3成功但没有产生任何Token，这是异常情况，应该报错
    if (tokens.length === 0) {
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: "UNEXPECTED_ERROR",
            message: `S3_${stageIdentifier.s3}阶段声称成功但未产生任何Token，这是异常情况。`
        }));
        return buildStageResult({
            stageId: 4,
            result: [],
            isValid: false,
            log: logs
        });
    }
    
    // ==================================================================================
    // 第四阶段第二步：逐Token增强处理
    // ==================================================================================
    
    /** 步骤4.4：准备增强结果容器 */
    const enhancedTokens: EnhancedToken[] = [];
    
    /** 步骤4.5：逐Token增强循环 */
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        try {
            let enhancedToken: EnhancedToken;
            
            // 根据Token类型进行选择性增强
            switch (token.type) {
                case TokenType.ACTION:
                    if (token.value.startsWith('$')) {
                        enhancedToken = enhanceAction(token);
                    } else {
                        // 不是$动作，保持原样
                        enhancedToken = token as EnhancedToken;
                    }
                    break;
                    
                case TokenType.COMMENT:
                    if (token.value.startsWith('@')) {
                        enhancedToken = enhanceComment(token);
                    } else {
                        // 不是@注释，保持原样
                        enhancedToken = token as EnhancedToken;
                    }
                    break;
                    
                case TokenType.SPECIAL_NOTE:
                    enhancedToken = enhanceSpecialNote(token);
                    break;
                    
                case TokenType.NOTE:
                case TokenType.MEASURE_BREAK:
                case TokenType.PHRASE_BREAK:
                case TokenType.TIE_START:
                case TokenType.TIE_END:
                case TokenType.NEWLINE:
                case TokenType.CHORD_SCOPE_MARK:
                default:
                    // 其他Token保持原样，不做任何增强处理
                    enhancedToken = token as EnhancedToken;
                    break;
            }
            
            enhancedTokens.push(enhancedToken);
            
            // 检查增强Token中是否包含错误信息
            // 在新结构中，错误信息存储在value字段中，当token类型为错误类型时
            if ('token' in enhancedToken && 
                (enhancedToken.token === 'UNKNOWN_ACTION' || 
                 (enhancedToken.token === 'COM_NORMAL' && enhancedToken.value.includes('Invalid')))) {
                logs.push(buildDebugMessage({
                    type: LogType.WARNING,
                    tag: 'TOKEN_ENHANCEMENT_WARNING',
                    message: enhancedToken.value,
                    source: {
                        line: token.position.line,
                        column: token.position.column,
                        offset: token.position.offset
                    }
                }));
            }
            
        } catch (error) {
            // 增强过程中发生错误，记录为警告并保持原Token
            const errorMessage = error instanceof Error ? error.message : String(error);
            logs.push(buildDebugMessage({
                type: LogType.WARNING,
                tag: 'TOKEN_ENHANCEMENT_ERROR',
                message: `Token增强失败: ${errorMessage}`,
                source: {
                    line: token.position.line,
                    column: token.position.column,
                    offset: token.position.offset
                }
            }));
            
            enhancedTokens.push(token as EnhancedToken);
        }
    }
    
    // ==================================================================================
    // 第四阶段第三步：后处理和结果构建
    // ==================================================================================
    
    /** 步骤4.6：统计增强结果 */
    const errorCount = logs.filter(log => log.type === 'ERROR').length;
    const warningCount = logs.filter(log => log.type === 'WARNING').length;
    
    const enhancementStats = {
        total: enhancedTokens.length,
        enhanced: enhancedTokens.filter(t => 'token' in t).length,
        unchanged: enhancedTokens.filter(t => !('token' in t)).length,
        warnings: warningCount,
        errors: errorCount
    };
    
    /** 步骤4.7：计算最终结果有效性 */
    // S4成功的标准：没有致命增强错误（warnings不影响成功状态）
    const isValid = errorCount === 0;
    
    // 如果有增强错误，应该返回空数组，阻止后续阶段处理有问题的Token
    const resultTokens = isValid ? enhancedTokens : [];

    /** 步骤4.8：记录处理完成的统计信息 */
    // 记录阶段完成
    logs.push(buildDebugMessage({
        type: LogType.INFO,
        tag: STAGE_END,
        message: `S4完成: ${isValid ? '成功' : '失败'} - 增强了 ${enhancementStats.enhanced} 个Token，保持原样 ${enhancementStats.unchanged} 个，共处理 ${enhancementStats.total} 个Token`,
        extra_data: {
            tokenCount: enhancementStats.total,
            enhancedCount: enhancementStats.enhanced,
            unchangedCount: enhancementStats.unchanged,
            warningCount: enhancementStats.warnings,
            errorCount: enhancementStats.errors,
            isValid
        }
    }));
    
    return buildStageResult({
        stageId: 4,
        result: resultTokens,
        isValid: isValid,
        log: logs  // 统一的日志数组，按时间顺序保持所有日志
    });
    
    
    // ==================================================================================
    // Token增强流程完成！
    // 输入: S3的过滤后Token数组
    // 输出: 成功时返回增强后的Token数组，失败时返回空数组 + 完整的错误和警告信息
    // 设计原则: 有增强错误时不应该让后续阶段处理有问题的Token数据
    // ==================================================================================
}

/**
 * S4阶段主函数的时间统计包装器
 * 
 * @description
 * 这是s4_main_fn的包装器，负责添加执行时间统计。
 * 保持原函数的逻辑不变，只在外层添加时间测量。
 * 
 * @param s3Result - S3阶段的完整结果
 * @returns StageResult<EnhancedToken[]> 包含duration_ms字段的完整结果
 */
const s4_main_fn_with_time = (s3Result: StageResult<Token[]>): StageResult<EnhancedToken[]> => {
    const startTime = performance.now();
    
    // 调用原始的S4主函数
    const result = s4_main_fn(s3Result);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    };
};

export default s4_main_fn_with_time;