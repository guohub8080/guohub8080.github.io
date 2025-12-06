import React from 'react';
import MusicTheoryIcon from './MusicTheoryIcon.tsx';
import routerPaths from '../../../dev/router/paths.ts';

/**
 * MusicTheoryDocument 配置信息
 * 乐理知识文档
 */
export const musicTheoryDocumentConfig = {
  /** 文档标题 */
  title: '乐理知识',
  /** URL slug */
  slug: routerPaths.musicTheory,
  /** 文档描述 */
  description: '流行和声等资料',
  /** 文档图标 */
  icon: <MusicTheoryIcon className="w-8 h-8" useGradient={true} />
};

export default musicTheoryDocumentConfig;

