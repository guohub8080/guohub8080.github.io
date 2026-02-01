import React, { useState, useEffect } from 'react';
import { H1 } from '@comps/mdx/index.ts';
import { Input } from '@shadcn/components/ui/input.tsx';
import { Button } from '@shadcn/components/ui/button.tsx';
import toast from 'react-hot-toast';
import guoDT from '@utils/utDateTime/guoDT';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useIMEDictionaryStore } from '@apps/IME/store/useIMEDictionaryStore.ts';
import type { Word, IMEData } from '@apps/IME/store/useIMEDictionaryStore.ts';

const title = '添加词库';

interface EditableSlot {
  id: string;
  order: number;
  word: Word | null;
}

type DiffType = 'unchanged' | 'added' | 'modified' | 'deleted';

interface DiffInfo {
  type: DiffType;
  original: EditableSlot;
  current: EditableSlot;
}

// 计算diff类型
function calculateDiffType(original: EditableSlot, current: EditableSlot): DiffType {
  const origWord = original.word;
  const currWord = current.word;

  // 原来没有，现在有 → 新增
  if (!origWord && currWord) return 'added';

  // 原来有，现在没有 → 删除
  if (origWord && !currWord) return 'deleted';

  // 原来没有，现在也没有 → 未修改
  if (!origWord && !currWord) return 'unchanged';

  // 原来有，现在也有，比较内容
  if (origWord && currWord) {
    if (origWord.content !== currWord.content || origWord.tag !== currWord.tag) {
      return 'modified';
    }
  }

  return 'unchanged';
}

