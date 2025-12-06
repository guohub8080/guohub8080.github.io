import React, { useState } from 'react';
import { H1 } from '../../../../components/mdx/index.ts';
import Login from '../../../../components/webLog/Login.tsx';
import useUserLog from '../../../../store/useUserLog/index.ts';
import { Button } from '../../../../shadcn/components/ui/button.tsx';
import { Input } from '../../../../shadcn/components/ui/input.tsx';
import { Textarea } from '../../../../shadcn/components/ui/textarea.tsx';
import { Card } from '../../../../shadcn/components/ui/card.tsx';
import { Switch } from '../../../../shadcn/components/ui/switch.tsx';
import { DateTimePicker } from '../../../../shadcn/components/ui/datetime-picker.tsx';
import { DeadlinePicker } from '../../../../shadcn/components/ui/deadline-picker.tsx';
import { apiPost } from '../../../../api/client.ts';
import guoDT from '../../../../utils/utDateTime/guoDT.ts';
import { Star } from 'lucide-react';

interface LongTaskForm {
  title: string;
  description: string;
  start_time: Date | undefined;
  ddl: Date | undefined;
  is_star: boolean;
  tags: string;
  contact: string;
  remark: string;
}

const NO_DEADLINE_PLACEHOLDER = guoDT.formatToApiDateTime('9999-12-01 00:00:00');

