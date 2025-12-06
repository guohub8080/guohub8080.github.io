import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { H1 } from '../../../../components/mdx/index.ts';
import Login from '../../../../components/webLog/Login.tsx';
import useUserLog from '../../../../store/useUserLog/index.ts';
import { apiGet, apiPut, apiPost, apiDelete } from '../../../../api/client.ts';
import { Button } from '../../../../shadcn/components/ui/button.tsx';
import { Card } from '../../../../shadcn/components/ui/card.tsx';
import { Badge } from '../../../../shadcn/components/ui/badge.tsx';
import { Calendar } from '../../../../shadcn/components/ui/calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../shadcn/components/ui/popover.tsx';
import { Input } from '../../../../shadcn/components/ui/input.tsx';
import { Textarea } from '../../../../shadcn/components/ui/textarea.tsx';
import { DateTimePicker } from '../../../../shadcn/components/ui/datetime-picker.tsx';
import { DeadlinePicker } from '../../../../shadcn/components/ui/deadline-picker.tsx';
import { Switch } from '../../../../shadcn/components/ui/switch.tsx';
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
import { CalendarIcon, CheckCircle2, Plus, Pencil, Trash2, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../../../shadcn/lib/utils.ts';
import guoDT from '../../../../utils/utDateTime/guoDT.ts';
import type { DateRange } from 'react-day-picker';

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

interface RangeQueryResponse {
  long_tasks: LongTask[];
  independent_instant_tasks: InstantTask[];
}

// 任务状态选项
const TASK_STATUS_OPTIONS = [
  { value: 'active', label: '进行中', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'paused', label: '暂停', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'done', label: '已完成', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'dropped', label: '已放弃', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
  { value: 'archived', label: '已归档', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
] as const;

const NO_DEADLINE_PLACEHOLDER = guoDT.formatToApiDateTime('9999-12-01 00:00:00');

const LONG_TASK_STATUS_SECTIONS = [
  {
    status: 'active',
    title: '进行中',
    description: '当前正在推进的任务，优先关注',
  },
  {
    status: 'paused',
    title: '暂停中',
    description: '暂时停滞的任务，后续可重新启动',
  },
  {
    status: 'done',
    title: '已完成',
    description: '已经顺利完成的任务，可以复盘总结',
  },
  {
    status: 'dropped',
    title: '已放弃',
    description: '决定终止或取消的任务，留作记录',
  },
  {
    status: 'archived',
    title: '已归档',
    description: '归档保存的历史任务',
  },
] as const;

const FALLBACK_LONG_TASK_SECTION = {
  status: 'others',
  title: '其他状态',
  description: '未分类或自定义状态的任务',
} as const;

type LongTaskSectionStatus =
  | typeof LONG_TASK_STATUS_SECTIONS[number]['status']
  | typeof FALLBACK_LONG_TASK_SECTION.status;

interface NodeFormData {
  title: string;
  content: string;
  start_time: Date | undefined;
  end_time: Date | undefined;
  tags: string;
  contact: string;
  remark: string;
  location: string;
  is_todo: boolean;
}

interface InstantTaskFormData {
  title: string;
  content: string;
  start_time: Date | undefined;
  end_time: Date | undefined;
  tags: string;
  contact: string;
  remark: string;
  location: string;
  is_star: boolean;
  is_todo: boolean;
}

interface LongTaskFormData {
  title: string;
  description: string;
  start_time: Date | undefined;
  ddl: Date | undefined;
  tags: string;
  contact: string;
  remark: string;
  location: string;
  is_star: boolean;
}

function QueryPage() {
  const { isLoggedIn } = useUserLog();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    return { from: today, to: today };
  });
  const [tagFilter, setTagFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [longTasks, setLongTasks] = useState<LongTask[]>([]);
  const [instantTasks, setInstantTasks] = useState<InstantTask[]>([]);
  const longTaskSections = useMemo(() => {
    const sectionMap = new Map<LongTaskSectionStatus, LongTask[]>();
    LONG_TASK_STATUS_SECTIONS.forEach(({ status }) => {
      sectionMap.set(status, []);
    });
    sectionMap.set('others', []);

    const pushTaskToSection = (key: LongTaskSectionStatus, task: LongTask) => {
      const list = sectionMap.get(key);
      if (list) {
        list.push(task);
      }
    };

    longTasks.forEach((task) => {
      const matchedSection = LONG_TASK_STATUS_SECTIONS.find(section => section.status === task.status);
      if (matchedSection) {
        pushTaskToSection(matchedSection.status, task);
      } else {
        pushTaskToSection('others', task);
      }
    });

    const sortTasks = (tasks: LongTask[]) =>
      [...tasks].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

    const sections: Array<{
      status: LongTaskSectionStatus;
      title: string;
      description: string;
      tasks: LongTask[];
    }> = [];

    LONG_TASK_STATUS_SECTIONS.forEach((section) => {
      const tasks = sortTasks(sectionMap.get(section.status) ?? []);
      if (tasks.length > 0) {
        sections.push({
          status: section.status,
          title: section.title,
          description: section.description,
          tasks,
        });
      }
    });

    const otherTasks = sectionMap.get('others') ?? [];
    if (otherTasks.length > 0) {
      sections.push({
        ...FALLBACK_LONG_TASK_SECTION,
        tasks: sortTasks(otherTasks),
      });
    }

    return sections;
  }, [longTasks]);
  
  // 节点排序状态：Map<longTaskId, 'asc' | 'desc'>
  const [nodeSortOrder, setNodeSortOrder] = useState<Map<number, 'asc' | 'desc'>>(new Map());
  
  // 添加节点相关状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLongTaskId, setCurrentLongTaskId] = useState<number | null>(null);
  const [nodeFormData, setNodeFormData] = useState<NodeFormData>(() => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 加1小时
    return {
      title: '',
      content: '',
      start_time: now,
      end_time: endTime,
      tags: '',
      contact: '',
      remark: '',
      location: '',
      is_todo: false
    };
  });

  // 编辑独立即时任务相关状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentInstantTask, setCurrentInstantTask] = useState<InstantTask | null>(null);
  const [instantTaskFormData, setInstantTaskFormData] = useState<InstantTaskFormData>(() => ({
    title: '',
    content: '',
    start_time: undefined,
    end_time: undefined,
    tags: '',
    contact: '',
    remark: '',
    location: '',
    is_star: false,
    is_todo: false
  }));
  const [originalInstantTaskData, setOriginalInstantTaskData] = useState<InstantTaskFormData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 编辑长任务相关状态
  const [editLongTaskDialogOpen, setEditLongTaskDialogOpen] = useState(false);
  const [currentLongTask, setCurrentLongTask] = useState<LongTask | null>(null);
  const [longTaskFormData, setLongTaskFormData] = useState<LongTaskFormData>(() => ({
    title: '',
    description: '',
    start_time: undefined,
    ddl: undefined,
    tags: '',
    contact: '',
    remark: '',
    location: '',
    is_star: false
  }));
  const [originalLongTaskData, setOriginalLongTaskData] = useState<LongTaskFormData | null>(null);
  const [deleteLongTaskDialogOpen, setDeleteLongTaskDialogOpen] = useState(false);
  const [useDdl, setUseDdl] = useState(false); // 是否设置截止时间

  const queryStartStr = useMemo(() => {
    return dateRange?.from 
      ? guoDT.getFormattedDayjs(guoDT.getDayjs(dateRange.from), 'YYYY-MM-DD') 
      : guoDT.getFormattedDayjs(guoDT.getDayjs(), 'YYYY-MM-DD');
  }, [dateRange?.from]);

  const queryEndStr = useMemo(() => {
    if (!dateRange?.to) return queryStartStr;
    return guoDT.getFormattedDayjs(guoDT.getDayjs(dateRange.to), 'YYYY-MM-DD');
  }, [dateRange?.to, queryStartStr]);

  const formattedDateDisplay = useMemo(() => {
    if (queryStartStr === queryEndStr) {
      const weekday = guoDT.getCnWeekDay(guoDT.getDayjs(queryStartStr + ' 00:00:00'));
      return `${queryStartStr}（周${weekday}）`;
    }
    const startWeekday = guoDT.getCnWeekDay(guoDT.getDayjs(queryStartStr + ' 00:00:00'));
    const endWeekday = guoDT.getCnWeekDay(guoDT.getDayjs(queryEndStr + ' 00:00:00'));
    return `${queryStartStr}（周${startWeekday}）→ ${queryEndStr}（周${endWeekday}）`;
  }, [queryStartStr, queryEndStr]);

  // 快捷日期范围查询
  const setQuickDateRange = useCallback((months: number) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - months);
    startDate.setDate(1); // 设置为月初
    setDateRange({ from: startDate, to: today });
  }, []);

  // 过去一周
  const setPastWeek = useCallback(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // 7天前
    setDateRange({ from: startDate, to: today });
  }, []);

  // 过去一月
  const setPastMonth = useCallback(() => {
    setQuickDateRange(1);
  }, [setQuickDateRange]);

  // 过去一季度（3个月）
  const setPastQuarter = useCallback(() => {
    setQuickDateRange(3);
  }, [setQuickDateRange]);

  // 过去半年（6个月）
  const setPastHalfYear = useCallback(() => {
    setQuickDateRange(6);
  }, [setQuickDateRange]);

  // 解析多种分隔符的标签字符串，返回英文逗号分隔的字符串（后端需要的格式）
  // 支持的分隔符：空格、中文逗号（，）、英文逗号（,）、中文分号（；）、英文分号（;）、中文句号（。）
  const parseTags = useCallback((input: string): string | undefined => {
    if (!input || !input.trim()) {
      return undefined;
    }
    
    // 使用正则表达式分割，支持多种分隔符（包括连续的分隔符）
    // 匹配：空格、中文逗号、英文逗号、中文分号、英文分号、中文句号
    const tags = input
      .split(/[\s，,；;。.]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0); // 过滤空字符串
    
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
    const startMonth = startDayjs.month() + 1; // dayjs月份从0开始
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
      // 同一天：X月X日（周X） XX:XX - XX:XX
      return `${startMonth}月${startDay}日（周${startWeekday}） ${startTimeStr} - ${endTimeStr}`;
    } else if (startYear === endYear) {
      // 同一年但不同天：X月X日（周X）xx:xx - X月X日（周X）xx:xx
      return `${startMonth}月${startDay}日（周${startWeekday}）${startTimeStr} - ${endMonth}月${endDay}日（周${endWeekday}）${endTimeStr}`;
    } else {
      // 不同年：X年X月X日（周X）xx:xx - X年X月X日（周X）xx:xx
      return `${startYear}年${startMonth}月${startDay}日（周${startWeekday}）${startTimeStr} - ${endYear}年${endMonth}月${endDay}日（周${endWeekday}）${endTimeStr}`;
    }
  }, [formatDateTimeWithZone]);

  // 格式化截止日期，如果年份大于9000则显示"暂无设定截止日期"
  const formatDeadline = useCallback((value: string) => {
    const dayjsObj = guoDT.getDayjs(value);
    if (dayjsObj.isValid()) {
      const year = dayjsObj.year();
      // 如果年份大于9000，表示没有截止日期
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

  // 计算截止日期的剩余天数或逾期天数
  // baseDate: 基准日期，如果未提供则使用今天
  const getDeadlineStatus = useCallback((ddl: string, baseDate?: string) => {
    const dayjsObj = guoDT.getDayjs(ddl);
    if (!dayjsObj.isValid()) {
      return null;
    }
    
    const year = dayjsObj.year();
    // 如果年份大于9000，表示没有截止日期
    if (year > 9000) {
      return null;
    }

    // 确定基准日期：如果提供了 baseDate 则使用它，否则使用今天
    const baseDayjs = baseDate ? guoDT.getDayjs(baseDate) : guoDT.getDayjs();
    const deadlineDate = dayjsObj.startOf('day');
    const base = baseDayjs.startOf('day');
    const diffDays = deadlineDate.diff(base, 'day');

    if (diffDays > 0) {
      return { type: 'remaining', days: diffDays };
    } else if (diffDays < 0) {
      return { type: 'overdue', days: Math.abs(diffDays) };
    } else {
      return { type: 'today', days: 0 };
    }
  }, []);

  // 判断查询范围是同一天还是不同天
  const isSameDayQuery = useMemo(() => {
    return queryStartStr === queryEndStr;
  }, [queryStartStr, queryEndStr]);

  // 获取任务状态的显示信息
  const getStatusDisplay = useCallback((status: string) => {
    const statusOption = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption || { 
      value: status, 
      label: status, 
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' 
    };
  }, []);

  // 更新任务状态
  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    setUpdating(true);
    setError(null);
    try {
      console.log(`📤 更新任务 ${taskId} 状态为: ${newStatus}`);
      console.log(`📅 当前查询范围: ${queryStartStr} ~ ${queryEndStr}`);
      
      const updatePromise = apiPut(`/task/long-tasks/${taskId}`, { status: newStatus });
      
      toast.promise(updatePromise, {
        loading: '更新中...',
        success: '状态更新成功！',
        error: (err: any) => err?.message || '状态更新失败，请稍后重试',
      });
      
      await updatePromise;
      
      console.log('✅ 状态更新成功');
      
      // 更新成功后，按照当前查询范围重新查询
      console.log('🔄 按当前范围重新查询数据...');
      await fetchData();
    } catch (err: any) {
      console.error('❌ 状态更新失败:', err);
      const message = err?.message || '状态更新失败，请稍后重试';
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  // 打开添加节点弹窗
  const openAddNodeDialog = (longTaskId: number) => {
    setCurrentLongTaskId(longTaskId);
    const now = new Date();
    const endTime = new Date(now.getTime() + 60 * 60 * 1000);
      setNodeFormData({
        title: '',
        content: '',
        start_time: now,
        end_time: endTime,
        tags: '',
        contact: '',
        remark: '',
        location: '',
        is_todo: false
      });
    setDialogOpen(true);
  };

  // 打开编辑长任务弹窗
  const openEditLongTaskDialog = (task: LongTask) => {
    setCurrentLongTask(task);
    const startTime = guoDT.getDayjs(task.start_time).toDate();
    const ddlTime = guoDT.getDayjs(task.ddl).toDate();
    const formData: LongTaskFormData = {
      title: task.title,
      description: task.description || '',
      start_time: startTime,
      ddl: ddlTime,
      tags: task.tags || '',
      contact: task.contact || '',
      remark: task.remark || '',
      location: task.location || '',
      is_star: task.is_star
    };
    setLongTaskFormData(formData);
    setOriginalLongTaskData(formData);
    // 根据原始Deadline是否为无Deadline来设置Switch状态
    setUseDdl(!isNoDeadlineDate(ddlTime));
    setEditLongTaskDialogOpen(true);
  };

  // 判断日期是否是无Deadline（年份大于9000表示无Deadline）
  const isNoDeadlineDate = useCallback((date: Date | undefined): boolean => {
    if (!date) return false;
    return date.getFullYear() > 9000;
  }, []);

  // 判断长任务字段是否被修改
  const isLongTaskFieldChanged = useCallback((field: keyof LongTaskFormData): boolean => {
    if (!originalLongTaskData) return false;
    
    const currentValue = longTaskFormData[field];
    const originalValue = originalLongTaskData[field];
    
    // 处理日期类型
    if (field === 'start_time' || field === 'ddl') {
      if (!currentValue && !originalValue) return false;
      if (!currentValue || !originalValue) return true;
      const currentDate = currentValue as Date;
      const originalDate = originalValue as Date;
      
      // 对于ddl字段，如果原始值是无Deadline（年份>9000），且当前值也是无Deadline，则认为未修改
      if (field === 'ddl') {
        const originalIsNoDeadline = isNoDeadlineDate(originalDate);
        const currentIsNoDeadline = isNoDeadlineDate(currentDate);
        
        // 如果原始值和当前值都是无Deadline，则认为未修改
        if (originalIsNoDeadline && currentIsNoDeadline) {
          return false;
        }
        
        // 如果一个是无Deadline，另一个不是，则认为已修改
        if (originalIsNoDeadline !== currentIsNoDeadline) {
          return true;
        }
      }
      
      return currentDate.getTime() !== originalDate.getTime();
    }
    
    // 处理布尔类型
    if (field === 'is_star') {
      return currentValue !== originalValue;
    }
    
    // 处理字符串类型
    return String(currentValue || '') !== String(originalValue || '');
  }, [longTaskFormData, originalLongTaskData, isNoDeadlineDate]);

  // 更新长任务
  const handleUpdateLongTask = async () => {
    if (!currentLongTask) return;
    
    try {
      // 验证必填字段
      if (!longTaskFormData.title.trim()) {
        setError('任务标题不能为空');
        return;
      }
      if (!longTaskFormData.start_time) {
        setError('开始时间不能为空');
        return;
      }

      // 只收集修改过的字段
      const updateData: {
        title?: string;
        description?: string | null;
        start_time?: string;
        ddl?: string;
        tags?: string | null;
        contact?: string | null;
        remark?: string | null;
        location?: string | null;
        is_star?: boolean;
      } = {};
      
      if (isLongTaskFieldChanged('title')) {
        updateData.title = longTaskFormData.title.trim();
      }
      if (isLongTaskFieldChanged('description')) {
        updateData.description = longTaskFormData.description.trim() || null;
      }
      if (isLongTaskFieldChanged('start_time')) {
        updateData.start_time = guoDT.formatToApiDateTime(longTaskFormData.start_time!);
      }
      // 处理ddl字段的更新
      const originalDdl = originalLongTaskData?.ddl;
      const currentDdl = longTaskFormData.ddl;
      const originalIsNoDeadline = originalDdl ? isNoDeadlineDate(originalDdl) : true;
      const currentIsNoDeadline = currentDdl ? isNoDeadlineDate(currentDdl) : true;
      
      if (useDdl) {
        // Switch开启：如果当前值不是无Deadline，且与原始值不同，则更新
        if (currentDdl && !currentIsNoDeadline) {
          // 如果原始值是无Deadline，或者当前值与原始值不同，则需要更新
          if (originalIsNoDeadline || isLongTaskFieldChanged('ddl')) {
            updateData.ddl = guoDT.formatToApiDateTime(currentDdl);
          }
        }
      } else {
        // Switch关闭：如果原始值有Deadline，则需要更新为无Deadline（9999-12-01 00:00:00）
        if (originalDdl && !originalIsNoDeadline) {
          updateData.ddl = NO_DEADLINE_PLACEHOLDER;
        }
      }
      if (isLongTaskFieldChanged('tags')) {
        // 将标签中的中文逗号替换为英文逗号
        const normalizedTags = longTaskFormData.tags.trim().replace(/，/g, ',');
        updateData.tags = normalizedTags || null;
      }
      if (isLongTaskFieldChanged('contact')) {
        updateData.contact = longTaskFormData.contact.trim() || null;
      }
      if (isLongTaskFieldChanged('remark')) {
        updateData.remark = longTaskFormData.remark.trim() || null;
      }
      if (isLongTaskFieldChanged('location')) {
        updateData.location = longTaskFormData.location.trim() || null;
      }
      if (isLongTaskFieldChanged('is_star')) {
        updateData.is_star = longTaskFormData.is_star;
      }

      // 如果没有修改任何字段，直接关闭弹窗
      if (Object.keys(updateData).length === 0) {
        setEditLongTaskDialogOpen(false);
        setCurrentLongTask(null);
        setUseDdl(false);
        return;
      }

      console.log(`📤 更新长任务 ${currentLongTask.id}`);
      console.log('更新字段:', updateData);
      
      setUpdating(true);
      const updatePromise = apiPut(`/task/long-tasks/${currentLongTask.id}`, updateData);
      
      toast.promise(updatePromise, {
        loading: '提交中...',
        success: '修改成功！',
        error: (err: any) => err?.message || '任务更新失败，请稍后重试',
      });
      
      await updatePromise;
      
      console.log('✅ 任务更新成功');
      
      // 关闭弹窗并刷新数据
      setEditLongTaskDialogOpen(false);
      setCurrentLongTask(null);
      setUseDdl(false);
      await fetchData();
    } catch (err: any) {
      console.error('❌ 任务更新失败:', err);
      const message = err?.message || '任务更新失败，请稍后重试';
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  // 删除长任务
  const handleDeleteLongTask = async () => {
    if (!currentLongTask) return;
    
    setUpdating(true);
    setError(null);
    setDeleteLongTaskDialogOpen(false);
    try {
      console.log(`📤 删除长任务 ${currentLongTask.id}`);
      
      const deletePromise = apiDelete(`/task/long-tasks/${currentLongTask.id}`);
      
      toast.promise(deletePromise, {
        loading: '删除中...',
        success: '删除成功！',
        error: (err: any) => err?.message || '任务删除失败，请稍后重试',
      });
      
      await deletePromise;
      
      console.log('✅ 任务删除成功');
      
      // 关闭弹窗并刷新数据
      setEditLongTaskDialogOpen(false);
      setCurrentLongTask(null);
      setUseDdl(false);
      await fetchData();
    } catch (err: any) {
      console.error('❌ 任务删除失败:', err);
      const message = err?.message || '任务删除失败，请稍后重试';
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  // 打开编辑独立即时任务弹窗
  const openEditInstantTaskDialog = (task: InstantTask) => {
    setCurrentInstantTask(task);
    const startTime = guoDT.getDayjs(task.start_time).toDate();
    const endTime = guoDT.getDayjs(task.end_time).toDate();
    const formData: InstantTaskFormData = {
      title: task.title,
      content: task.content || '',
      start_time: startTime,
      end_time: endTime,
      tags: task.tags || '',
      contact: task.contact || '',
      remark: task.remark || '',
      location: task.location || '',
      is_star: task.is_star,
      is_todo: task.is_todo
    };
    setInstantTaskFormData(formData);
    setOriginalInstantTaskData(formData);
    setEditDialogOpen(true);
  };

  // 判断字段是否被修改
  const isFieldChanged = useCallback((field: keyof InstantTaskFormData): boolean => {
    if (!originalInstantTaskData) return false;
    
    const currentValue = instantTaskFormData[field];
    const originalValue = originalInstantTaskData[field];
    
    // 处理日期类型
    if (field === 'start_time' || field === 'end_time') {
      if (!currentValue && !originalValue) return false;
      if (!currentValue || !originalValue) return true;
      const currentDate = currentValue as Date;
      const originalDate = originalValue as Date;
      return currentDate.getTime() !== originalDate.getTime();
    }
    
    // 处理布尔类型
    if (field === 'is_star') {
      return currentValue !== originalValue;
    }
    
    // 处理字符串类型
    return String(currentValue || '') !== String(originalValue || '');
  }, [instantTaskFormData, originalInstantTaskData]);

  // 更新独立即时任务
  const handleUpdateInstantTask = async () => {
    if (!currentInstantTask) return;
    
    try {
      // 验证必填字段
      if (!instantTaskFormData.title.trim()) {
        setError('任务标题不能为空');
        return;
      }
      if (!instantTaskFormData.start_time || !instantTaskFormData.end_time) {
        setError('开始时间和结束时间不能为空');
        return;
      }

      // 只收集修改过的字段
      const updateData: {
        title?: string;
        content?: string | null;
        start_time?: string;
        end_time?: string;
        tags?: string | null;
        contact?: string | null;
        remark?: string | null;
        location?: string | null;
        is_star?: boolean;
        is_todo?: boolean;
      } = {};
      
      if (isFieldChanged('title')) {
        updateData.title = instantTaskFormData.title.trim();
      }
      if (isFieldChanged('content')) {
        updateData.content = instantTaskFormData.content.trim() || null;
      }
      if (isFieldChanged('start_time')) {
        updateData.start_time = guoDT.formatToApiDateTime(instantTaskFormData.start_time!);
      }
      if (isFieldChanged('end_time')) {
        updateData.end_time = guoDT.formatToApiDateTime(instantTaskFormData.end_time!);
      }
      if (isFieldChanged('tags')) {
        // 将标签中的中文逗号替换为英文逗号
        const normalizedTags = instantTaskFormData.tags.trim().replace(/，/g, ',');
        updateData.tags = normalizedTags || null;
      }
      if (isFieldChanged('contact')) {
        updateData.contact = instantTaskFormData.contact.trim() || null;
      }
      if (isFieldChanged('remark')) {
        updateData.remark = instantTaskFormData.remark.trim() || null;
      }
      if (isFieldChanged('location')) {
        updateData.location = instantTaskFormData.location.trim() || null;
      }
      if (isFieldChanged('is_star')) {
        updateData.is_star = instantTaskFormData.is_star;
      }
      if (isFieldChanged('is_todo')) {
        updateData.is_todo = instantTaskFormData.is_todo;
      }

      // 如果没有修改任何字段，直接关闭弹窗
      if (Object.keys(updateData).length === 0) {
        setEditDialogOpen(false);
        setCurrentInstantTask(null);
        return;
      }

      console.log(`📤 更新即时任务 ${currentInstantTask.id}`);
      console.log('更新字段:', updateData);
      
      setUpdating(true);
      const updatePromise = apiPut(`/task/instant-tasks/${currentInstantTask.id}`, updateData);
      
      toast.promise(updatePromise, {
        loading: '提交中...',
        success: '修改成功！',
        error: (err: any) => err?.message || '任务更新失败，请稍后重试',
      });
      
      await updatePromise;
      
      console.log('✅ 任务更新成功');
      
      // 关闭弹窗并刷新数据
      setEditDialogOpen(false);
      setCurrentInstantTask(null);
      await fetchData();
    } catch (err: any) {
      console.error('❌ 任务更新失败:', err);
      const message = err?.message || '任务更新失败，请稍后重试';
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  // 删除独立即时任务
  const handleDeleteInstantTask = async () => {
    if (!currentInstantTask) return;
    
    setUpdating(true);
    setError(null);
    setDeleteDialogOpen(false);
    try {
      console.log(`📤 删除即时任务 ${currentInstantTask.id}`);
      
      const deletePromise = apiDelete(`/task/instant-tasks/${currentInstantTask.id}`);
      
      toast.promise(deletePromise, {
        loading: '删除中...',
        success: '删除成功！',
        error: (err: any) => err?.message || '任务删除失败，请稍后重试',
      });
      
      await deletePromise;
      
      console.log('✅ 任务删除成功');
      
      // 关闭弹窗并刷新数据
      setEditDialogOpen(false);
      setCurrentInstantTask(null);
      await fetchData();
    } catch (err: any) {
      console.error('❌ 任务删除失败:', err);
      const message = err?.message || '任务删除失败，请稍后重试';
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  // 添加节点
  const handleAddNode = async () => {
    if (!currentLongTaskId) return;
    
    try {
      // 验证必填字段
      if (!nodeFormData.title.trim()) {
        setError('节点标题不能为空');
        return;
      }
      if (!nodeFormData.start_time || !nodeFormData.end_time) {
        setError('开始时间和结束时间不能为空');
        return;
      }

      // 如果开始时间大于结束时间，自动交换
      let startTime = nodeFormData.start_time;
      let endTime = nodeFormData.end_time;
      if (startTime.getTime() > endTime.getTime()) {
        [startTime, endTime] = [endTime, startTime];
      }

      console.log(`📤 为长任务 ${currentLongTaskId} 添加节点`);
      
      // 将标签中的中文逗号替换为英文逗号
      const normalizedTags = nodeFormData.tags.trim().replace(/，/g, ',');
      
      const requestData = {
        title: nodeFormData.title.trim(),
        content: nodeFormData.content.trim() || null,
        start_time: guoDT.formatToApiDateTime(startTime),
        end_time: guoDT.formatToApiDateTime(endTime),
        long_task_id: currentLongTaskId,
        is_star: false,
        is_todo: nodeFormData.is_todo,
        tags: normalizedTags || null,
        contact: nodeFormData.contact.trim() || null,
        remark: nodeFormData.remark.trim() || null,
        location: nodeFormData.location.trim() || null
      };

      console.log('请求数据:', requestData);
      
      const addPromise = apiPost('/task/instant-tasks', requestData);
      
      toast.promise(addPromise, {
        loading: '添加中...',
        success: '节点添加成功！',
        error: (err: any) => err?.message || '节点添加失败，请稍后重试',
      });
      
      await addPromise;
      
      console.log('✅ 节点添加成功');
      
      // 关闭弹窗并刷新数据，按照当前查询范围重新查询
      setDialogOpen(false);
      setCurrentLongTaskId(null);
      await fetchData();
    } catch (err: any) {
      console.error('❌ 节点添加失败:', err);
      const message = err?.message || '节点添加失败，请稍后重试';
      setError(message);
    }
  };

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
        params: {
          query_start: string;
          query_finish: string;
          tags?: string;
        }
      } = {
        params: {
          query_start: queryStartStr,
          query_finish: queryEndStr
        }
      };
      
      // 如果有标签过滤，添加到参数中（已经是英文逗号分隔格式）
      if (parsedTags) {
        params.params.tags = parsedTags;
      }
      
      console.log('📤 发送 GET 请求到 /task/tasks/range-query');
      console.log('请求参数:', JSON.stringify(params, null, 2));
      
      const result = await apiGet<RangeQueryResponse>('/task/tasks/range-query', params);
      
      console.log('✅ 请求成功，响应数据:', result);
      console.log('长任务数量:', result.long_tasks?.length || 0);
      console.log('独立即时任务数量:', result.independent_instant_tasks?.length || 0);
      
      setLongTasks(result.long_tasks || []);
      setInstantTasks(result.independent_instant_tasks || []);
    } catch (err: any) {
      console.error('❌ 查询失败:', err);
      const message = err?.message || '查询失败，请稍后重试';
      setError(message);
      setLongTasks([]);
      setInstantTasks([]);
    } finally {
      setLoading(false);
    }
  }, [queryStartStr, queryEndStr, tagFilter, parseTags]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchData();
  }, [fetchData, isLoggedIn]);

  let loginStateSection: React.ReactNode = null;
  if (!isLoggedIn) {
    loginStateSection = (
      <div className="p-6 rounded-lg border-2 border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          请先登录以查询和管理你的任务
        </p>
      </div>
    );
  } else {
    const hasLongTasks = longTaskSections.length > 0;
    const hasInstantTasks = instantTasks.length > 0;

    loginStateSection = (
      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 flex-shrink-0"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        // 允许选择同一天作为范围
                        if (range?.from && !range?.to) {
                          setDateRange({ from: range.from, to: range.from });
                        } else {
                          setDateRange(range);
                        }
                      }}
                      initialFocus
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
                
                <div className="text-base font-medium">
                  {formattedDateDisplay}
                </div>
              </div>
              
              <Button type="button" onClick={fetchData} disabled={loading}>
                {loading ? '查询中...' : '重新查询'}
              </Button>
            </div>

            {/* 快捷日期范围按钮 */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={setPastWeek}
                className="text-xs"
              >
                过去一周
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={setPastMonth}
                className="text-xs"
              >
                过去一月
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={setPastQuarter}
                className="text-xs"
              >
                过去一季度
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={setPastHalfYear}
                className="text-xs"
              >
                过去半年
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
              <h3 className="text-base font-semibold">长任务</h3>
              <span className="text-xs text-muted-foreground">共 {longTasks.length} 项</span>
            </div>
            {hasLongTasks ? (
              <div className="space-y-6">
                {longTaskSections.map((section) => (
                  <div key={section.status} className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{section.title}</p>
                        {section.description && (
                          <p className="text-xs text-muted-foreground">{section.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {section.tasks.length} 项
                      </span>
                    </div>
                    <div className="space-y-4">
                      {section.tasks.map(task => (
                        <Card key={task.id} className="p-5 space-y-4">
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditLongTaskDialog(task)}
                                className="h-7 w-7 p-0 ml-auto"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground break-words">{task.description}</p>
                            )}
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>开始：{formatDateTimeWithZone(task.start_time)}</p>
                              {(() => {
                                // 如果查询范围是同一天，使用查询日期作为基准；否则使用今天
                                const baseDate = isSameDayQuery ? queryStartStr : undefined;
                                const deadlineStatus = getDeadlineStatus(task.ddl, baseDate);
                                if (deadlineStatus === null) {
                                  return <p>{formatDeadline(task.ddl)}</p>;
                                }
                                const deadlineText = formatDeadline(task.ddl);
                                let statusText = '';
                                if (deadlineStatus.type === 'remaining') {
                                  statusText = `还剩${deadlineStatus.days}天`;
                                } else if (deadlineStatus.type === 'overdue') {
                                  statusText = `已逾期${deadlineStatus.days}天`;
                                } else {
                                  statusText = isSameDayQuery ? '当天截止' : '今天截止';
                                }
                                return (
                                  <p>
                                    截止日期：{deadlineText} <span className={deadlineStatus.type === 'overdue' ? 'text-red-500 font-medium' : deadlineStatus.type === 'today' ? 'text-orange-500 font-medium' : 'text-blue-500'}>{statusText}</span>
                                  </p>
                                );
                              })()}
                            </div>
                            {(task.contact || task.location) && (
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                                {task.contact && <span>联系人：{task.contact}</span>}
                                {task.location && <span>地点：{task.location}</span>}
                              </div>
                            )}
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex gap-2 flex-wrap">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button size="sm" variant="outline" disabled={updating}>
                                  {updating ? '更新中...' : '更新状态'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 p-2" align="start">
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                                    选择新状态
                                  </p>
                                  {TASK_STATUS_OPTIONS.map((option) => (
                                    <Button
                                      key={option.value}
                                      variant="ghost"
                                      size="sm"
                                      disabled={updating}
                                      className={cn(
                                        "w-full justify-start",
                                        task.status === option.value && "bg-accent"
                                      )}
                                      onClick={() => updateTaskStatus(task.id, option.value)}
                                    >
                                      {task.status === option.value && (
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                      )}
                                      <span className={cn(
                                        "px-2 py-0.5 rounded text-xs font-medium",
                                        option.color
                                      )}>
                                        {option.label}
                                      </span>
                                    </Button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={updating}
                              onClick={() => openAddNodeDialog(task.id)}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              添加节点
                            </Button>
                          </div>

                          {task.nodes.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">进度节点（{task.nodes.length}）</p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const currentOrder = nodeSortOrder.get(task.id) || 'asc';
                                    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
                                    setNodeSortOrder(prev => {
                                      const newMap = new Map(prev);
                                      newMap.set(task.id, newOrder);
                                      return newMap;
                                    });
                                  }}
                                  className="h-7 px-2"
                                >
                                  {nodeSortOrder.get(task.id) === 'desc' ? (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                  )}
                                  <span className="text-xs">
                                    {nodeSortOrder.get(task.id) === 'desc' ? '倒序' : '正序'}
                                  </span>
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {[...task.nodes].sort((a, b) => {
                                  const sortOrder = nodeSortOrder.get(task.id) || 'asc';
                                  const timeA = new Date(a.start_time).getTime();
                                  const timeB = new Date(b.start_time).getTime();
                                  return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
                                }).map(node => (
                                  <div
                                    key={node.id}
                                    className="rounded-md border border-border/60 p-3 space-y-2 bg-muted/30"
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
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => openEditInstantTaskDialog(node)}
                                          className="h-7 w-7 p-0 ml-auto"
                                        >
                                          <Pencil className="h-3 w-3" />
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
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-sm text-muted-foreground">
                今日暂无长任务
              </Card>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">独立即时任务</h3>
              <span className="text-xs text-muted-foreground">共 {instantTasks.length} 项</span>
            </div>
            {hasInstantTasks ? (
              <div className="space-y-3">
                {instantTasks.map(task => (
                  <Card key={task.id} className="p-5 space-y-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "text-sm font-semibold",
                          task.is_todo && "text-red-500"
                        )}>{task.title}</span>
                        {task.is_todo && (
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                        )}
                        {task.is_star && (
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditInstantTaskDialog(task)}
                          className="h-7 w-7 p-0 ml-auto"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeRange(task.start_time, task.end_time)}
                      </div>
                    </div>
                    {task.content && (
                      <p className="text-sm text-muted-foreground break-words">{task.content}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {task.tags && (
                        <div className="flex flex-wrap gap-1">
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
                      {task.contact && <span>联系人：{task.contact}</span>}
                      {task.location && <span>地点：{task.location}</span>}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-sm text-muted-foreground">
                今日暂无独立即时任务
              </Card>
            )}
          </section>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-8">
      <H1>查询任务</H1>
      
      {/* 登录组件 */}
      <Login isSimpleMode={true} />
      {loginStateSection}

      {/* 添加节点的弹窗 */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 遮罩层 */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setDialogOpen(false)}
          />
          
          {/* 弹窗内容 */}
          <Card className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">添加节点</h2>
                <p className="text-sm text-muted-foreground">
                  为长任务添加新的即时任务节点
                </p>
              </div>

              {/* 标题 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  标题 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={nodeFormData.title}
                  onChange={(e) => setNodeFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入节点标题"
                />
              </div>

              {/* 内容 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">内容</label>
                <Textarea
                  value={nodeFormData.content}
                  onChange={(e) => setNodeFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="请输入节点详细内容（可选）"
                  rows={3}
                />
              </div>

              {/* 开始时间 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  开始时间 <span className="text-red-500">*</span>
                </label>
                <DateTimePicker
                  value={nodeFormData.start_time}
                  onChange={(date) => setNodeFormData(prev => ({ ...prev, start_time: date }))}
                />
              </div>

              {/* 结束时间 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  结束时间 <span className="text-red-500">*</span>
                </label>
                <DateTimePicker
                  value={nodeFormData.end_time}
                  onChange={(date) => setNodeFormData(prev => ({ ...prev, end_time: date }))}
                />
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">标签</label>
                <Input
                  value={nodeFormData.tags}
                  onChange={(e) => setNodeFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="多个标签用逗号分隔，例如：开发,前端"
                />
              </div>

              {/* 联系人 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">联系人</label>
                <Input
                  value={nodeFormData.contact}
                  onChange={(e) => setNodeFormData(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="请输入联系人（可选）"
                />
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">备注</label>
                <Textarea
                  value={nodeFormData.remark}
                  onChange={(e) => setNodeFormData(prev => ({ ...prev, remark: e.target.value }))}
                  placeholder="请输入备注（可选）"
                  rows={2}
                />
              </div>

              {/* 地点 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">地点</label>
                <Input
                  value={nodeFormData.location}
                  onChange={(e) => setNodeFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="请输入地点（可选）"
                />
              </div>

              {/* 待办 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">待办</label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={nodeFormData.is_todo}
                    onCheckedChange={(checked) => setNodeFormData(prev => ({ ...prev, is_todo: checked }))}
                  />
                  <span className="text-sm text-muted-foreground">标记为待办任务</span>
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleAddNode}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? '添加中...' : '添加节点'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setCurrentLongTaskId(null);
                  }}
                  disabled={loading}
                >
                  取消
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 编辑独立即时任务的弹窗 */}
      {editDialogOpen && currentInstantTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 遮罩层 */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setEditDialogOpen(false)}
          />
          
          {/* 弹窗内容 */}
          <Card className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">编辑任务</h2>
                <p className="text-sm text-muted-foreground">
                  编辑即时任务
                </p>
              </div>

              {/* 标题 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('title') && "text-blue-600 dark:text-blue-400"
                )}>
                  标题 <span className="text-red-500">*</span>
                  {isFieldChanged('title') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Input
                  value={instantTaskFormData.title}
                  onChange={(e) => setInstantTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入任务标题"
                  className={cn(
                    isFieldChanged('title') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 内容 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('content') && "text-blue-600 dark:text-blue-400"
                )}>
                  内容
                  {isFieldChanged('content') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Textarea
                  value={instantTaskFormData.content}
                  onChange={(e) => setInstantTaskFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="请输入任务详细内容（可选）"
                  rows={3}
                  className={cn(
                    isFieldChanged('content') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 开始时间 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('start_time') && "text-blue-600 dark:text-blue-400"
                )}>
                  开始时间 <span className="text-red-500">*</span>
                  {isFieldChanged('start_time') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <div className={cn(
                  isFieldChanged('start_time') && "border border-blue-500 rounded-md p-1 bg-blue-50/50 dark:bg-blue-950/20"
                )}>
                  <DateTimePicker
                    value={instantTaskFormData.start_time}
                    onChange={(date) => setInstantTaskFormData(prev => ({ ...prev, start_time: date }))}
                  />
                </div>
              </div>

              {/* 结束时间 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('end_time') && "text-blue-600 dark:text-blue-400"
                )}>
                  结束时间 <span className="text-red-500">*</span>
                  {isFieldChanged('end_time') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <div className={cn(
                  isFieldChanged('end_time') && "border border-blue-500 rounded-md p-1 bg-blue-50/50 dark:bg-blue-950/20"
                )}>
                  <DateTimePicker
                    value={instantTaskFormData.end_time}
                    onChange={(date) => setInstantTaskFormData(prev => ({ ...prev, end_time: date }))}
                  />
                </div>
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('tags') && "text-blue-600 dark:text-blue-400"
                )}>
                  标签
                  {isFieldChanged('tags') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Input
                  value={instantTaskFormData.tags}
                  onChange={(e) => setInstantTaskFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="多个标签用逗号分隔，例如：开发,前端"
                  className={cn(
                    isFieldChanged('tags') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 联系人 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('contact') && "text-blue-600 dark:text-blue-400"
                )}>
                  联系人
                  {isFieldChanged('contact') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Input
                  value={instantTaskFormData.contact}
                  onChange={(e) => setInstantTaskFormData(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="请输入联系人（可选）"
                  className={cn(
                    isFieldChanged('contact') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('remark') && "text-blue-600 dark:text-blue-400"
                )}>
                  备注
                  {isFieldChanged('remark') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Textarea
                  value={instantTaskFormData.remark}
                  onChange={(e) => setInstantTaskFormData(prev => ({ ...prev, remark: e.target.value }))}
                  placeholder="请输入备注（可选）"
                  rows={2}
                  className={cn(
                    isFieldChanged('remark') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 地点 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('location') && "text-blue-600 dark:text-blue-400"
                )}>
                  地点
                  {isFieldChanged('location') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Input
                  value={instantTaskFormData.location}
                  onChange={(e) => setInstantTaskFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="请输入地点（可选）"
                  className={cn(
                    isFieldChanged('location') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 星标 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('is_star') && "text-blue-600 dark:text-blue-400"
                )}>
                  星标
                  {isFieldChanged('is_star') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={instantTaskFormData.is_star}
                    onCheckedChange={(checked) => setInstantTaskFormData(prev => ({ ...prev, is_star: checked }))}
                    className={cn(
                      isFieldChanged('is_star') && "data-[state=checked]:bg-blue-600"
                    )}
                  />
                  <span className="text-sm text-muted-foreground">标记为重要任务</span>
                </div>
              </div>

              {/* 待办 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isFieldChanged('is_todo') && "text-blue-600 dark:text-blue-400"
                )}>
                  待办
                  {isFieldChanged('is_todo') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={instantTaskFormData.is_todo}
                    onCheckedChange={(checked) => setInstantTaskFormData(prev => ({ ...prev, is_todo: checked }))}
                    className={cn(
                      isFieldChanged('is_todo') && "data-[state=checked]:bg-blue-600"
                    )}
                  />
                  <span className="text-sm text-muted-foreground">标记为待办任务</span>
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <Button 
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={loading || updating}
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除任务
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        确定要删除任务"{currentInstantTask.title}"吗？此操作不可恢复。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={updating}>取消</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteInstantTask}
                        disabled={updating}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {updating ? '删除中...' : '确认删除'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="flex gap-2 ml-auto">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setEditDialogOpen(false);
                      setCurrentInstantTask(null);
                    }}
                    disabled={loading || updating}
                    size="sm"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={handleUpdateInstantTask}
                    disabled={loading || updating}
                    size="sm"
                  >
                    {loading || updating ? '更新中...' : '保存更改'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 编辑长任务的弹窗 */}
      {editLongTaskDialogOpen && currentLongTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 遮罩层 */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => {
              setEditLongTaskDialogOpen(false);
              setUseDdl(false);
            }}
          />
          
          {/* 弹窗内容 */}
          <Card className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">编辑长任务</h2>
                <p className="text-sm text-muted-foreground">
                  编辑长任务
                </p>
              </div>

              {/* 标题 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isLongTaskFieldChanged('title') && "text-blue-600 dark:text-blue-400"
                )}>
                  标题 <span className="text-red-500">*</span>
                  {isLongTaskFieldChanged('title') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Input
                  value={longTaskFormData.title}
                  onChange={(e) => setLongTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入任务标题"
                  className={cn(
                    isLongTaskFieldChanged('title') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 描述 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isLongTaskFieldChanged('description') && "text-blue-600 dark:text-blue-400"
                )}>
                  描述
                  {isLongTaskFieldChanged('description') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Textarea
                  value={longTaskFormData.description}
                  onChange={(e) => setLongTaskFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入任务描述（可选）"
                  rows={3}
                  className={cn(
                    isLongTaskFieldChanged('description') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 开始时间 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isLongTaskFieldChanged('start_time') && "text-blue-600 dark:text-blue-400"
                )}>
                  开始时间 <span className="text-red-500">*</span>
                  {isLongTaskFieldChanged('start_time') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <div className={cn(
                  isLongTaskFieldChanged('start_time') && "border border-blue-500 rounded-md p-1 bg-blue-50/50 dark:bg-blue-950/20"
                )}>
                  <DateTimePicker
                    value={longTaskFormData.start_time}
                    onChange={(date) => setLongTaskFormData(prev => ({ ...prev, start_time: date }))}
                  />
                </div>
              </div>

              {/* 截止时间 */}
              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="use-ddl"
                      checked={useDdl}
                      onCheckedChange={(checked) => {
                        setUseDdl(checked);
                        // 如果关闭Switch，将ddl设置为无Deadline（年份>9000）
                        if (!checked) {
                          const noDeadlineDate = new Date('9999-12-01T00:00:00');
                          setLongTaskFormData(prev => ({ ...prev, ddl: noDeadlineDate }));
                        } else {
                          // 如果开启Switch，且当前ddl是无Deadline，则设置为默认值（开始时间+1天）
                          if (longTaskFormData.ddl && isNoDeadlineDate(longTaskFormData.ddl)) {
                            const defaultDdl = new Date(longTaskFormData.start_time!.getTime() + 24 * 60 * 60 * 1000);
                            defaultDdl.setHours(23, 59, 59, 0);
                            setLongTaskFormData(prev => ({ ...prev, ddl: defaultDdl }));
                          }
                        }
                      }}
                    />
                    <label htmlFor="use-ddl" className={cn(
                      "text-sm font-medium cursor-pointer whitespace-nowrap flex items-center gap-2",
                      isLongTaskFieldChanged('ddl') && "text-blue-600 dark:text-blue-400"
                    )}>
                      {useDdl ? '设置截止时间' : '无截止时间'}
                      {isLongTaskFieldChanged('ddl') && (
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                          已修改
                        </Badge>
                      )}
                    </label>
                  </div>
                  {useDdl && longTaskFormData.ddl && !isNoDeadlineDate(longTaskFormData.ddl) && (
                    <span className="text-sm text-muted-foreground">
                      （周{guoDT.getCnWeekDay(guoDT.getDayjs(longTaskFormData.ddl.getTime()))}）
                    </span>
                  )}
                </div>
                {useDdl && (
                  <div className={cn(
                    isLongTaskFieldChanged('ddl') && "border border-blue-500 rounded-md p-1 bg-blue-50/50 dark:bg-blue-950/20"
                  )}>
                    <DeadlinePicker
                      value={longTaskFormData.ddl}
                      onChange={(date) => setLongTaskFormData(prev => ({ ...prev, ddl: date }))}
                    />
                  </div>
                )}
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isLongTaskFieldChanged('tags') && "text-blue-600 dark:text-blue-400"
                )}>
                  标签
                  {isLongTaskFieldChanged('tags') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Input
                  value={longTaskFormData.tags}
                  onChange={(e) => setLongTaskFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="多个标签用逗号分隔，例如：开发,前端"
                  className={cn(
                    isLongTaskFieldChanged('tags') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 联系人 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isLongTaskFieldChanged('contact') && "text-blue-600 dark:text-blue-400"
                )}>
                  联系人
                  {isLongTaskFieldChanged('contact') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Input
                  value={longTaskFormData.contact}
                  onChange={(e) => setLongTaskFormData(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="请输入联系人（可选）"
                  className={cn(
                    isLongTaskFieldChanged('contact') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isLongTaskFieldChanged('remark') && "text-blue-600 dark:text-blue-400"
                )}>
                  备注
                  {isLongTaskFieldChanged('remark') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Textarea
                  value={longTaskFormData.remark}
                  onChange={(e) => setLongTaskFormData(prev => ({ ...prev, remark: e.target.value }))}
                  placeholder="请输入备注（可选）"
                  rows={2}
                  className={cn(
                    isLongTaskFieldChanged('remark') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 地点 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isLongTaskFieldChanged('location') && "text-blue-600 dark:text-blue-400"
                )}>
                  地点
                  {isLongTaskFieldChanged('location') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <Input
                  value={longTaskFormData.location}
                  onChange={(e) => setLongTaskFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="请输入地点（可选）"
                  className={cn(
                    isLongTaskFieldChanged('location') && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                />
              </div>

              {/* 星标 */}
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  isLongTaskFieldChanged('is_star') && "text-blue-600 dark:text-blue-400"
                )}>
                  星标
                  {isLongTaskFieldChanged('is_star') && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      已修改
                    </Badge>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={longTaskFormData.is_star}
                    onCheckedChange={(checked) => setLongTaskFormData(prev => ({ ...prev, is_star: checked }))}
                    className={cn(
                      isLongTaskFieldChanged('is_star') && "data-[state=checked]:bg-blue-600"
                    )}
                  />
                  <span className="text-sm text-muted-foreground">标记为重要任务</span>
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                <AlertDialog open={deleteLongTaskDialogOpen} onOpenChange={setDeleteLongTaskDialogOpen}>
                  <Button 
                    variant="destructive"
                    onClick={() => setDeleteLongTaskDialogOpen(true)}
                    disabled={loading || updating}
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除任务
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        确定要删除任务"{currentLongTask.title}"吗？此操作不可恢复。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={updating}>取消</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteLongTask}
                        disabled={updating}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {updating ? '删除中...' : '确认删除'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="flex gap-2 ml-auto">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setEditLongTaskDialogOpen(false);
                      setCurrentLongTask(null);
                      setUseDdl(false);
                    }}
                    disabled={loading || updating}
                    size="sm"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={handleUpdateLongTask}
                    disabled={loading || updating}
                    size="sm"
                  >
                    {loading || updating ? '更新中...' : '保存更改'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default {
  title: '查询任务',
  jsx: <QueryPage />
};

