/** @jsxImportSource react */
/**
 * BookLayout - 图书式布局组件
 * 
 * 功能说明：
 * 1. 提供经典的书籍/文档阅读布局：左侧目录 + 右侧内容
 * 2. 使用 SidebarProvider 管理侧边栏的展开/收起状态
 * 3. 使用 Outlet 渲染子路由内容（如文章、章节等）
 * 4. 支持响应式设计，适配不同屏幕尺寸
 * 
 * 布局结构：
 * - 外层容器：全屏宽度，最小高度撑满屏幕
 * - 内容容器：最大宽度 1400px，居中显示，带有 0.5rem 的内边距
 * - 侧边栏（BookSidebar）：可展开/收起的导航目录
 * - 主内容区（SidebarInset）：通过 Outlet 渲染子路由
 * 
 * 全局配置：
 * - bookSideWidth: 侧边栏宽度（默认 300px）
 * - bookContentWidth: 内容区最大宽度（默认 768px）
 * - bookContentPadding: 内容区内边距（默认 30px）
 * - bookSideContentGap: 侧边栏与内容区的间距（默认 10px）
 */
import React, { useMemo, useEffect } from "react";
import { Outlet } from "react-router-dom";
// 公共对外只暴露这三个入口：
import BookSideContainer from "./BookSideContainer.tsx";            // 桌面侧栏
import BookSideMobileContainer from "./BookSideMobileContainer.tsx"; // 移动侧栏
import { BookLayoutConfigProvider } from "./internal/BookLayoutContext.tsx";
import { HeadingNumberProvider } from "../../mdx/contexts/HeadingNumberContext.tsx";
import { useIsMobile } from "../../../shadcn/hooks/use-mobile.ts";
import useGlobalSettings, { globalSettingsStore } from "../../../store/useGlobalSettings";
import { useWindowSize } from "react-use";
import type { BookLoader } from "./types/BookLoader.ts";

interface BookLayoutProps {
  loader: BookLoader;
}

const BookLayout: React.FC<BookLayoutProps> = ({ loader }) => {
  // 初始化书籍状态
  useEffect(() => {
    loader.initializeBookState();
    
    // 组件卸载时清理书籍状态
    return () => {
      globalSettingsStore.getState().setIsBookPage(false);
    };
  }, [loader]);
  
  // 从全局设置中获取布局相关配置
  const {
    bookContentPadding,    // 内容区内边距
    bookContentWidth,      // 内容区最大宽度
    bookSideContentGap,    // 侧边栏与内容区间距
    bookSideWidth,         // 侧边栏宽度
    isBookTocShow,         // 目录是否显示
    setIsBookTocShow,      // 设置目录显示状态
    setBookContentPadding,
    setBookContentWidth,
    setBookSideContentGap,
    setBookSideWidth
  } = useGlobalSettings();

  const isMobile = useIsMobile();
  const { width: windowWidth } = useWindowSize();
  
  // 根据窗口宽度动态调整 bookContentPadding
  useEffect(() => {
    let newPadding: number;
    if (windowWidth < 640) {
      newPadding = 16;      // 小屏幕：16px
    } else if (windowWidth < 768) {
      newPadding = 20;      // 平板：20px
    } else if (windowWidth < 1024) {
      newPadding = 30;      // 中等屏幕：30px
    } else if (windowWidth < 1280) {
      newPadding = 40;      // 大屏幕：40px
    } else {
      newPadding = 50;      // 超大屏幕：50px
    }
    
    if (newPadding !== bookContentPadding) {
      setBookContentPadding(newPadding);
    }
  }, [windowWidth, bookContentPadding, setBookContentPadding]);
  
  const sideMarginLeft = useMemo(() => {
    if(windowWidth <= bookContentWidth + bookSideWidth + bookSideContentGap*2) return 0;
    return 0.5 * (windowWidth - bookSideWidth - bookContentWidth - bookSideContentGap*2);
  }, [windowWidth, bookContentWidth, bookSideWidth, bookSideContentGap]);
  // 桌面端默认左侧留白（供正文避让侧栏）；你也可以直接改下面结构的 style
  const contentMarginLeft = !isMobile && isBookTocShow
    ? `${bookSideWidth + (bookSideContentGap ?? 0)}px`
    : undefined;

  // 简单直观的两套渲染
  if (isMobile) {
    return (
      <BookLayoutConfigProvider basePrefix={`/${loader.config.slug}`}>
        <HeadingNumberProvider>
          <div className="w-full min-h-screen overflow-x-hidden">
            {isBookTocShow && <BookSideMobileContainer loader={loader} />}
            <div
              className={`flex w-full  mx-auto min-w-0`}
              style={{ paddingTop: 0, paddingBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
            >
              <Outlet />
            </div>
          </div>
        </HeadingNumberProvider>
      </BookLayoutConfigProvider>
    );
  }

  // 桌面端
  return (
    <BookLayoutConfigProvider basePrefix={`/${loader.config.slug}`}>
      <HeadingNumberProvider>
        <div className="w-full min-h-screen overflow-x-hidden">
          <div  style={{marginLeft:sideMarginLeft}}
            className={`transition-opacity duration-200 ${
              isBookTocShow ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <BookSideContainer ml={sideMarginLeft} loader={loader} />
          </div>
          <div className={`flex w-full  mx-auto  justify-center `}
          >
            {/* 空白占位,宽度和侧栏的宽度相同,高度随便,这样就可以方便地自动布局了 */}
            <div 
              className="transition-all duration-300 flex-shrink-0"
              style={{ 
                width: isBookTocShow ? bookSideWidth  : 0, 
                minWidth: isBookTocShow ? bookSideWidth  : 0,
                maxWidth: isBookTocShow ? bookSideWidth  : 0,
                height: `calc(50vh)`,
              }} 
            />

              {/* 内容正文 */}
              <div 
                data-slot="book-content" 
                className="flex-grow min-w-0"
                style={{ 
                  maxWidth: bookContentWidth, 
                  marginTop:5,
                  marginLeft: bookSideContentGap, 
                  marginRight: bookSideContentGap 
                }}
              >
                <Outlet />
              </div>
          </div>
        </div>
      </HeadingNumberProvider>
    </BookLayoutConfigProvider>
  );
};

export default BookLayout;

