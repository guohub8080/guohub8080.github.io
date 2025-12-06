/** @jsxImportSource react */
import React from "react";
import { BookSidebarProvider } from "./internal/BookSidebarProvider.tsx";
import { BookSidebar } from "./internal/Sidebar.tsx";
import useGlobalSettings from "../../../store/useGlobalSettings";
import type { BookLoader } from "./types/BookLoader.ts";

/**
 * BookSideMobileContainer - 仅用于移动端的侧边栏容器
 * - 使用抽屉 overlay，不参与页面布局
 * - 不支持外部 margin/position 调整
 */
interface BookSideMobileContainerProps {
  loader: BookLoader;
}

const BookSideMobileContainer: React.FC<BookSideMobileContainerProps> = ({ loader }) => {
  const { bookSideWidth, isBookTocShow, setIsBookTocShow } = useGlobalSettings();
  return (
    <BookSidebarProvider
      className="contents"
      defaultOpen
      openMobile={isBookTocShow}
      onOpenMobileChange={setIsBookTocShow}
      style={{ "--sidebar-width": `${bookSideWidth}px` } as React.CSSProperties}
    >
      <BookSidebar loader={loader} />
    </BookSidebarProvider>
  );
};

export default BookSideMobileContainer;


