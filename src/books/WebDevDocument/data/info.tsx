import routerPaths from '../../../dev/router/paths.ts';
import WebDevIcon from './WebDevIcon.tsx';

export const webDevDocumentConfig = {
  title: "Web开发文档",
  slug: routerPaths.webDev,
  description: "前端开发技术文档与指南",
  icon: <WebDevIcon className="w-full h-full" />
};

export default webDevDocumentConfig;

