// S6结构构建器类型定义
import { StateAssignedToken } from '../../s5_state_assignment/s5_types';

// Scope类型定义
export type ScopeValue = 
  | string                    // 简单字符串: pid, "unknown" 等
  | { start: string; end: string };  // 范围对象: {start: "px-sx-phx-mx-nx", end: "px-sx-phx-mx-nx"}

// S6阶段扩展的Token类型，包含结构化字段
export interface StructureAssignedToken extends StateAssignedToken {
  sid?: number;   // Section ID - 段落标识符
  phid?: number;  // Phrase ID - 乐句标识符  
  mid?: number;   // Measure ID - 小节标识符
  nid?: number | null;   // Note ID - 音符标识符（每个part内递增，只有音符和特殊音符有，其他为null）
  scope?: ScopeValue;  // Scope标记 - 作用域信息
  id?: string;    // 音符唯一标识符 - 格式为"px-sx-phx-mx-nx"（只有音符和特殊音符有）
}

// 音乐结构类型
export interface MusicalStructure {
  parts: Part[];
  score_meta: StructureMetadata;
}

export interface Part {
  id: string;
  name?: string;
  instrument?: string;
  sections: Section[];
  commands: StructureAssignedToken[];
  tokens: StructureAssignedToken[]; // 该part的所有音符tokens
}

export interface Section {
  id: string;
  name?: string;
  type: SectionType;
  content: StructureAssignedToken[];
  startPosition?: number; // 在整体token流中的起始位置
  endPosition?: number;   // 在整体token流中的结束位置
}

export enum SectionType {
  INTRO = 'INTRO',
  VERSE = 'VERSE', 
  CHORUS = 'CHORUS',
  BRIDGE = 'BRIDGE',
  OUTRO = 'OUTRO',
  CUSTOM = 'CUSTOM',
  UNNAMED = 'UNNAMED' // 未命名段落
}

export interface StructureMetadata {
  // 基础音乐信息
  tempo?: number;
  key?: string;
  time_signature?: string;
  octave?: number;
  
  // 作品信息
  title?: string;
  author?: string;
  genre?: string;
  date?: string;
  score_description?: string;  // 乐谱描述信息 $description{}
}
