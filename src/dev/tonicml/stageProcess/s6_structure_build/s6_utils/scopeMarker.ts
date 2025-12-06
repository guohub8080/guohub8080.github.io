// Scope Marker处理器 - 处理作用域标记相关的逻辑
import { isNil } from 'lodash';
import { StructureAssignedToken, ScopeValue } from '../s6_types';
import { 
  buildDebugMessage,
  LogType,
  type DebugMessage 
} from '../../../utils/debugLogBuilder.ts';

/**
 * 处理Scope Marker的结果类型
 */
export interface ScopeMarkerResult {
  tokens: StructureAssignedToken[];
  errors: DebugMessage[];
  warnings: DebugMessage[];
}

/**
 * 生成标准的作用域标识符格式 "px-sx-phx-mx-nx"
 */
function generateScopeId(pid: number, sid?: number, phid?: number, mid?: number, nid?: number | null): string {
  const parts = [
    `p${pid}`,
    sid ? `s${sid}` : 'sx',
    phid ? `ph${phid}` : 'phx', 
    mid ? `m${mid}` : 'mx',
    nid ? `n${nid}` : 'nx'
  ];
  return parts.join('-');
}

/**
 * 判断token是否为音符类型（有nid的token）
 * 只有NOTE、SPECIAL_NOTE和SP_NOTE_*类型的token才会被分配nid
 */
function isNoteToken(token: StructureAssignedToken): boolean {
  return !isNil(token.nid);
}

/**
 * 音符信息接口 - 包含完整的结构ID
 */
interface NoteInfo {
  nid: number;
  sid?: number;
  phid?: number;
  mid?: number;
}

/**
 * 查找从指定索引开始，直到遇到指定边界的所有音符
 */
function findNotesInRange(tokens: StructureAssignedToken[], startIndex: number, boundaries: string[]): { firstNote: NoteInfo | null; lastNote: NoteInfo | null } {
  let firstNote: NoteInfo | null = null;
  let lastNote: NoteInfo | null = null;
  
  for (let i = startIndex; i < tokens.length; i++) {
    const token = tokens[i];
    
    // 如果遇到边界标记，停止查找
    if (boundaries.includes(token.token)) break;
    
    if (isNoteToken(token)) {
      if (isNil(firstNote)) {
        firstNote = {
          nid: token.nid!,
          sid: token.sid,
          phid: token.phid,
          mid: token.mid
        };
      }
      lastNote = {
        nid: token.nid!,
        sid: token.sid,
        phid: token.phid,
        mid: token.mid
      };
    }
  }
  
  return { firstNote, lastNote };
}

/**
 * 查找当前mid内的所有音符（COM_MEASURE专用）
 */
function findNotesInCurrentMid(tokens: StructureAssignedToken[], comMeasureIndex: number): { firstNote: NoteInfo | null; lastNote: NoteInfo | null } {
  const comMeasureToken = tokens[comMeasureIndex];
  const targetMid = comMeasureToken.mid;
  let firstNote: NoteInfo | null = null;
  let lastNote: NoteInfo | null = null;
  
  // 在整个tokens数组中查找具有相同mid的所有音符
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (isNoteToken(token) && token.mid === targetMid) {
      if (isNil(firstNote)) {
        firstNote = {
          nid: token.nid!,
          sid: token.sid,
          phid: token.phid,
          mid: token.mid
        };
      }
      lastNote = {
        nid: token.nid!,
        sid: token.sid,
        phid: token.phid,
        mid: token.mid
      };
    }
  }
  
  return { firstNote, lastNote };
}

/**
 * 为和弦标记查找作用域范围 - 直到下一个和弦标记或小节结束
 * CHORD_SCOPE_MARK不跨小节，在遇到小节边界或下一个和弦标记时停止
 */
function findChordScopeMarkRange(tokens: StructureAssignedToken[], currentIndex: number): { firstNote: NoteInfo | null; lastNote: NoteInfo | null } {
  let firstNote: NoteInfo | null = null;
  let lastNote: NoteInfo | null = null;
  const currentMid = tokens[currentIndex].mid;
  
  // 从当前和弦标记之后开始查找
  for (let i = currentIndex + 1; i < tokens.length; i++) {
    const token = tokens[i];
    
    // 如果遇到新的和弦标记，停止
    if (token.token === 'CHORD_SCOPE_MARK') break;
    
    // 如果遇到小节边界标记，停止
    if (['MEASURE_BREAK', 'PHRASE_BREAK', 'NEWLINE'].includes(token.token)) break;
    
    // 如果是音符或特殊音符
    if (isNoteToken(token)) {
      // 如果mid发生变化，说明跨小节了，停止
      if (token.mid !== currentMid) break;
      
      if (isNil(firstNote)) {
        firstNote = {
          nid: token.nid!,
          sid: token.sid,
          phid: token.phid,
          mid: token.mid
        };
      }
      lastNote = {
        nid: token.nid!,
        sid: token.sid,
        phid: token.phid,
        mid: token.mid
      };
    }
  }
  
  return { firstNote, lastNote };
}

