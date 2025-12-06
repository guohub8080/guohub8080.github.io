/**
 * 合法的 Comment Tag 定义
 * 
 * 这个文件定义了所有在 TonicML 中被认为是合法的注释标签
 * 在 S3 语法过滤阶段会验证用户输入的注释是否在此列表中
 */

// ============================================================================
// 注释类型 Tags
// ============================================================================

/** 结构化注释标签（可以不带参数或带参数） */
export const STRUCTURED_COMMENT_TAGS = [
  'part',     // 段落注释 @part 或 @part{内容}
  'phrase',   // 乐句标记 @phrase 或 @phrase{内容}
  'measure',  // 小节标记 @measure 或 @measure{内容}
] as const;

/** 必须带参数的注释标签 */
export const PARAMETERIZED_COMMENT_TAGS = [
  'section',  // 区域注释 @section{内容}
  'score',    // 全局注释 @score{内容}
] as const;

// ============================================================================
// 合并所有合法的 Comment Tags
// ============================================================================

/** 所有合法的命名注释标签 */
export const VALID_COMMENT_TAGS = [
  ...STRUCTURED_COMMENT_TAGS,
  ...PARAMETERIZED_COMMENT_TAGS,
] as const;

// ============================================================================
// 类型定义
// ============================================================================

export type ValidCommentTag = typeof VALID_COMMENT_TAGS[number];
export type StructuredCommentTag = typeof STRUCTURED_COMMENT_TAGS[number];
export type ParameterizedCommentTag = typeof PARAMETERIZED_COMMENT_TAGS[number];

// ============================================================================
// 验证函数
// ============================================================================

/**
 * 检查给定的 comment tag 是否合法（不区分大小写）
 * @param tag - 要检查的 comment tag（不含 @ 前缀）
 * @returns 是否为合法的 comment tag
 */
export const isValidCommentTag = (tag: string): boolean => {
  const lowerTag = tag.toLowerCase();
  return (VALID_COMMENT_TAGS as readonly string[]).some(
    validTag => validTag.toLowerCase() === lowerTag
  );
};

/**
 * 检查是否为结构化注释（可以不带参数）
 * @param tag - 要检查的 comment tag
 * @returns 是否为结构化注释
 */
export const isStructuredComment = (tag: string): boolean => {
  const lowerTag = tag.toLowerCase();
  return (STRUCTURED_COMMENT_TAGS as readonly string[]).some(
    validTag => validTag.toLowerCase() === lowerTag
  );
};

/**
 * 检查是否为必须带参数的注释
 * @param tag - 要检查的 comment tag
 * @returns 是否必须带参数
 */
export const isParameterizedComment = (tag: string): boolean => {
  const lowerTag = tag.toLowerCase();
  return (PARAMETERIZED_COMMENT_TAGS as readonly string[]).some(
    validTag => validTag.toLowerCase() === lowerTag
  );
};

/**
 * 解析 comment 命令，判断其格式和合法性
 * @param commentValue - comment 的完整值（含 @ 前缀）
 * @returns 解析结果
 */
export interface CommentParseResult {
  isValid: boolean;              // 是否为合法的 comment
  format: 'named' | 'section_sugar' | 'generic' | 'invalid';  // comment 格式类型
  commentName?: string;          // 注释名称（如果是命名格式）
  parameter?: string;            // 参数内容
  errorReason?: string;          // 如果不合法，错误原因
}

/**
 * 解析并验证 comment 命令
 * @param commentValue - comment 的完整值（含 @ 前缀，如 "@part{xxx}" 或 "@{xxx}"）
 * @returns 解析结果
 * 
 * @note S2 阶段已经保证传入的 COMMENT token 一定以 @ 开头，所以这里不需要检查
 * 
 * @规则说明
 * 只允许三种格式：
 * 1. 通用注释：@{} 或 @{内容}
 * 2. 语法糖：@~标识符 或 @~标识符{内容}
 * 3. 命名注释：@part, @part{}, @section{}, @phrase{} 等合法的命名注释
 * 
 * 其他任何格式都是非法的，会被拦截
 */
