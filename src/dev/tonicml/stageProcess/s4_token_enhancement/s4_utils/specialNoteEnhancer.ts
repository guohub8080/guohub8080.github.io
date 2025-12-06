// 特殊音符增强器
import { Token } from '../../s2_basic_token_recognition/s2_types';
import { EnhancedToken, EnhancedTokenType } from '../s4_types';

// 特殊音符增强处理函数
export const enhanceSpecialNote = (token: Token): EnhancedToken => {
  const value = token.value;
  
  // 处理 &c 和弦
  if (value.startsWith('&c')) {
    const remainingValue = value.substring(2); // 去掉 "&c"
    
    return {
      position: token.position,
      token: EnhancedTokenType.SP_NOTE_CHORD,
      value: remainingValue, // 提取去掉&c后的内容
      character: token.value  // 原始字符
    };
  }
  
  // 处理 &t 连音
  if (value.startsWith('&t')) {
    const remainingValue = value.substring(2); // 去掉 "&t"
    
    return {
      position: token.position,
      token: EnhancedTokenType.SP_NOTE_TUPLET,
      value: remainingValue, // 提取去掉&t后的内容
      character: token.value  // 原始字符
    };
  }
  
  // 不应该到达这里，因为S3已经过滤掉所有未知特殊音符
  throw new Error(`意外的特殊音符类型: ${value}，这表明S3过滤器有问题`);
};
