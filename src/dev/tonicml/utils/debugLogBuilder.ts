// 调试日志构建器 - 提供统一格式的调试信息

import { isNil } from 'lodash';

// 日志类型枚举
export enum LogType {
  ERROR = 'ERROR',
  WARNING = 'WARNING', 
  SUGGESTION = 'SUGGESTION',
  INFO = 'INFO'
}

// 源码信息接口 - 严格只包含代码位置和内容
export interface DebugSource {
  line?: number;           // 行号
  column?: number;         // 列号
  offset?: number;         // 字符偏移量
  character?: string;      // 相关字符内容
}

// 标准调试信息接口 - 新增tag字段
export interface DebugMessage {
  type: LogType;                        // 日志类型：ERROR、WARNING、SUGGESTION、INFO
  tag: string;                          // 标签字段，用于分类或标记
  message: string;                      // 日志消息内容
  source?: DebugSource | null;          // 可选的源码位置信息
  extra_data?: Record<string, any>;     // 可选的额外数据
}

// 构建调试信息的参数接口
export interface BuildDebugMessageParams {
  type: LogType;
  message: string;
  tag?: string;
  source?: DebugSource | null;
  extra_data?: Record<string, any>;
}

// 统一的调试信息构建函数
export function buildDebugMessage(
  params: BuildDebugMessageParams
): DebugMessage {
  const { type, message, tag = '', source, extra_data } = params;
  
  const debugMsg: DebugMessage = {
    type,
    tag,
    message
  };

  if (!isNil(source)) {
    debugMsg.source = source;
  }

  if (extra_data) {
    debugMsg.extra_data = extra_data;
  }

  return debugMsg;
}


// 按类型统计消息数量
export function countMessagesByType(messages: DebugMessage[]): Record<LogType, number> {
  const counts = {
    [LogType.ERROR]: 0,
    [LogType.WARNING]: 0,
    [LogType.SUGGESTION]: 0,
    [LogType.INFO]: 0
  };
  
  messages.forEach(msg => {
    counts[msg.type]++;
  });
  
  return counts;
}
