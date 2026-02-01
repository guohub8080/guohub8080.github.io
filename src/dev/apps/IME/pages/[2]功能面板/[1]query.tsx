import React, { useState, useCallback, useEffect } from 'react';
import { H1 } from '@comps/mdx/index.ts';
import { Input } from '@shadcn/components/ui/input.tsx';
import { Button } from '@shadcn/components/ui/button.tsx';
import { Textarea } from '@shadcn/components/ui/textarea.tsx';
import { Switch } from '@shadcn/components/ui/switch.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shadcn/components/ui/select.tsx';
import { isString } from 'lodash';
import toast from 'react-hot-toast';
import guoDT from '@utils/utDateTime/guoDT';
import { useIMEDictionaryStore } from '@apps/IME/store/useIMEDictionaryStore.ts';
import type { Word, IMEData } from '@apps/IME/store/useIMEDictionaryStore.ts';

const title = '查询词库';

// 模拟 collection.js - 前端过滤查询功能
class Collection {
  private data: Word[];

  constructor(data: Word[]) {
    this.data = data;
  }

  // 按缩写查询
  findByAbbr(abbr: string, exact: boolean = true): Word[] {
    if (exact) {
      return this.data.filter(w => w.abbr === abbr);
    }
    return this.data.filter(w => w.abbr.includes(abbr));
  }

  // 按内容查询
  findByContent(content: string): Word[] {
    return this.data.filter(w => w.content.includes(content));
  }

  // 按标签查询
  findByTag(tag: string): Word[] {
    return this.data.filter(w => w.tag && w.tag.includes(tag));
  }

  // 组合查询
  find(filters: {
    abbr?: string;
    abbrExact?: boolean;
    content?: string;
    tag?: string;
  }): Word[] {
    let results = [...this.data];

    if (filters.abbr) {
      results = results.filter(w => {
        if (filters.abbrExact) {
          return w.abbr === filters.abbr;
        }
        return w.abbr.includes(filters.abbr);
      });
    }

    if (filters.content) {
      results = results.filter(w => w.content.includes(filters.content));
    }

    if (filters.tag) {
      results = results.filter(w => w.tag && w.tag.includes(filters.tag));
    }

    return results;
  }

