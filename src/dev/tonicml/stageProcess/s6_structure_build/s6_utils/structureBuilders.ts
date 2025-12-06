// 结构构建相关的核心函数
import { isNil } from 'lodash';
import { StateAssignedToken } from '../../s5_state_assignment/s5_types';
import { StructureAssignedToken } from '../s6_types';
import { isCoreElement } from '../../s2_basic_token_recognition/s2_types';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../../utils/debugLogBuilder.ts';

// 判断是否为音符或特殊音符（需要分配nid的token）
// nid只分配给真正的音符类型：NOTE、SPECIAL_NOTE和SP_NOTE_*
function isNoteOrSpecialNote(token: StateAssignedToken): boolean {
  return token.token === 'NOTE' || 
         token.token === 'SPECIAL_NOTE' ||
         token.token.startsWith('SP_NOTE');
}

// 第一遍遍历：为每个token分配sid（section ID）
export function assignSectionIds(tokens: StateAssignedToken[]): { 
  tokens: StructureAssignedToken[], 
  errors: DebugMessage[]
} {
  const result: StructureAssignedToken[] = [];
  const errors: DebugMessage[] = [];
  
  let currentSid = 1;
  let hasSeenFirstNote = false;
  let lastSectionHadNotes = false;
  
  for (const token of tokens) {
    // 如果遇到COM_SECTION
    if (token.token === 'COM_SECTION') {
      if (hasSeenFirstNote && !lastSectionHadNotes) {
        errors.push(buildDebugMessage({
          type: LogType.ERROR,
          message: `第${currentSid}个section为空，不允许空的section`,
          tag: 'ERROR'
        }));
      }
      
      // 如果已经遇到过音符，准备增加sid
      if (hasSeenFirstNote) {
        currentSid++;
        lastSectionHadNotes = false;
      }
      
      result.push({ ...token, sid: currentSid });
      continue;
    }
    
    // 如果是音符或特殊音符，用于控制逻辑
    if (isNoteOrSpecialNote(token)) {
      hasSeenFirstNote = true;
      lastSectionHadNotes = true;
    }
    
    // 所有token都加上sid
    result.push({ ...token, sid: currentSid });
  }
  
  return { tokens: result, errors };
}

// 第二遍遍历：为每个token分配phid（phrase ID）
export function assignPhraseIds(tokens: StructureAssignedToken[]): { 
  tokens: StructureAssignedToken[], 
  errors: DebugMessage[]
} {
  const result: StructureAssignedToken[] = [];
  const errors: DebugMessage[] = [];
  
  let currentPhid = 1;
  let hasSeenFirstNote = false;
  let lastSid = 0;
  let lastPhidChangeReason = 'init';  // 记录上次phid变化的原因：'init', 'sid_change', 'phrase_break'
  
  for (const token of tokens) {
    // 如果遇到COM_PHRASE或PHRASE_BREAK
    if (token.token === 'COM_PHRASE' || token.token === 'PHRASE_BREAK') {
      // 如果已经遇到过音符，且上次phid变化不是因为sid变化，才自增
      if (hasSeenFirstNote && lastPhidChangeReason !== 'sid_change') {
        currentPhid++;
      }
      lastPhidChangeReason = 'phrase_break';
      
      result.push({ ...token, phid: currentPhid });
      continue;
    }
    
    // 检查sid是否发生变化（对所有token，不只是音符）
    if (hasSeenFirstNote && !isNil(token.sid) && token.sid !== lastSid) {
      currentPhid++;
      lastSid = token.sid;
      lastPhidChangeReason = 'sid_change';
    }
    
    // 如果是音符或特殊音符，标记为已见过
    if (isNoteOrSpecialNote(token)) {
      hasSeenFirstNote = true;
      if (!isNil(token.sid)) {
        lastSid = token.sid;
      }
    }
    
    // 所有token都加上phid
    result.push({ ...token, phid: currentPhid });
  }
  
  return { tokens: result, errors };
}

// 处理单个part的结构分配
export function assignStructureIds(tokens: StateAssignedToken[]): {
  tokens: StructureAssignedToken[],
  errors: DebugMessage[]
} {
  const errors: DebugMessage[] = [];
  
  // 第一遍：分配sid
  const sidResult = assignSectionIds(tokens);
  errors.push(...sidResult.errors);
  
  // 第二遍：分配phid
  const phidResult = assignPhraseIds(sidResult.tokens);
  errors.push(...phidResult.errors);
  
  // 第三遍：分配mid（根据MEASURE_BREAK和PHRASE_BREAK隔断）
  const midTokens: StructureAssignedToken[] = [];
  let currentMid = 1;
  let hasNotesSinceLastMidIncrement = false;  // 从上次mid自增后是否见过音符
  
  for (const token of phidResult.tokens) {
    // 如果遇到MEASURE_BREAK、PHRASE_BREAK或NEWLINE
    if (token.token === 'MEASURE_BREAK' || token.token === 'PHRASE_BREAK' || token.token === 'NEWLINE') {
      // 只有从上次自增后至少经过一个音符，才自增mid
      if (hasNotesSinceLastMidIncrement) {
        currentMid++;
        hasNotesSinceLastMidIncrement = false;  // 重置音符标志
      }
      
      midTokens.push({ ...token, mid: currentMid });
      continue;
    }
    
    // 如果是音符或特殊音符，标记为见过音符
    if (isNoteOrSpecialNote(token)) {
      hasNotesSinceLastMidIncrement = true;
    }
    
    midTokens.push({ ...token, mid: currentMid });
  }
  
  // 第四遍：分配nid（音符ID，每个part内递增）
  const finalTokens: StructureAssignedToken[] = [];
  let currentNid = 1;
  
  for (const token of midTokens) {
    if (isNoteOrSpecialNote(token)) {
      finalTokens.push({ ...token, nid: currentNid });
      currentNid++;
    } else {
      finalTokens.push({ ...token, nid: null });  // 明确设置为null
    }
  }
  
  return {
    tokens: finalTokens,
    errors
  };
}