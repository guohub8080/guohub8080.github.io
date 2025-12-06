import React from 'react';
import Music12Icon from '../../../dev/assets/svgs/icons/Music12Icon.tsx';
import routerPaths from '../../../dev/router/paths.ts';

/**
 * Music12Document 配置信息
 * 音乐理论学习和工具文档
 */
export const Music12GuideConfig = {
  /** 文档标题 */
  title: 'Music12 音乐理论',
  /** URL slug */
  slug: routerPaths.music12,
  /** 文档描述 */
  description: '音乐理论学习和工具使用指南',
  /** 文档图标 */
  icon: <Music12Icon className="w-8 h-8" useGradient={true} />
};

export default Music12GuideConfig;
