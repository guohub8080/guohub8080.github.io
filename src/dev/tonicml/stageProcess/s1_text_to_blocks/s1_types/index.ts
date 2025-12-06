/**
 * S1阶段类型定义
 * 文本转换为块（带位置信息）阶段的所有类型定义
 */

// 带位置信息的Block
export interface BlockWithPosition {
    value: string;
    line: number;        // 行号（从1开始）
    column: number;      // 列号（从1开始）
    offset: number;      // 在原始文本中的绝对位置（从0开始）
    length: number;      // block的长度
    contains_braces: boolean;  // 是否包含花括号
}
