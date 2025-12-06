/** @jsxImportSource react */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useBookLayoutConfig } from "./BookLayoutContext.tsx";
import type { BookLoader } from "../types/BookLoader.ts";

/**
 * Breadcrumbs - 面包屑（internal）
 * - 从当前路径和 loader 数据推导：Home > 指南 > 分类 > 文章
 * - basePrefix 由 BookLayoutConfigProvider 提供（例如 /svg-guide 或 /music-theory）
 */
interface BreadcrumbsProps {
  loader: BookLoader;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ loader }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { basePrefix } = useBookLayoutConfig();

  const lowerPath = location.pathname.toLowerCase();
  const prefix = (basePrefix || "").toLowerCase().replace(/^\/+|\/+$/g, "");
  const segments = lowerPath.split("/").filter(Boolean);
  const routeSegments = prefix && segments[0] === prefix ? segments.slice(1) : segments;
  const routePart = routeSegments.join("/");

  let currentCategory: { categoryName: string } | null = null;
  let currentArticle: { title: string; routePath: string } | null = null;

  for (const category of loader.categories) {
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
    { label: "首页", onClick: () => navigate("/home/") },
    { label: loader.config.title, onClick: () => navigate(`/${prefix}/`) },
    { label: currentCategory.categoryName },
    { label: currentArticle.title },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 pb-4 border-b overflow-x-auto flex-wrap min-w-0">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          {item.onClick ? (
            <button onClick={item.onClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0">
              {idx === 0 && <Home className="w-4 h-4 inline mr-1" />}
              {item.label}
            </button>
          ) : (
            <span className="text-sm font-medium text-foreground shrink-0">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};


