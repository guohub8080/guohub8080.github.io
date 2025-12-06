import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shadcn/components/ui/card.tsx';
import { cn } from "../../../../shadcn/lib/utils.ts"
import { Eye, CheckCircle2, FileText } from 'lucide-react';

interface ExamAnswerProps {
  answer: string;
  explain?: React.ReactNode;
  className?: string;
}

export default function ExamAnswer({ answer, explain, className }: ExamAnswerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={cn(
        "cursor-pointer transition-all duration-200 my-2.5 select-none rounded-md border overflow-hidden",
        isOpen 
          ? "bg-card border-border/60 shadow-sm" 
          : "bg-accent/40 border-accent/60 hover:bg-accent/60 hover:border-border",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* 触发区域 */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span className={cn(
          "transition-transform duration-200 text-xs text-muted-foreground/50",
          isOpen && "rotate-90"
        )}>
          ▶
        </span>
        <Eye className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span className="text-sm font-medium text-muted-foreground">
          {isOpen ? "答案与解析" : "查看答案"}
        </span>
      </div>

      {/* 展开内容 */}
      {isOpen && (
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-border/40 animate-in slide-in-from-top-2 fade-in-50 duration-200">
          <div className="mt-2.5 rounded-md bg-primary/8 border border-primary/20 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-xs font-semibold text-primary/80 uppercase tracking-wide">答案</span>
            </div>
            <div className="text-sm font-medium text-foreground select-text leading-relaxed pl-5">
              {answer}
            </div>
          </div>
          
          {explain && (
            <div className="rounded-md bg-muted/40 border border-border/40 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">解析</span>
              </div>
              <div className="text-sm text-foreground/90 leading-relaxed select-text pl-5">
                {explain}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
