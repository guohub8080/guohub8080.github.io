/** @jsxImportSource react */
/**
 * 首页组件 - 使用 Kanban 风格的横向卡片布局
 */
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Hero from "./Hero"
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
} from "../../shadcn/components/ui/kanban.tsx"
import { CardData, columns, initialCards } from "./cardsConfig.tsx"

export default function Home() {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const navigate = useNavigate();
  const ICP_LINK = "https://beian.miit.gov.cn/";
  
  const handleCardClick = (href: string) => {
    // 如果是外部链接，在新窗口打开
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      // 内部链接使用 navigate
      // 移除开头的 # 和 /
      const path = href.replace(/^#?\/?/, '/');
      navigate(path);
    }
  };
  
  return (
    <>
      <div className="container mx-auto max-w-6xl relative z-10 pb-20 px-4">
        <Hero />
        
        {/* Kanban 风格的横向卡片布局 - 完全按照模板 */}
        <div className="mt-4">
          <KanbanProvider columns={columns} data={cards} onDataChange={setCards}>
            {(column) => (
              <KanbanBoard id={column.id} key={column.id} className={column.id === 'about' ? 'pt-0' : ''}>
                {/* 只有非"关于"分区才显示标题 */}
                {column.id !== 'about' && (
                  <KanbanHeader className="mb-1">
                    <div className="relative inline-block">
                      <span className="relative z-10 text-lg font-semibold text-foreground">
                        {column.name}
                      </span>
                      <div 
                        className="absolute bottom-0.5 -left-4 -right-4 h-3 rounded-sm -z-10"
                        style={{ 
                          backgroundColor: column.color,
                          opacity: 0.25
                        }}
                      />
                    </div>
                  </KanbanHeader>
                )}
                <KanbanCards id={column.id}>
                  {(card: CardData) => (
                    <KanbanCard
                      column={card.column}
                      id={card.id}
                      key={card.id}
                      name={card.title}
                    >
                      <div
                        onClick={() => handleCardClick(card.href)}
                        className="block no-underline group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="shrink-0 w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                            style={{ color: card.color }}
                          >
                            {card.icon}
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <p className="m-0 font-normal text-base">
                              {card.title}
                            </p>
                            <p className="m-0 text-muted-foreground text-sm">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </KanbanCard>
                  )}
                </KanbanCards>
              </KanbanBoard>
            )}
          </KanbanProvider>
        </div>
      </div>

      {/* 深色页脚 - 备案信息 */}
      <footer className="w-full bg-neutral-700 text-neutral-300">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-50">
          <div className="flex flex-col items-center justify-center gap-3 text-sm">
            {/* 白色图标 */}
            <span className="inline-flex items-center justify-center" aria-hidden>
              <svg viewBox="0 0 480 554" className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M53.253,199.859L53.253,384.338L213.026,476.578L213.026,292.114L53.253,199.859ZM186.4,30.746L239.667,0L479.32,138.366L479.32,169.113L266.279,292.114L266.294,476.592L426.052,384.338L426.052,322.845L319.546,384.338L319.546,322.845L479.305,230.606L479.32,415.085L239.667,553.451L0,415.085L0,138.366L26.641,122.986L239.667,245.987L399.426,153.747L186.4,30.746Z" fill="currentColor" fillRule="nonzero" />
              </svg>
            </span>
            <div className="-mb-2">
              guohub.top
            </div>
            {/* 备案信息 */}
            <a
              href={ICP_LINK}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              京ICP备2023017358号-1
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

