/**
 * Music12Document 用户指引动态加载器
 * 自动扫描 src/books/Music12Document 文件夹下的所有 .tsx, .md, .mdx 文件
 * 按文件夹分组，每个文件夹对应一个分类
 * 
 * 文件夹命名规则：[x]M
 * - [x] - 排序号，数字越小越靠上
 * - M - 显示的分类名称
 * - 每个文件夹必须包含 info.tsx 文件，定义路由 slug 和图标
 * 
 * 文件命名规则（支持两种结构）：
 * 1. 直接文件：[x]slug.{tsx,md,mdx}
 * 2. 文件夹结构：[x]slug/index.{tsx,mdx}
 * 
 * 其中：
 * - [x] - 排序号（数字，组内排序）
 * - slug - URL 路径（全英文，如：music_theory, chord_progression）
 * - 扩展名：.tsx（React组件）、.md（Markdown）、.mdx（MDX）
 * 
 * 例如：文件夹 [01]音乐理论/info.tsx 定义 slug: "theory"
 *       文件 [1]music_theory.tsx => 路由为 /{slug}/theory/music_theory
 *       文件 [2]guide.md => 路由为 /{slug}/theory/guide
 *       文件夹 [3]tutorial/index.tsx => 路由为 /{slug}/theory/tutorial
 *       文件夹 [4]advanced/index.mdx => 路由为 /{slug}/theory/advanced
 * 只有符合上述格式的文件才会被加载
 */

import React, { ReactNode } from "react";
import { RouteObject, Navigate } from 'react-router-dom';
import BookLayout from '../../../dev/components/layout/BookLayout';
import ArticleContent from '../../../dev/components/layout/BookLayout/ArticleContent.tsx';
import { BookLayoutConfigProvider } from '../../../dev/components/layout/BookLayout/internal/BookLayoutContext.tsx';
import { Music12GuideConfig } from './info.tsx';
import type { LucideIcon } from "lucide-react";
import type { BookLoader, BookConfig, BookCategory, BookArticle } from '../../../dev/components/layout/BookLayout/types/BookLoader.ts';
import useGlobalSettings, { globalSettingsStore } from '../../../dev/store/useGlobalSettings';
import { MDXProviderWrapper, detectFileType } from '../../../dev/components/mdx/index.ts';

/**
 * 文档导出类型
 * 文件名格式：[x]slug.{tsx,md,mdx}，其中 x 为排序序号
 */
export interface DocumentExport {
    /** 文档标题 */
    title: string;
    /** JSX 内容（TSX文件）或 MDX 组件（MD/MDX文件） */
    jsx: ReactNode;
    /** 文件类型 */
    fileType?: 'tsx' | 'md' | 'mdx';
}

/**
 * 分类信息导出类型
 * 文件名：info.tsx
 */
export interface CategoryInfo {
    /** 分类图标（lucide-react 图标组件） */
    icon?: LucideIcon;
    /** 必填：用于覆盖文件夹 {y} 的路由前缀 */
    slug: string;
}

// 使用相对路径导入当前目录的父目录下的所有文件
// 当前文件: src/books/Music12Document/data/music12DocumentLoader.tsx
// 目标目录: src/books/Music12Document/**/*.{tsx,md,mdx}

// 动态导入父目录下的所有 .tsx, .md, .mdx 文件
// 支持两种结构：
// 1. 直接文件：[x]slug.{tsx,md,mdx}
// 2. 文件夹结构：[x]slug/index.{tsx,mdx}
// 注意：排除 'data/components/**' 下的文件（公用组件不参与路由）
const allModules = import.meta.glob<{ default: any }>(
  [
    "../**/*.{tsx,md,mdx}",  // 直接文件
    "../**/index.{tsx,mdx}"  // 文件夹中的index文件
  ],
  { eager: true }
);

// 同时导入原始文件内容用于提取标题
const rawModules = import.meta.glob(
  [
    "../**/*.{md,mdx}",      // 直接文件
    "../**/index.{md,mdx}"   // 文件夹中的index文件
  ],
  { 
    eager: true,
    query: '?raw'
  }
);
const documentModules = Object.fromEntries(
  Object.entries(allModules).filter(([path]) => 
    path.startsWith("../") &&    // 仅限上级目录内容（排除 data 目录下的文件）
    !/\/info\.tsx$/.test(path)   // 排除分类 info
  )
);

