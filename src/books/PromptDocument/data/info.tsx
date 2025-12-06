import routerPaths from '../../../dev/router/paths.ts';
import PromptIcon from './PromptIcon.tsx';

export const promptDocumentConfig = {
  title: "Prompt 文档",
  slug: routerPaths.prompt,
  description: "常用提示词模板与技巧",
  icon: <PromptIcon className="w-full h-full" />
};

export default promptDocumentConfig;


