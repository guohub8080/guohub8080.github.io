/**
 * MinnaJP_Primary1 文档加载器
 * 自动扫描 src/books/MinnaJP_Primary1 文件夹下的所有 .tsx, .md, .mdx 文件
 * 按文件夹分组，每个文件夹对应一个分类
 * 
 * 文件夹命名规则：[x]M
 * - [x] - 排序号，数字越小越靠上
 * - M - 显示的分类名称
 * - 每个文件夹必须包含 info.tsx 文件，定义路由 slug 和图标
 * 
 * 文件命名规则：[x]slug.{tsx,md,mdx}
 * - [x] - 排序号（数字，组内排序）
 * - slug - URL 路径（全英文，如：lesson1, vocabulary）
 * - 扩展名：.tsx（React组件）、.md（Markdown）、.mdx（MDX）
 */

import React, { ReactNode } from "react";
import { RouteObject, Navigate } from 'react-router-dom';
import BookLayout from '../../../dev/components/layout/BookLayout';
import ArticleContent from '../../../dev/components/layout/BookLayout/ArticleContent.tsx';
import { BookLayoutConfigProvider } from '../../../dev/components/layout/BookLayout/internal/BookLayoutContext.tsx';
import { minnaJPPrimary1Config } from './info.tsx';
import type { LucideIcon } from "lucide-react";
import type { BookLoader, BookCategory, BookArticle } from '../../../dev/components/layout/BookLayout/types/BookLoader.ts';
import { globalSettingsStore } from '../../../dev/store/useGlobalSettings';
import { MDXProviderWrapper, detectFileType, processDocumentContent } from '../../../dev/components/mdx/index.ts';

export interface CategoryInfo {
  icon?: LucideIcon;
  slug: string;
}

const allModules = import.meta.glob<{ default: any; title?: string }>(
  [
    "../**/*.{tsx,md,mdx}",
    "../**/index.{tsx,mdx}"
  ],
  { eager: true }
);

const documentModules = Object.fromEntries(
  Object.entries(allModules).filter(([path]) => 
    path.startsWith("../") &&          // 仅限上级目录内容（排除 data 目录下的文件）
    !/\.\/components\//.test(path) && // 排除本地 components
    !/\/info\.tsx$/.test(path) &&      // 排除分类 info
    !/\/data\//.test(path)             // 排除 data 目录
  )
);

const categoryInfoModules = import.meta.glob<{ default: CategoryInfo }>(
  "../**/info.tsx",
  { eager: true }
);

export interface DocumentCategory extends BookCategory {}

export interface DocumentItem extends BookArticle {
  fileName: string;
}

function parseFolderName(folderName: string): { order: number; name: string } {
  const match = folderName.match(/^\[(\d+)\](.+)$/);
  if (!match) {
    throw new Error(`文件夹名称格式错误: "${folderName}"，期望: [x]名称`);
  }
  return { order: parseInt(match[1], 10), name: match[2] };
}

function parseFileName(fileName: string): { order: number; slug: string } | null {
  const directFileMatch = fileName.match(/^\[(\d+)\](.+)\.(tsx|md|mdx)$/);
  if (directFileMatch) {
    return { order: parseInt(directFileMatch[1], 10), slug: directFileMatch[2] };
  }
  const indexFileMatch = fileName.match(/^\[(\d+)\](.+)\/index\.(tsx|mdx)$/);
  if (indexFileMatch) {
    return { order: parseInt(indexFileMatch[1], 10), slug: indexFileMatch[2] };
  }
  return null;
}

function parsePath(path: string): { categoryFolder: string; fileName: string; isIndexFile: boolean } {
  const directFileMatch = path.match(/^\.\.\/([^\/]+)\/(.+)\.(tsx|md|mdx)$/);
  if (directFileMatch) {
    return { categoryFolder: directFileMatch[1], fileName: directFileMatch[2] + '.' + directFileMatch[3], isIndexFile: false };
  }
  const indexFileMatch = path.match(/^\.\.\/([^\/]+)\/([^\/]+)\/index\.(tsx|mdx)$/);
  if (indexFileMatch) {
    return { categoryFolder: indexFileMatch[1], fileName: indexFileMatch[2] + '/index.' + indexFileMatch[3], isIndexFile: true };
  }
  throw new Error(`Invalid preset path: ${path}`);
}

