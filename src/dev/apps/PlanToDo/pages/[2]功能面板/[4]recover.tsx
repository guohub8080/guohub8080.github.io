import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { H1 } from '../../../../components/mdx/index.ts';
import Login from '../../../../components/webLog/Login.tsx';
import useUserLog from '../../../../store/useUserLog/index.ts';
import { apiGet, apiPut } from '../../../../api/client.ts';
import { Button } from '../../../../shadcn/components/ui/button.tsx';
import { Card } from '../../../../shadcn/components/ui/card.tsx';
import { Badge } from '../../../../shadcn/components/ui/badge.tsx';
import { Input } from '../../../../shadcn/components/ui/input.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../shadcn/components/ui/alert-dialog.tsx';
import { RotateCcw, Star } from 'lucide-react';
import { cn } from '../../../../shadcn/lib/utils.ts';
import guoDT from '../../../../utils/utDateTime/guoDT.ts';

interface InstantTask {
  id: number;
  long_task_id: number;
  title: string;
  content: string | null;
  stamp: string;
  start_time: string;
  end_time: string;
  is_star: boolean;
  is_todo: boolean;
  tags: string | null;
  contact: string | null;
  remark: string | null;
  location: string | null;
}

interface LongTask {
  id: number;
  title: string;
  description: string | null;
  stamp: string;
  start_time: string;
  ddl: string;
  finished_time: string;
  status: string;
  is_star: boolean;
  tags: string | null;
  contact: string | null;
  remark: string | null;
  location: string | null;
  nodes: InstantTask[];
}