// 动态导入所有分类的 info.tsx 文件
const categoryInfoModules = import.meta.glob<{ default: CategoryInfo }>(
  "../**/info.tsx",
  { eager: true }
);

// 按文件夹分组的文档数据结构
export interface DocumentCategory extends BookCategory {
  // 继承 BookCategory 的所有属性
}

// 文档项（包含路由信息和排序）
export interface DocumentItem extends BookArticle {
  // 继承 BookArticle 的所有属性
  fileName: string;           // 文件名（不含扩展名）
}

/**
 * 从MDX/MD文件内容中提取第一个一级标题
 */
function extractTitleFromMarkdown(content: string): string {
  if (typeof content !== 'string') {
    console.warn('extractTitleFromMarkdown: content is not a string:', typeof content);
    return '未命名文档';
  }
  
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      const title = trimmed.substring(2).trim();
      return title;
    }
  }
  return '未命名文档';
}


/**
 * 解析文件夹名称，提取排序号和显示名称
 * 格式：[x]M
 * 例如：[01]音乐理论 => order: 1, name: 音乐理论
 */
function parseFolderName(folderName: string): {
  order: number;
  name: string;
} {
  const match = folderName.match(/^\[(\d+)\](.+)$/);
  
  if (!match) {
    throw new Error(
      `文件夹名称格式错误: "${folderName}"\n` +
      `期望格式: [x]M\n` +
      `例如: [01]音乐理论`
    );
  }
  
  return {
    order: parseInt(match[1], 10),
    name: match[2]
  };
}

/**
 * 解析文件名，提取排序号和 slug
 * 支持两种格式：
 * 1. 直接文件：[x]slug.{tsx,md,mdx}
 * 2. 文件夹结构：[x]slug/index.{tsx,mdx}
 * 
 * 例如：[1]music_theory.tsx => order: 1, slug: music_theory
 *      [2]guide.md => order: 2, slug: guide
 *      [3]tutorial/index.tsx => order: 3, slug: tutorial
 * 
 * 如果文件名不符合格式，返回 null（该文件会被跳过）
 */
function parseFileName(fileName: string): { order: number; slug: string } | null {
  // 处理直接文件格式：[x]slug.{tsx,md,mdx}
  const directFileMatch = fileName.match(/^\[(\d+)\](.+)\.(tsx|md|mdx)$/);
  if (directFileMatch) {
    return {
      order: parseInt(directFileMatch[1], 10),
      slug: directFileMatch[2]
    };
  }
  
  // 处理文件夹结构格式：[x]slug/index.{tsx,mdx}
  const indexFileMatch = fileName.match(/^\[(\d+)\](.+)\/index\.(tsx|mdx)$/);
  if (indexFileMatch) {
    return {
      order: parseInt(indexFileMatch[1], 10),
      slug: indexFileMatch[2]
    };
  }
  
  return null; // 不符合格式，跳过该文件
}


/**
 * 解析路径，提取分类信息
 * 支持两种路径格式：
 * 1. 直接文件: ../[01]音乐理论/[1]music_theory.tsx
 * 2. 文件夹结构: ../[01]音乐理论/[1]music_theory/index.tsx
 */
function parsePath(path: string): { 
  categoryFolder: string; 
  fileName: string;
  isIndexFile: boolean;
} {
  // 匹配直接文件格式: ../[category]/[file].{tsx,md,mdx}
  const directFileMatch = path.match(/^\.\.\/([^\/]+)\/(.+)\.(tsx|md|mdx)$/);
  if (directFileMatch) {
    return {
      categoryFolder: directFileMatch[1],
      fileName: directFileMatch[2] + '.' + directFileMatch[3],
      isIndexFile: false
    };
  }
  
  // 匹配文件夹结构格式: ../[category]/[folder]/index.{tsx,mdx}
  const indexFileMatch = path.match(/^\.\.\/([^\/]+)\/([^\/]+)\/index\.(tsx|mdx)$/);
  if (indexFileMatch) {
    return {
      categoryFolder: indexFileMatch[1],
      fileName: indexFileMatch[2] + '/index.' + indexFileMatch[3],
      isIndexFile: true
    };
  }
  
  throw new Error(`Invalid preset path: ${path}\nExpected patterns:\n- ../[category]/[file].{tsx,md,mdx}\n- ../[category]/[folder]/index.{tsx,mdx}`);
}