  // 分页查询
  paginate(data: Word[], page: number, pageSize: number): {
    items: Word[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // 获取所有数据
  getAll(): Word[] {
    return [...this.data];
  }

  // 获取所有唯一缩写
  getUniqueAbbrs(): string[] {
    return Array.from(new Set(this.data.map(w => w.abbr))).sort();
  }

  // 获取所有唯一标签
  getUniqueTags(): string[] {
    const tags = new Set<string>();
    this.data.forEach(w => {
      if (w.tag) {
        w.tag.split(/[,，]/).forEach(t => tags.add(t.trim()));
      }
    });
    return Array.from(tags).sort();
  }
}

function QueryPage() {
  // 从 Zustand store 获取词库数据
  const imeData = useIMEDictionaryStore((state) => state.imeData);
  const setImeData = useIMEDictionaryStore((state) => state.setImeData);
  const clearDictionary = useIMEDictionaryStore((state) => state.clearDictionary);

  const [collection, setCollection] = useState<Collection | null>(null);

  // 查询条件
  const [abbr, setAbbr] = useState('');
  const [isAbbrExact, setIsAbbrExact] = useState(true);
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');

  // 分页
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 查询结果
  const [queryResult, setQueryResult] = useState<{
    items: Word[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // JSON 文本框内容
  const [jsonText, setJsonText] = useState('');

  // 解析导入的 JSON 文件
  const parseJSONFile = (jsonText: string): IMEData => {
    try {
      const parsed = JSON.parse(jsonText);

      // 兼容多种格式
      if (Array.isArray(parsed)) {
        // 直接是数组格式: [{ abbr, order, content, tag }, ...]
        return { words: parsed };
      } else if (parsed.words && Array.isArray(parsed.words)) {
        // 标准格式: { words: [...], metadata: {...} }
        return parsed;
      } else if (parsed.data && Array.isArray(parsed.data)) {
        // 另一种格式: { data: [...]}
        return { words: parsed.data };
      }

      throw new Error('不支持的 JSON 格式');
    } catch (err) {
      throw new Error('JSON 解析失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  // 导入 JSON 文件
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseJSONFile(text);

        setImeData(data);
        setCollection(new Collection(data.words));

        // 重置查询状态
        setQueryResult(null);
        setPage(1);
        setAbbr('');
        setContent('');
        setTag('');

        toast.success(`成功导入 ${data.words.length} 条词条`, {
          duration: 2000,
          position: 'top-center',
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '导入失败';
        toast.error(errorMsg, {
          duration: 3000,
          position: 'top-center',
        });
      }
    };
    reader.readAsText(file);

    // 清空 input 以便可以重复导入同一文件
    event.target.value = '';
  };

  // 粘贴 JSON 导入（优先从文本框，如果没有则从剪贴板）
  const handlePasteJSON = async () => {
    try {
      // 优先使用文本框内容
      const text = jsonText.trim() || await navigator.clipboard.readText();

      if (!text) {
        toast.error('请先在文本框中粘贴 JSON 内容，或确保剪贴板有内容', {
          duration: 3000,
          position: 'top-center',
        });
        return;
      }

      const data = parseJSONFile(text);

      setImeData(data);
      setCollection(new Collection(data.words));
      setJsonText(''); // 清空文本框

      // 重置查询状态
      setQueryResult(null);
      setPage(1);
      setAbbr('');
      setContent('');
      setTag('');

      toast.success(`成功导入 ${data.words.length} 条词条`, {
        duration: 2000,
        position: 'top-center',
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '导入失败';
      toast.error(errorMsg, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  // 从剪贴板粘贴到文本框
  const handlePasteToTextarea = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonText(text);
      toast.success('已粘贴到文本框', {
        duration: 1500,
        position: 'top-center',
      });
    } catch (err) {
      toast.error('无法读取剪贴板，请手动粘贴', {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  // 导出 JSON 文件
  const handleExportJSON = () => {
    if (!imeData || !collection) {
      toast.error('请先导入词库数据', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    // 按 abbr 和 order 排序词条
    const sortedWords = [...collection.getAll()].sort((a, b) => {
      // 先按 abbr 排序
      if (a.abbr !== b.abbr) {
        return a.abbr.localeCompare(b.abbr);
      }
      // abbr 相同按 order 排序
      return a.order - b.order;
    });

    // 添加导出元数据
    const exportData: IMEData = {
      ...imeData,
      words: sortedWords,
      metadata: {
        ...imeData.metadata,
        exportDate: guoDT.formatToApiDateTime(new Date()),
        version: imeData.metadata?.version || '1.0',
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // 生成文件名：ime_phrase_YYYYMMDD_HHMMSS.json（东八区时间）
    const nowStr = guoDT.getDayjs().format('YYYYMMDD_HHmmss');
    a.download = `ime_phrase_${nowStr}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('词库已导出', {
      duration: 2000,
      position: 'top-center',
    });
  };

  // 导出搜狗词库格式（复制到剪贴板）
  const handleExportSogou = async () => {
    if (!imeData || !collection) {
      toast.error('请先导入词库数据', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    // 按 abbr 和 order 排序词条
    const sortedWords = [...collection.getAll()].sort((a, b) => {
      if (a.abbr !== b.abbr) {
        return a.abbr.localeCompare(b.abbr);
      }
      return a.order - b.order;
    });

    // 转换为搜狗格式: abbr,order=content
    const sogouText = sortedWords
      .map(w => `${w.abbr},${w.order}=${w.content}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(sogouText);
      toast.success(`已复制 ${sortedWords.length} 条词条到剪贴板`, {
        duration: 2000,
        position: 'top-center',
      });
    } catch (err) {
      toast.error('复制失败，请重试', {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  // 执行查询 - 使用 collection.js 风格的过滤
  const handleQuery = useCallback((customPage?: number) => {
    if (!collection) return;

    const currentPage = customPage ?? page;

    // 使用 collection 的 find 方法进行过滤
    let filtered = collection.find({
      abbr: abbr || undefined,
      abbrExact: isAbbrExact,
      content: content || undefined,
      tag: tag || undefined,
    });

    // 分页
    const paginated = collection.paginate(filtered, currentPage, pageSize);
    setQueryResult(paginated);

    // 如果是外部调用改变页码，更新页码状态
    if (customPage && customPage !== page) {
      setPage(customPage);
    }
  }, [collection, abbr, isAbbrExact, content, tag, page, pageSize]);

  // 监听 imeData 变化，自动更新 collection
  useEffect(() => {
    if (imeData) {
      setCollection(new Collection(imeData.words));
    } else {
      setCollection(null);
    }
  }, [imeData]);

  // 监听查询条件变化，自动重新查询
  React.useEffect(() => {
    if (collection) {
      handleQuery();
    }
  }, [collection, abbr, isAbbrExact, content, tag, pageSize]);

  // 重置查询条件
  const handleReset = () => {
    setAbbr('');
    setIsAbbrExact(true);
    setContent('');
    setTag('');
    setPage(1);
    setQueryResult(null);
  };

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

  // 检查是否有任何查询条件
  const hasQueryConditions = abbr || content || tag;

  // 快速统计信息
  const stats = collection ? {
    total: collection.getAll().length,
    uniqueAbbrs: collection.getUniqueAbbrs().length,
    uniqueTags: collection.getUniqueTags().length,
  } : null;

  return (
    <div className="w-full space-y-8">
      <H1>{title}</H1>

      {/* 数据导入区域 */}
      {!imeData ? (
        <div className="space-y-4">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">导入词库 JSON</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  上传 JSON 文件或在下方文本框中粘贴 JSON 内容
                </p>
              </div>

              {/* JSON 文本框 */}
              <div className="w-full max-w-2xl">
                <Textarea
                  placeholder="在此粘贴 JSON 内容..."
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="font-mono text-sm h-32"
                />
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                <label className="cursor-pointer inline-flex">
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                  <span>
                    <Button type="button">选择文件</Button>
                  </span>
                </label>
                <Button
                  variant="outline"
                  onClick={handlePasteToTextarea}
                >
                  从剪贴板粘贴到文本框
                </Button>
                <Button
                  onClick={handlePasteJSON}
                  disabled={!jsonText.trim()}
                >
                  导入 JSON
                </Button>
              </div>

              {jsonText.trim() && (
                <div className="pt-2 w-full max-w-2xl">
                  <p className="text-xs text-muted-foreground">
                    📝 文本框已填充 {jsonText.length} 个字符，点击"导入 JSON"按钮开始导入
                  </p>
                </div>
              )}

              <div className="pt-2 w-full max-w-md">
                <p className="text-xs text-muted-foreground">
                  💡 支持 JSON 格式：<code>{"{ words: [{ abbr, order, content, tag }] }"}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 已加载数据的操作栏 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card">
            <div>
              <h3 className="text-lg font-semibold">
                词库已加载
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({stats?.total?.toLocaleString()} 条词条)
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">
                {stats?.uniqueAbbrs} 个缩写 · {stats?.uniqueTags} 个标签
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportJSON}
                variant="outline"
                size="sm"
              >
                导出 JSON
              </Button>
              <Button
                onClick={handleExportSogou}
                variant="outline"
                size="sm"
              >
                复制搜狗格式
              </Button>
              <Button
                onClick={() => {
                  clearDictionary();
                  setCollection(null);
                  setQueryResult(null);
                  handleReset();
                }}
                variant="outline"
                size="sm"
              >
                清空数据
              </Button>
            </div>
          </div>

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
                    placeholder="输入缩写"
                  />
                </div>

                {/* 内容查询 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">内容</label>
                  <Input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="输入内容关键词"
                  />
                </div>

                {/* 标签查询 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">标签</label>
                  <Input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="输入标签"
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
                    onClick={handleReset}
                    variant="outline"
                    disabled={!hasQueryConditions && !queryResult}
                    className="flex-1 sm:flex-none"
                  >
                    重置
                  </Button>
                </div>
              </div>
            </div>

            {/* 引导界面 - 没有查询结果时显示 */}
            {!queryResult && collection && collection.getAll().length === 0 && (
              <div className="p-8 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
                <div className="flex flex-col items-center text-center space-y-4">
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

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">开始查询词库</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      输入查询条件进行过滤，或清空条件显示所有词条
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 查询结果 */}
            {queryResult && queryResult.items.length > 0 && (
              <div className="space-y-4">
                {/* 统计信息 */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      共 {queryResult.total} 条记录，第 {queryResult.page} / {queryResult.totalPages} 页
                    </span>
                    <span className="text-muted-foreground">
                      显示 {(queryResult.page - 1) * queryResult.pageSize + 1} - {Math.min(queryResult.page * queryResult.pageSize, queryResult.total)} 条
                    </span>
                  </div>
                </div>

                {/* 结果表格 */}
                <div className="rounded-lg border bg-card overflow-hidden">
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
                        {queryResult.items.map((word, index) => (
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
                                onClick={() => handleCopy(`${word.abbr}\t${word.order}\t${word.content}${word.tag ? '\t' + word.tag : ''}`, '词条')}
                                className="h-6 px-2 text-xs text-primary hover:underline cursor-pointer transition-colors"
                              >
                                复制
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 分页控制 */}
                <div className="space-y-3">
                  {/* 第一行：每页数量 */}
                  <div className="flex items-center justify-center gap-2">
                    <label className="text-sm font-medium whitespace-nowrap">每页</label>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => {
                        setPageSize(Number(value));
                        setPage(1);
                      }}
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
                    <Button
                      onClick={() => setPage(1)}
                      disabled={queryResult.page === 1}
                      variant="outline"
                      size="sm"
                      className="hidden lg:inline-flex"
                    >
                      首页
                    </Button>

                    <Button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={queryResult.page === 1}
                      variant="outline"
                      size="sm"
                    >
                      上一页
                    </Button>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={page}
                        onChange={(e) => setPage(Math.max(1, Math.min(queryResult.totalPages, Number(e.target.value))))}
                        min="1"
                        className="w-16 h-8 text-center"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">/ {queryResult.totalPages}</span>
                    </div>

                    <Button
                      onClick={() => setPage(p => Math.min(queryResult.totalPages, p + 1))}
                      disabled={queryResult.page === queryResult.totalPages}
                      variant="outline"
                      size="sm"
                    >
                      下一页
                    </Button>

                    <Button
                      onClick={() => setPage(queryResult.totalPages)}
                      disabled={queryResult.page === queryResult.totalPages}
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
        </>
      )}
    </div>
  );
}

export default {
  title,
  jsx: <QueryPage />
};
