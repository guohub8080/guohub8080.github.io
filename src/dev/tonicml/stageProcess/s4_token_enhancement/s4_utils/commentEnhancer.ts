// @注释增强器
import { Token } from '../../s2_basic_token_recognition/s2_types';
import { EnhancedToken, EnhancedTokenType } from '../s4_types';

// @注释增强处理函数
export const enhanceComment = (token: Token): EnhancedToken => {
  const { value } = token;
  
  // 1. @part 段落注释
  if (value === '@part') {
    return {
      position: token.position,
      token: EnhancedTokenType.COM_PART,
      value: 'part',       // 提取标记名
      character: token.value // 原始字符
    };
  }

  // 1.1. @part{内容} 段落注释带内容
  const partMatch = value.match(/^@part\{([^}]*)\}$/);
  if (partMatch) {
    const [, content] = partMatch;
    
    return {
      position: token.position,
      token: EnhancedTokenType.COM_PART,
      value: content,      // 提取段落内容
      character: token.value // 原始字符
    };
  }
  
  // 2. @phrase 乐句标记
  if (value === '@phrase') {
    return {
      position: token.position,
      token: EnhancedTokenType.COM_PHRASE,
      value: 'phrase',     // 提取标记名
      character: token.value // 原始字符
    };
  }

  // 2.1. @phrase{内容} 乐句标记带内容
  const phraseMatch = value.match(/^@phrase\{([^}]*)\}$/);
  if (phraseMatch) {
    const [, content] = phraseMatch;
    
    return {
      position: token.position,
      token: EnhancedTokenType.COM_PHRASE,
      value: content,      // 提取乐句内容
      character: token.value // 原始字符
    };
  }
  
  // 3. @measure 小节标记
  if (value === '@measure') {
    return {
      position: token.position,
      token: EnhancedTokenType.COM_MEASURE,
      value: 'measure',    // 提取标记名
      character: token.value // 原始字符
    };
  }

  // 3.1. @measure{内容} 小节标记带内容
  const measureMatch = value.match(/^@measure\{([^}]*)\}$/);
  if (measureMatch) {
    const [, content] = measureMatch;
    
    return {
      position: token.position,
      token: EnhancedTokenType.COM_MEASURE,
      value: content,      // 提取小节内容
      character: token.value // 原始字符
    };
  }
  
  // 4. @~标识符{内容} 区域注释语法糖  
  const sectionSugarWithContentMatch = value.match(/^@~([a-zA-Z][a-zA-Z0-9_]*)\{([^}]*)\}$/);
  if (sectionSugarWithContentMatch) {
    const [, sectionName, content] = sectionSugarWithContentMatch;
    const finalContent = `${sectionName}:${content}`;
    
    return {
      position: token.position,
      token: EnhancedTokenType.COM_SECTION,
      value: finalContent,  // 提取处理后的内容
      character: token.value // 原始字符
    };
  }
  
  // 5. @~标识符 区域注释语法糖（不带花括号）
  const sectionSugarMatch = value.match(/^@~([a-zA-Z][a-zA-Z0-9_]*)$/);
  if (sectionSugarMatch) {
    const [, sectionName] = sectionSugarMatch;
    
    return {
      position: token.position,
      token: EnhancedTokenType.COM_SECTION,
      value: sectionName,   // 提取段落名
      character: token.value // 原始字符
    };
  }
  
  // 6. @~ 单独出现时报错
  if (value === '@~') {
    return {
      position: token.position,
      token: EnhancedTokenType.COM_NORMAL,
      value: 'Invalid section syntax: @~ must be followed by identifier', // 错误信息
      character: token.value // 原始字符
    };
  }
  
  // 7. @section{内容} 区域注释（标准格式）
  const sectionMatch = value.match(/^@section\{([^}]*)\}$/);
  if (sectionMatch) {
    const [, content] = sectionMatch;
    
    return {
      position: token.position,
      token: EnhancedTokenType.COM_SECTION,
      value: content,       // 提取内容
      character: token.value // 原始字符
    };
  }
  
  // 8. @score{内容} 全局注释
  const scoreMatch = value.match(/^@score\{([^}]*)\}$/);
  if (scoreMatch) {
    const [, content] = scoreMatch;
    
    return {
      position: token.position,
      token: EnhancedTokenType.COM_SCORE,
      value: content,       // 提取注释内容
      character: token.value // 原始字符
    };
  }
  
  // 9. @{内容} 普通注释
  const normalMatch = value.match(/^@\{([^}]*)\}$/);
  if (normalMatch) {
    const [, content] = normalMatch;
    
    return {
      position: token.position,
      token: EnhancedTokenType.COM_NORMAL,
      value: content,       // 提取注释内容
      character: token.value // 原始字符
    };
  }
  
  // 10. 无法识别的@命令格式
  return {
    position: token.position,
    token: EnhancedTokenType.COM_NORMAL,
    value: 'Invalid format', // 错误信息
    character: token.value    // 原始字符
  };
};