/**
 * 将文档按分类分组并排序
 */
function groupAndSortDocuments(): DocumentCategory[] {
  // 用于存储分类信息的 Map: categoryFolder -> { info, articles, slug, icon }
  const categoryMap = new Map<string, {
    info: ReturnType<typeof parseFolderName>;
    articles: DocumentItem[];
    slug: string;
    icon?: LucideIcon;
  }>();
  
  // 用于检测重复 URL 的 Map: routePath -> 文件路径
  const urlMap = new Map<string, string>();

  // 工具：将 CamelCase 或包含连字符/空格的字符串转换为 lower_snake_case
  const toSnakeCaseLower = (input: string): string => {
    // 将驼峰转为下划线
    const step1 = input
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[-\s]+/g, '_');
    return step1.toLowerCase();
  };

  // 遍历所有模块，按分类分组
  Object.entries(documentModules).forEach(([path, module]) => {
    const { categoryFolder, fileName, isIndexFile } = parsePath(path);
    
    // 解析文件名，提取 order
    const fileInfo = parseFileName(fileName);
    
    // 如果文件名不符合格式，跳过该文件
    if (!fileInfo) {
      return;
    }
    
    const document = module.default;
    
    // 检测文件类型
    // 对于index文件，需要从路径中提取实际的文件扩展名
    const actualFileName = isIndexFile ? path.split('/').pop() || fileName : fileName;
    const fileType = detectFileType(actualFileName);


    // 解析文件夹名称
    let categoryInfo;
    try {
      categoryInfo = parseFolderName(categoryFolder);
    } catch (error) {
      throw new Error(
        `解析文件夹名称失败: ${path}\n` +
        `${(error as Error).message}`
      );
    }

    // 处理不同文件类型的内容和标题
    let title: string;
    let jsxContent: React.ReactNode;
    
    if (fileType === 'md' || fileType === 'mdx') {
      // MD/MDX文件：检查是否有导出的title
      
      // 检查模块是否有导出的title属性
      if ((module as any).title) {
        title = (module as any).title;
      } else {
        // 如果没有导出title，使用文件名
        let nameWithoutExt: string;
        if (isIndexFile) {
          // 对于index文件，使用文件夹名
          nameWithoutExt = fileName.split('/')[0].replace(/^\[\d+\]/, '');
        } else {
          nameWithoutExt = fileName.replace(/\.(md|mdx)$/, '').replace(/^\[\d+\]/, '');
        }
        title = nameWithoutExt || '未命名文档';
      }
      
      // 创建MDX组件
      const MDXComponent = document;
      jsxContent = (
        <MDXProviderWrapper>
          {React.createElement(MDXComponent)}
        </MDXProviderWrapper>
      );
    } else {
      // TSX文件：使用原有的title和jsx
      title = document.title;
      jsxContent = document.jsx;
    }

    // 读取该分类的 info.tsx 以获取 slug 覆盖（如果提供）
    const categoryInfoPath = Object.keys(categoryInfoModules).find(p => p.includes(`/${categoryFolder}/info.tsx`));
    const folderInfo = categoryInfoPath ? categoryInfoModules[categoryInfoPath].default : undefined;
    if (!folderInfo?.slug) {
      throw new Error(`分类 ${categoryFolder} 缺少 info.tsx 中的必填 slug 字段`);
    }
    const categoryPathSlug = String(folderInfo.slug).trim().replace(/^\/+|\/+$/g, '');

    // 生成路由路径：{slug}/{categoryPath}/{slug}
    // slug 直接从文件名获取
    // 例如：[1]music_theory.tsx => music_theory
    const routePath = `${categoryPathSlug}/${fileInfo.slug}`;

    // 检查是否有重复的 URL（包含基础前缀 slug）
    const fullUrl = `${Music12GuideConfig.slug}/${routePath}`;
    if (urlMap.has(fullUrl)) {
      const existingFilePath = urlMap.get(fullUrl);
      throw new Error(
        `❌ 检测到重复的用户指引 URL!\n` +
        `URL: ${fullUrl}\n` +
        `文件1: ${existingFilePath}\n` +
        `文件2: ${path}\n` +
        `请修改文件名或分类以确保唯一性。`
      );
    }
    
    urlMap.set(fullUrl, path);

    // 根据文件类型创建内容
    let content: ReactNode;
    if (fileType === 'md' || fileType === 'mdx') {
      // MD/MDX文件需要用MDXProvider包装
      content = (
        <MDXProviderWrapper>
          {jsxContent}
        </MDXProviderWrapper>
      );
    } else {
      // TSX文件直接使用
      content = jsxContent;
    }

    // 创建 DocumentItem
    const documentItem: DocumentItem = {
      title,
      routePath,
      order: fileInfo.order,
      content,
      fileName
    };

    // 按分类分组
    if (!categoryMap.has(categoryFolder)) {
      categoryMap.set(categoryFolder, {
        info: categoryInfo,
        articles: [],
        slug: categoryPathSlug,
        icon: folderInfo.icon
      });
    }
    categoryMap.get(categoryFolder)!.articles.push(documentItem);
  });

  // 转换为数组
  const categories: DocumentCategory[] = [];
  
  categoryMap.forEach(({ info, articles, slug, icon }, categoryFolder) => {
    // 对每个分类内的文档按 order 排序（数字越小越靠上）
    const sortedArticles = articles.sort((a, b) => {
      return a.order - b.order;
    });

    categories.push({
      categoryName: info.name,
      categoryPath: slug,
      categoryOrder: info.order,
      articles: sortedArticles,
      icon: icon
    });
  });

  // 对分类本身按 order 排序（数字越小越靠上）
  categories.sort((a, b) => {
    return a.categoryOrder - b.categoryOrder;
  });

  return categories;
}

