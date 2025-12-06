// TonicML 编译器 - 统一入口文件

import { isNil } from 'lodash';
import type { StageResult } from './utils/stageResultBuilder.ts';
import { buildErrorStageResult } from './utils/stageResultBuilder.ts';
import { buildDebugMessage, LogType } from './utils/debugLogBuilder.ts';
import type { DebugMessage } from './utils/debugLogBuilder.ts';
import s1_main_fn from './stageProcess/s1_text_to_blocks';
import s2_main_fn from './stageProcess/s2_basic_token_recognition';
import s3_main_fn from './stageProcess/s3_syntax_error_filtration';
import s4_main_fn from './stageProcess/s4_token_enhancement';
import s5_main_fn from './stageProcess/s5_state_assignment';
import s6_main_fn from './stageProcess/s6_structure_build';
import s7_main_fn from './stageProcess/s7_note_parse';
import s8_main_fn from './stageProcess/s8_score_validation';
import s9_main_fn from './stageProcess/s9_chord_phrase';
import s10_main_fn from './stageProcess/s10_final_build';

// ==================================================================================
// 导出类型定义
// ==================================================================================

export type { Position, Token, TokenType } from './stageProcess/s2_basic_token_recognition';
export { isCoreElement, isTokenCoreElement, CoreElementTypes } from './stageProcess/s2_basic_token_recognition';
export type { BlockWithPosition } from './stageProcess/s1_text_to_blocks/s1_types';
export type { SyntaxError, ErrorFilterResult } from './stageProcess/s3_syntax_error_filtration';
export type { EnhancedToken } from './stageProcess/s4_token_enhancement';
export type { StateAssignmentResult, ScoreMeta } from './stageProcess/s5_state_assignment';
export type { MusicalStructure } from './stageProcess/s6_structure_build';
export type { NoteParsedStructure, NoteParsingResult } from './stageProcess/s7_note_parse';
export type { ValidatedScoreStructure, ScoreValidationResult } from './stageProcess/s8_score_validation';
export type { ChordPhraseStructure, ChordPhraseResult } from './stageProcess/s9_chord_phrase';
export type { FinalBuildStructure, FinalBuildResult } from './stageProcess/s10_final_build';
export type { UnifiedStageResult } from './types/commonTypes.ts';
export type { StageResult, DebugMessage };

// ==================================================================================
// TonicML 编译器类
// ==================================================================================

/**
 * TonicML 编译器主类
 * 
 * @description
 * 这个类封装了整个TonicML编译流程，提供了统一的接口来管理所有编译阶段的结果。
 */
export class TonicMLCompiler {
    // ==================================================================================
    // 私有属性 - 内部状态管理
    // ==================================================================================
    
    /** 原始输入文本 */
    private readonly rawText: string;
    
    /** 各阶段的结果存储 */
    private stages: Record<number, StageResult<any>> = {};
    
    /** 编译是否已完成 */
    private isCompiled: boolean = false;
    
    /** 编译开始时间（用于计算总耗时） */
    private compilationStartTime?: number;
    
    /** 编译结束时间 */
    private compilationEndTime?: number;
    
    
    // ==================================================================================
    // 私有帮助函数 - 日志过滤
    // ==================================================================================
    
    /**
     * 从日志数组中过滤指定类型的消息
     */
    private filterLogsByType(logs: DebugMessage[], type: LogType): DebugMessage[] {
        return logs.filter(log => log.type === type);
    }
    
    /**
     * 从StageResult中提取指定类型的日志
     */
    private getLogsFromStage(stage: StageResult<any>, type: LogType): DebugMessage[] {
        return this.filterLogsByType(stage.log || [], type);
    }
    
    // ==================================================================================
    // 构造函数和核心编译方法
    // ==================================================================================
    
    /**
     * 创建编译器实例
     */
    constructor(rawText: string) {

        
        this.rawText = rawText;
    }
    