export const parseAndValidateComment = (commentValue: string): CommentParseResult => {
  const withoutAt = commentValue.slice(1); // 去掉 @
  
  // 格式1：通用注释 @{...}（空内容也可以）
  const genericMatch = withoutAt.match(/^\{([^}]*)\}$/);
  if (genericMatch) {
    const [, content] = genericMatch;
    return {
      isValid: true,
      format: 'generic',
      parameter: content
    };
  }
  
  // 格式2：语法糖 @~标识符 或 @~标识符{...}
  if (withoutAt.startsWith('~')) {
    // @~标识符{内容}
    const sectionSugarWithContentMatch = withoutAt.match(/^~([a-zA-Z][a-zA-Z0-9_]*)\{([^}]*)\}$/);
    if (sectionSugarWithContentMatch) {
      const [, sectionName, content] = sectionSugarWithContentMatch;
      return {
        isValid: true,
        format: 'section_sugar',
        commentName: 'section',
        parameter: `${sectionName}:${content}`
      };
    }
    
    // @~标识符（不带花括号）
    const sectionSugarMatch = withoutAt.match(/^~([a-zA-Z][a-zA-Z0-9_]*)$/);
    if (sectionSugarMatch) {
      const [, sectionName] = sectionSugarMatch;
      return {
        isValid: true,
        format: 'section_sugar',
        commentName: 'section',
        parameter: sectionName
      };
    }
    
    // @~ 单独出现或格式错误
    const commandOnly = commentValue.split('{')[0];
    return {
      isValid: false,
      format: 'invalid',
      errorReason: `发现未知的注释：\`${commandOnly}\`（@~ 后面必须跟字母开头的标识符）`
    };
  }
  
  // 格式3：命名注释 @xxx 或 @xxx{...}
  // 先尝试匹配带参数的格式：@xxx{...}
  const namedWithParamMatch = withoutAt.match(/^([a-zA-Z]+)\{([^}]*)\}$/);
  if (namedWithParamMatch) {
    const [, commentName, parameter] = namedWithParamMatch;
    const isValidName = isValidCommentTag(commentName);
    
    if (!isValidName) {
      const commandOnly = `@${commentName}`;
      return {
        isValid: false,
        format: 'named',
        commentName,
        parameter,
        errorReason: `发现未知的注释：\`${commandOnly}\``
      };
    }
    
    return {
      isValid: true,
      format: 'named',
      commentName,
      parameter
    };
  }
  
  // 再尝试匹配不带参数的格式：@xxx
  const namedWithoutParamMatch = withoutAt.match(/^([a-zA-Z]+)$/);
  if (namedWithoutParamMatch) {
    const [, commentName] = namedWithoutParamMatch;
    
    // 检查是否为合法的注释名
    if (!isValidCommentTag(commentName)) {
      const commandOnly = `@${commentName}`;
      return {
        isValid: false,
        format: 'named',
        commentName,
        errorReason: `发现未知的注释：\`${commandOnly}\``
      };
    }
    
    // 检查是否为必须带参数的注释类型
    if (isParameterizedComment(commentName)) {
      const commandOnly = `@${commentName}`;
      return {
        isValid: false,
        format: 'named',
        commentName,
        errorReason: `注释 \`${commandOnly}\` 必须带参数，格式应为 \`${commandOnly}{内容}\``
      };
    }
    
    // 结构化注释可以不带参数
    return {
      isValid: true,
      format: 'named',
      commentName,
      parameter: undefined
    };
  }
  
  // 如果所有三种格式都不匹配，则是非法格式
  const commandOnly = commentValue.split('{')[0];
  
  return {
    isValid: false,
    format: 'invalid',
    errorReason: `发现未知的注释：\`${commandOnly}\``
  };
};

