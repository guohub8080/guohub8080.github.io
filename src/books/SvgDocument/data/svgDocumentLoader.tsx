/**
 * SvgDocument 用户指引动态加载器
 * 自动扫描 src/books/SvgDocument 文件夹下的所有 .tsx, .md, .mdx 文件
 * 按文件夹分组，每个文件夹对应一个分类
 * 
 * 文件夹命名规则：[x]M
 * - [x] - 排序号，数字越小越靠上
 * - M - 显示的分类名称
 * - 每个文件夹必须包含 info.tsx 文件，定义路由 slug 和图标
 * 
 * 文件命名规则：[x]slug.{tsx,md,mdx}
 * - [x] - 排序号（数字，组内排序）
 * - slug - URL 路径（全英文，如：translate, fade_switch）
 * - 扩展名：.tsx（React组件）、.md（Markdown）、.mdx（MDX）
 * 
 * 例如：文件夹 [02]基本动画/info.tsx 定义 slug: "basic"
 *       文件 [1]translate.tsx => 路由为 /{slug}/basic/translate
 *       文件 [2]guide.md => 路由为 /{slug}/basic/guide
 *       文件 [3]tutorial.mdx => 路由为 /{slug}/basic/tutorial
 * 只有符合 [x]slug.{tsx,md,mdx} 格式的文件才会被加载
 */

import React, { ReactNode } from "react";
import { RouteObject, Navigate } from 'react-router-dom';
import BookLayout from '../../../dev/components/layout/BookLayout';
import ArticleContent from '../../../dev/components/layout/BookLayout/ArticleContent.tsx';
import { BookLayoutConfigProvider } from '../../../dev/components/layout/BookLayout/internal/BookLayoutContext.tsx';
import { svgDocumentConfig } from './info.tsx';
import type { LucideIcon } from "lucide-react";
import type { BookLoader, BookConfig, BookCategory, BookArticle } from '../../../dev/components/layout/BookLayout/types/BookLoader.ts';
import useGlobalSettings, { globalSettingsStore } from '../../../dev/store/useGlobalSettings';
import { MDXProviderWrapper, detectFileType, processDocumentContent } from '../../../dev/components/mdx/index.ts';

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
// 当前文件: src/books/SvgDocument/data/svgDocumentLoader.tsx
// 目标目录: src/books/SvgDocument/**/*.{tsx,md,mdx}

// 动态导入父目录下的所有 .tsx, .md, .mdx 文件
// 注意：排除 'data/components/**' 下的文件（公用组件不参与路由）
const allModules = import.meta.glob<{ default: any }>(
  "../**/*.{tsx,md,mdx}",
  { eager: true }
);

// 同时导入原始文件内容用于提取标题
const rawModules = import.meta.glob<string>(
  "../**/*.{md,mdx}",
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
 * 解析文件夹名称，提取排序号和显示名称
 * 格式：[x]M
 * 例如：[02]基本动画 => order: 2, name: 基本动画
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
      `例如: [02]基本动画`
    );
  }
  
  return {
    order: parseInt(match[1], 10),
    name: match[2]
  };
}


/**
 * 解析文件名，提取排序号和 slug
 * 格式：[x]slug.{tsx,md,mdx}
 * 例如：[1]translate.tsx => order: 1, slug: translate
 *      [2]guide.md => order: 2, slug: guide
 *      [3]tutorial.mdx => order: 3, slug: tutorial
 * 
 * 如果文件名不符合格式，返回 null（该文件会被跳过）
 */
function parseFileName(fileName: string): { order: number; slug: string } | null {
  // 移除文件扩展名 (.tsx, .md, .mdx)
  const nameWithoutExt = fileName.replace(/\.(tsx|md|mdx)$/, '');
  
  // 检查是否符合 [x]slug 格式
  const match = nameWithoutExt.match(/^\[(\d+)\](.+)$/);
  
  if (!match) {
    return null; // 不符合格式，跳过该文件
  }
  
  return {
    order: parseInt(match[1], 10),
    slug: match[2]
  };
}

/**
 * 解析路径，提取分类信息
 */
function parsePath(path: string): { 
  categoryFolder: string; 
  fileName: string;
} {
  // 使用相对路径匹配
  // 路径格式: ../[01]基本工具函数/[1]keysplines.tsx
  //          ../[01]基本工具函数/[2]guide.md
  //          ../[01]基本工具函数/[3]tutorial.mdx
  const match = path.match(/^\.\.\/([^\/]+)\/(.+)\.(tsx|md|mdx)$/);
  if (!match) {
    throw new Error(`Invalid preset path: ${path}\nExpected pattern: ../[category]/[file].{tsx,md,mdx}`);
  }
  return {
    categoryFolder: match[1],
    fileName: match[2] + '.' + match[3] // 重新组合文件名和扩展名
  };
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
    const { categoryFolder, fileName } = parsePath(path);
    
    // 解析文件名，提取 order
    const fileInfo = parseFileName(fileName);
    
    // 如果文件名不符合 [x]slug.tsx 格式，跳过该文件
    if (!fileInfo) {
      return;
    }
    
    const document = module.default;
    
    // 检测文件类型
    const fileType = detectFileType(fileName);

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
    const { title, jsxContent } = processDocumentContent(document, fileType, fileName);

    // 读取该分类的 info.tsx 以获取 slug 覆盖（如果提供）
    const categoryInfoPath = Object.keys(categoryInfoModules).find(p => p.includes(`/${categoryFolder}/info.tsx`));
    const folderInfo = categoryInfoPath ? categoryInfoModules[categoryInfoPath].default : undefined;
    if (!folderInfo?.slug) {
      throw new Error(`分类 ${categoryFolder} 缺少 info.tsx 中的必填 slug 字段`);
    }
    const categoryPathSlug = String(folderInfo.slug).trim().replace(/^\/+|\/+$/g, '');

    // 生成路由路径：{slug}/{categoryPath}/{slug}
    // slug 直接从文件名获取
    // 例如：[4]fade_switch.tsx => fade_switch
    const routePath = `${categoryPathSlug}/${fileInfo.slug}`;

    // 检查是否有重复的 URL（包含基础前缀 slug）
    const fullUrl = `${svgDocumentConfig.slug}/${routePath}`;
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
const svgDocumentLoader: BookLoader = {
  config: {
    title: svgDocumentConfig.title,
    slug: svgDocumentConfig.slug,
    icon: () => svgDocumentConfig.icon,
    description: svgDocumentConfig.description
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
export function generateSvgDocumentRoutes(): RouteObject[] {
  return [
    {
      path: svgDocumentConfig.slug,
      element: (
        <BookLayoutConfigProvider basePrefix={`/${svgDocumentConfig.slug}`}>
          <BookLayout loader={svgDocumentLoader} />
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
              element: <ArticleContent loader={svgDocumentLoader}>{article.content}</ArticleContent>,
            };
          })
        ),
      ],
    },
    // 兼容旧地址 /guide -> /{slug}
    {
      path: "guide",
      element: <Navigate to={`/${svgDocumentConfig.slug}/`} replace />,
    },
  ];
}

export default svgDocumentLoader;

// 调试用跳转组件：打印 from/to 以及父路径
function DebugRedirect({ to }: { to: string }) {
  const el = React.useMemo(() => {
    return <Navigate to={to} replace />
  }, [to]);
  return el;
}