function groupAndSortDocuments(): DocumentCategory[] {
  const categoryMap = new Map<string, { info: ReturnType<typeof parseFolderName>; articles: DocumentItem[]; slug: string; icon?: LucideIcon }>();
  const urlMap = new Map<string, string>();

  Object.entries(documentModules).forEach(([path, module]) => {
    const { categoryFolder, fileName, isIndexFile } = parsePath(path);
    const fileInfo = parseFileName(fileName);
    if (!fileInfo) return;

    const document = module.default;
    const actualFileName = isIndexFile ? path.split('/').pop() || fileName : fileName;
    const fileType = detectFileType(actualFileName);

    let categoryInfo;
    try {
      categoryInfo = parseFolderName(categoryFolder);
    } catch (error) {
      throw new Error(`解析文件夹名称失败: ${path}\n${(error as Error).message}`);
    }

    // 优先使用 MDX 文件的命名导出 title
    let finalTitle: string;
    if (module.title) {
      // MDX 文件有命名导出的 title
      finalTitle = module.title;
    } else {
      // 否则使用 processDocumentContent 提取的 title
      const { title } = processDocumentContent(document, fileType, fileName);
      finalTitle = title;
    }

    const { jsxContent } = processDocumentContent(document, fileType, fileName);

    const categoryInfoPath = Object.keys(categoryInfoModules).find(p => p.includes(`/${categoryFolder}/info.tsx`));
    const folderInfo = categoryInfoPath ? categoryInfoModules[categoryInfoPath].default : undefined;
    if (!folderInfo?.slug) {
      throw new Error(`分类 ${categoryFolder} 缺少 info.tsx 中的必填 slug 字段`);
    }
    const categoryPathSlug = String(folderInfo.slug).trim().replace(/^\/+|\/+$/g, '');

    const routePath = `${categoryPathSlug}/${fileInfo.slug}`;
    const fullUrl = `${minnaJPPrimary1Config.slug}/${routePath}`;
    if (urlMap.has(fullUrl)) {
      const existingFilePath = urlMap.get(fullUrl);
      throw new Error(`重复的 URL: ${fullUrl}\n文件1: ${existingFilePath}\n文件2: ${path}`);
    }
    urlMap.set(fullUrl, path);

    const content: ReactNode = (fileType === 'md' || fileType === 'mdx')
      ? (<MDXProviderWrapper>{jsxContent}</MDXProviderWrapper>)
      : jsxContent;

    const documentItem: DocumentItem = { title: finalTitle, routePath, order: fileInfo.order, content, fileName };

    if (!categoryMap.has(categoryFolder)) {
      categoryMap.set(categoryFolder, { info: categoryInfo, articles: [], slug: categoryPathSlug, icon: folderInfo.icon });
    }
    categoryMap.get(categoryFolder)!.articles.push(documentItem);
  });

  const categories: DocumentCategory[] = [];
  categoryMap.forEach(({ info, articles, slug, icon }) => {
    const sortedArticles = articles.sort((a, b) => a.order - b.order);
    categories.push({ categoryName: info.name, categoryPath: slug, categoryOrder: info.order, articles: sortedArticles, icon });
  });
  categories.sort((a, b) => a.categoryOrder - b.categoryOrder);
  return categories;
}

export const userDocumentCategories = groupAndSortDocuments();
export const allUserDocuments = userDocumentCategories.flatMap(cat => cat.articles);

const minnaJPPrimary1Loader: BookLoader = {
  config: {
    title: minnaJPPrimary1Config.title,
    slug: minnaJPPrimary1Config.slug,
    icon: () => minnaJPPrimary1Config.icon,
    description: minnaJPPrimary1Config.description
  },
  categories: userDocumentCategories,
  getAllArticles(): BookArticle[] { return allUserDocuments; },
  getCurrentArticle(path: string): BookArticle | null {
    const normalizedPath = path.toLowerCase().replace(/^\/+|\/+$/g, '');
    return allUserDocuments.find(a => a.routePath.toLowerCase() === normalizedPath) || null;
  },
  getNavigationData() { return { categories: userDocumentCategories, allArticles: allUserDocuments }; },
  initializeBookState() { globalSettingsStore.getState().setIsBookPage(true); }
};

export function generateMinnaJPPrimary1Routes(): RouteObject[] {
  return [
    {
      path: minnaJPPrimary1Config.slug,
      element: (
        <BookLayoutConfigProvider basePrefix={`/${minnaJPPrimary1Config.slug}`}>
          <BookLayout loader={minnaJPPrimary1Loader} />
        </BookLayoutConfigProvider>
      ),
      children: [
        {
          index: true,
          element: allUserDocuments.length > 0
            ? (<Navigate to={allUserDocuments[0].routePath} replace />)
            : <div className="p-6 text-center text-muted-foreground">暂无文章</div>,
        },
        ...userDocumentCategories.flatMap((category) =>
          category.articles.map((article) => ({
            path: article.routePath,
            element: <ArticleContent loader={minnaJPPrimary1Loader}>{article.content}</ArticleContent>,
          }))
        ),
      ],
    },
  ];
}

export default minnaJPPrimary1Loader;