function AddLongTaskPage() {
  const { isLoggedIn } = useUserLog();
  
  // 表单状态
  const [formData, setFormData] = useState<LongTaskForm>(() => {
    const now = new Date();
    const defaultDdl = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 默认1天后
    defaultDdl.setHours(23, 59, 59, 0); // 设置为当天结束
    return {
      title: '',
      description: '',
      start_time: now,
      ddl: defaultDdl,
      is_star: false,
      tags: '',
      contact: '',
      remark: ''
    };
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [useDdl, setUseDdl] = useState(false); // 是否设置截止时间

  // 处理表单字段变化
  const handleChange = (field: keyof LongTaskForm, value: string | boolean | Date | undefined) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // 如果修改了开始时间，自动更新截止日期为开始时间的1天后
      if (field === 'start_time' && value instanceof Date) {
        const newDdl = new Date(value.getTime() + 24 * 60 * 60 * 1000); // 1天后
        newDdl.setHours(23, 59, 59, 0); // 设置为当天结束
        newData.ddl = newDdl;
      }
      
      return newData;
    });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 验证必填字段
      if (!formData.title.trim()) {
        throw new Error('任务标题不能为空');
      }
      if (!formData.start_time) {
        throw new Error('开始时间不能为空');
      }

      // 构建请求数据
      // 将标签中的中文逗号替换为英文逗号
      const normalizedTags = formData.tags.trim().replace(/，/g, ',');
      
      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        start_time: guoDT.formatToApiDateTime(formData.start_time),
        ddl: useDdl && formData.ddl ? guoDT.formatToApiDateTime(formData.ddl) : NO_DEADLINE_PLACEHOLDER,
        status: 'active',
        is_star: formData.is_star,
        tags: normalizedTags || null,
        contact: formData.contact.trim() || null,
        remark: formData.remark.trim() || null
      };

      // 打印请求数据
      console.log('📤 发送 POST 请求到 /task/long-tasks');
      console.log('请求数据:', JSON.stringify(requestData, null, 2));

      // 发送请求
      const result = await apiPost('/task/long-tasks', requestData);
      
      // 打印响应数据
      console.log('✅ 请求成功，响应数据:', result);
      
      // 成功提示
      setMessage({ type: 'success', text: '长任务创建成功！' });
      
      // 重置表单
      const now = new Date();
      const defaultDdl = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 默认1天后
      defaultDdl.setHours(23, 59, 59, 0); // 设置为当天结束
      setFormData({
        title: '',
        description: '',
        start_time: now,
        ddl: defaultDdl,
        is_star: false,
        tags: '',
        contact: '',
        remark: ''
      });
      setUseDdl(false);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || '创建失败，请检查网络或重试' 
      });
      console.error('创建失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full space-y-8">
      <H1>增加长任务</H1>
      
      {/* 登录组件 */}
      <Login isSimpleMode={true} />
      
      {/* 未登录时的提示 */}
      {!isLoggedIn && (
        <div className="p-6 rounded-lg border-2 border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            请先登录以增加和管理你的任务
          </p>
        </div>
      )}
      
      {/* 已登录时显示添加功能 */}
      {isLoggedIn && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">创建长任务</h2>
            <p className="text-sm text-muted-foreground">
              长任务用于项目级、长期性的任务管理，可以包含多个即时任务作为节点。
            </p>
          </div>
          
          {/* 消息提示 */}
          {message && (
            <div className={`p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'border-green-500/30 bg-green-50 dark:bg-green-950/20' 
                : 'border-red-500/30 bg-red-50 dark:bg-red-950/20'
            }`}>
              <p className={`text-sm ${
                message.type === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {message.text}
              </p>
            </div>
          )}
          
          {/* 表单 */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 任务标题 - 必填 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  任务标题 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="输入任务标题"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    maxLength={500}
                    required
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('is_star', !formData.is_star)}
                    className="cursor-pointer transition-colors flex-shrink-0"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        formData.is_star
                          ? 'fill-orange-500 text-orange-500'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  请简要描述这个长任务（最多 500 字符）
                </p>
              </div>

              {/* 任务描述 - 可选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">任务描述</label>
                <Textarea
                  placeholder="输入任务的详细描述"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              {/* 开始时间 - 必填 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  开始时间{formData.start_time && `（周${guoDT.getCnWeekDay(guoDT.getDayjs(formData.start_time.getTime()))}）`} <span className="text-red-500">*</span>
                </label>
                <DateTimePicker
                  value={formData.start_time}
                  onChange={(date) => handleChange('start_time', date)}
                  placeholder="选择开始时间"
                />
              </div>

              {/* 截止时间 - 可选 */}
              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="use-ddl"
                      checked={useDdl}
                      onCheckedChange={setUseDdl}
                    />
                    <label htmlFor="use-ddl" className="text-sm font-medium cursor-pointer whitespace-nowrap">
                      {useDdl ? '设置截止时间' : '无截止时间'}
                    </label>
                  </div>
                  {useDdl && formData.ddl && (
                    <span className="text-sm text-muted-foreground">
                      （周{guoDT.getCnWeekDay(guoDT.getDayjs(formData.ddl.getTime()))}）
                    </span>
                  )}
                </div>
                {useDdl && (
                  <DeadlinePicker
                    value={formData.ddl}
                    onChange={(date) => handleChange('ddl', date)}
                    placeholder="选择截止日期"
                  />
                )}
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">标签</label>
                <Input
                  type="text"
                  placeholder="用英文逗号分隔多个标签"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  用英文逗号分隔多个标签，不要加空格
                </p>
              </div>

              {/* 联系人 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">联系人</label>
                <Input
                  type="text"
                  placeholder="输入联系人"
                  value={formData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                />
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">备注</label>
                <Textarea
                  placeholder="输入备注信息"
                  value={formData.remark}
                  onChange={(e) => handleChange('remark', e.target.value)}
                  rows={3}
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? '创建中...' : '创建长任务'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    const now = new Date();
                    const defaultDdl = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 默认1天后
                    defaultDdl.setHours(23, 59, 59, 0); // 设置为当天结束
                    setFormData({
                      title: '',
                      description: '',
                      start_time: now,
                      ddl: defaultDdl,
                      is_star: false,
                      tags: '',
                      contact: '',
                      remark: ''
                    });
                    setUseDdl(false);
                    setMessage(null);
                  }}
                >
                  重置表单
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default {
  title: '增加长任务',
  jsx: <AddLongTaskPage />
};

