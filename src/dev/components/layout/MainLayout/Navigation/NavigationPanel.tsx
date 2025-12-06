/** @jsxImportSource react */
/**
 * 导航面板组件 - 显示 Home 页面的卡片内容
 */
import React from "react"
import { useNavigate } from "react-router-dom"
import { useWindowSize } from "react-use"
import { Home } from "lucide-react"
import { columns, initialCards, type CardData } from "../../../../apps/Home/cardsConfig.tsx"
import { cn } from "../../../../shadcn/lib/utils.ts"
import routerPaths from "../../../../router/paths.ts"

interface NavigationPanelProps {
  onNavigate?: () => void
}

export default function NavigationPanel({ onNavigate }: NavigationPanelProps) {
  const navigate = useNavigate()
  const { width } = useWindowSize()

  const handleCardClick = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      const path = href.replace(/^#?\/?/, '/');
      navigate(path);
    }
    onNavigate?.();
  };

  // 移动端：单列，全宽全屏
  if (width < 768) {
    return (
      <div className="w-full h-full max-h-full overflow-y-auto p-4 bg-background/95 backdrop-blur-sm">
        <div className="space-y-6">
          {columns.map((column) => {
            const columnCards = initialCards.filter(card => card.column === column.id);
            if (columnCards.length === 0) return null;

            return (
              <div key={column.id} className="space-y-2">
                {column.id !== 'about' && (
                  <div className="relative inline-block mb-2">
                    <span className="relative z-10 text-sm font-semibold text-foreground">
                      {column.name}
                    </span>
                    <div 
                      className="absolute bottom-0.5 -left-2 -right-2 h-2 rounded-sm -z-10"
                      style={{ 
                        backgroundColor: column.color,
                        opacity: 0.25
                      }}
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 gap-2">
                  {column.id === 'about' && (
                    <div
                      onClick={() => handleCardClick(`/${routerPaths.home}/`)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                        "hover:bg-accent transition-colors",
                        "border border-transparent hover:border-border",
                        "active:scale-[0.98] transition-transform"
                      )}
                    >
                      <div
                        className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300"
                        style={{ color: '#3b82f6' }}
                      >
                        <Home className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="m-0 font-medium text-sm truncate">
                          主页
                        </p>
                        <p className="m-0 text-muted-foreground text-xs truncate">
                          返回首页
                        </p>
                      </div>
                    </div>
                  )}
                  {columnCards.map((card: CardData) => (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card.href)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                        "hover:bg-accent transition-colors",
                        "border border-transparent hover:border-border",
                        "active:scale-[0.98] transition-transform"
                      )}
                    >
                      <div
                        className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ color: card.color }}
                      >
                        {card.icon}
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="m-0 font-medium text-sm truncate">
                          {card.title}
                        </p>
                        <p className="m-0 text-muted-foreground text-xs truncate">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 平板：两列，固定宽度（模仿宽屏模式）
  if (width < 1024) {
    return (
      <div className="w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto p-4 bg-background/95 backdrop-blur-sm">
        <div className="space-y-6">
          {columns.map((column) => {
            const columnCards = initialCards.filter(card => card.column === column.id);
            if (columnCards.length === 0) return null;

            return (
              <div key={column.id} className="space-y-2">
                {column.id !== 'about' && (
                  <div className="relative inline-block mb-2">
                    <span className="relative z-10 text-sm font-semibold text-foreground">
                      {column.name}
                    </span>
                    <div 
                      className="absolute bottom-0.5 -left-2 -right-2 h-2 rounded-sm -z-10"
                      style={{ 
                        backgroundColor: column.color,
                        opacity: 0.25
                      }}
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {column.id === 'about' && (
                    <div
                      onClick={() => handleCardClick(`/${routerPaths.home}/`)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                        "hover:bg-accent transition-colors",
                        "border border-transparent hover:border-border",
                        "active:scale-[0.98] transition-transform"
                      )}
                    >
                      <div
                        className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300"
                        style={{ color: '#3b82f6' }}
                      >
                        <Home className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="m-0 font-medium text-sm truncate">
                          主页
                        </p>
                        <p className="m-0 text-muted-foreground text-xs truncate">
                          返回首页
                        </p>
                      </div>
                    </div>
                  )}
                  {columnCards.map((card: CardData) => (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card.href)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                        "hover:bg-accent transition-colors",
                        "border border-transparent hover:border-border",
                        "active:scale-[0.98] transition-transform"
                      )}
                    >
                      <div
                        className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ color: card.color }}
                      >
                        {card.icon}
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="m-0 font-medium text-sm truncate">
                          {card.title}
                        </p>
                        <p className="m-0 text-muted-foreground text-xs truncate">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 桌面端：三列，固定宽度
  return (
    <div className="w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto p-4 bg-background/95 backdrop-blur-sm">
      <div className="space-y-6">
        {columns.map((column) => {
          const columnCards = initialCards.filter(card => card.column === column.id);
          if (columnCards.length === 0) return null;

          return (
            <div key={column.id} className="space-y-2">
              {column.id !== 'about' && (
                <div className="relative inline-block mb-2">
                  <span className="relative z-10 text-sm font-semibold text-foreground">
                    {column.name}
                  </span>
                  <div 
                    className="absolute bottom-0.5 -left-2 -right-2 h-2 rounded-sm -z-10"
                    style={{ 
                      backgroundColor: column.color,
                      opacity: 0.25
                    }}
                  />
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                {column.id === 'about' && (
                  <div
                    onClick={() => handleCardClick(`/${routerPaths.home}/`)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                      "hover:bg-accent transition-colors",
                      "border border-transparent hover:border-border",
                      "active:scale-[0.98] transition-transform"
                    )}
                  >
                    <div
                      className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300"
                      style={{ color: '#3b82f6' }}
                    >
                      <Home className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <p className="m-0 font-medium text-sm truncate">
                        主页
                      </p>
                      <p className="m-0 text-muted-foreground text-xs truncate">
                        返回首页
                      </p>
                    </div>
                  </div>
                )}
                {columnCards.map((card: CardData) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.href)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                      "hover:bg-accent transition-colors",
                      "border border-transparent hover:border-border",
                      "active:scale-[0.98] transition-transform"
                    )}
                  >
                    <div
                      className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ color: card.color }}
                    >
                      {card.icon}
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <p className="m-0 font-medium text-sm truncate">
                        {card.title}
                      </p>
                      <p className="m-0 text-muted-foreground text-xs truncate">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

