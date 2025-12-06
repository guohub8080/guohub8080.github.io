/**
 * ArticleContent - 文章内容组件
 * 
 * 功能说明：
 * 1. 卡片式文章展示布局，带边框和阴影
 * 2. 自动生成面包屑导航（首页 > SVG指南 > 分类 > 当前文章）
 * 3. 自动生成上一篇/下一篇导航（基于文章顺序）
 * 4. 使用 ErrorBoundary 包裹内容，防止渲染错误
 * 5. 响应式设计，适配不同屏幕尺寸
 * 
 * 布局结构：
 * - 卡片容器：最大宽度 4xl、居中、带边框和阴影
 * - 面包屑导航：顶部固定，跟随内容滚动
 * - 文章内容区：通过 children 传入
 * - 上下篇导航：底部固定，带交互效果
 * 
 * Props:
 * - children: 文章主体内容（React 节点）
 */
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Home, ArrowLeft, ArrowRight } from "lucide-react";
import PreviewErrorBoundary from "../../ErrorBoundary";
import { Button } from "../../../shadcn/components/ui/button.tsx";
import { useBookLayoutConfig } from "./internal/BookLayoutContext.tsx";
import useGlobalSettings from "../../../store/useGlobalSettings";
import type { BookLoader } from "./types/BookLoader.ts";

interface ArticleContentProps {
  children: React.ReactNode;
  loader: BookLoader;
}

