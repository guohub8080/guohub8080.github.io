// 错误显示 UI 组件（函数组件）
import React, { useState } from 'react';
import { Button } from '../../shadcn/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/components/ui/card.tsx';
import { Badge } from '../../shadcn/components/ui/badge.tsx';
import { Copy, Check, RefreshCw, FileText, Layers } from 'lucide-react';
import {
  extractFunctionName,
  formatComponentStack,
  getDeviceType,
  getOSInfo,
  getBrowserInfo,
  getPlatformInfo,
  getMobileInfo,
  generateErrorReport,
} from './utils.ts';

interface ErrorDisplayProps {
  error: {
    name: string;
    message: string;
    stack?: string;
    componentStack?: string;
    source?: string;
    line?: number;
    column?: number;
  };
  errorTitle?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, errorTitle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyError = async () => {
    const errorText = generateErrorReport(error);
    
    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="w-full p-4">
      <div className="mx-auto max-w-4xl">
        {/* 错误标题区域 */}
        <div className="mb-6 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-destructive">
              {errorTitle ?? "内容渲染出错"}
            </h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            抱歉，页面内容加载时遇到了问题
          </p>

          {/* 快速操作按钮 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button 
              onClick={handleCopyError}
              className="inline-flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制错误信息
                </>
              )}
            </Button>
            <Button 
              onClick={handleRefreshPage}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              刷新页面
            </Button>
          </div>
        </div>

        {/* 错误信息卡片 */}
        <div className="space-y-3">
          {/* 错误基本信息 */}
          <Card>
            <CardContent className="space-y-3">
              <div>
                <Badge variant="destructive" className="mb-2 text-sm px-2 py-0.5">
                  {error.name || 'Error'}
                </Badge>
                <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-3">
                  <p className="text-sm text-foreground font-medium">
                    {error.message || '未知错误'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {error.source && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">触发位置:</span>
                    <span className="text-muted-foreground break-all">
                      {error.source}
                    </span>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-20">触发函数:</span>
                  <span className="text-muted-foreground">
                    {extractFunctionName(error.stack || '')}
                  </span>
                </div>
                
                {error.line && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-20">行列数:</span>
                    <span className="text-muted-foreground">
                      行 {error.line}, 列 {error.column || 0}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 错误堆栈 */}
          {error.stack && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  错误堆栈
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <pre className="max-h-96 overflow-auto bg-muted p-4 text-xs leading-relaxed rounded-md mt-0 -mb-3">
                  {error.stack}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* 组件堆栈 */}
          {error.componentStack && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  组件堆栈
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <pre className="max-h-96 overflow-auto bg-muted p-4 text-xs leading-relaxed rounded-md mt-0 -mb-3">
                  {formatComponentStack(error.componentStack)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* 环境设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                环境信息
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-24">设备类型:</span>
                  <span className="text-muted-foreground">
                    {getDeviceType()}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-24">操作系统:</span>
                  <span className="text-muted-foreground">
                    {getOSInfo()}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-24">浏览器:</span>
                  <span className="text-muted-foreground">
                    {getBrowserInfo()}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-24">平台:</span>
                  <span className="text-muted-foreground">
                    {getPlatformInfo()}
                  </span>
                </div>
                {getMobileInfo() && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-24">设备型号:</span>
                    <span className="text-muted-foreground">
                      {getMobileInfo()}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-24">当前 URL:</span>
                  <span className="text-muted-foreground break-all">
                    {window.location.href}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-24">User Agent:</span>
                  <span className="text-muted-foreground break-all">
                    {navigator.userAgent}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

