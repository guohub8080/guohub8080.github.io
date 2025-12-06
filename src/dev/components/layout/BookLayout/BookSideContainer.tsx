/** @jsxImportSource react */
import React from "react";
import { BookSidebarWrapper } from "./internal/BookSidebarWrapper.tsx";
import { BookSidebarProvider } from "./internal/BookSidebarProvider.tsx";
import { BookSidebar } from "./internal/Sidebar.tsx";
import useGlobalSettings from "../../../store/useGlobalSettings";
import { isUndefined, isNumber } from "lodash";
import type { BookLoader } from "./types/BookLoader.ts";

/**
 * BookSideContainer - 仅负责渲染"书籍侧边栏"的容器
 * - 独立拥有 BookSidebarProvider 上下文
 * - 不渲染正文（正文由外层自行决定）
 * - 移动端通过全局 isBookTocShow 控制 Sheet 抽屉开关
 */
type BookSideContainerProps = React.ComponentProps<typeof BookSidebarWrapper> & {
  /** 左侧偏移（px 或任意 CSS 长度），number 会按 px 处理 */
  ml?: number | string;
  /** 书籍加载器 */
  loader: BookLoader;
};

const BookSideContainer: React.FC<BookSideContainerProps> = (props) => {
  const { bookSideWidth } = useGlobalSettings();
  const { ml, style: styleFromProps, loader, ...rest } = props;
  const resolvedLeft = !isUndefined(ml) ? (isNumber(ml) ? `${ml}px` : String(ml)) : undefined;
  const mergedContainerStyle = resolvedLeft
    ? ({ padding: 0, left: resolvedLeft, marginLeft: resolvedLeft } as React.CSSProperties)
    : ({ padding: 0 } as React.CSSProperties);
  return (
    <BookSidebarProvider
      className="contents"
      defaultOpen
      style={{ "--sidebar-width": `${bookSideWidth}px` } as React.CSSProperties}
    >
      <BookSidebar {...rest} style={styleFromProps as React.CSSProperties} containerStyle={mergedContainerStyle} loader={loader} />
    </BookSidebarProvider>
  );
};

export default BookSideContainer;


