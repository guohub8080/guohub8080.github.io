/**
 * BookSidebar - 图书布局侧边栏（internal）
 */
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookText } from "lucide-react";
import useGlobalSettings from "../../../../store/useGlobalSettings";
import { BookSidebarWrapper } from "./BookSidebarWrapper.tsx";
import { useBookLayoutConfig } from "./BookLayoutContext.tsx";
import type { LucideIcon } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../../../shadcn/components/ui/sidebar.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import type { BookLoader } from "../types/BookLoader.ts";
import { useBookSidebar } from "./BookSidebarProvider.tsx";

interface BookSidebarProps extends React.ComponentProps<typeof BookSidebarWrapper> {
  loader: BookLoader;
}

export function BookSidebar({ loader, ...props }: BookSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigationHeight } = useGlobalSettings();
  const { setOpenMobile, isMobile, openMobile } = useBookSidebar();

  const { categories, allArticles } = loader.getNavigationData();
  
  const config = useBookLayoutConfig();
  type SidebarNavItem = { title: string; routePath: string; isActive: boolean; uniqueKey: string };
  type SidebarNavCategory = { title: string; icon: LucideIcon; isActive: boolean; items: SidebarNavItem[] };
  const lowerPath = location.pathname.toLowerCase();
  const basePrefix = (config?.basePrefix || "").toLowerCase();
  
  // 使用动态的 basePrefix 来处理路径
  const segments = lowerPath.split("/").filter(Boolean);
  const prefixWithoutSlash = basePrefix.replace(/^\/+|\/+$/g, ''); // 移除前后的斜杠
  const routeSegments = prefixWithoutSlash && segments[0] === prefixWithoutSlash 
    ? segments.slice(1) 
    : segments;
  const routePart = routeSegments.join("/");
  
  const isActivePath = (routePath: string) => routePart === routePath.toLowerCase();
  const hasActiveItem = (categoryPath: string) => routePart.startsWith(categoryPath.toLowerCase());
  const navData: SidebarNavCategory[] = categories.map((category) => ({
    title: category.categoryName,
    icon: category.icon || BookText,
    isActive: hasActiveItem(category.categoryPath),
    items: category.articles.map((article) => ({
      title: article.title,
      routePath: `${basePrefix}/${article.routePath}`,
      isActive: isActivePath(article.routePath),
      // 添加层级key：路由路径-文件夹名-文章slug
      uniqueKey: `${basePrefix.replace(/^\/+|\/+$/g, '')}-${category.categoryPath}-${article.routePath.split('/').pop()}`,
    })),
  }));

  return (
    <BookSidebarWrapper
      variant="floating"
      {...props}
    
      style={{
        "--nav-height": `${navigationHeight}px`,
        top: `${navigationHeight}px`,
        marginLeft:byDefault(props.containerStyle?.marginLeft, 0),
        height: `calc(100vh - ${navigationHeight}px)`,
      } as React.CSSProperties}
    >
      <SidebarHeader className="bg-card border-b rounded-t-lg">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex aspect-square size-10 items-center justify-center">
            <loader.config.icon />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-base">{loader.config.title}</span>
            <span className="text-xs text-muted-foreground">共 {allArticles.length} 篇文章</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {navData.map((item, index) => (
              <SidebarMenuItem key={item.title} className={index > 0 ? "mt-6" : ""}>
                <div className="flex items-center gap-2 px-2 py-1.5 font-medium text-sm">
                  <item.icon className="size-4" />
                  {item.title}
                </div>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5 mt-1">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.uniqueKey}>
                        <SidebarMenuSubButton
                          isActive={subItem.isActive}
                          onClick={() => {
                            if (isMobile) {
                              setOpenMobile(false);
                            }
                            navigate(subItem.routePath);
                          }}
                          className={`cursor-pointer ${isMobile ? 'h-11' : ''}`}
                          style={subItem.isActive ? { backgroundColor: "#1976D2", color: "#ffffff", fontWeight: 500 } : undefined}
                        >
                          <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap" title={subItem.title}>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </BookSidebarWrapper>
  );
}