    /**
     * 执行完整的编译流程
     */
    compile(): this {
        if (this.isCompiled) {
            throw new Error('编译器已经执行过编译，请创建新实例。');
        }
        
        this.compilationStartTime = performance.now();
        
        // 执行各个编译阶段（按顺序执行，不因失败而中断）
        this.runStage1();  // 文本转块
        this.runStage2();  // 基本Token识别
        this.runStage3();  // 语法错误过滤
        this.runStage4();  // Token增强
        this.runStage5();  // 状态赋予
        this.runStage6();  // 结构构建
        this.runStage7();  // 音符解析
        this.runStage8();  // 乐谱验证
        this.runStage9();  // 和弦短语
        this.runStage10(); // 最终构建
        
        this.compilationEndTime = performance.now();
        this.isCompiled = true;
        
        return this;
    }
    
    
    // ==================================================================================
    // 公共信息访问方法
    // ==================================================================================
    
    /**
     * 获取最终编译结果
     */
    getResult<T = any>(): T | null {
        this.ensureCompiled();
        
        // 返回最后一个有效阶段的结果
        const lastStage = this.getLastValidStage();
        return lastStage ? lastStage.result : null;
    }
    
    /**
     * 获取指定阶段的结果
     */
    getStageResult(stageId: number): StageResult<any> | null {
        this.ensureCompiled();
        return this.stages[stageId] || null;
    }
    
    /**
     * 为消息添加 stage 前缀标签
     * 例如：STAGE_START -> S1_STAGE_START
     */
    private addStagePrefix(messages: DebugMessage[], stageId: number): DebugMessage[] {
        return messages.map(msg => ({
            ...msg,
            tag: msg.tag ? `S${stageId}_${msg.tag}` : `S${stageId}_MESSAGE`
        }));
    }
    
    /**
     * 获取所有错误信息
     */
    getErrors(stageId?: number): DebugMessage[] {
        this.ensureCompiled();
        
        if (!isNil(stageId)) {
            const stage = this.stages[stageId];
            const errors = stage ? this.getLogsFromStage(stage, LogType.ERROR) : [];
            return this.addStagePrefix(errors, stageId);
        }
        
        // 返回所有阶段的错误
        const allErrors: DebugMessage[] = [];
        Object.entries(this.stages).forEach(([id, stage]) => {
            const stageErrors = this.getLogsFromStage(stage, LogType.ERROR);
            allErrors.push(...this.addStagePrefix(stageErrors, Number(id)));
        });
        return allErrors;
    }
    
    /**
     * 获取所有警告信息
     */
    getWarnings(stageId?: number): DebugMessage[] {
        this.ensureCompiled();
        
        if (!isNil(stageId)) {
            const stage = this.stages[stageId];
            const warnings = stage ? this.getLogsFromStage(stage, LogType.WARNING) : [];
            return this.addStagePrefix(warnings, stageId);
        }
        
        const allWarnings: DebugMessage[] = [];
        Object.entries(this.stages).forEach(([id, stage]) => {
            const stageWarnings = this.getLogsFromStage(stage, LogType.WARNING);
            allWarnings.push(...this.addStagePrefix(stageWarnings, Number(id)));
        });
        return allWarnings;
    }
    
    /**
     * 获取调试信息
     */
    getInfo(stageId?: number): DebugMessage[] {
        this.ensureCompiled();
        
        if (!isNil(stageId)) {
            const stage = this.stages[stageId];
            const info = stage ? this.getLogsFromStage(stage, LogType.INFO) : [];
            return this.addStagePrefix(info, stageId);
        }
        
        const allInfo: DebugMessage[] = [];
        Object.entries(this.stages).forEach(([id, stage]) => {
            const stageInfo = this.getLogsFromStage(stage, LogType.INFO);
            allInfo.push(...this.addStagePrefix(stageInfo, Number(id)));
        });
        return allInfo;
    }
    
