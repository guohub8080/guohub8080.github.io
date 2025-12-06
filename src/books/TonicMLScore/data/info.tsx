import routerPaths from '../../../dev/router/paths.ts';
import TonicMLScoreIcon from './TonicMLScoreIcon.tsx';

export const tonicmlScoreConfig = {
  title: "TonicML Score 文档",
  slug: routerPaths.tonicmlScore,
  description: "TonicML Score 乐谱生成使用指南",
  icon: <TonicMLScoreIcon className="w-full h-full" useGradient={true} />
};

export default tonicmlScoreConfig;