// 左边原始槽位（只读）
function OriginalSlot({ slot, diffType }: { slot: EditableSlot; diffType: DiffType }) {
  let bgClass = 'bg-card';
  let borderClass = 'border';
  let badgeClass = 'bg-muted';
  let textClass = '';

  if (diffType === 'deleted') {
    bgClass = 'bg-red-50/50 dark:bg-red-950/20';
    borderClass = 'border-2 border-red-500/30';
    badgeClass = 'bg-red-600 text-white';
    textClass = 'line-through text-red-700 dark:text-red-300';
  }

  return (
    <div className={`p-3 rounded-lg ${borderClass} ${bgClass}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${badgeClass} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
          {slot.order}
        </div>
        <div className="flex-1 min-w-0">
          {slot.word ? (
            <>
              <div className={`text-sm font-medium theme-font-family truncate ${textClass}`}>
                {slot.word.content}
              </div>
              {slot.word.tag && (
                <div className={`text-xs ${textClass || 'text-muted-foreground'}`}>
                  标签: {slot.word.tag}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-muted-foreground">空</div>
          )}
        </div>
      </div>
    </div>
  );
}

// 右边当前槽位（可拖拽、可编辑）
function CurrentSlot({
  slot,
  diffType,
  onEdit,
  onDelete,
  onRestore,
}: {
  slot: EditableSlot;
  diffType: DiffType;
  onEdit: (order: number, content: string, tag: string) => void;
  onDelete: (order: number) => void;
  onRestore: (order: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');

  // 拖拽功能
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = () => {
    if (slot.word) {
      setNewContent(slot.word.content);
      setNewTag(slot.word.tag);
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!newContent.trim()) return;
    onEdit(slot.order, newContent.trim(), newTag.trim());
    setIsEditing(false);
    setNewContent('');
    setNewTag('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewContent('');
    setNewTag('');
  };

  const handleAdd = () => {
    setNewContent('');
    setNewTag('');
    setIsEditing(true);
  };

  // 获取样式类名
  let bgClass = 'bg-card';
  let borderClass = 'border';
  let badgeClass = 'bg-muted';

  if (diffType === 'added') {
    bgClass = 'bg-green-50/50 dark:bg-green-950/20';
    borderClass = 'border-2 border-green-500/30';
    badgeClass = 'bg-green-600 text-white';
  } else if (diffType === 'modified') {
    bgClass = 'bg-yellow-50/50 dark:bg-yellow-950/20';
    borderClass = 'border-2 border-yellow-500/30';
    badgeClass = 'bg-yellow-600 text-white';
  }

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className={`p-3 rounded-lg ${borderClass} ${bgClass}`}>
        <div className="flex items-start gap-3">
          <div
            {...attributes}
            {...listeners}
            className={`w-8 h-8 rounded-full ${badgeClass} flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-move`}
          >
            {slot.order}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="输入内容"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="标签（可选）"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={!newContent.trim()}>
                保存
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 显示当前状态
  if (slot.word) {
    return (
      <div ref={setNodeRef} style={style} className={`p-3 rounded-lg ${borderClass} ${bgClass}`}>
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className={`w-8 h-8 rounded-full ${badgeClass} flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-move`}
          >
            {slot.order}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium theme-font-family truncate">
              {slot.word.content}
            </div>
            {slot.word.tag && (
              <div className="text-xs text-muted-foreground">
                标签: {slot.word.tag}
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleEdit} className="text-xs text-primary hover:underline">
              编辑
            </button>
            {diffType === 'modified' && (
              <button onClick={() => onRestore(slot.order)} className="text-xs text-primary hover:underline">
                还原
              </button>
            )}
            <button onClick={() => onDelete(slot.order)} className="text-xs text-destructive hover:underline">
              删除
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 空槽位
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-colors cursor-pointer"
      onClick={handleAdd}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0">
          {slot.order}
        </div>
        <div className="flex-1 text-sm text-muted-foreground">
          点击添加到第 {slot.order} 位
        </div>
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
  );
}

function AddPage() {
  // 从 Zustand store 获取词库数据和方法
  const imeData = useIMEDictionaryStore((state) => state.imeData);
  const setImeData = useIMEDictionaryStore((state) => state.setImeData);
  const updateWords = useIMEDictionaryStore((state) => state.updateWords);
  const clearDictionary = useIMEDictionaryStore((state) => state.clearDictionary);

  const [collection, setCollection] = useState<Word[] | null>(null);

  // 步骤控制
  const [step, setStep] = useState<1 | 2>(1); // 1: 输入缩写, 2: 查看现有词条并添加

  // 表单数据
  const [abbr, setAbbr] = useState('');
  const [originalSlots, setOriginalSlots] = useState<EditableSlot[]>([]); // 原始数据
  const [slots, setSlots] = useState<EditableSlot[]>([]); // 当前编辑数据
  const [hasChanges, setHasChanges] = useState(false);
  const [batchTag, setBatchTag] = useState(''); // 批量标签

  // 状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 监听 imeData 变化，自动更新 collection
  useEffect(() => {
    if (imeData) {
      setCollection(imeData.words);
    } else {
      setCollection(null);
    }
  }, [imeData]);

  // 解析导入的 JSON 文件
  const parseJSONFile = (jsonText: string): IMEData => {
    try {
      const parsed = JSON.parse(jsonText);

      // 兼容多种格式
      if (Array.isArray(parsed)) {
        return { words: parsed };
      } else if (parsed.words && Array.isArray(parsed.words)) {
        return parsed;
      } else if (parsed.data && Array.isArray(parsed.data)) {
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
        setCollection(data.words);

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
    event.target.value = '';
  };

  // 粘贴 JSON 导入
  const handlePasteJSON = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = parseJSONFile(text);

      setImeData(data);
      setCollection(data.words);

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

  // 查询现有词条（第一步点击下一步）
  const handleQueryExisting = () => {
    if (!abbr.trim()) {
      setError('请输入缩写');
      return;
    }

    if (!collection) {
      setError('请先导入词库数据');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 从本地数据中查找该缩写的词条
      const words = collection.filter(w => w.abbr === abbr.trim());

      // 创建1-9的槽位
      const newSlots: EditableSlot[] = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((order) => ({
        id: `slot-${order}`,
        order,
        word: words.find(w => w.order === order) || null,
      }));

      // 深拷贝保存原始数据和当前数据
      setOriginalSlots(JSON.parse(JSON.stringify(newSlots)));
      setSlots(newSlots);
      setHasChanges(false);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败');
    } finally {
      setLoading(false);
    }
  };

  // 拖拽结束处理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSlots((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // 更新order
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      });
      setHasChanges(true);
    }
  };

  // 编辑词条
  const handleEdit = (order: number, content: string, tag: string) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.order === order
          ? {
              ...slot,
              word: {
                abbr: abbr,
                order,
                content,
                tag,
              },
            }
          : slot
      )
    );
    setHasChanges(true);
  };

  // 删除词条
  const handleDelete = (order: number) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.order === order ? { ...slot, word: null } : slot
      )
    );
    setHasChanges(true);
  };

  // 恢复词条到原始状态
  const handleRestore = (order: number) => {
    const originalSlot = originalSlots.find(s => s.order === order);
    if (originalSlot) {
      setSlots((prev) =>
        prev.map((slot) =>
          slot.order === order ? { ...slot, word: originalSlot.word } : slot
        )
      );
      setHasChanges(true);
    }
  };

  // 保存修改（更新本地数据）
  const handleSaveChanges = () => {
    if (!imeData || !collection) {
      toast.error('请先导入词库数据');
      return;
    }

    // 计算变更
    const changes: {
      added: Word[];
      modified: Word[];
      deleted: Word[];
    } = {
      added: [],
      modified: [],
      deleted: [],
    };

    // 先移除该缩写下的所有词条
    let newWords = collection.filter(w => w.abbr !== abbr);

    for (let i = 0; i < slots.length; i++) {
      const currentSlot = slots[i];
      const originalSlot = originalSlots[i];
      const diffType = calculateDiffType(originalSlot, currentSlot);

      if (diffType === 'unchanged') continue;

      if (currentSlot.word) {
        const word = {
          abbr: abbr,
          order: currentSlot.order,
          content: currentSlot.word.content,
          tag: currentSlot.word.tag || '',
        };

        if (diffType === 'added') {
          changes.added.push(word);
        } else {
          changes.modified.push(word);
        }
        newWords.push(word);
      }
      // 删除操作：原来有，现在没有
      else if (originalSlot.word && !currentSlot.word) {
        changes.deleted.push(originalSlot.word);
      }
    }

    // 更新 store 中的词库数据
    updateWords(newWords);

    // 更新本地 collection
    setCollection(newWords);

    // 更新原始槽位
    const newOriginalSlots = slots.map(s => ({ ...s }));
    setOriginalSlots(newOriginalSlots);
    setSlots(newOriginalSlots);
    setHasChanges(false);

    // 显示变更摘要
    const changeSummary = [
      changes.added.length > 0 ? `新增 ${changes.added.length} 条` : '',
      changes.modified.length > 0 ? `修改 ${changes.modified.length} 条` : '',
      changes.deleted.length > 0 ? `删除 ${changes.deleted.length} 条` : '',
    ].filter(Boolean).join('，');

    toast.success(`保存成功：${changeSummary || '无变更'}`, {
      duration: 3000,
      position: 'top-center',
    });
  };

  // 重置表单
  const handleReset = () => {
    setStep(1);
    setAbbr('');
    setOriginalSlots([]);
    setSlots([]);
    setHasChanges(false);
    setBatchTag('');
    setError(null);
  };

  // 将输入框内容批量设置为所有词条的tag
  const handleFillAllTags = () => {
    if (!batchTag.trim()) {
      toast.error('请先输入标签内容');
      return;
    }

    const newSlots = slots.map(slot => {
      if (slot.word) {
        return {
          ...slot,
          word: {
            ...slot.word,
            tag: batchTag.trim()
          }
        };
      }
      return slot;
    });

    setSlots(newSlots);
    setHasChanges(true);
    toast.success(`已将标签设置为：${batchTag.trim()}`);
  };

  // 处理回车键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 1) {
        handleQueryExisting();
      }
    }
  };

  // 快速统计信息
  const stats = collection ? {
    total: collection.length,
    uniqueAbbrs: Array.from(new Set(collection.map(w => w.abbr))).length,
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
                  上传 JSON 文件或粘贴 JSON 内容来导入词库数据
                </p>
              </div>

              <div className="flex gap-3">
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
                  onClick={handlePasteJSON}
                >
                  粘贴 JSON
                </Button>
              </div>

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
                {stats?.uniqueAbbrs} 个缩写
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  // 按 abbr 和 order 排序词条
                  const sortedWords = [...collection!].sort((a, b) => {
                    if (a.abbr !== b.abbr) {
                      return a.abbr.localeCompare(b.abbr);
                    }
                    return a.order - b.order;
                  });

                  const updatedData: IMEData = {
                    ...imeData!,
                    words: sortedWords,
                    metadata: {
                      ...imeData!.metadata,
                      exportDate: guoDT.formatToApiDateTime(new Date()),
                    },
                  };
                  const blob = new Blob([JSON.stringify(updatedData, null, 2)], {
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
                }}
                variant="outline"
                size="sm"
              >
                导出 JSON
              </Button>
              <Button
                onClick={() => {
                  clearDictionary();
                  setCollection(null);
                  handleReset();
                }}
                variant="outline"
                size="sm"
              >
                清空数据
              </Button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="p-4 rounded-lg border-2 border-red-500/30 bg-red-50 dark:bg-red-950/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* 添加表单 */}
          <div className="space-y-4">
            {/* 步骤1: 输入缩写 */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="p-5 rounded-lg border bg-card space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">缩写</label>
                    <Input
                      type="text"
                      value={abbr}
                      onChange={(e) => setAbbr(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleQueryExisting}
                      disabled={loading || !abbr.trim()}
                      className="flex-1 sm:flex-none"
                    >
                      {loading ? '查询中...' : '下一步'}
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

                {/* 使用说明 */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h3 className="text-sm font-medium mb-2">操作说明</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 输入要添加词条的缩写</li>
                    <li>• 点击"下一步"将查看该缩写下已有的词条（1-9号位）</li>
                    <li>• 然后可以在空位或指定位置添加新词条</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 步骤2: 查看现有词条并编辑 */}
            {step === 2 && (
              <div className="space-y-4">
                {/* 标题栏 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border bg-card">
                  <div>
                    <h3 className="text-lg font-semibold">缩写：{abbr}</h3>
                    <p className="text-sm text-muted-foreground">
                      Diff 对比视图（左：原始 | 右：修改）
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveChanges}
                      disabled={!hasChanges || loading}
                      size="sm"
                    >
                      {loading ? '保存中...' : '保存修改'}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                    >
                      返回上一步
                    </Button>
                  </div>
                </div>

                {/* 修改提示 */}
                {hasChanges && (
                  <div className="p-3 rounded-lg border-2 border-orange-500/30 bg-orange-50 dark:bg-orange-950/20">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      ⚠️ 有未保存的修改，请点击"保存修改"按钮保存
                    </p>
                  </div>
                )}

                {/* 左右对比视图 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 左边：原始数据 */}
                  <div>
                    <div className="mb-3 p-2 bg-muted/50 rounded text-sm font-medium text-center">
                      原始数据
                    </div>
                    <div className="space-y-2">
                      {originalSlots.map((slot, index) => {
                        const currentSlot = slots[index];
                        const diffType = calculateDiffType(slot, currentSlot);
                        return (
                          <OriginalSlot key={slot.id} slot={slot} diffType={diffType} />
                        );
                      })}
                    </div>
                  </div>

                  {/* 右边：当前数据（可拖拽） */}
                  <div>
                    <div className="mb-3 p-2 bg-primary/10 rounded text-sm font-medium text-center">
                      当前数据（可拖拽）
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={slots.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {slots.map((slot, index) => {
                            const originalSlot = originalSlots[index];
                            const diffType = calculateDiffType(originalSlot, slot);

                            return (
                              <CurrentSlot
                                key={slot.id}
                                slot={slot}
                                diffType={diffType}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onRestore={handleRestore}
                              />
                            );
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>

                {/* 批量设置标签 */}
                <div className="p-4 rounded-lg border bg-card">
                  <label className="block text-sm font-medium mb-2">批量设置标签</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={batchTag}
                      onChange={(e) => setBatchTag(e.target.value)}
                      placeholder="输入标签内容"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleFillAllTags}
                      variant="outline"
                      disabled={!batchTag.trim() || slots.filter(s => s.word).length === 0}
                    >
                      应用到全部词条
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    将输入的标签内容批量应用到所有词条
                  </p>
                </div>

                {/* 使用说明 */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h3 className="text-sm font-medium mb-2">操作说明</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <span className="text-green-600">绿色</span> = 新增词条</li>
                    <li>• <span className="text-yellow-600">黄色</span> = 修改词条</li>
                    <li>• <span className="text-red-600">红色 + 删除线</span> = 删除词条</li>
                    <li>• 点击"编辑"可修改词条内容</li>
                    <li>• 点击"删除"可移除词条</li>
                    <li>• 点击"恢复"/"还原"可撤销修改</li>
                    <li>• 点击空槽位可添加新词条</li>
                    <li>• 修改后需点击"保存修改"更新到本地数据</li>
                  </ul>
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
  jsx: <AddPage />
};
