// $动作增强器
import { Token } from '../../s2_basic_token_recognition/s2_types';
import { EnhancedToken, EnhancedTokenType } from '../s4_types';

// $动作增强处理函数
export const enhanceAction = (token: Token): EnhancedToken => {
  const { value } = token;
  
  // 首先检查声部属性命令格式 $p.属性{值} 或 $part.属性{值}（不区分大小写）
  const partPropertyMatch = value.match(/^\$(p|part)\.([\w-]+)\{([^}]*)\}$/i);
  if (partPropertyMatch) {
    const [, , propertyName, parameter] = partPropertyMatch;
    return enhancePartPropertyCommand(token, propertyName, parameter);
  }
  
  // 普通动作格式 $动作{参数}
  const actionMatch = value.match(/^\$([a-zA-Z_]+)\{([^}]*)\}$/);
  if (!actionMatch) {
    return {
      position: token.position,
      token: EnhancedTokenType.UNKNOWN_ACTION,
      value: 'Invalid format', // 错误信息
      character: token.value    // 原始字符
    };
  }
  
  const [, actionName, parameter] = actionMatch;
  
  return enhanceBasicAction(token, actionName, parameter);
};

// 处理基础动作
const enhanceBasicAction = (token: Token, actionName: string, parameter: string): EnhancedToken => {
  const lowerName = actionName.toLowerCase();
  
  switch (lowerName) {
    // 基础信息动作
    case 'title':
      return createEnhancedAction(token, EnhancedTokenType.SET_TITLE, 'title', parameter);
    case 'author':
      return createEnhancedAction(token, EnhancedTokenType.SET_AUTHOR, 'author', parameter);
    case 'date':
      return createEnhancedAction(token, EnhancedTokenType.SET_DATE, 'date', parameter);
    case 'description':
      return createEnhancedAction(token, EnhancedTokenType.SET_DESCRIPTION, 'description', parameter);
    case 'style':
    case 'genre':
      return createEnhancedAction(token, EnhancedTokenType.SET_GENRE, 'genre', parameter);
    
    // 调性动作 - 支持多种别名
    case 'key':
    case 'k':
      return createEnhancedAction(token, EnhancedTokenType.SET_KEY, 'key', parameter);
    
    // 八度动作 - 支持多种别名
    case 'octave':
    case 'o':
      return createEnhancedAction(token, EnhancedTokenType.SET_OCTAVE, 'octave', parameter);
    
    // 速度动作 - 支持多种别名 (tempo和bpm都映射到SET_BPM)
    case 'tempo':
    case 'bpm':
      return createEnhancedAction(token, EnhancedTokenType.SET_BPM, 'bpm', parameter);
    
    // 拍号动作 - 支持多种别名 (time和beat都映射到SET_BEAT)
    case 'time':
    case 'beat':
      return createEnhancedAction(token, EnhancedTokenType.SET_BEAT, 'beat', parameter);
    
    // 谱号动作
    case 'clef':
      return createEnhancedAction(token, EnhancedTokenType.SET_CLEF, 'clef', parameter);
    
    // 声部定义命令 - 支持多种别名
    case 'part':
    case 'p':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART, 'part', parameter);
    
    default:
      return {
        position: token.position,
        token: EnhancedTokenType.UNKNOWN_ACTION,
        value: `Unknown action type: ${actionName}`, // 错误信息
        character: token.value // 原始字符
      };
  }
};

// 处理声部属性命令
const enhancePartPropertyCommand = (token: Token, propertyName: string, parameter: string): EnhancedToken => {
  const lowerPropertyName = propertyName.toLowerCase();
  
  switch (lowerPropertyName) {
    case 'name':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART_ATTR_NAME, 'part_name', parameter);
    case 'abbr':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART_ATTR_ABBR, 'part_abbreviation', parameter);
    case 'instrument':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART_ATTR_INSTRUMENT, 'part_instrument', parameter);
    case 'midi-channel':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART_ATTR_MIDI_CHANNEL, 'midi_channel', parameter);
    case 'midi-program':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART_ATTR_MIDI_PROGRAM, 'midi_program', parameter);
    case 'volume':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART_ATTR_VOLUME, 'volume', parameter);
    case 'pan':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART_ATTR_PAN, 'pan', parameter);
    case 'clef':
      return createEnhancedAction(token, EnhancedTokenType.SET_PART_ATTR_CLEF, 'clef', parameter);
    
    default:
      return {
        position: token.position,
        token: EnhancedTokenType.UNKNOWN_ACTION,
        value: `Unknown part property: ${propertyName}`, // 错误信息
        character: token.value // 原始字符
      };
  }
};

// 创建增强动作的辅助函数
const createEnhancedAction = (token: Token, enhancedType: EnhancedTokenType, actionType: string, parameter: string): EnhancedToken => {
  // 处理调性动作的简谱友好别名
  if (actionType === 'key' && parameter.startsWith('1=')) {
    parameter = parameter.substring(2); // 移除"1="前缀
  }
  
  return {
    position: token.position,
    token: enhancedType,
    value: parameter,        // 解析后的值
    character: token.value   // 原始字符串
  };
};
