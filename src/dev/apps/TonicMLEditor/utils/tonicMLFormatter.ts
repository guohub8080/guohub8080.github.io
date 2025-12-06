/**
 * TonicML 代码格式化工具
 * 
 * 主要功能：
 * 1. 规范化缩进
 * 2. 对齐命令和内容
 * 3. 清理多余空格
 * 4. 保留有意义的空行
 */

/**
 * 检查是否为元数据命令行
 */
const isMetaCommandLine = (line: string): boolean => {
  return /^\s*\$(?:title|author|style|genre|date|key|K|k|octave|O|o|clef|bpm|tempo|beat|time|part|P|p)\{/.test(line);
};

/**
 * 检查是否为段落标记行
 */
const isSectionLine = (line: string): boolean => {
  return /^\s*@(?:~(?:intro|verse|chorus|bridge|solo|outro|prechorus|interlude|coda)|section|sec|s|S)\{?/.test(line);
};

/**
 * 检查是否为小节标记行
 */
const isMeasureLine = (line: string): boolean => {
  return /^\s*@[Mm]\{/.test(line);
};

/**
 * 检查是否为乐句标记行
 */
const isPhraseLine = (line: string): boolean => {
  return /^\s*@(?:phrase|ph|f)\{/.test(line);
};

/**
 * 检查是否为注释行
 */
const isCommentLine = (line: string): boolean => {
  return /^\s*#/.test(line);
};

/**
 * 检查是否为空行
 */
const isEmptyLine = (line: string): boolean => {
  return /^\s*$/.test(line);
};

/**
 * 检查是否为音乐内容行（音符、和弦等）
 */
const isMusicContentLine = (line: string): boolean => {
  return /[A-Ga-g0-9\[\]\|]/.test(line);
};

/**
 * 格式化单行
 */
const formatLine = (line: string, context: 'meta' | 'section' | 'measure' | 'phrase' | 'music' | 'comment'): string => {
  // 移除行首和行尾的空白
  let formatted = line.trim();
  
  if (!formatted) {
    return '';
  }
  
  // 根据上下文添加适当的缩进
  switch (context) {
    case 'meta':
      // 元数据命令不缩进
      return formatted;
    
    case 'section':
      // 段落标记不缩进
      return formatted;
    
    case 'measure':
      // 小节标记缩进 1 级（2 空格）
      return '  ' + formatted;
    
    case 'phrase':
      // 乐句标记缩进 2 级（4 空格）
      return '    ' + formatted;
    
    case 'music':
      // 音乐内容缩进 3 级（6 空格）
      return '      ' + formatted;
    
    case 'comment':
      // 注释保持原样（不额外缩进）
      return formatted;
    
    default:
      return formatted;
  }
};

/**
 * 格式化 TonicML 代码
 */
export const formatTonicML = (code: string): string => {
  const lines = code.split('\n');
  const formatted: string[] = [];
  
  let currentContext: 'meta' | 'section' | 'measure' | 'phrase' | 'music' | 'comment' = 'meta';
  let previousLineWasEmpty = false;
  
  for (const line of lines) {
    // 检查空行
    if (isEmptyLine(line)) {
      // 避免连续多个空行
      if (!previousLineWasEmpty) {
        formatted.push('');
        previousLineWasEmpty = true;
      }
      continue;
    }
    
    previousLineWasEmpty = false;
    
    // 检查注释行
    if (isCommentLine(line)) {
      formatted.push(formatLine(line, 'comment'));
      continue;
    }
    
    // 检查元数据命令
    if (isMetaCommandLine(line)) {
      currentContext = 'meta';
      formatted.push(formatLine(line, currentContext));
      continue;
    }
    
    // 检查段落标记
    if (isSectionLine(line)) {
      currentContext = 'section';
      // 段落之间添加空行
      if (formatted.length > 0 && formatted[formatted.length - 1] !== '') {
        formatted.push('');
      }
      formatted.push(formatLine(line, currentContext));
      continue;
    }
    
    // 检查小节标记
    if (isMeasureLine(line)) {
      currentContext = 'measure';
      formatted.push(formatLine(line, currentContext));
      continue;
    }
    
    // 检查乐句标记
    if (isPhraseLine(line)) {
      currentContext = 'phrase';
      formatted.push(formatLine(line, currentContext));
      continue;
    }
    
    // 音乐内容行
    if (isMusicContentLine(line)) {
      currentContext = 'music';
      formatted.push(formatLine(line, currentContext));
      continue;
    }
    
    // 其他行保持原样
    formatted.push(line.trim());
  }
  
  // 移除末尾多余的空行
  while (formatted.length > 0 && formatted[formatted.length - 1] === '') {
    formatted.pop();
  }
  
  // 返回格式化后的代码
  return formatted.join('\n');
};

/**
 * 验证 TonicML 代码（简单检查）
 */
export const validateTonicML = (code: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const lines = code.split('\n');
  
  let hasTitle = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;
    
    // 跳过空行和注释
    if (isEmptyLine(line) || isCommentLine(line)) {
      continue;
    }
    
    // 检查是否有标题
    if (/^\$title\{/.test(line)) {
      hasTitle = true;
    }
    
    // 检查括号是否匹配
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`第 ${lineNum} 行: 括号不匹配`);
    }
    
    // 检查和弦括号
    const openChordBrackets = (line.match(/\[/g) || []).length;
    const closeChordBrackets = (line.match(/\]/g) || []).length;
    if (openChordBrackets !== closeChordBrackets) {
      errors.push(`第 ${lineNum} 行: 和弦括号不匹配`);
    }
  }
  
  // 建议添加标题（非强制）
  if (!hasTitle) {
    errors.push('建议添加 $title{...} 设置乐曲标题');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

