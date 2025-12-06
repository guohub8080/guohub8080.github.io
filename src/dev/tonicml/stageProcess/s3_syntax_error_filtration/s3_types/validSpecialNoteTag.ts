/**
 * 合法的 Special Note Tag 定义
 * 
 * 这个文件定义了所有在 TonicML 中被认为是合法的特殊音符标签
 * 在 S3 语法过滤阶段会验证用户输入的特殊音符是否在此列表中
 */

// ============================================================================
// 特殊音符类型 Tags
// ============================================================================

/** 合法的特殊音符标签 */
export const VALID_SPECIAL_NOTE_TAGS = [
  'c',  // &c{...} 和弦 (chord)
  't',  // &t{...} 连音 (tuplet) - 三连音、五连音等
] as const;

// ============================================================================
// 类型定义
// ============================================================================

export type ValidSpecialNoteTag = typeof VALID_SPECIAL_NOTE_TAGS[number];

// ============================================================================
// 验证函数
// ============================================================================

/**
 * 检查给定的特殊音符 tag 是否合法（不区分大小写）
 * @param tag - 要检查的特殊音符 tag（不含 & 前缀）
 * @returns 是否为合法的特殊音符 tag
 */
export const isValidSpecialNoteTag = (tag: string): boolean => {
  const lowerTag = tag.toLowerCase();
  return (VALID_SPECIAL_NOTE_TAGS as readonly string[]).some(
    validTag => validTag.toLowerCase() === lowerTag
  );
};

/**
 * 解析特殊音符，判断其格式和合法性
 * @param specialNoteValue - 特殊音符的完整值（含 & 前缀）
 * @returns 解析结果
 */
export interface SpecialNoteParseResult {
  isValid: boolean;         // 是否为合法的特殊音符
  noteTag?: string;         // 特殊音符标签（如 'c', 't'）
  parameter?: string;       // 参数内容
  errorReason?: string;     // 如果不合法，错误原因
}

/**
 * 解析并验证特殊音符
 * @param specialNoteValue - 特殊音符的完整值（含 & 前缀，如 "&c{...}" 或 "&t{...}"）
 * @returns 解析结果
 * 
 * @note S2 阶段已经保证传入的 SPECIAL_NOTE token 一定以 & 开头，所以这里不需要检查
 * 
 * @规则说明
 * 特殊音符格式：&x{...} 或 &x（其中 x 是单个字母标签）
 * - &c{...} - 和弦
 * - &t{...} - 连音
 */
export const parseAndValidateSpecialNote = (specialNoteValue: string): SpecialNoteParseResult => {
  const withoutAmpersand = specialNoteValue.slice(1); // 去掉 &
  
  // 格式1：带参数格式 &x{...}
  const withParamMatch = withoutAmpersand.match(/^([a-zA-Z])\{([^}]*)\}$/);
  if (withParamMatch) {
    const [, noteTag, parameter] = withParamMatch;
    const isValidTag = isValidSpecialNoteTag(noteTag);
    
    if (!isValidTag) {
      const commandOnly = `&${noteTag}`;
      return {
        isValid: false,
        noteTag,
        parameter,
        errorReason: `发现未知的特殊音符：\`${commandOnly}\``
      };
    }
    
    return {
      isValid: true,
      noteTag,
      parameter
    };
  }
  
  // 格式2：不带参数格式 &x（虽然通常需要参数，但在语法层面允许）
  const withoutParamMatch = withoutAmpersand.match(/^([a-zA-Z])$/);
  if (withoutParamMatch) {
    const [, noteTag] = withoutParamMatch;
    const isValidTag = isValidSpecialNoteTag(noteTag);
    
    if (!isValidTag) {
      const commandOnly = `&${noteTag}`;
      return {
        isValid: false,
        noteTag,
        errorReason: `发现未知的特殊音符：\`${commandOnly}\``
      };
    }
    
    return {
      isValid: true,
      noteTag,
      parameter: undefined
    };
  }
  
  // 格式3：多字符标签（不支持）
  const multiCharMatch = withoutAmpersand.match(/^([a-zA-Z]+)/);
  if (multiCharMatch) {
    const [, tag] = multiCharMatch;
    const commandOnly = `&${tag}`;
    return {
      isValid: false,
      noteTag: tag,
      errorReason: `发现未知的特殊音符：\`${commandOnly}\`（特殊音符标签必须是单个字母）`
    };
  }
  
  // 其他格式错误
  const commandOnly = specialNoteValue.split('{')[0];
  return {
    isValid: false,
    errorReason: `发现未知的特殊音符：\`${commandOnly}\``
  };
};