/**
 * 处理作用域标记
 * 
 * @param tokens - 输入的StructureAssignedToken数组
 * @param currentPid - 当前的part ID
 * @returns ScopeMarkerResult - 处理后的token数组和调试信息
 */
export function processScopeMarkers(tokens: StructureAssignedToken[], currentPid: number = 1): ScopeMarkerResult {
  const errors: DebugMessage[] = [];
  const warnings: DebugMessage[] = [];
  const processedTokens: StructureAssignedToken[] = [];
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let scope: ScopeValue | undefined;
    
    // 根据token类型设置scope
    switch (token.token) {
      case 'COM_PART':
        scope = currentPid.toString();
        break;
        
      case 'COM_SECTION': {
        // COM_SECTION管理从这里开始直到下一个COM_SECTION的所有音符
        const { firstNote, lastNote } = findNotesInRange(tokens, i + 1, ['COM_SECTION']);
        
        if (firstNote && lastNote) {
          scope = {
            start: generateScopeId(currentPid, firstNote.sid, firstNote.phid, firstNote.mid, firstNote.nid),
            end: generateScopeId(currentPid, lastNote.sid, lastNote.phid, lastNote.mid, lastNote.nid)
          };
        }
        break;
      }
      
      case 'COM_PHRASE': {
        // COM_PHRASE管理从这里开始直到下一个COM_PHRASE或PHRASE_BREAK的所有音符
        const { firstNote, lastNote } = findNotesInRange(tokens, i + 1, ['COM_PHRASE', 'PHRASE_BREAK', 'COM_SECTION']);
        
        if (firstNote && lastNote) {
          scope = {
            start: generateScopeId(currentPid, firstNote.sid, firstNote.phid, firstNote.mid, firstNote.nid),
            end: generateScopeId(currentPid, lastNote.sid, lastNote.phid, lastNote.mid, lastNote.nid)
          };
        }
        break;
      }
      
      case 'COM_MEASURE': {
        // COM_MEASURE管理当前mid内的所有音符（无论COM_MEASURE出现在measure什么位置）
        const { firstNote, lastNote } = findNotesInCurrentMid(tokens, i);
        
        if (firstNote && lastNote) {
          scope = {
            start: generateScopeId(currentPid, firstNote.sid, firstNote.phid, firstNote.mid, firstNote.nid),
            end: generateScopeId(currentPid, lastNote.sid, lastNote.phid, lastNote.mid, lastNote.nid)
          };
        }
        break;
      }
      
      case 'COM_NORMAL':
      case 'COM_SCORE':
        scope = 'unknown';
        break;
        
      case 'CHORD_SCOPE_MARK': {
        // CHORD_SCOPE_MARK的scope规则：
        // 1. 不跨小节 - 遇到小节边界就停止
        // 2. start: 标记后的第一个note或special note
        // 3. end: 遇到下一个CHORD_SCOPE_MARK或小节结束前的最后一个音符
        const { firstNote, lastNote } = findChordScopeMarkRange(tokens, i);
        
        if (firstNote && lastNote) {
          scope = {
            start: generateScopeId(currentPid, firstNote.sid, firstNote.phid, firstNote.mid, firstNote.nid),
            end: generateScopeId(currentPid, lastNote.sid, lastNote.phid, lastNote.mid, lastNote.nid)
          };
        }
        break;
      }
    }
    
    // 过滤掉不需要的token（各种break、换行符、连线标记等）
    const shouldFilter = [
      'NEWLINE',
      'MEASURE_BREAK', 
      'PHRASE_BREAK',
      'TIE_START',
      'TIE_END'
    ].includes(token.token);
    
    // 只有不被过滤的token才添加到结果数组
    if (!shouldFilter) {
      // 函数式地构建processedToken，避免修改对象
      const processedToken = {
        ...token,
        ...(!isNil(scope) && { scope }),
        ...(isNoteToken(token) && { 
          id: generateScopeId(currentPid, token.sid, token.phid, token.mid, token.nid) 
        })
      };
      
      processedTokens.push(processedToken);
    }
  }
  
  return {
    tokens: processedTokens,
    errors,
    warnings
  };
}