const ArticleContent = ({ children, loader }: ArticleContentProps) => {
  const location = useLocation();  // 获取当前路由路径
  const navigate = useNavigate();  // 用于编程式导航
  const { basePrefix } = useBookLayoutConfig(); // 获取基础路径前缀
  const { bookContentPadding } = useGlobalSettings();

  /**
   * 生成面包屑导航 - 使用 useMemo 优化性能
   * 
   * 逻辑：
   * 1. 获取当前路由路径（例如：/{basePrefix}/basic/translate）
   * 2. 在 userGuideCategories 中查找匹配的文章
   * 3. 构建面包屑层级：首页 > 指南 > 分类 > 文章
   */
  const breadcrumbs = useMemo(() => {
    const lowerPath = location.pathname.toLowerCase();
    
    // 路径格式: /{basePrefix}/category/slug
    const segments = lowerPath.split("/").filter(Boolean);
    
    // 如果路径以 basePrefix 开头，则移除它
    const prefixWithoutSlash = basePrefix.replace(/^\/+|\/+$/g, ''); // 移除前后的斜杠
    const routeSegments = prefixWithoutSlash && segments[0] === prefixWithoutSlash 
      ? segments.slice(1) 
      : segments;
    const routePart = routeSegments.join("/");

    let currentCategory: { categoryName: string } | null = null;
    let currentArticle: { title: string; routePath: string } | null = null;

    const { categories } = loader.getNavigationData();
    for (const category of categories) {
      for (const article of category.articles) {
        if (routePart === article.routePath.toLowerCase()) {
          currentCategory = category as any;
          currentArticle = article as any;
          break;
        }
      }
      if (currentCategory) break;
    }

    if (!currentCategory || !currentArticle) return null;

    const items: { label: string; onClick?: () => void }[] = [
      { label: loader.config.title },
      { label: currentCategory.categoryName },
      { label: currentArticle.title },
    ];

    return items;
  }, [location.pathname, loader, basePrefix]);  // 添加 loader 和 basePrefix 依赖

  /**
   * 获取上一篇和下一篇文章 - 使用 useMemo 优化性能
   * 
   * 逻辑：
   * 1. 获取当前路由路径（routePath 都是英文，例如：base/translate）
   * 2. 在 allUserGuides 数组中查找当前文章的索引
   *    - allUserGuides 是所有文章的扁平化数组，按 loader 中的顺序排列
   * 3. 根据索引计算上一篇（index-1）和下一篇（index+1）
   * 4. 边界处理：第一篇没有上一篇，最后一篇没有下一篇
   * 
   * 返回：
   * - prev: 上一篇文章对象（null 表示没有上一篇）
   * - next: 下一篇文章对象（null 表示没有下一篇）
   */
  const { prev, next } = useMemo(() => {
    const currentPath = location.pathname.toLowerCase();

    // 在所有文章中查找当前文章的索引位置
    const { allArticles } = loader.getNavigationData();
    const currentIndex = allArticles.findIndex(
      article => `${basePrefix}/${article.routePath}`.toLowerCase() === currentPath
    );

    // 如果未找到当前文章，返回空导航
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    // 计算上一篇：如果不是第一篇，则取前一个
    const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;

    // 计算下一篇：如果不是最后一篇，则取后一个
    const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

    return {
      prev: prevArticle,  // 上一篇文章
      next: nextArticle,  // 下一篇文章
    };
  }, [location.pathname, loader, basePrefix]);  // 添加 loader 和 basePrefix 依赖

  return (
    // 卡片容器：最大宽度 4xl、居中、圆角边框、阴影
    <div
      style={{ marginBottom: 100 }}
      className="flex flex-col w-full mx-auto rounded-lg border bg-card shadow-sm overflow-y-hidden overflow-x-visible">
      {/* 主内容区域：流式布局，无内边距 */}
      <main className="w-full overflow-x-visible">
        {/* 
          面包屑导航区域
          - 仅在有面包屑数据时显示
          - 跟随内容滚动（非固定定位）
          - 支持水平滚动和换行
        */}
        {breadcrumbs && (
          <div className="flex items-center gap-2 mb-6 border-b overflow-x-auto flex-wrap py-3" style={{ paddingLeft: bookContentPadding }}>
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                {idx === 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0 mr-1">
                    <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
                <span className="text-sm font-medium text-foreground shrink-0">{item.label}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* 
          文章内容区域
          - 使用 ErrorBoundary 包裹，防止内容渲染错误导致整个应用崩溃
          - children: 由父组件传入的文章主体内容
        */}
        <PreviewErrorBoundary errorTitle="内容渲染出错">
          <div className="w-full" style={{ paddingLeft: bookContentPadding, paddingRight: bookContentPadding }}>
            {children}
          </div>
        </PreviewErrorBoundary>

        {/* 
          上一篇/下一篇导航区域
          - 始终显示（无论是否有上下篇）
          - 响应式布局：小屏幕垂直排列，大屏幕水平两端对齐
          - 顶部留白 16、顶部边框 2px
        */}
        <div
          style={{ paddingLeft: bookContentPadding, paddingRight: bookContentPadding, paddingBottom: bookContentPadding, paddingTop: bookContentPadding }}
          className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-4 sm:gap-6 mt-16 border-t-2">
          {/* 
                上一篇导航卡片
                - 有上一篇：显示可点击的卡片，带 hover 效果
                - 无上一篇：显示禁用状态的卡片（虚线边框、半透明）
              */}
          {prev ? (
            // 可点击的上一篇卡片
            <div
              onClick={() => navigate(`${basePrefix}/${prev.routePath}`)}
              className="group cursor-pointer flex flex-col w-full gap-4 p-4 sm:p-6 rounded-xl border border-border hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all max-w-[20rem]"
            >
              {/* 左箭头图标 - hover 时变为主题色背景 */}
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary transition-all">
                <ArrowLeft className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors" />
              </div>
              {/* 文字信息 */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">上一篇</span>
                <span className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
                  {prev.title}
                </span>
              </div>
            </div>
          ) : (
            // 禁用状态的上一篇卡片（已是第一篇）
            <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-xl w-full border border-dashed border-border/50 opacity-40">
              <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">上一篇</span>
                <span className="text-sm text-muted-foreground">已是第一篇</span>
              </div>
            </div>
          )}

          {/* 
                下一篇导航卡片
                - 有下一篇：显示可点击的卡片，带 hover 效果
                - 无下一篇：显示禁用状态的卡片（虚线边框、半透明）
                - 右对齐布局（与上一篇对称）
              */}
          {next ? (
            // 可点击的下一篇卡片（右对齐）
            <div
              onClick={() => navigate(`${basePrefix}/${next.routePath}`)}
              className="group cursor-pointer flex flex-col w-full gap-4 p-4 sm:p-6 rounded-xl border border-border hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all max-w-[20rem]"
            >
              {/* 右箭头图标 - hover 时变为主题色背景 */}
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary transition-all">
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors" />
              </div>
              {/* 文字信息（右对齐） */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">下一篇</span>
                <span className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
                  {next.title}
                </span>
              </div>
            </div>
          ) : (
            // 禁用状态的下一篇卡片（已是最后一篇）
            <div className="flex flex-col gap-4 p-4  sm:p-6 rounded-xl border border-dashed border-border/50 opacity-40 w-full">
              <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center shrink-0">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">下一篇</span>
                <span className="text-sm text-muted-foreground">已是最后一篇</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ArticleContent;

