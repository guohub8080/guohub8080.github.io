// Head阶段处理器：处理head tokens，确定Meta状态，处理完毕后消失
import { isNil } from 'lodash';
import { EnhancedToken } from '../../s4_token_enhancement/s4_types';
import { ScoreMeta, StateAssignmentError } from '../s5_types';

// Head阶段处理结果
export interface HeadStageResult {
  isValid: boolean;
  scoreMeta: ScoreMeta;
  errors: StateAssignmentError[];
  warnings: StateAssignmentError[];
}

// 判断是否为meta信息SET命令
function isMetaSetToken(token: EnhancedToken): boolean {
  const metaTypes = ['SET_TITLE', 'SET_AUTHOR', 'SET_DATE', 'SET_GENRE', 'SET_DESCRIPTION', 'SET_BPM', 'SET_OCTAVE'];
  const tokenType = 'token' in token ? token.token : token.type;
  return metaTypes.includes(tokenType as string);
}

// 根据SET命令更新乐谱meta信息 - 函数式版本
function updateScoreMeta(
  token: EnhancedToken, 
  scoreMeta: ScoreMeta
): { updatedScoreMeta: ScoreMeta; error: StateAssignmentError | null } {
  const tokenType = 'token' in token ? token.token : token.type;
  const value = token.value;
  
  // 检查是否重复设置meta信息
  let isAlreadySet = false;
  let metaType = '';
  let updatedField: Partial<ScoreMeta> = {};
  
  switch (tokenType) {
    case 'SET_TITLE':
      isAlreadySet = !isNil(scoreMeta.title);
      metaType = 'title';
      if (!isAlreadySet) {
        updatedField = { title: value };
      }
      break;
    case 'SET_AUTHOR':
      isAlreadySet = !isNil(scoreMeta.author);
      metaType = 'author';
      if (!isAlreadySet) {
        updatedField = { author: value };
      }
      break;
    case 'SET_DATE':
      isAlreadySet = !isNil(scoreMeta.date);
      metaType = 'date';
      if (!isAlreadySet) {
        updatedField = { date: value };
      }
      break;
    case 'SET_GENRE':
      isAlreadySet = !isNil(scoreMeta.genre);
      metaType = 'genre';
      if (!isAlreadySet) {
        updatedField = { genre: value };
      }
      break;
    case 'SET_DESCRIPTION':
      isAlreadySet = !isNil(scoreMeta.description);
      metaType = 'description';
      if (!isAlreadySet) {
        updatedField = { description: value };
      }
      break;
    case 'SET_BPM':
      isAlreadySet = !isNil(scoreMeta.tempo);
      metaType = 'tempo';
      if (!isAlreadySet) {
        updatedField = { tempo: value };
      }
      break;
    case 'SET_OCTAVE':
      isAlreadySet = !isNil(scoreMeta.octave);
      metaType = 'octave';
      if (!isAlreadySet) {
        const octaveValue = parseInt(value);
        if (!isNaN(octaveValue)) {
          updatedField = { octave: octaveValue };
        }
      }
      break;
    case 'SET_KEY':
      isAlreadySet = !isNil(scoreMeta.key);
      metaType = 'key';
      if (!isAlreadySet) {
        updatedField = { key: value };
      }
      break;
    case 'SET_BEAT':
      isAlreadySet = !isNil(scoreMeta.time_signature);
      metaType = 'time_signature';
      if (!isAlreadySet) {
        updatedField = { time_signature: value };
      }
      break;
    default:
      return { updatedScoreMeta: scoreMeta, error: null };
  }
  
  // 如果已经设置过，返回错误
  if (isAlreadySet) {
    const error: StateAssignmentError = {
      message: `元信息重复设置错误：${metaType} 只能设置一次`,
      position: token.position,
      errorType: 'DUPLICATE_META_INFO' as any,
      severity: 'error'
    };
    return { updatedScoreMeta: scoreMeta, error };
  }
  
  // 返回更新后的scoreMeta（函数式更新）
  return { 
    updatedScoreMeta: { ...scoreMeta, ...updatedField },
    error: null
  };
}

