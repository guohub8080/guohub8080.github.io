import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import {
    buildDebugMessage,
    LogType,
    type DebugMessage
} from '../../utils/debugLogBuilder.ts';
import type { EnhancedToken } from '../s4_token_enhancement/s4_types';
import type { ProcessedPart, ScoreMeta, StateAssignmentError, PartMeta } from './s5_types';
import { splitTokensIntoHeadAndParts } from './s5_utils/splitter.ts';
import { processHeadStage } from './s5_utils/headStageProcessor.ts';
import { processPartStages } from './s5_utils/partStageProcessor.ts';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_SKIP } from '../../types/commonTagTypes.ts';

// Re-export types for convenience
export type { ProcessedPart, ScoreMeta, StateAssignmentError, StateAssignmentResult } from './s5_types';

/**
 * S5阶段主函数：对S4增强后的Token数组进行状态赋予
 * 
 * @description 
 * 这是TonicML编译器的第五个阶段（S5），负责对S4阶段增强后的Token数组进行状态赋予。
 * 将Token分为头部（Head）和声部（Part）两个部分，从头部提取全局元信息，
 * 为各个声部的音符Token赋予具体的音乐状态（调性、八度、拍号等）。
 * 
 * @param s4Result - S4阶段的完整结果，包含增强后的Token数组和状态信息
 * 
 * @returns StageResult<{score_meta: ScoreMeta, parts: ProcessedPart[]}> 包含以下信息的阶段结果：
 *   - result: {score_meta, parts} - 乐谱元信息和处理后的声部数组
 *   - is_valid: boolean - 状态赋予是否成功
 *   - stage_id: number - 阶段ID（固定为5）
 *   - stage_identifier: string - 阶段标识符
 *   - warning: DebugMessage[] - 警告信息数组
 *   - error: DebugMessage[] - 错误信息数组
 *   - info: DebugMessage[] - 调试信息数组
 * 
 * @example
 * ```typescript
 * const s4Result = s4_main_fn(s3Result);
 * const s5Result = s5_main_fn(s4Result);
 * // 返回包含乐谱元信息和状态赋予后的声部数据
 * ```
 * 
 * @processing_rules
 * 1. **Head/Part分离**：将Token分为头部信息和声部内容
 * 2. **元信息提取**：从头部Token提取全局设置（标题、调性、速度等）
 * 3. **状态继承**：各声部从全局元信息继承初始状态
 * 4. **状态更新**：声部内的SET命令更新局部状态
 * 5. **状态赋予**：为核心元素（音符）赋予当前状态
 * 
 * @validation_checks
 * - S4结果验证：如果S4失败，直接返回失败结果
 * - 空Token数组：如果S4成功但没有Token，使用默认配置
 * - 元信息冲突检查：检测重复设置的元信息
 * 
 * @error_handling
 * - S4失败时直接返回失败结果
 * - S5只返回自己的调试信息，不继承S4的错误和警告
 * - 状态赋予错误不会完全阻止流程，但会影响最终有效性
 * 
 * @performance
 * - 时间复杂度：O(n) 其中n是Token数量
 * - 空间复杂度：O(n) 用于存储状态赋予结果
 * 
 * @since S5阶段重构后
 * @author guohub8080
 */