    /**
     * 检查编译是否成功
     */
    isValid(): boolean {
        this.ensureCompiled();
        
        // 检查是否有任何阶段失败
        for (const stage of Object.values(this.stages)) {
            if (!stage.is_valid) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * 获取指定阶段的耗时
     */
    getStageDuration(stageId: number): number | null {
        this.ensureCompiled();
        const stage = this.stages[stageId];
        return stage?.duration_ms || null;
    }
    
    /**
     * 获取总编译耗时
     */
    getTotalDuration(): number | null {
        this.ensureCompiled();
        
        if (this.compilationStartTime && this.compilationEndTime) {
            return this.compilationEndTime - this.compilationStartTime;
        }
        return null;
    }
    
    /**
     * 获取所有阶段的耗时统计
     */
    getAllDurations(): Record<number, number> {
        this.ensureCompiled();
        
        const durations: Record<number, number> = {};
        Object.entries(this.stages).forEach(([stageId, stage]) => {
            if (!isNil(stage.duration_ms)) {
                durations[Number(stageId)] = stage.duration_ms;
            }
        });
        return durations;
    }
    
    /**
     * 获取编译统计信息
     */
    getStats() {
        this.ensureCompiled();
        
        return {
            totalStages: Object.keys(this.stages).length,
            validStages: Object.values(this.stages).filter(s => s.is_valid).length,
            totalErrors: this.getErrors().length,
            totalWarnings: this.getWarnings().length,
            totalDuration: this.getTotalDuration(),
            stageDurations: this.getAllDurations(),
            inputLength: this.rawText.length,
            isValid: this.isValid()
        };
    }
    
    
    // ==================================================================================
    // 私有辅助方法
    // ==================================================================================
    
    /**
     * 确保编译已完成，否则抛出错误
     */
    private ensureCompiled(): void {
        if (!this.isCompiled) {
            throw new Error('请先调用 compile() 方法完成编译。');
        }
    }
    
    /**
     * 获取最后一个有效的阶段结果
     */
    private getLastValidStage(): StageResult<any> | null {
        let lastValidStage: StageResult<any> | null = null;
        
        Object.values(this.stages).forEach(stage => {
            if (stage.is_valid) {
                lastValidStage = stage;
            }
        });
        
        return lastValidStage;
    }
    
    /**
     * 执行第一阶段：文本转块
     */
    private runStage1(): void {
        this.stages[1] = s1_main_fn(this.rawText);
    }
    
    /**
     * 执行第二阶段：基本Token识别
     */
    private runStage2(): void {
        this.stages[2] = s2_main_fn(this.stages[1]);
    }
    
    /**
     * 执行第三阶段：语法错误过滤
     */
    private runStage3(): void {
        this.stages[3] = s3_main_fn(this.stages[2]);
    }
    
    /**
     * 执行第四阶段：Token增强
     */
    private runStage4(): void {
        this.stages[4] = s4_main_fn(this.stages[3]);
    }
    
    /**
     * 执行第五阶段：状态赋予
     */
    private runStage5(): void {
        this.stages[5] = s5_main_fn(this.stages[4]);
    }
    
    /**
     * 执行第六阶段：结构构建
     */
    private runStage6(): void {
        this.stages[6] = s6_main_fn(this.stages[5]);
    }
    
    /**
     * 执行第七阶段：音符解析
     */
    private runStage7(): void {
        this.stages[7] = s7_main_fn(this.stages[6]);
    }
    
    /**
     * 执行第八阶段：乐谱验证
     */
    private runStage8(): void {
        this.stages[8] = s8_main_fn(this.stages[7]);
    }
    
    /**
     * 执行第九阶段：和弦短语
     */
    private runStage9(): void {
        this.stages[9] = s9_main_fn(this.stages[8]);
    }
    
    /**
     * 执行第十阶段：最终构建
     */
    private runStage10(): void {
        this.stages[10] = s10_main_fn(this.stages[9]);
    }
}

// ==================================================================================
// 工厂函数 - 看起来像普通函数，实际返回类实例
// ==================================================================================

/**
 * 编译TonicML源码 - 工厂函数
 * 
 * @description
 * 这是一个工厂函数，从外部看起来像普通函数调用，但内部创建并返回TonicMLCompiler实例。
 * 提供了更简洁的使用方式，同时保持完整的类功能。
 * 
 * @example
 * ```typescript
 * // 看起来像普通函数调用
 * const result = compile("1 2{key=C} 3\n4");
 * 
 * // 但实际可以使用完整的类方法
 * if (result.isValid()) {
 *   // 编译成功处理
 * } else {
 *   // 编译失败处理
 * }
 * ```
 */
export function compile(rawText: string): TonicMLCompiler {
  return new TonicMLCompiler(rawText).compile();
}