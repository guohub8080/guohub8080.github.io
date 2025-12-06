// 编译器各阶段通用的Result接口设计 - 简化版本

// 简单统一的阶段结果接口
export interface UnifiedStageResult<TResult = any> {
  result: TResult;      // 主要处理结果（数组或对象）  
  isValid: boolean;     // 是否成功/有效
}

// 各阶段的具体类型定义
export type S1Result = UnifiedStageResult<any[]>;        // blocks数组
export type S2Result = UnifiedStageResult<any[]>;        // tokens数组  
export type S3Result = UnifiedStageResult<any[]>;        // filteredTokens数组
export type S4Result = UnifiedStageResult<any[]>;        // enhancedTokens数组
export type S5Result = UnifiedStageResult<{              // 复合结果
  parts: any[];
  scoreMeta: any;
}>;
export type S6Result = UnifiedStageResult<{              // 复合结果
  structure: any;
}>;

// 便利函数：创建成功结果
export function createSuccessResult<T>(result: T): UnifiedStageResult<T> {
  return {
    result,
    isValid: true
  };
}

// 便利函数：创建失败结果
export function createErrorResult<T>(defaultResult: T): UnifiedStageResult<T> {
  return {
    result: defaultResult,
    isValid: false
  };
}
