import { isNil, isString } from 'lodash';
import { buildStageResult, type StageResult } from '../../utils/stageResultBuilder.ts';
import {
    buildDebugMessage,
    LogType,
    type DebugMessage
} from '../../utils/debugLogBuilder.ts';
import type { StructureAssignedToken } from '../s6_structure_build/s6_types';
import type { ScoreMeta } from '../s5_state_assignment/s5_types';
import type { NoteParsedStructure } from './s7_types';
import { parseNoteToken } from './s7_utils/noteParser.ts';
import { parseSpecialNoteToken } from './s7_utils/specialNoteParser.ts';
import stageIdentifier from '../../types/stageIdentifier.ts';
import { STAGE_SKIP } from '../../types/commonTagTypes.ts';

// Re-export types for convenience
export type { NoteParsedStructure, NoteParsingResult } from './s7_types';

// S6阶段的输出类型定义
type S6ResultType = {
    score_meta: ScoreMeta;
    parts: Array<{
        tokens: StructureAssignedToken[];
        pid: number;
        is_explicit_part: boolean;
        part_meta: any;
    }>;
};

/**
 * S7阶段主函数：音符解析
 * 
 * @description 
 * 这是TonicML编译器的第七个阶段（S7），负责音符解析。
 * 接收S6阶段的结构化输出，进行音符解析处理。
 * 
 * @param s6Result - S6阶段的完整结果
 * @returns StageResult<NoteParsedStructure> 音符解析结果
 */
const s7_main_fn = (s6Result: StageResult<S6ResultType>): StageResult<NoteParsedStructure> => {
    const warnings: DebugMessage[] = [];
    const errors: DebugMessage[] = [];
    const info: DebugMessage[] = [];
    
    // 验证S6结果
    if (!s6Result.is_valid) {
        errors.push(buildDebugMessage({
            type: LogType.ERROR,
            tag: STAGE_SKIP,
            message: `S6_${stageIdentifier.s6}阶段失败，S7_${stageIdentifier.s7}阶段跳过处理。`
        }));
        return buildStageResult({
            stageId: 7,
            result: { parts: [], score_meta: {} },
            isValid: false,
            log: [...errors, ...warnings, ...info]
        });
    }
    
    // 记录接收到的S6数据统计
    const { score_meta, parts } = s6Result.result;
    info.push(buildDebugMessage({
        type: LogType.INFO,
        message: `S7开始处理：接收到${parts.length}个part`,
        tag: 'INFO'
    }));
    
    // 统计各part的tokens数量
    parts.forEach(part => {
        const noteCount = part.tokens.filter(token => !isNil(token.nid)).length;
        info.push(buildDebugMessage({
            type: LogType.INFO,
            message: `Part ${part.pid}: ${part.tokens.length}个tokens，其中${noteCount}个音符`,
            tag: 'INFO'
        }));
    });
    
    // 按照新的数据处理流程：完全复制一份数据，tokens数组先置空，然后遍历验证
    const result: NoteParsedStructure = {
        parts: parts.map(originalPart => {
            // 完全复制原始part，但tokens数组先置空
            const copiedPart = {
                ...originalPart,
                tokens: [] as StructureAssignedToken[]  // 清空tokens数组
            };
            
            let processedCount = 0;
            let noteTokenCount = 0;
            let specialTokenCount = 0;
            
            // 遍历原来的tokens数组
            originalPart.tokens.forEach(token => {
                try {
                    // 判断token类型并分发到不同的解析器
                    const tokenType = getTokenType(token);
                    
                    if (tokenType === 'note') {
                        // 普通音符token，分发到noteParser
                        const parsedToken = parseNoteToken(token);
                        copiedPart.tokens.push(parsedToken);
                        noteTokenCount++;
                        
                        info.push(buildDebugMessage({
                            type: LogType.INFO,
                            message: `Part ${originalPart.pid}: 解析普通音符token "${token.value}"`,
                            tag: 'INFO'
                        }));
                    } else if (tokenType === 'special') {
                        // 特殊音符token，分发到specialNoteParser
                        const parsedToken = parseSpecialNoteToken(token);
                        copiedPart.tokens.push(parsedToken);
                        specialTokenCount++;
                        
                        info.push(buildDebugMessage({
                            type: LogType.INFO,
                            message: `Part ${originalPart.pid}: 解析特殊音符token "${token.value}"`,
                            tag: 'INFO'
                        }));
                    } else {
                        // 不需要解析的token，原封不动push
                        copiedPart.tokens.push({ ...token });
                    }
                    
                    processedCount++;
                } catch (error: any) {
                    // 解析失败，记录错误但仍保留原token
                    errors.push(buildDebugMessage({
                        type: LogType.ERROR,
                        message: `Token解析失败: ${error.message}`,
                        tag: 'ERROR',
                        source: token.position
                    }));
                    copiedPart.tokens.push({ ...token });
                    processedCount++;
                }
            });
            
            info.push(buildDebugMessage({
                type: LogType.INFO,
                message: `Part ${originalPart.pid}: 处理了${processedCount}个tokens，其中${noteTokenCount}个普通音符，${specialTokenCount}个特殊音符`,
                tag: 'INFO'
            }));
            
            // 转换为 ParsedPart 结构
            return {
                id: `part_${originalPart.pid}`,
                sections: [],
                parsed_notes: [],
                commands: [],
                tokens: copiedPart.tokens
            };
        }),
        score_meta: score_meta || {}
    };
    
    info.push(buildDebugMessage({
        type: LogType.INFO,
        message: `S7阶段完成：处理了${parts.length}个part的音符解析，共处理${result.parts.reduce((sum, part) => sum + (part.tokens || []).length, 0)}个tokens`,
        tag: 'INFO'
    }));
    
    return buildStageResult({
        stageId: 7,
        result,
        isValid: true,
        log: [...errors, ...warnings, ...info]
    });
}

/**
 * S7阶段主函数的时间统计包装器
 * 
 * @description
 * 这是s7_main_fn的包装器，负责添加执行时间统计。
 * 保持原函数的逻辑不变，只在外层添加时间测量。
 * 
 * @param s6Result - S6阶段的完整结果
 * @returns StageResult<NoteParsedStructure> 包含duration_ms字段的完整结果
 */
const s7_main_fn_with_time = (s6Result: StageResult<S6ResultType>): StageResult<NoteParsedStructure> => {
    const startTime = performance.now();
    
    // 调用原始的S7主函数
    const result = s7_main_fn(s6Result);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // 在结果中添加时间统计
    return {
        ...result,
        duration_ms: durationMs
    };
};

/**
 * 判断token是否需要解析，以及需要哪种类型的解析
 * @param token - 需要判断的token
 * @returns 'note' | 'special' | null（null表示不需要解析）
 */
function getTokenType(token: StructureAssignedToken): 'note' | 'special' | null {
    // 判断是否为普通音符token
    if (!isNil(token.nid) && token.token === 'NOTE') {
        return 'note';
    }
    
    // 判断是否为特殊音符token（和弦、休止符等）
    if (token.token === 'CHORD_SCOPE_MARK' || 
        token.token === 'SPECIAL_NOTE' ||
        (isString(token.token) && token.token.includes('CHORD'))) {
        return 'special';
    }
    
    // 不需要解析的token
    return null;
}

export default s7_main_fn_with_time;
