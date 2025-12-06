import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import {
    buildDebugMessage,
    LogType,
    type DebugMessage
} from '../../utils/debugLogBuilder.ts';
import type { BlockWithPosition } from './s1_types';
import { splitRoughBlocks, type SplitResult } from './s1_utils/roughBlockSplitter.ts';
import { filterRedundantBlocks, type FilterResult } from './s1_utils/redundantBlockFilter.ts';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_START, STAGE_END, STAGE_ERROR } from '../../types/commonTagTypes.ts';

// Re-export types for convenience
export type { BlockWithPosition } from './s1_types';

/**
 * S1阶段主函数（重构版）：分发器模式
 * 
 * @description 
 * 重构后的S1主函数采用分发器模式，将具体逻辑拆分到各个工具函数中。
 * 主函数只负责协调各个处理步骤，保持逻辑清晰和可维护性。
 * 
 * @param rawText - 要处理的原始文本字符串
 * @returns StageResult<BlockWithPosition[]> - 标准的阶段结果对象
 * 
 * @design_principles
 * 1. **分发器模式**：主函数只做协调，具体逻辑在utils中
 * 2. **函数式编程**：所有utils都不修改输入，返回新对象
 * 3. **逐步拆解**：按处理阶段拆分，便于测试和维护
 * 4. **统一接口**：所有utils遵循相同的输入输出规范
 * 
 * @processing_steps
 * 1. splitRoughBlocks: 基础分块，不加验证
 */
const s1_main_fn = (rawText: string): StageResult<BlockWithPosition[]> => {
    // 初始化日志收集器
    const logs: DebugMessage[] = [];

    // 记录阶段开始
    logs.push(buildDebugMessage({
        type: LogType.INFO,
        tag: STAGE_START,
        message: `S1_${stageIdentifier.s1} 开始。`
    }));

    // 基本输入验证：检查是否为空或只有空白字符
    if (rawText.trim().length === 0) {
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: "EMPTY_CONTENT",
            message: `输入文本为空或只包含空白字符，停止编译。`
        }));
        return buildStageResult({
            stageId: 1,
            result: [],
            isValid: false,
            log: logs,
            duration_ms: 0
        });
    }

    // ==================================================================================
    // 第一步：粗糙分块 - 纯粹的分块逻辑，不加任何验证
    // ==================================================================================
    
    const splitResult = splitRoughBlocks(rawText);
    const { blocks: roughBlocks, warnings: splitWarnings } = splitResult;
    
    // 合并分块过程中的警告
    logs.push(...splitWarnings);
    
    // 检查分块过程中是否有错误
    const hasErrors = splitWarnings.some(warning => warning.type === 'ERROR');
    if (hasErrors) {
        // 如果分块过程中有错误，直接返回失败结果
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_ERROR,
            message: `S1阶段在分块过程中发现错误，停止处理`
        }));
        
        return buildStageResult({
            stageId: 1,
            result: [],
            isValid: false,
            log: logs,
            duration_ms: 0
        });
    }
    
    // ==================================================================================
    // 第二步：冗余块过滤 - 移除多余的空行、逗号和分号，不进行任何验证
    // ==================================================================================
    
    const filterResult = filterRedundantBlocks(roughBlocks);
    const { blocks: cleanBlocks, warnings: filterWarnings } = filterResult;
    
    // 合并过滤过程中的警告
    logs.push(...filterWarnings);
    
    // 记录阶段完成
    logs.push(buildDebugMessage({
        type: LogType.INFO,
        tag: STAGE_END,
        message: `完成分块处理，最终得到${cleanBlocks.length}个block（原始：${roughBlocks.length}个）`,
        extra_data: { 
            finalBlockCount: cleanBlocks.length,
            originalBlockCount: roughBlocks.length,
            filteredCount: roughBlocks.length - cleanBlocks.length
        }
    }));

    // 构建并返回结果
    return buildStageResult({
        stageId: 1,
        result: cleanBlocks,
        isValid: true,
        log: logs,
        duration_ms: 0
    });
};

/**
 * S1阶段主函数的时间统计包装器
 * 
 * @description
 * 这是s1_main_fn的包装器，负责添加执行时间统计。
 * 保持原函数的逻辑不变，只在外层添加时间测量。
 * 
 * @param rawText - 要处理的原始文本字符串
 * @returns StageResult<BlockWithPosition[]> 包含duration_ms字段的完整结果
 */
const s1_main_fn_with_time = (rawText: string): StageResult<BlockWithPosition[]> => {
    const startTime = performance.now();

    // 调用原始的S1主函数
    const result = s1_main_fn(rawText);

    const endTime = performance.now();
    const durationMs = endTime - startTime;

    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    };
};

export default s1_main_fn_with_time;