// 任务状态选项
const TASK_STATUS_OPTIONS = [
  { value: 'active', label: '进行中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'paused', label: '暂停', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'done', label: '已完成', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'dropped', label: '已放弃', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
  { value: 'archived', label: '已归档', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
] as const;

function RecoverPage() {
  const { isLoggedIn } = useUserLog();
  const [tagFilter, setTagFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [longTasks, setLongTasks] = useState<LongTask[]>([]);
  
  // 恢复确认对话框状态
  const [recoverDialogOpen, setRecoverDialogOpen] = useState(false);
  const [recoverTaskType, setRecoverTaskType] = useState<'long' | 'instant' | null>(null);
  const [recoverTaskId, setRecoverTaskId] = useState<number | null>(null);
  const [recoverTaskTitle, setRecoverTaskTitle] = useState<string>('');

  // 解析多种分隔符的标签字符串，返回英文逗号分隔的字符串（后端需要的格式）
  const parseTags = useCallback((input: string): string | undefined => {
    if (!input || !input.trim()) {
      return undefined;
    }
    
    // 使用正则表达式分割，支持多种分隔符（包括连续的分隔符）
    const tags = input
      .split(/[\s，,；;。.]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    if (tags.length === 0) {
      return undefined;
    }
    
    // 返回英文逗号分隔的字符串（后端 API 要求的格式）
    return tags.join(',');
  }, []);

  const formatDateTimeWithZone = useCallback((value: string) => {
    // 格式：YYYY-MM-DD（周X）HH:mm
    const dayjsObj = guoDT.getDayjs(value);
    if (dayjsObj.isValid()) {
      const weekday = guoDT.getCnWeekDay(dayjsObj);
      const dateStr = guoDT.getFormattedDayjs(dayjsObj, 'YYYY-MM-DD');
      const timeStr = guoDT.getFormattedDayjs(dayjsObj, 'HH:mm');
      return `${dateStr}（周${weekday}）${timeStr}`;
    }
    return value;
  }, []);

  // 智能格式化时间范围
  const formatTimeRange = useCallback((startTime: string, endTime: string) => {
    const startDayjs = guoDT.getDayjs(startTime);
    const endDayjs = guoDT.getDayjs(endTime);
    
    if (!startDayjs.isValid() || !endDayjs.isValid()) {
      return `${formatDateTimeWithZone(startTime)} ~ ${formatDateTimeWithZone(endTime)}`;
    }

    const startYear = startDayjs.year();
    const endYear = endDayjs.year();
    const startMonth = startDayjs.month() + 1;
    const endMonth = endDayjs.month() + 1;
    const startDay = startDayjs.date();
    const endDay = endDayjs.date();
    const startWeekday = guoDT.getCnWeekDay(startDayjs);
    const endWeekday = guoDT.getCnWeekDay(endDayjs);
    const startTimeStr = guoDT.getFormattedDayjs(startDayjs, 'HH:mm');
    const endTimeStr = guoDT.getFormattedDayjs(endDayjs, 'HH:mm');

    // 判断是否同一天
    const isSameDay = startYear === endYear && 
                      startMonth === endMonth && 
                      startDay === endDay;

    if (isSameDay) {
      return `${startMonth}月${startDay}日（周${startWeekday}） ${startTimeStr} - ${endTimeStr}`;
    } else if (startYear === endYear) {
      return `${startMonth}月${startDay}日（周${startWeekday}）${startTimeStr} - ${endMonth}月${endDay}日（周${endWeekday}）${endTimeStr}`;
    } else {
      return `${startYear}年${startMonth}月${startDay}日（周${startWeekday}）${startTimeStr} - ${endYear}年${endMonth}月${endDay}日（周${endWeekday}）${endTimeStr}`;
    }
  }, [formatDateTimeWithZone]);

  // 格式化截止日期
  const formatDeadline = useCallback((value: string) => {
    const dayjsObj = guoDT.getDayjs(value);
    if (dayjsObj.isValid()) {
      const year = dayjsObj.year();
      if (year > 9000) {
        return '暂无设定截止日期';
      }
      const weekday = guoDT.getCnWeekDay(dayjsObj);
      const dateStr = guoDT.getFormattedDayjs(dayjsObj, 'YYYY-MM-DD');
      const timeStr = guoDT.getFormattedDayjs(dayjsObj, 'HH:mm');
      return `${dateStr}（周${weekday}）${timeStr}`;
    }
    return value;
  }, []);

  // 获取任务状态的显示信息
  const getStatusDisplay = useCallback((status: string) => {
    const statusOption = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption || { 
      value: status, 
      label: status, 
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' 
    };
  }, []);

  // 打开恢复确认对话框
  const openRecoverDialog = (type: 'long' | 'instant', taskId: number, title: string) => {
    setRecoverTaskType(type);
    setRecoverTaskId(taskId);
    setRecoverTaskTitle(title);
    setRecoverDialogOpen(true);
  };

  // 恢复任务
  const handleRecoverTask = async () => {
    if (!recoverTaskType || !recoverTaskId) return;
    
    setUpdating(true);
    setError(null);
    setRecoverDialogOpen(false);
    
    try {
      const endpoint = recoverTaskType === 'long' 
        ? `/task/long-tasks/${recoverTaskId}`
        : `/task/instant-tasks/${recoverTaskId}`;
      
      console.log(`📤 恢复${recoverTaskType === 'long' ? '长' : '即时'}任务 ${recoverTaskId}`);
      
      const recoverPromise = apiPut(endpoint, { is_deleted: false });
      
      toast.promise(recoverPromise, {
        loading: '恢复中...',
        success: '任务恢复成功！',
        error: (err: any) => err?.message || '任务恢复失败，请稍后重试',
      });
      
      await recoverPromise;
      
      console.log('✅ 任务恢复成功');
      
      // 刷新数据
      await fetchData();
    } catch (err: any) {
      console.error('❌ 任务恢复失败:', err);
      const message = err?.message || '任务恢复失败，请稍后重试';
      setError(message);
    } finally {
      setUpdating(false);
      setRecoverTaskType(null);
      setRecoverTaskId(null);
      setRecoverTaskTitle('');
    }
  };

  // 获取所有已删除的任务
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 将用户输入的各种分隔符格式转换为后端需要的英文逗号分隔格式
      const parsedTags = parseTags(tagFilter);
      
      if (tagFilter && tagFilter.trim()) {
        console.log('🏷️ 标签过滤转换：');
        console.log('  用户输入:', tagFilter);
        console.log('  转换后（发送到后端）:', parsedTags || '（无有效标签，不进行过滤）');
      }
      
      const params: {
        params?: {
          tags?: string;
        }
      } = {};
      
      // 如果有标签过滤，添加到参数中（已经是英文逗号分隔格式）
      if (parsedTags) {
        params.params = { tags: parsedTags };
      }
      
      console.log('📤 发送 GET 请求到 /task/tasks/recover');
      console.log('请求参数:', JSON.stringify(params, null, 2));
      
      const result = await apiGet<LongTask[]>('/task/tasks/recover', params);
      
      console.log('✅ 请求成功，响应数据:', result);
      console.log('已删除的长任务数量:', result?.length || 0);
      
      setLongTasks(result || []);
    } catch (err: any) {
      console.error('❌ 查询失败:', err);
      const message = err?.message || '查询失败，请稍后重试';
      setError(message);
      setLongTasks([]);
    } finally {
      setLoading(false);
    }
  }, [tagFilter, parseTags]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchData();
  }, [fetchData, isLoggedIn]);

  // 统计所有已删除的即时任务数量
  const totalDeletedInstantTasks = useMemo(() => {
    return longTasks.reduce((sum, task) => sum + (task.nodes?.length || 0), 0);
  }, [longTasks]);

  let loginStateSection: React.ReactNode = null;
  if (!isLoggedIn) {
    loginStateSection = (
      <div className="p-6 rounded-lg border-2 border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          请先登录以查看和管理回收站中的任务
        </p>
      </div>
    );
  } else {
    const hasLongTasks = longTasks.length > 0;

    loginStateSection = (
      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">回收站</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  查看和管理已删除的任务，可以恢复误删的任务
                </p>
              </div>
              
              <Button type="button" onClick={fetchData} disabled={loading}>
                {loading ? '刷新中...' : '刷新'}
              </Button>
            </div>

            {/* Tag 过滤输入框 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">标签过滤</label>
              <Input
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                placeholder="输入标签（空格/逗号分隔）"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchData();
                  }
                }}
              />
              {tagFilter && (
                <p className="text-xs text-muted-foreground">
                  将发送到后端：{parseTags(tagFilter) || '（无有效标签，不会过滤）'}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-50 dark:bg-red-950/20 p-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">已删除的长任务</h3>
              <span className="text-xs text-muted-foreground">
                共 {longTasks.length} 项，包含 {totalDeletedInstantTasks} 个已删除的即时任务
              </span>
            </div>
            {hasLongTasks ? (
              <div className="space-y-4">
                {longTasks.map(task => (
                  <Card key={task.id} className="p-5 space-y-4 border-2 border-red-200 dark:border-red-900">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-semibold">{task.title}</span>
                        {task.is_star && (
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        )}
                        <span className={cn(
                          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                          getStatusDisplay(task.status).color
                        )}>
                          {getStatusDisplay(task.status).label}
                        </span>
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400 border-red-300 dark:border-red-800">
                          已删除
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRecoverDialog('long', task.id, task.title)}
                          disabled={updating}
                          className="h-7 ml-auto"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          恢复
                        </Button>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground break-words">{task.description}</p>
                      )}
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>创建时间：{formatDateTimeWithZone(task.stamp)}</p>
                        <p>开始时间：{formatDateTimeWithZone(task.start_time)}</p>
                        <p>截止日期：{formatDeadline(task.ddl)}</p>
                      </div>
                      {(task.contact || task.location) && (
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                          {task.contact && <span>联系人：{task.contact}</span>}
                          {task.location && <span>地点：{task.location}</span>}
                        </div>
                      )}
                      {task.tags && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {task.tags
                            .split(',')
                            .map(tag => tag.trim())
                            .filter(Boolean)
                            .map(tag => (
                              <Badge key={tag} variant="outline" className="text-[10px]">
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* 已删除的即时任务节点 */}
                    {task.nodes && task.nodes.length > 0 && (
                      <div className="space-y-2 border-t border-border pt-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">已删除的即时任务（{task.nodes.length}）</p>
                        </div>
                        <div className="space-y-2">
                          {task.nodes.map(node => (
                            <div
                              key={node.id}
                              className="rounded-md border border-red-200 dark:border-red-900 p-3 space-y-2 bg-red-50/30 dark:bg-red-950/10"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={cn(
                                    "text-sm font-medium",
                                    node.is_todo && "text-red-500 font-semibold"
                                  )}>{node.title}</span>
                                  {node.is_todo && (
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                  )}
                                  {node.is_star && (
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  )}
                                  <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400 border-red-300 dark:border-red-800">
                                    已删除
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openRecoverDialog('instant', node.id, node.title)}
                                    disabled={updating}
                                    className="h-6 px-2 ml-auto"
                                  >
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    恢复
                                  </Button>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTimeRange(node.start_time, node.end_time)}
                                </div>
                              </div>
                              {node.content && (
                                <p className="text-xs text-muted-foreground break-words">{node.content}</p>
                              )}
                              {node.tags && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {node.tags
                                    .split(',')
                                    .map(tag => tag.trim())
                                    .filter(Boolean)
                                    .map(tag => (
                                      <Badge key={tag} variant="outline" className="text-[10px]">
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                              {(node.contact || node.location) && (
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                                  {node.contact && <span>联系人：{node.contact}</span>}
                                  {node.location && <span>地点：{node.location}</span>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-sm text-muted-foreground text-center">
                回收站中暂无已删除的任务
              </Card>
            )}
          </section>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-8">
      <H1>回收站</H1>
      
      {/* 登录组件 */}
      <Login isSimpleMode={true} />
      {loginStateSection}

      {/* 恢复确认对话框 */}
      <AlertDialog open={recoverDialogOpen} onOpenChange={setRecoverDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认恢复任务</AlertDialogTitle>
            <AlertDialogDescription>
              确定要恢复任务"{recoverTaskTitle}"吗？恢复后任务将重新出现在任务列表中。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updating}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRecoverTask}
              disabled={updating}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {updating ? '恢复中...' : '确认恢复'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default {
  title: '回收站',
  jsx: <RecoverPage />
};

