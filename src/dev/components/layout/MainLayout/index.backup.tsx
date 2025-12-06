/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useState, useRef, useEffect} from "react";
import {Outlet} from "react-router-dom";
import Sidebar from "@comps/layout/Sidebar";
import FloatToolbar from "../../../apps/FloatToolbar";
import useKeyboardJs from "react-use/lib/useKeyboardJs";
import ResizablePanel from "@comps/ResizablePanel";
import {useViewSettingsStore} from "../../../store/useViewSettingsStore.ts";
import PreviewErrorBoundary from "../../ErrorBoundary";

/**
 * 主布局组件
 * 包含侧边栏、主内容区和浮动工具栏
 */
const MainLayout = () => {
  const [isShiftKeyPressed] = useKeyboardJs('shift');

  // 使用 zustand store 管理视图设置
  const { bgColor, viewPadding, articleScroll, setArticleScroll, setMaxScroll } = useViewSettingsStore();
  
  // 滚动容器的引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingFromSlider = useRef(false); // 标记是否是从滑块触发的滚动

  // 是否隐藏侧边栏
  const [isSideHide, setIsSideHide] = useState(false)
  
  // 监听 articleScroll 变化，滚动到对应位置
  useEffect(() => {
    if (scrollContainerRef.current && !isScrollingFromSlider.current) {
      scrollContainerRef.current.scrollTop = articleScroll;
    }
    isScrollingFromSlider.current = false;
  }, [articleScroll]);
  
  // 监听滚动事件，更新 articleScroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const scrollHeight = scrollContainerRef.current.scrollHeight;
      const clientHeight = scrollContainerRef.current.clientHeight;
      const maxScrollValue = scrollHeight - clientHeight;
      
      // 更新最大滚动高度
      setMaxScroll(maxScrollValue);
      
      // 标记这是从容器滚动触发的，避免循环
      isScrollingFromSlider.current = true;
      setArticleScroll(Math.round(scrollTop));
    }
  };
  
  // 计算最大滚动高度（当内容变化时）
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollHeight = scrollContainerRef.current.scrollHeight;
      const clientHeight = scrollContainerRef.current.clientHeight;
      const maxScrollValue = scrollHeight - clientHeight;
      setMaxScroll(Math.max(0, maxScrollValue));
    }
  }, [setMaxScroll]);
  
  return (
    <> 
      {/* 浮动工具栏 */}
      <FloatToolbar 
        switchSide={() => setIsSideHide(!isSideHide)}
        clearQueryCompare={() => {}}
      />
      
      <div style={{backgroundColor: "#3C3C3C"}}>
        <div style={{backgroundColor: "#3C3C3C", overflowX: "hidden"}}>
          <div style={{display: "flex", overflowX: "hidden"}}>
            {/* 侧边栏 */}
            {!isSideHide && (
              <ResizablePanel defaultWidth={300} maxWidth={600} minWidth={200}>
                <Sidebar 
                  isShiftKeyPressed={isShiftKeyPressed} 
                  openCompareArticle={() => {}}
                />
              </ResizablePanel>
            )}
            
            {/* 主内容视图 */}
            <ResizablePanel defaultWidth={400} maxWidth={900} minWidth={200}>
              <div 
                style={{
                  backgroundColor: bgColor, 
                  height: "calc(100vh)"
                }}>
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  style={{
                    padding: viewPadding,
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden"
                  }}>
                  <section id="gzt">
                    <PreviewErrorBoundary errorTitle="内容渲染出错">
                      <Outlet/>
                    </PreviewErrorBoundary>
                  </section>
                </div>
              </div>
            </ResizablePanel>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainLayout;