// 设置默认值并产生警告 - 函数式版本
function setDefaultsAndWarnings(scoreMeta: ScoreMeta): { 
  updatedScoreMeta: ScoreMeta; 
  warnings: StateAssignmentError[] 
} {
  const warnings: StateAssignmentError[] = [];
  let updatedScoreMeta = { ...scoreMeta };
  
  // 设置调性默认值
  if (isNil(updatedScoreMeta.key)) {
    const warning: StateAssignmentError = {
      message: '未设置调性，使用默认值 C',
      errorType: 'MISSING_REQUIRED_STATE' as any,
      severity: 'warning'
    };
    warnings.push(warning);
    updatedScoreMeta = { ...updatedScoreMeta, key: 'C' };
  }
  
  // 设置速度默认值
  if (isNil(updatedScoreMeta.tempo)) {
    const warning: StateAssignmentError = {
      message: '未设置速度，使用默认值 100',
      errorType: 'MISSING_REQUIRED_STATE' as any,
      severity: 'warning'
    };
    warnings.push(warning);
    updatedScoreMeta = { ...updatedScoreMeta, tempo: '100' };
  }
  
  // 设置八度默认值
  if (isNil(updatedScoreMeta.octave)) {
    updatedScoreMeta = { ...updatedScoreMeta, octave: 4 };
  }
  
  // 设置拍号默认值
  if (isNil(updatedScoreMeta.time_signature)) {
    const warning: StateAssignmentError = {
      message: '未设置拍号，使用默认值 4/4',
      errorType: 'MISSING_REQUIRED_STATE' as any,
      severity: 'warning'
    };
    warnings.push(warning);
    updatedScoreMeta = { ...updatedScoreMeta, time_signature: '4/4' };
  }
  
  return { updatedScoreMeta, warnings };
}

// 处理Head阶段：确定Meta状态 - 函数式版本
export function processHeadStage(headTokens: EnhancedToken[]): HeadStageResult {
  // 1. 初始化空白的scoreMeta
  let scoreMeta: ScoreMeta = {
    title: null,
    author: null,
    date: null,
    genre: null,
    description: null,
    tempo: null,
    key: null,
    octave: null,
    time_signature: null,
    score_comment: []
  };
  
  const errors: StateAssignmentError[] = [];
  const warnings: StateAssignmentError[] = [];
  
  // 2. 遍历head tokens，提取meta信息（完全信任拆分器的结果）
  for (let i = 0; i < headTokens.length; i++) {
    const token = headTokens[i];
    
    // 根据token类型提取信息，不做任何"允许/不允许"的验证
    const tokenType = 'token' in token ? token.token : token.type;
    if (tokenType === 'COM_NORMAL') {
      // 函数式地添加注释
      scoreMeta = {
        ...scoreMeta,
        score_comment: [...scoreMeta.score_comment, token.value]
      };
    } else if (tokenType === 'COM_SCORE') {
      // 函数式地添加注释
      scoreMeta = {
        ...scoreMeta,
        score_comment: [...scoreMeta.score_comment, token.value]
      };
    } else if (isMetaSetToken(token) || tokenType === 'SET_KEY' || tokenType === 'SET_BEAT') {
      const updateResult = updateScoreMeta(token, scoreMeta);
      scoreMeta = updateResult.updatedScoreMeta;
      if (updateResult.error) {
        errors.push(updateResult.error);
      }
    }
    // 其他所有token都被静默忽略（由拆分器保证它们属于head部分）
  }
  
  // 3. 设置默认值并产生警告
  const defaultsResult = setDefaultsAndWarnings(scoreMeta);
  scoreMeta = defaultsResult.updatedScoreMeta;
  warnings.push(...defaultsResult.warnings);
  
  return {
    isValid: errors.length === 0, // 有错误则失败
    scoreMeta,
    errors,
    warnings
  };
}
