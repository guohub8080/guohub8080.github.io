// 音符解析工具函数
import type { StructureAssignedToken } from '../../s6_structure_build/s6_types';

/**
 * 解析普通音符Token
 * @param token - 需要解析的token
 * @returns 解析后的token，包含解析出的音符信息
 */
export function parseNoteToken(token: StructureAssignedToken): StructureAssignedToken {
  // 创建基础的note对象
  const noteData = {
    note_type: null as string | null,
    lyric: null as string | null,
    note_comment: null as string | null,
    quarter_length: 1,
    octave_shift: 0,
    alter: 0,
    letter_step: null,
    number_step: null
  };

  // 获取token的原始字符串值
  let remainingString = token.value;

  // 1. 提取{}和@{}
  // 提取@{}中的内容到note_comment字段
  const commentMatch = remainingString.match(/@\{([^}]*)\}/);
  if (commentMatch) {
    noteData.note_comment = commentMatch[1];
    remainingString = remainingString.replace(/@\{[^}]*\}/g, '');
  }

  // 提取{}中的内容到lyric字段
  const lyricMatch = remainingString.match(/\{([^}]*)\}/);
  if (lyricMatch) {
    noteData.lyric = lyricMatch[1];
    remainingString = remainingString.replace(/\{[^}]*\}/g, '');
  }

  // 2. 处理八度符号
  // 批量替换>，有几个就在octave_shift字段+1几次
  const greaterThanMatches = remainingString.match(/>/g);
  if (greaterThanMatches) {
    noteData.octave_shift += greaterThanMatches.length;
    remainingString = remainingString.replace(/>/g, '');
  }

  // 批量替换<，有几个就在octave_shift字段-1几次
  const lessThanMatches = remainingString.match(/</g);
  if (lessThanMatches) {
    noteData.octave_shift -= lessThanMatches.length;
    remainingString = remainingString.replace(/</g, '');
  }

  // 3. 处理时值符号
  // 如果有-，有几个就quarter_length*0.5几次
  const minusMatches = remainingString.match(/-/g);
  if (minusMatches) {
    for (let i = 0; i < minusMatches.length; i++) {
      noteData.quarter_length *= 0.5;
    }
    remainingString = remainingString.replace(/-/g, '');
  }

  // 如果有+，有几个就quarter_length*2几次
  const plusMatches = remainingString.match(/\+/g);
  if (plusMatches) {
    for (let i = 0; i < plusMatches.length; i++) {
      noteData.quarter_length *= 2;
    }
    remainingString = remainingString.replace(/\+/g, '');
  }

  // 4. 处理附点
  // 如果有.，有几个就quarter_length*1.5几次
  const dotMatches = remainingString.match(/\./g);
  if (dotMatches) {
    for (let i = 0; i < dotMatches.length; i++) {
      noteData.quarter_length *= 1.5;
    }
    remainingString = remainingString.replace(/\./g, '');
  }

  // 5. 检查休止符标记和数字音级
  // 看看有没有0或者r/R，有的话就让note_type为rest
  if (remainingString.includes('0') || remainingString.includes('r') || remainingString.includes('R')) {
    noteData.note_type = 'rest';
    // 移除休止符标记
    remainingString = remainingString.replace(/[0rR]/g, '');
  }


  
  // 检查是否有数字，先验证不能有8、9
  if (remainingString.match(/[89]/)) {
    throw new Error(`数字音符不能包含8或9: ${token.value}`);
  }

  // 检查是否有1234567这些数字，如果有就设为number_note
  const numberMatches = remainingString.match(/[1-7]/g);
  if (numberMatches) {
    const numberString = numberMatches.join('');

    // 验证数字不能超过两位数
    if (numberString.length > 2) {
      throw new Error(`数字音符不能超过两位数: ${token.value}`);
    }

    noteData.note_type = 'number_note';
    noteData.number_step = numberString;
    // 移除数字
    remainingString = remainingString.replace(/[1-7]/g, '');
  } else {
    // 剩余的字符串就是音符类型
    noteData.note_type = remainingString.trim() || null;
  }

  // 返回包含解析数据的token
  return {
    ...token,
    note_info: noteData
  } as StructureAssignedToken;
}

