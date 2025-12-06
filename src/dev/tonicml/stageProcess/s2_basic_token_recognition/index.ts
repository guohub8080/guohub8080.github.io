import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../utils/debugLogBuilder.ts';
import type { BlockWithPosition } from '../s1_text_to_blocks/s1_types';
import type { Token } from './s2_types';
import { TokenType } from './s2_types';
import { parseBlock } from './s2_utils/blockParser.ts';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_START, STAGE_END, STAGE_SKIP } from '../../types/commonTagTypes.ts';
import byDefault from '../../utils/byDefault.ts';
import { 
  type S2TokenType, 
  isS2TokenType,
  type CommonTokenType,
  type BasicTokenType 
} from '../../types/tokenTypes.ts';

// Re-export types for convenience (保持兼容性)
export type { Token, Position, TokenType } from './s2_types';
export { isCoreElement, isTokenCoreElement, CoreElementTypes } from './s2_types';

// 新的类型约束导出
export type { S2TokenType, CommonTokenType, BasicTokenType } from '../../types/tokenTypes.ts';

// S2阶段约束的Token接口 - 只能产生S2TokenType
export interface S2Token {
  position: {
    line: number;     // 行号（从1开始）
    column: number;   // 列号（从1开始）
    offset: number;   // 字符偏移量（从0开始）
    length: number;   // Token长度（字符数）
  };
  type: S2TokenType;  // 只能是CommonTokenType或BasicTokenType
  value: string;      // 原始文本内容
}

// S2阶段输出格式定义 - 使用新的类型约束
export type S2OutputFormat = S2Token;

// 类型断言：确保S2输出的Token数组符合类型约束
export type S2Result = StageResult<S2Token[]>;

/**
 * S2阶段主函数：将S1的块数组转换为Token数组
 * 
 * @description 
 * 这是TonicML编译器的第二个阶段（S2），负责将S1阶段产生的块数组转换为语义化的基本Token数组。
 * 每个块根据其内容被识别为不同类型的Token（动作、注释、音符等），并进行必要的拆分处理。
 * 
 * @param s1Result - S1阶段的完整结果，包含块数组和状态信息
 * 
 * @returns StageResult<Token[]> 包含以下信息的阶段结果：
 *   - result: Token[] - 解析出的Token数组
 *   - is_valid: boolean - 解析是否成功
 *   - stage_id: number - 阶段ID（固定为2）
 *   - stage_identifier: string - 阶段标识符
 *   - log: DebugMessage[] - 统一的日志数组，包含所有类型的调试信息（ERROR、WARNING、INFO等）
 *   - duration_ms: number - 阶段处理耗时，以毫秒为单位
 * 
 * @example
 * ```typescript
 * const s1Result = s1_main_fn("$tempo 1\n\n\n2");
 * const s2Result = s2_main_fn(s1Result);
 * 
 * // 返回Token数组，每个Token的详细格式如下：
 * // [
 * //   {
 * //     position: { line: 1, column: 1, offset: 0, length: 6 },
 * //     type: "ACTION",
 * //     value: "$tempo"
 * //   },
 * //   {
 * //     position: { line: 1, column: 8, offset: 7, length: 1 },
 * //     type: "NOTE", 
 * //     value: "1"
 * //   },
 * //   {
 * //     position: { line: 1, column: 9, offset: 8, length: 1 },
 * //     type: "NEWLINE",
 * //     value: "\n"
 * //   },
 * //   {
 * //     position: { line: 4, column: 1, offset: 11, length: 1 },
 * //     type: "NOTE",
 * //     value: "2"
 * //   }
 * // ]
 * // 
 * // 注意：连续的换行符和break被简化，每种类型只保留第一个
 * ```
 * 
 * @token_format
 * S2阶段输出的每个Token都包含以下三个标准字段：
 * 
 * **position**: Position对象，包含精确的源码位置信息
 *   - line: number     - 行号（从1开始）
 *   - column: number   - 列号（从1开始）
 *   - offset: number   - 字符偏移量（从0开始）
 *   - length: number   - Token长度（字符数）
 * 
 * **type**: TokenType枚举值，标识Token的语义类型
 *   - "ACTION"           - 动作指令（如 $tempo, $key）
 *   - "NOTE"             - 音符内容（如 1, 2, 3{key=C}）
 *   - "COMMENT"          - 注释内容（如 @这是注释）
 *   - "NEWLINE"          - 换行符
 *   - "MEASURE_BREAK"    - 小节间断（,）
 *   - "PHRASE_BREAK"     - 乐句间断（;）
 *   - "TIE_START"        - 连线开始（(）
 *   - "TIE_END"          - 连线结束（)）
 *   - "SPECIAL_NOTE"     - 特殊音符（如 &rest）
 *   - "CHORD_SCOPE_MARK" - 和弦作用域标记（如 [scope]）
 * 
 * **value**: string，Token的原始文本内容
 *   - 保持与源码完全一致的字符串
 *   - 包含所有原始的空格、符号、参数等
 * 
 * @processing_rules
 * 1. **块类型识别**：根据块的开头字符识别类型（$=动作, @=注释, &=特殊音符等）
 * 2. **单块转换**：每个block直接转换为对应的token，不再拆分
 * 3. **连线处理**：单独的括号()被识别为连线标记
 * 4. **位置保持**：所有Token都保持精确的源码位置信息
 * 5. **简化流程**：S1已完成主要拆分工作，S2只做类型识别
 * 
 * @validation_checks
 * - S1结果验证：如果S1失败，直接返回失败结果
 * - 空块数组：如果S1成功但没有块，报错（异常情况）
 * 
 * @error_handling
 * - S1失败时直接返回失败结果
 * - S2只返回自己的调试信息，不继承S1的错误和警告
 * - S2特有的警告和错误信息
 * 
 * @performance
 * - 时间复杂度：O(n*m) 其中n是块数量，m是平均块长度
 * - 空间复杂度：O(n) 用于存储Token数组
 * - 自动记录处理耗时，结果包含在StageResult的duration_ms字段中
 * 
 * @since S2阶段重构后
 * @author guohub8080
 */
