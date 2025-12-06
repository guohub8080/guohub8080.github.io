import React, { useState } from 'react';
import { H1 } from '../../../../components/mdx/index.ts';
import Login from '../../../../components/webLog/Login.tsx';
import useUserLog from '../../../../store/useUserLog/index.ts';
import { Input } from '../../../../shadcn/components/ui/input.tsx';
import { Button } from '../../../../shadcn/components/ui/button.tsx';
import { Switch } from '../../../../shadcn/components/ui/switch.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../shadcn/components/ui/select.tsx';
import { isString } from 'lodash';
import toast from 'react-hot-toast';

const title = '查询词库';

interface Word {
  abbr: string;
  order: number;
  content: string;
  tag: string;
}

interface QueryResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Word[];
}

function QueryPage() {
  const { isLoggedIn, apiBaseUrl, jwtToken } = useUserLog();
  
  // 查询条件
  const [abbr, setAbbr] = useState('');
  const [isAbbrExact, setIsAbbrExact] = useState(true);
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  
  // 分页
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // 查询结果
  const [queryResult, setQueryResult] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<'sogo' | 'qqime' | null>(null);
  
  // 执行查询
  const handleQuery = async (customPage?: number) => {
    if (!apiBaseUrl || !jwtToken) {
      setError('请先配置 API 地址并登录');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 构建查询参数
      const params = new URLSearchParams({
        page: (customPage ?? page).toString(),
        page_size: pageSize.toString(),
      });
      
      if (abbr) {
        params.append('abbr', abbr);
        params.append('is_abbr_exact', isAbbrExact.toString());
      }
      if (content) params.append('content', content);
      if (tag) params.append('tag', tag);
      
      const response = await fetch(`${apiBaseUrl}/api/ime/words?${params}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`查询失败: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('输入法查询返回数据:', data);
      setQueryResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 重置查询条件
  const handleReset = () => {
    setAbbr('');
    setIsAbbrExact(true);
    setContent('');
    setTag('');
    setPage(1);
    setPageSize(20);
    setQueryResult(null);
    setError(null);
  };
  
  // 翻页
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // 自动触发查询，传入新页码
    handleQuery(newPage);
  };
  
  // 处理回车键查询
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };
  
  // 检查是否有任何查询条件
  const hasQueryConditions = abbr || content || tag;
  
  // 复制到剪贴板
  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`已复制${type}：${text}`, {
        duration: 2000,
        position: 'top-center',
      });
    } catch (err) {
      console.error('复制失败:', err);
      toast.error('复制失败，请重试', {
        duration: 2000,
        position: 'top-center',
      });
    }
  };
  
  // 删除词条
  const handleDelete = async (word: Word) => {
    // 确认对话框
    const confirmed = window.confirm(
      `确定要删除词条吗？\n\n缩写: ${word.abbr}\n顺序: ${word.order}\n内容: ${word.content}`
    );
    
    if (!confirmed) {
      return;
    }
    
    if (!apiBaseUrl || !jwtToken) {
      setError('请先配置 API 地址并登录');
      return;
    }
    
    try {
      const params = new URLSearchParams({
        abbr: word.abbr,
        order: word.order.toString(),
      });
      
      const response = await fetch(`${apiBaseUrl}/api/ime/words?${params}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`删除失败: ${response.status}`);
      }
      
      // 删除成功，重新查询
      handleQuery();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    }
  };
  
  // 获取搜狗词库并复制到剪贴板
  const handleGetSogo = async () => {
    if (!apiBaseUrl || !jwtToken) {
      setError('请先配置 API 地址并登录');
      return;
    }
    
    setDownloading('sogo');
    setError(null);
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/ime/sogo`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`获取搜狗词库失败: ${response.status}`);
      }
      
      const text = await response.text();
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(text);
      
      toast.success('搜狗词库已复制到剪贴板', {
        duration: 2000,
        position: 'top-center',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取搜狗词库失败';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setDownloading(null);
    }
  };
  
  // 获取QQ输入法词库并复制到剪贴板
  const handleGetQqime = async () => {
    if (!apiBaseUrl || !jwtToken) {
      setError('请先配置 API 地址并登录');
      return;
    }
    
    setDownloading('qqime');
    setError(null);
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/ime/qqime`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`获取QQ输入法词库失败: ${response.status}`);
      }
      
      const text = await response.text();
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(text);
      
      toast.success('QQ输入法词库已复制到剪贴板', {
        duration: 2000,
        position: 'top-center',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取QQ输入法词库失败';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setDownloading(null);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="w-full space-y-8">
        <H1>{title}</H1>
        
        <Login isSimpleMode={true} />
        
        <div className="p-6 rounded-lg border-2 border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            请先登录以查询词库
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-8">
      <H1>{title}</H1>
      
      <Login isSimpleMode={true} />
      
      {/* 查询表单 */}
      <div className="space-y-4">
        <div className="p-5 rounded-lg border bg-card space-y-4">
          {/* 第一行：主要查询字段 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 缩写查询 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">缩写</label>
              <Input
                type="text"
                value={abbr}
                onChange={(e) => setAbbr(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            {/* 内容查询 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">内容</label>
              <Input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            {/* 标签查询 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">标签</label>
              <Input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          
          {/* 第二行：精确匹配和操作 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* 精确匹配开关 */}
            {isString(abbr) && abbr.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={isAbbrExact}
                  onCheckedChange={setIsAbbrExact}
                />
                <span className="text-sm">{isAbbrExact ? '精确匹配缩写' : '包含缩写'}</span>
              </label>
            )}
            
            {/* 操作按钮 */}
            <div className="flex gap-2 sm:ml-auto">
              <Button
                onClick={() => handleQuery()}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                {loading ? '查询中...' : (hasQueryConditions ? '条件查询' : '查询全部')}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                重置
              </Button>
            </div>
          </div>
          
          {/* 第三行：词库导出按钮 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex gap-2">
              <Button
                onClick={handleGetSogo}
                disabled={downloading !== null || loading}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                {downloading === 'sogo' ? '获取中...' : '获取搜狗词库'}
              </Button>
              <Button
                onClick={handleGetQqime}
                disabled={downloading !== null || loading}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                {downloading === 'qqime' ? '获取中...' : '获取QQ输入法词库'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="p-4 rounded-lg border-2 border-red-500/30 bg-red-50 dark:bg-red-950/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        
        {/* 引导界面 - 没有查询结果时显示 */}
        {!queryResult && !loading && (
          <div className="p-8 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* 图标 */}
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-primary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              
              {/* 引导文字 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">开始查询词库</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  点击上方"查询全部"按钮查看所有词条，或输入查询条件进行"条件查询"
                </p>
              </div>
              
              {/* 提示信息 */}
              <div className="pt-2 w-full max-w-md">
                <p className="text-xs text-muted-foreground">
                  💡 提示：可以通过缩写、内容或标签进行搜索，支持模糊匹配
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* 查询结果 */}
        {queryResult && (
          <div className="space-y-4">
            {/* 统计信息 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between text-sm">
                <span>
                  共 {queryResult.total} 条记录，第 {queryResult.page} / {queryResult.total_pages} 页
                </span>
                <span className="text-muted-foreground">
                  显示 {(queryResult.page - 1) * queryResult.page_size + 1} - {Math.min(queryResult.page * queryResult.page_size, queryResult.total)} 条
                </span>
              </div>
            </div>
            
            {/* 结果表格 */}
            <div className="rounded-lg border bg-card overflow-hidden relative">
              {/* Loading 遮罩层 */}
              {loading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground">加载中...</span>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="divide-x">
                      <th className="px-4 py-1 text-center text-sm font-medium w-24 whitespace-nowrap">缩写</th>
                      <th className="px-4 py-1 text-center text-sm font-medium min-w-[60px] whitespace-nowrap">顺序</th>
                      <th className="px-4 py-1 text-left text-sm font-medium min-w-[200px]">内容</th>
                      <th className="px-4 py-1 text-center text-sm font-medium min-w-[60px] whitespace-nowrap">标签</th>
                      <th className="px-4 py-1 text-center text-sm font-medium w-20 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {queryResult.items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-4 text-center text-sm text-muted-foreground theme-font-family">
                          没有找到匹配的词条
                        </td>
                      </tr>
                    ) : (
                      queryResult.items.map((word, index) => (
                        <tr key={index} className="hover:bg-muted/30 divide-x">
                          <td 
                            className="px-4 py-1 text-sm font-mono text-center theme-font-family w-24 whitespace-nowrap cursor-pointer hover:bg-primary/10 transition-colors"
                            onClick={() => handleCopy(word.abbr, '缩写')}
                            title="点击复制缩写"
                          >
                            {word.abbr}
                          </td>
                          <td className="px-4 py-1 text-sm text-center theme-font-family min-w-[60px] whitespace-nowrap">{word.order}</td>
                          <td 
                            className="px-4 py-1 text-sm theme-font-family min-w-[200px] cursor-pointer hover:bg-primary/10 transition-colors"
                            onClick={() => handleCopy(word.content, '内容')}
                            title="点击复制内容"
                          >
                            {word.content}
                          </td>
                          <td className="px-4 py-1 text-sm text-muted-foreground text-center theme-font-family min-w-[60px] whitespace-nowrap">
                            {word.tag || '-'}
                          </td>
                          <td className="px-4 py-1 text-center w-20">
                            <button
                              onClick={() => handleDelete(word)}
                              className="h-6 px-2 text-xs text-destructive/60 hover:text-destructive cursor-pointer transition-colors"
                              disabled={loading}
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 分页控制 */}
            <div className="space-y-3">
              {/* 第一行：每页数量（始终显示） */}
              <div className="flex items-center justify-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">每页</label>
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={(value) => setPageSize(Number(value))}
                  disabled={loading}
                >
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="150">150</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 第二行：分页按钮 */}
              <div className="flex items-center justify-center gap-2">
                {/* 首页按钮 - 只在大屏显示 */}
                <Button
                  onClick={() => handlePageChange(1)}
                  disabled={queryResult.page === 1 || loading}
                  variant="outline"
                  size="sm"
                  className="hidden lg:inline-flex"
                >
                  首页
                </Button>
                
                <Button
                  onClick={() => handlePageChange(queryResult.page - 1)}
                  disabled={queryResult.page === 1 || loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? '加载中...' : '上一页'}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={page}
                    onChange={(e) => setPage(Math.max(1, Number(e.target.value)))}
                    onKeyDown={handleKeyDown}
                    min="1"
                    disabled={loading}
                    className="w-16 h-8 text-center"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">/ {queryResult.total_pages}</span>
                </div>
                
                <Button
                  onClick={() => handlePageChange(queryResult.page + 1)}
                  disabled={queryResult.page === queryResult.total_pages || loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? '加载中...' : '下一页'}
                </Button>
                
                {/* 末页按钮 - 只在大屏显示 */}
                <Button
                  onClick={() => handlePageChange(queryResult.total_pages)}
                  disabled={queryResult.page === queryResult.total_pages || loading}
                  variant="outline"
                  size="sm"
                  className="hidden lg:inline-flex"
                >
                  末页
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default {
  title,
  jsx: <QueryPage />
};

