import React, { useState } from 'react';
import { Button } from '../../../../dev/shadcn/components/ui/button.tsx';
import { Copy, Check } from 'lucide-react';
import byDefault from '../../../../dev/utils/common/byDefault.ts';

interface PromptWindowProps {
  content: string;
  isHeadCopy?: boolean;
  isFootCopy?: boolean;
}

const PromptWindow: React.FC<PromptWindowProps> = (props) => {
  const { content } = props;
  const isHeadCopy = byDefault(props.isHeadCopy, false);
  const isFootCopy = byDefault(props.isFootCopy, false);
  
  // 如果都为false，则默认head为true
  const showHeadCopy = isHeadCopy || (!isHeadCopy && !isFootCopy);
  const showFootCopy = isFootCopy;
  
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后重置状态
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      {/* 头部区域 */}
      {showHeadCopy && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 rounded-t-lg">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Prompt
          </h3>
          <Button 
            onClick={handleCopy}
            variant="default"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                复制
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* 内容区域 */}
      <div className={`p-4 ${showFootCopy ? '' : 'rounded-b-lg'} ${showHeadCopy ? '' : 'rounded-t-lg'}`}>
        <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {content}
        </div>
      </div>
      
      {/* 底部复制按钮 */}
      {showFootCopy && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Prompt
          </h3>
          <Button 
            onClick={handleCopy}
            variant="default"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                复制
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromptWindow;