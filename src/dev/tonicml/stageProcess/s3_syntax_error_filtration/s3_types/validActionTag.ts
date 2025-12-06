/**
 * 合法的 Action Tag 定义
 * 
 * 这个文件定义了所有在 TonicML 中被认为是合法的 action 命令标签
 * 在 S3 语法过滤阶段会验证用户输入的 action 是否在此列表中
 */

// ============================================================================
// 基础信息 Action Tags
// ============================================================================

/** 乐谱元信息相关的 action tag（不区分大小写） */
export const SCORE_META_TAGS = [
  'title',        // 作品标题 $title{}
  'author',       // 作者 $author{}
  'date',         // 时间记录 $date{}
  'description',  // 描述信息 $description{}
  'style',        // 曲风/流派 $style{}
  'genre',        // 曲风/流派 $genre{} (style 的别名)
] as const;

// ============================================================================
// 音乐属性 Action Tags
// ============================================================================

/** 调性相关的 action tag */
export const KEY_TAGS = [
  'key',  // 调性 $key{}
  'k',    // 调性简写 $k{} (key 的别名)
] as const;

/** 八度相关的 action tag */
export const OCTAVE_TAGS = [
  'octave',  // 八度 $octave{}
  'o',       // 八度简写 $o{} (octave 的别名)
] as const;

/** 速度相关的 action tag */
export const TEMPO_TAGS = [
  'tempo',  // 速度 $tempo{}
  'bpm',    // 速度 $bpm{} (tempo 的别名)
] as const;

/** 拍号相关的 action tag */
export const TIME_SIGNATURE_TAGS = [
  'time',  // 拍号 $time{}
  'beat',  // 拍号 $beat{} (time 的别名)
] as const;

/** 谱号相关的 action tag */
export const CLEF_TAGS = [
  'clef',  // 谱号 $clef{}
] as const;

// ============================================================================
// 声部相关 Action Tags
// ============================================================================

/** 声部定义的 action tag */
export const PART_DEFINITION_TAGS = [
  'part',  // 声部定义 $part{}
  'p',     // 声部定义简写 $p{} (part 的别名)
] as const;

/** 声部属性的 property name（用于 $p.xxx{} 或 $part.xxx{} 格式） */
export const PART_PROPERTY_NAMES = [
  'name',          // 声部完整名称 $p.name{}
  'abbr',          // 声部缩写 $p.abbr{}
  'instrument',    // 乐器 $p.instrument{}
  'midi-channel',  // MIDI通道 $p.midi-channel{}
  'midi-program',  // MIDI音色 $p.midi-program{}
  'volume',        // 音量 $p.volume{}
  'pan',           // 声像 $p.pan{}
  'clef',          // 谱号 $p.clef{}
] as const;

// ============================================================================
// 合并所有合法的基础 Action Tags
// ============================================================================

/** 所有合法的基础 action tag（不包括声部属性格式）*/
export const VALID_ACTION_TAGS = [
  ...SCORE_META_TAGS,
  ...KEY_TAGS,
  ...OCTAVE_TAGS,
  ...TEMPO_TAGS,
  ...TIME_SIGNATURE_TAGS,
  ...CLEF_TAGS,
  ...PART_DEFINITION_TAGS,
] as const;

// ============================================================================
// 类型定义
// ============================================================================

export type ValidActionTag = typeof VALID_ACTION_TAGS[number];
export type ValidPartPropertyName = typeof PART_PROPERTY_NAMES[number];

// ============================================================================
// 验证函数
// ============================================================================

/**
 * 检查给定的 action tag 是否合法（不区分大小写）
 * @param tag - 要检查的 action tag（不含 $ 前缀）
 * @returns 是否为合法的 action tag
 */
export const isValidActionTag = (tag: string): boolean => {
  const lowerTag = tag.toLowerCase();
  return (VALID_ACTION_TAGS as readonly string[]).some(
    validTag => validTag.toLowerCase() === lowerTag
  );
};

/**
 * 检查给定的声部属性名是否合法（不区分大小写）
 * @param propertyName - 要检查的属性名
 * @returns 是否为合法的声部属性名
 */
export const isValidPartPropertyName = (propertyName: string): boolean => {
  const lowerName = propertyName.toLowerCase();
  return (PART_PROPERTY_NAMES as readonly string[]).some(
    validName => validName.toLowerCase() === lowerName
  );
};

/**
 * 解析 action 命令，判断其格式和合法性
 * @param actionValue - action 的完整值（含 $ 前缀）
 * @returns 解析结果
 */
export interface ActionParseResult {
  isValid: boolean;           // 是否为合法的 action
  format: 'basic' | 'part_property' | 'invalid';  // action 格式类型
  actionName?: string;        // 基础 action 名称（如果是基础格式）
  partPrefix?: string;        // 声部前缀（如果是声部属性格式，如 'p' 或 'part'）
  propertyName?: string;      // 属性名称（如果是声部属性格式）
  parameter?: string;         // 参数内容
  errorReason?: string;       // 如果不合法，错误原因
}

/**
 * 解析并验证 action 命令
 * @param actionValue - action 的完整值（含 $ 前缀，如 "$title{xxx}" 或 "$p.name{xxx}"）
 * @returns 解析结果
 * 
 * @note S2 阶段已经保证传入的 ACTION token 一定以 $ 开头，所以这里不需要检查
 */
export const parseAndValidateAction = (actionValue: string): ActionParseResult => {
  const withoutDollar = actionValue.slice(1); // 去掉 $
  
  // 尝试匹配声部属性格式：$p.xxx{...} 或 $part.xxx{...}（不区分大小写）
  const partPropertyMatch = withoutDollar.match(/^(p|part)\.([\w-]+)\{([^}]*)\}$/i);
  if (partPropertyMatch) {
    const [, partPrefix, propertyName, parameter] = partPropertyMatch;
    const isValidProperty = isValidPartPropertyName(propertyName);
    
    // 提取命令名部分：$p.xxx 或 $part.xxx
    const commandOnly = `$${partPrefix}.${propertyName}`;
    
    return {
      isValid: isValidProperty,
      format: 'part_property',
      partPrefix,
      propertyName,
      parameter,
      errorReason: isValidProperty ? undefined : `发现未知的命令：\`${commandOnly}\``
    };
  }
  
  // 尝试匹配基础 action 格式：$xxx{...}
  const basicActionMatch = withoutDollar.match(/^([a-zA-Z_]+)\{([^}]*)\}$/);
  if (basicActionMatch) {
    const [, actionName, parameter] = basicActionMatch;
    const isValidAction = isValidActionTag(actionName);
    
    // 提取命令名部分：$xxx
    const commandOnly = `$${actionName}`;
    
    return {
      isValid: isValidAction,
      format: 'basic',
      actionName,
      parameter,
      errorReason: isValidAction ? undefined : `发现未知的命令：\`${commandOnly}\``
    };
  }
  
  // 如果两种格式都不匹配，提取命令名部分（去掉大括号内容）
  const commandOnly = actionValue.split('{')[0];
  
  return {
    isValid: false,
    format: 'invalid',
    errorReason: `发现未知的命令：\`${commandOnly}\``
  };
};
