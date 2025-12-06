/**
 * 通用书籍加载器接口
 * 任何书籍系统都需要实现这个接口
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * 书籍配置信息
 */
export interface BookConfig {
  /** 书籍标题 */
  title: string;
  /** 书籍 slug（用于 URL 路径） */
  slug: string;
  /** 书籍图标 */
  icon: React.ComponentType;
  /** 书籍描述 */
  description?: string;
}

/**
 * 文章项
 */
export interface BookArticle {
  /** 文章标题 */
  title: string;
  /** 文章路由路径（相对于书籍根路径） */
  routePath: string;
  /** 文章排序号 */
  order: number;
  /** 文章内容 */
  content: React.ReactNode;
}

/**
 * 书籍分类
 */
export interface BookCategory {
  /** 分类显示名称 */
  categoryName: string;
  /** 分类路由路径标识符 */
  categoryPath: string;
  /** 分类排序号 */
  categoryOrder: number;
  /** 分类图标 */
  icon?: LucideIcon;
  /** 该分类下的所有文章 */
  articles: BookArticle[];
}

/**
 * 通用书籍加载器接口
 */
export interface BookLoader {
  /** 书籍配置信息 */
  config: BookConfig;
  
  /** 书籍分类数据 */
  categories: BookCategory[];
  
  /** 获取所有文章（扁平化） */
  getAllArticles(): BookArticle[];
  
  /** 根据路径获取当前文章 */
  getCurrentArticle(path: string): BookArticle | null;
  
  /** 获取导航数据 */
  getNavigationData(): {
    categories: BookCategory[];
    allArticles: BookArticle[];
  };
  
  /** 初始化书籍状态（设置全局状态） */
  initializeBookState(): void;
}
