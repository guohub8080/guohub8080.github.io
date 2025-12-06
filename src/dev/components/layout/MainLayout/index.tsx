/** @jsxImportSource react */
/**
 * 主布局组件 - 新版本
 * 仿照 shadcn.com 的设计：顶部导航栏 + 主内容区域
 */
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import PreviewErrorBoundary from "../../ErrorBoundary";
import MainBG, { type BackgroundType } from "../MainBG";
import useGlobalSettings from "../../../store/useGlobalSettings";

const MainLayout = () => {
  const location = useLocation();
  const { setLastVisitedUrl, mainDynamicBackround } = useGlobalSettings();
  const allowed: BackgroundType[] = ["aurora", "none", "gradient"];
  const safeBackground: BackgroundType = allowed.includes(mainDynamicBackround as any)
    ? (mainDynamicBackround as BackgroundType)
    : "gradient";

  // 记录访问路径（排除 settings 页面）
  useEffect(() => {
    const currentPath = location.pathname + location.search + location.hash;
    // 如果不是 settings 页面，记录路径
    if (!location.pathname.includes('/settings')) {
      setLastVisitedUrl(currentPath);
    }
  }, [location, setLastVisitedUrl]);
  return (
    <div className="min-h-screen">
      {/* 背景 - 全屏固定背景，固定在最底层 */}
      <MainBG type={safeBackground} />
      
      {/* 内容层 - 在背景之上 */}
      <div className="relative z-10">
        {/* 导航栏 - sticky 定位 */}
        <Navigation />
        
        {/* 主内容区域 */}
        <main>
          <PreviewErrorBoundary errorTitle="内容渲染出错">
            <Outlet />
          </PreviewErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default MainLayout;
