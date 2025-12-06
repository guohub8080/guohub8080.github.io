import routerPaths from '../../../dev/router/paths.ts';
import TonicMLDocIcon from './TonicMLDocIcon.tsx';

export const tonicmlDocumentConfig = {
  title: "TonicML 文档",
  slug: routerPaths.tonicmlDoc,
  description: "TonicML 乐理标记语言使用指南",
  icon: <TonicMLDocIcon className="w-full h-full" useGradient={true} />
};

export default tonicmlDocumentConfig;

