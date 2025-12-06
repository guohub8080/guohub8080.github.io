// 导入s2的token类型
import { Token, Position } from '../../s2_basic_token_recognition/s2_types';
import { DebugMessage } from '../../../utils/debugLogBuilder.ts';
// 语法错误类型
export interface SyntaxError {
  message: string;
  position: Position;
  errorType: SyntaxErrorType;
  severity: 'error' | 'warning';
  stage: string; // 错误产生的编译阶段，如 's1_raw_text_to_block', 's2_basic_block_tokens' 等
}

export enum SyntaxErrorType {
  INVALID_COMMAND_FORMAT = 'INVALID_COMMAND_FORMAT',
  UNCLOSED_COMMAND = 'UNCLOSED_COMMAND',
  UNCLOSED_CHORD_SCOPE_MARK = 'UNCLOSED_CHORD_SCOPE_MARK', 
  INVALID_CHORD_SCOPE_MARK_FORMAT = 'INVALID_CHORD_SCOPE_MARK_FORMAT',
  INVALID_NOTE_FORMAT = 'INVALID_NOTE_FORMAT',
  INVALID_SPECIAL_NOTE_FORMAT = 'INVALID_SPECIAL_NOTE_FORMAT',
  INVALID_SPECIAL_NOTE_TYPE = 'INVALID_SPECIAL_NOTE_TYPE',
  INVALID_ANNOTATION_FORMAT = 'INVALID_ANNOTATION_FORMAT',
  UNEXPECTED_TOKEN = 'UNEXPECTED_TOKEN',
  MISSING_REQUIRED_TOKEN = 'MISSING_REQUIRED_TOKEN',
  STRUCTURAL_ERROR = 'STRUCTURAL_ERROR'
}

// Error Filter结果类型
export interface ErrorFilterResult {
  isValid: boolean;
  errors: SyntaxError[];
  warnings: SyntaxError[];
  filteredTokens: Token[]; // 通过过滤的token
}

// 验证函数类型定义
export type ValidatorFunction = (token: Token, context?: FilterContext) => FilterResult;

// 过滤上下文（用于跨token的过滤）
export interface FilterContext {
  previousTokens: Token[];
  seenCommands: Set<string>;
  currentIndex: number;
  allTokens: Token[];
}

// 单个过滤结果
export interface FilterResult {
  logs: DebugMessage[]; // 统一的日志数组
  isValid: boolean; // 该token是否通过过滤
}

// ============================================================================
// 导出 Action Tag 验证相关
// ============================================================================

export type { 
  ValidActionTag, 
  ValidPartPropertyName, 
  ActionParseResult 
} from './validActionTag.ts';

export { 
  VALID_ACTION_TAGS,
  PART_PROPERTY_NAMES,
  SCORE_META_TAGS,
  KEY_TAGS,
  OCTAVE_TAGS,
  TEMPO_TAGS,
  TIME_SIGNATURE_TAGS,
  CLEF_TAGS,
  PART_DEFINITION_TAGS,
  isValidActionTag,
  isValidPartPropertyName,
  parseAndValidateAction
} from './validActionTag.ts';

// ============================================================================
// 导出 Comment Tag 验证相关
// ============================================================================

export type { 
  ValidCommentTag, 
  StructuredCommentTag,
  ParameterizedCommentTag,
  CommentParseResult 
} from './validCommentTag.ts';

export { 
  VALID_COMMENT_TAGS,
  STRUCTURED_COMMENT_TAGS,
  PARAMETERIZED_COMMENT_TAGS,
  isValidCommentTag,
  isStructuredComment,
  isParameterizedComment,
  parseAndValidateComment
} from './validCommentTag.ts';

// ============================================================================
// 导出 Special Note Tag 验证相关
// ============================================================================

export type { 
  ValidSpecialNoteTag, 
  SpecialNoteParseResult 
} from './validSpecialNoteTag.ts';

export { 
  VALID_SPECIAL_NOTE_TAGS,
  isValidSpecialNoteTag,
  parseAndValidateSpecialNote
} from './validSpecialNoteTag.ts';