const s5_main_fn = (s4Result: StageResult<EnhancedToken[]>): StageResult<{score_meta: ScoreMeta, parts: ProcessedPart[]}> => {
    // ==================================================================================
    // 第五阶段第一步：S4结果验证和准备工作
    // ==================================================================================
    
    /** 步骤1.1：初始化调试信息收集器 */
    const warnings: DebugMessage[] = [];
    const errors: DebugMessage[] = [];
    const info: DebugMessage[] = [];
    
    /** 步骤1.2：验证S4阶段结果的有效性 */
    // 如果S4阶段失败，直接返回失败状态，不进行任何处理
    if (!s4Result.is_valid) {
        errors.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S4_${stageIdentifier.s4}阶段失败，S5_${stageIdentifier.s5}阶段跳过处理。`
        }));
        
        // S5只返回自己的调试信息，不继承S4的错误和警告
        return buildStageResult({
            stageId: 5,
            result: { score_meta: createDefaultMeta(), parts: [] },
            isValid: false,
            log: [...errors, ...warnings, ...info]
        });
    }
    
    /** 步骤1.3：提取S4的Token数组 */
    const enhancedTokens = s4Result.result || [];
    
    // 如果S4成功但没有产生任何Token，使用默认配置
    if (enhancedTokens.length === 0) {
        warnings.push(buildDebugMessage({
            type: LogType.WARNING,
            message: `S4阶段成功但未产生任何Token，使用默认配置。`,
            tag: 'EMPTY_TOKENS'
        }));
        
        return buildStageResult({
            stageId: 5,
            result: { score_meta: createDefaultMeta(), parts: [] },
            isValid: true,
            log: [...errors, ...warnings, ...info]
        });
    }
    
    // ==================================================================================
    // 第五阶段第二步：Token分离（Head/Part）
    // ==================================================================================
    
    /** 步骤2.1：将Token分离为Head和Part部分 */
    const { head_token_list, part_token_list } = splitTokensIntoHeadAndParts(enhancedTokens);
    
    // ==================================================================================
    // 第五阶段第三步：Head阶段处理（提取元信息）
    // ==================================================================================
    
    /** 步骤3.1：处理Head阶段，确定乐谱元信息 */
    let score_meta: ScoreMeta;
    let headErrors: StateAssignmentError[] = [];
    let headWarnings: StateAssignmentError[] = [];
    
    if (head_token_list.length === 0) {
        // 如果Head为空，使用默认元信息
        score_meta = createDefaultMeta();
        
        // 添加默认值警告
        headWarnings.push({
            message: '没有头部信息，使用默认值',
            errorType: 'MISSING_REQUIRED_STATE' as any,
            severity: 'warning'
        });
    } else {
        // 处理Head Token列表
        const headResult = processHeadStage(head_token_list);
        
        // 如果Head阶段有错误，直接返回停止
        if (!headResult.isValid) {
            errors.push(buildDebugMessage({
                type: LogType.ERROR,
                message: `Head阶段处理失败，停止后续处理`,
                tag: 'HEAD_ERROR'
            }));
            
            // 转换StateAssignmentError为DebugMessage
            for (const error of headResult.errors) {
                errors.push(buildDebugMessage({
                    type: LogType.ERROR,
                    message: error.message,
                    tag: 'HEAD_ERROR',
                    extra_data: {
                        position: error.position,
                        errorType: error.errorType
                    }
                }));
            }
            
            for (const warning of headResult.warnings) {
                warnings.push(buildDebugMessage({
                    type: LogType.WARNING,
                    message: warning.message,
                    tag: 'HEAD_WARNING',
                    extra_data: {
                        position: warning.position,
                        errorType: warning.errorType
                    }
                }));
            }
            
            return buildStageResult({
                stageId: 5,
                result: { score_meta: headResult.scoreMeta, parts: [] },
                isValid: false,
                log: [...errors, ...warnings, ...info]
            });
        }
        
        score_meta = headResult.scoreMeta;
        headErrors = headResult.errors;
        headWarnings = headResult.warnings;
    }
    
    // ==================================================================================
    // 第五阶段第四步：Part阶段处理（状态赋予）
    // ==================================================================================
    
    /** 步骤4.1：处理各个Part的Token并赋予状态 */
    let processedParts: ProcessedPart[] = [];
    let partErrors: StateAssignmentError[] = [];
    let partWarnings: StateAssignmentError[] = [];
    
    if (part_token_list.length === 0) {
        // 如果没有任何part token（连默认part都没有），说明整个输入只有head内容
        info.push(buildDebugMessage({
            type: LogType.INFO,
            message: `只有头部内容，没有声部内容，返回空的parts数组。`,
            tag: 'NO_PARTS'
        }));
    } else {
        // 调用 processPartStages 处理所有parts
        // 注意：即使没有明确的SET_PART命令，splitter也会创建一个默认part
        const partResult = processPartStages(part_token_list, score_meta, headErrors, headWarnings);
        
        // 将处理结果转换为 ProcessedPart[] 格式
        processedParts = partResult.partResults.map((partTokens, index) => {
            const partTokenArray = part_token_list[index];
            const isExplicit = hasSetPartCommand(partTokenArray);
            const extracted_part_meta = partResult.partMetas[index];
            
            // 根据用户需求的逻辑：检查第一个token是否为SET_PART
            let partName = "default part"; // 默认名称
            if (isExplicit) {
                // 如果第一个有效token是SET_PART，使用其值作为name
                const setPartToken = getFirstSetPartToken(partTokenArray);
                if (setPartToken && setPartToken.value) {
                    partName = setPartToken.value;
                }
            }
            
            // 合并SET_PART的名称和SET_PART_ATTR中提取的属性
            // 确保固定结构，优先使用SET_PART_ATTR_NAME，否则使用SET_PART的值或默认值
            const final_part_meta: PartMeta = {
                ...extracted_part_meta,  // SET_PART_ATTR中提取的属性（已包含所有字段）
                name: extracted_part_meta.name || partName  // 优先使用SET_PART_ATTR_NAME，否则使用SET_PART的值或默认值
            };
            
            return {
                tokens: partTokens,
                pid: index + 1,
                is_explicit_part: isExplicit,
                part_meta: final_part_meta
            };
        });
        
        partErrors = partResult.errors;
        partWarnings = partResult.warnings;
        
        info.push(buildDebugMessage({
            type: LogType.INFO,
            message: `成功处理了 ${processedParts.length} 个声部。`,
            tag: 'PARTS_PROCESSED',
            extra_data: { partCount: processedParts.length }
        }));
    }
    
    // ==================================================================================
    // 第五阶段第五步：后处理和结果构建  
    // ==================================================================================
    
    /** 步骤5.1：转换所有阶段的错误为调试消息 */
    // 将Head阶段的StateAssignmentError转换为DebugMessage格式
    for (const error of headErrors) {
        errors.push(buildDebugMessage({
            type: LogType.ERROR,
            message: error.message,
            tag: 'HEAD_ERROR',
            extra_data: {
                position: error.position,
                errorType: error.errorType
            }
        }));
    }
    
    for (const warning of headWarnings) {
        warnings.push(buildDebugMessage({
            type: LogType.WARNING,
            message: warning.message,
            tag: 'HEAD_WARNING',
            extra_data: {
                position: warning.position,
                errorType: warning.errorType
            }
        }));
    }
    
    // 将Part阶段的StateAssignmentError转换为DebugMessage格式
    for (const error of partErrors) {
        errors.push(buildDebugMessage({
            type: LogType.ERROR,
            message: error.message,
            tag: 'PART_ERROR',
            extra_data: {
                position: error.position,
                errorType: error.errorType
            }
        }));
    }
    
    for (const warning of partWarnings) {
        warnings.push(buildDebugMessage({
            type: LogType.WARNING,
            message: warning.message,
            tag: 'PART_WARNING',
            extra_data: {
                position: warning.position,
                errorType: warning.errorType
            }
        }));
    }
    
    /** 步骤5.2：构建最终结果 */
    // Head和Part处理完成，基于所有错误判断有效性
    const isValid = headErrors.length === 0 && partErrors.length === 0;
    const result = {
        score_meta: score_meta,
        parts: processedParts
    };
    
    return buildStageResult({
        stageId: 5,
        result,
        isValid,
        log: [...errors, ...warnings, ...info]  // S5的所有日志信息
    });
    
    // ==================================================================================
    // 状态赋予流程完成！
    // 输入: S4的增强后Token数组
    // 输出: 乐谱元信息 + 状态赋予后的声部数组
    // ==================================================================================
}

/**
 * 检查part token数组的第一个有效token是否为SET_PART命令
 * 跳过NEWLINE等无效token
 * 
 * 注意：由于head函数的拆分逻辑，所有在第一个结束head的token（核心元素、结构性注释、SET_PART）
 * 之前的NEWLINE都会被包含在head中，因此part的第一个元素肯定不是NEWLINE。
 * 但是保留NEWLINE跳过逻辑作为防御性编程。
 */
function hasSetPartCommand(partTokens: EnhancedToken[]): boolean {
    // 找到第一个有效的token（跳过换行符，虽然理论上part第一个不会是NEWLINE）
    for (let i = 0; i < partTokens.length; i++) {
        const token = partTokens[i];
        const tokenType = 'token' in token ? token.token : token.type;
        // 跳过NEWLINE token
        if (tokenType === 'NEWLINE') {
            continue;
        }
        // 找到第一个有效token，检查是否为SET_PART
        return tokenType === 'SET_PART';
    }
    // 如果没有找到任何有效token，返回false
    return false;
}

/**
 * 获取part token数组中的第一个SET_PART token
 * 跳过NEWLINE等无效token
 */
function getFirstSetPartToken(partTokens: EnhancedToken[]): EnhancedToken | null {
    // 找到第一个有效的token（跳过换行符）
    for (let i = 0; i < partTokens.length; i++) {
        const token = partTokens[i];
        const tokenType = 'token' in token ? token.token : token.type;
        // 跳过NEWLINE token
        if (tokenType === 'NEWLINE') {
            continue;
        }
        // 找到第一个有效token，如果是SET_PART则返回
        if (tokenType === 'SET_PART') {
            return token;
        }
        // 如果第一个有效token不是SET_PART，则没有SET_PART
        break;
    }
    return null;
}

/**
 * 创建默认的乐谱元信息
 */
function createDefaultMeta(): ScoreMeta {
    return {
        title: null,
        author: null,
        date: null,
        genre: null,
        description: null,
        tempo: '100',      // 默认值
        key: 'C',         // 默认值
        octave: 4,        // 默认值
        time_signature: '4/4', // 默认值
        score_comment: []
    };
}

/**
 * S5阶段主函数的时间统计包装器
 * 
 * @description
 * 这是s5_main_fn的包装器，负责添加执行时间统计。
 * 保持原函数的逻辑不变，只在外层添加时间测量。
 * 
 * @param s4Result - S4阶段的完整结果
 * @returns StageResult<{score_meta: ScoreMeta, parts: ProcessedPart[]}> 包含duration_ms字段的完整结果
 */
const s5_main_fn_with_time = (s4Result: StageResult<EnhancedToken[]>): StageResult<{score_meta: ScoreMeta, parts: ProcessedPart[]}> => {
    const startTime = performance.now();
    
    // 调用原始的S5主函数
    const result = s5_main_fn(s4Result);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    };
};

export default s5_main_fn_with_time;