// 导出分组后的文档数据
export const userDocumentCategories = groupAndSortDocuments();

// 导出扁平化的所有文档（用于路由）
export const allUserDocuments = userDocumentCategories.flatMap(cat => cat.articles);

// 创建 BookLoader 实现
const music12DocumentLoader: BookLoader = {
  config: {
    title: Music12GuideConfig.title,
    slug: Music12GuideConfig.slug,
    icon: () => Music12GuideConfig.icon,
    description: Music12GuideConfig.description
  },
  
  categories: userDocumentCategories,
  
  getAllArticles(): BookArticle[] {
    return allUserDocuments;
  },
  
  getCurrentArticle(path: string): BookArticle | null {
    const normalizedPath = path.toLowerCase().replace(/^\/+|\/+$/g, '');
    return allUserDocuments.find(article => 
      article.routePath.toLowerCase() === normalizedPath
    ) || null;
  },
  
  getNavigationData() {
    return {
      categories: userDocumentCategories,
      allArticles: allUserDocuments
    };
  },
  
  initializeBookState() {
    // 设置全局书籍状态 - 只标记为书籍页面
    globalSettingsStore.getState().setIsBookPage(true);
  }
};

// 生成路由的函数
export function generateMusic12DocumentRoutes(): RouteObject[] {
  return [
    {
      path: Music12GuideConfig.slug,
      element: (
        <BookLayoutConfigProvider basePrefix={`/${Music12GuideConfig.slug}`}>
          <BookLayout loader={music12DocumentLoader} />
        </BookLayoutConfigProvider>
      ),
      children: [
        // 默认跳转到第一篇文章
        {
          index: true,
          element: allUserDocuments.length > 0 
            ? (<DebugRedirect to={allUserDocuments[0].routePath} />)
            : <div className="p-6 text-center text-muted-foreground">暂无文章</div>,
        },
        // 所有组件页面 - 用 ArticleContent 包装
        ...userDocumentCategories.flatMap((category) =>
          category.articles.map((article) => {
            // 子路由路径（相对于 /{slug}）
            const path = article.routePath;
            return {
              path: path,
              element: <ArticleContent loader={music12DocumentLoader}>{article.content}</ArticleContent>,
            };
          })
        ),
      ],
    },
  ];
}

export default music12DocumentLoader;

// 调试用跳转组件：打印 from/to 以及父路径
function DebugRedirect({ to }: { to: string }) {
  const el = React.useMemo(() => {
    return <Navigate to={to} replace />
  }, [to]);
  return el;
}