const s2_main_fn = (s1Result: StageResult<BlockWithPosition[]>): S2Result => {
    // 初始化日志收集器
    const logs: DebugMessage[] = [];

    // 第一步：验证S1阶段结果的有效性
    if (!s1Result.is_valid) {
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S1_${stageIdentifier.s1}阶段失败，S2_${stageIdentifier.s2}阶段跳过处理。`
        }));
        return buildStageResult({
            stageId: 2,
            result: [],
            isValid: false,
            log: logs
        }) as S2Result;
    }

    // 记录阶段开始（只有S1有效时才开始）
    logs.push(buildDebugMessage({
        type: LogType.INFO,
        tag: STAGE_START,
        message: `S2_${stageIdentifier.s2} 开始。`
    }));
    
    // 提取S1的块数组
    const blocks = byDefault(s1Result.result, []);
    
    // 如果S1成功但没有产生任何块，这是异常情况
    if (blocks.length === 0) {
        logs.push(buildDebugMessage({
            type: LogType.ERROR,
            tag:"UNEXPECTED_ERROR",
            message: `S1_${stageIdentifier.s1}阶段声称成功但未产生任何块，这是异常情况。`
        }));
        return buildStageResult({
            stageId: 2,
            result: [],
            isValid: false,
            log: logs
        }) as S2Result;
    }
    
    // 逐块解析为Token
    const rawTokens: S2Token[] = [];
    
    for (const block of blocks) {
        const token = parseBlock(block);
        
        // parseBlock只产生有效的S2TokenType，无需验证
        
        // 所有token直接使用，不再拆分NOTE类型
        rawTokens.push(token as S2Token);
    }
    
    // S2不进行过滤，直接使用所有转换后的tokens
    const tokens = rawTokens;
    
    // parseBlock只产生有效的S2TokenType，无需最终验证

    // 记录阶段完成
    logs.push(buildDebugMessage({
        type: LogType.INFO,
        tag: STAGE_END,
        message: `S2完成: 转换了${tokens.length}个Token（输入块：${blocks.length}个）`,
        extra_data: { 
            tokenCount: tokens.length,
            inputBlockCount: blocks.length
        }
    }));
    
    // 构建最终结果
    const result = buildStageResult({
        stageId: 2,
        result: tokens,
        isValid: true,
        log: logs
    });
    
    return result as S2Result;
    
    // ==================================================================================
    // Token化流程完成！
    // 输入: S1的块数组
    // 输出: 语义化的Token数组 + S2的调试信息
    // 特性: 简单的块到token转换，保持1:1对应关系
    // 
    // S3阶段接口保证：
    // - result 数组中的每个元素都是标准的 Token 对象
    // - 每个 Token 包含 {type, value, position} 三个必需字段
    // - position 包含 {line, column, offset, length} 完整位置信息
    // - type 为 TokenType 枚举值，确保类型安全
    // ==================================================================================
}

/**
 * S2阶段主函数的时间统计包装器
 * 
 * @description
 * 这是s2_main_fn的包装器，负责添加执行时间统计。
 * 保持原函数的逻辑不变，只在外层添加时间测量。
 * 
 * @param s1Result - S1阶段的完整结果
 * @returns S2Result 包含duration_ms字段的完整结果
 */
const s2_main_fn_with_time = (s1Result: StageResult<BlockWithPosition[]>): S2Result => {
    const startTime = performance.now();
    
    // 调用原始的S2主函数
    const result = s2_main_fn(s1Result);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    } as S2Result;
};

export default s2_main_fn_with_time;