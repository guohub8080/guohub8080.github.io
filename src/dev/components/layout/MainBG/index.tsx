/** @jsxImportSource react */
/**
 * 主背景组件 - 可切换不同背景效果
 */
import React from "react";
import { AuroraBackground } from "../../../shadcn/components/background/AuroraBackground";

// 背景类型枚举
export type BackgroundType = "aurora" | "none" | "gradient";

interface MainBGProps {
  type?: BackgroundType;
  className?: string;
}

const MainBG: React.FC<MainBGProps> = ({ type = "gradient", className = "" }) => {
  // 根据类型渲染不同的背景
  const renderBackground = () => {
    switch (type) {
      case "aurora":
        return (
          <AuroraBackground className={`!fixed !inset-0 !h-screen !w-screen !z-0 !justify-start !items-stretch ${className}`}>
            <div />
          </AuroraBackground>
        );
      
      case "gradient":
        return (
          <div className={`fixed inset-0 h-screen w-screen z-0 overflow-hidden ${className}`}>
            {/* 动态渐变背景 */}
            <div 
              className="absolute inset-0 opacity-100"
              style={{
                background: `
                  linear-gradient(45deg, 
                    #667eea 0%, 
                    #764ba2 15%, 
                    #f093fb 30%, 
                    #4facfe 45%, 
                    #00f2fe 60%, 
                    #43e97b 75%, 
                    #38f9d7 90%, 
                    #667eea 100%)
                `,
                backgroundSize: '400% 400%',
                animation: 'gradientShift 20s ease infinite'
              }}
            />
            {/* 叠加层 - 亮色模式下变亮，暗色模式下变暗 */}
            <div className="absolute inset-0 bg-white/90 dark:bg-black/75" />
            
            {/* CSS 动画定义 */}
            <style>{`
              @keyframes gradientShift {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
            `}</style>
          </div>
        );
      
      case "none":
        return (
          <div 
            className={`fixed inset-0 h-screen w-screen z-0 bg-background ${className}`}
          />
        );
      
      default:
        return null;
    }
  };

  return <>{renderBackground()}</>;
};

export default MainBG;

