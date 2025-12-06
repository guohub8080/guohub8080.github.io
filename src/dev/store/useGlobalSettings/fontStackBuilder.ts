/**
 * 字体堆栈构建工具
 * 负责根据用户设置构建完整的 font-family 堆栈
 */

/**
 * 展开分片字体的辅助函数 - 所有 range（用于中文）
 * 将单个字体名展开为多个 range 字体
 */
const expandAllRanges = (fontName: string): string[] => {
  // 检查是否是分片字体（minsans-v, syht-cn-v, syst-cn-v）
  if (['minsans-v', 'syht-cn-v', 'syst-cn-v'].includes(fontName)) {
    // 可变字体不需要分片，直接返回字体名
    return [`'${fontName}'`];
  }
  // 其他字体直接返回
  return [`'${fontName}'`];
};

/**
 * 展开分片字体的 range-0（用于英文）
 * 可变字体使用 unicode-range 自动分片，直接返回字体名即可
 */
const expandEnglishRange = (fontName: string): string[] => {
  // 直接返回字体名，浏览器会根据 unicode-range 自动加载需要的分片
  return [`'${fontName}'`];
};

/**
 * 构建字体堆栈的辅助函数（用于中文，展开所有 range）
 */
const buildFullFontStack = (primaryFont: string | null, fallbackFonts: string[] = []): string => {
  const fonts = [];
  if (primaryFont) {
    // 展开所有分片字体 range
    fonts.push(...expandAllRanges(primaryFont));
  }
  fonts.push(...fallbackFonts);
  return fonts.join(', ');
};

/**
 * 系统字体 fallback 列表（不包含自定义 web 字体）
 */
const SYSTEM_FONTS = [
  'PingFang SC',
  'Hiragino Sans GB',
  'Microsoft YaHei',
  'WenQuanYi Micro Hei',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'sans-serif'
];

/**
 * 系统等宽字体 fallback 列表
 */
const SYSTEM_MONOSPACE_FONTS = [
  'ui-monospace',
  'SFMono-Regular',
  'Consolas',
  'Liberation Mono',
  'Menlo',
  'monospace'
];

/**
 * 日文字体映射：中文字体 -> 对应的日文字体
 */
const CHINESE_TO_JAPANESE_FONT_MAP: Record<string, string> = {
  'minsans-v': 'minsans-v',      // MiSans 中日通用
  'syht-cn-v': 'syht-jp-v',      // 思源黑体 CN -> JP
  'syst-cn-v': 'syst-jp-v',      // 思源宋体 CN -> JP
};

/**
 * 构建主题字体堆栈
 */
export const buildThemeFontStack = (
  chineseFontFamily: string | null,
  englishFontFamily: string | null
): string => {
  if (!chineseFontFamily) {
    // 中文选择系统默认：不使用任何自定义字体，直接使用系统字体
    if (!englishFontFamily) {
      // 英文也跟随中文：只用系统字体
      return SYSTEM_FONTS.join(', ');
    } else {
      // 英文设置了：英文字体（只用 range-0）+ 系统字体
      const englishFonts = expandEnglishRange(englishFontFamily);
      return [...englishFonts, ...SYSTEM_FONTS].join(', ');
    }
  } else {
    // 中文设置了自定义字体
    if (!englishFontFamily) {
      // 英文跟随中文：使用中文字体的所有 range + 系统字体
      return buildFullFontStack(chineseFontFamily, SYSTEM_FONTS);
    } else {
      // 英文设置了：英文字体（只用 range-0）+ 中文字体（所有 range）+ 系统字体
      const englishFonts = expandEnglishRange(englishFontFamily);
      const chineseFonts = expandAllRanges(chineseFontFamily);
      return [...englishFonts, ...chineseFonts, ...SYSTEM_FONTS].join(', ');
    }
  }
};

/**
 * 构建代码字体堆栈
 * 智能字体栈逻辑：
 * 1. 如果code有设置，优先使用code设置（只用range-0），然后fallback中文
 * 2. 如果code没有设置，而英文有设置，先英文，再fallback中文
 * 3. 如果都没有设置，按中文的字符来
 */
export const buildCodeFontStack = (
  codeFontFamily: string | null,
  themeFontStack: string,
  chineseFontFamily: string | null,
  englishFontFamily: string | null
): string => {
  const fonts = [];
  
  if (codeFontFamily && codeFontFamily !== 'system') {
    // 情况1：code有设置，优先使用code设置（只用range-0）
    const codeFonts = expandEnglishRange(codeFontFamily);
    fonts.push(...codeFonts);
    
    // 然后fallback中文（如果中文有设置）
    if (chineseFontFamily) {
      const chineseFonts = expandAllRanges(chineseFontFamily);
      fonts.push(...chineseFonts);
    }
    
    // 最后fallback系统字体
    fonts.push(...SYSTEM_MONOSPACE_FONTS);
    
  } else if (!codeFontFamily && englishFontFamily) {
    // 情况2：code没有设置，而英文有设置，先英文，再fallback中文
    const englishFonts = expandEnglishRange(englishFontFamily);
    fonts.push(...englishFonts);
    
    // fallback中文（如果中文有设置）
    if (chineseFontFamily) {
      const chineseFonts = expandAllRanges(chineseFontFamily);
      fonts.push(...chineseFonts);
    }
    
    // 最后fallback系统字体
    fonts.push(...SYSTEM_MONOSPACE_FONTS);
    
  } else {
    // 情况3：都没有设置，按中文的字符来
    if (chineseFontFamily) {
      const chineseFonts = expandAllRanges(chineseFontFamily);
      fonts.push(...chineseFonts);
    }
    
    // fallback系统字体
    fonts.push(...SYSTEM_MONOSPACE_FONTS);
  }
  
  return fonts.join(', ');
};

/**
 * 构建日文字体堆栈
 * 逻辑：
 * 1. 如果日文有设置，直接使用日文字体
 * 2. 中文字体作为 fallback
 * 3. 最后 fallback 到系统字体
 */
export const buildJapaneseFontStack = (
  japaneseFontFamily: string | null,
  chineseFontFamily: string | null
): string => {
  const fonts = [];
  
  // 日文字体
  if (japaneseFontFamily) {
    fonts.push(`'${japaneseFontFamily}'`);
  }
  
  // 中文字体作为 fallback
  if (chineseFontFamily) {
    fonts.push(`'${chineseFontFamily}'`);
  }
  
  // 最后 fallback 到系统字体
  fonts.push(...SYSTEM_FONTS);
  
  return fonts.join(', ');
};
