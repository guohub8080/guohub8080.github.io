import React, { useState } from 'react';
import { H1 } from '../../../../components/mdx/index.ts';
import Login from '../../../../components/webLog/Login.tsx';
import useUserLog from '../../../../store/useUserLog/index.ts';
import { Button } from '../../../../shadcn/components/ui/button.tsx';
import { Input } from '../../../../shadcn/components/ui/input.tsx';
import { Textarea } from '../../../../shadcn/components/ui/textarea.tsx';
import { Card } from '../../../../shadcn/components/ui/card.tsx';
import { DateTimePicker } from '../../../../shadcn/components/ui/datetime-picker.tsx';
import { apiPost } from '../../../../api/client.ts';
import guoDT from '../../../../utils/utDateTime/guoDT.ts';
import { Star } from 'lucide-react';

interface InstantTaskForm {
  title: string;
  content: string;
  start_time: Date | undefined;
  end_time: Date | undefined;
  is_star: boolean;
  tags: string;
  contact: string;
  remark: string;
}

function AddPage() {
  const { isLoggedIn } = useUserLog();
  
  // 表单状态
  const [formData, setFormData] = useState<InstantTaskForm>(() => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 30 * 60 * 1000); // 加30分钟
    return {
      title: '',
      content: '',
      start_time: now,
      end_time: endTime,
      is_star: false,
      tags: '',
      contact: '',
      remark: ''
    };
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 处理表单字段变化
  const handleChange = (field: keyof InstantTaskForm, value: string | boolean | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      if (!formData.end_time) {
        throw new Error('结束时间不能为空');
      }

      // 构建请求数据
      // 将标签中的中文逗号替换为英文逗号
      const normalizedTags = formData.tags.trim().replace(/，/g, ',');
      
      const requestData = {
        title: formData.title.trim(),
        content: formData.content.trim() || null,
        start_time: guoDT.formatToApiDateTime(formData.start_time),
        end_time: guoDT.formatToApiDateTime(formData.end_time),
        long_task_id: 0, // 独立即时任务
        is_star: formData.is_star,
        tags: normalizedTags || null,
        contact: formData.contact.trim() || null,
        remark: formData.remark.trim() || null
      };

      // 打印请求数据
      console.log('📤 发送 POST 请求到 /task/instant-tasks');
      console.log('请求数据:', JSON.stringify(requestData, null, 2));

      // 发送请求
      const result = await apiPost('/task/instant-tasks', requestData);
      
      // 打印响应数据
      console.log('✅ 请求成功，响应数据:', result);
      
      // 成功提示
      setMessage({ type: 'success', text: '即时任务创建成功！' });
      
      // 重置表单
      const now = new Date();
      const endTime = new Date(now.getTime() + 30 * 60 * 1000); // 加30分钟
      setFormData({
        title: '',
        content: '',
        start_time: now,
        end_time: endTime,
        is_star: false,
        tags: '',
        contact: '',
        remark: ''
      });
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
      <H1>增加新任务</H1>
      
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
            <h2 className="text-xl font-semibold">创建即时任务</h2>
            <p className="text-sm text-muted-foreground">
              即时任务用于记录一次性的工作、会议或事项，可以独立存在，也可以后续挂载到长任务。
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
                  请简要描述这个任务（最多 500 字符）
                </p>
              </div>

              {/* 任务内容 - 可选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">任务内容</label>
                <Textarea
                  placeholder="输入任务的详细内容"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={4}
                />
              </div>

              {/* 时间字段 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 开始时间 */}
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

                {/* 结束时间 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    结束时间{formData.end_time && `（周${guoDT.getCnWeekDay(guoDT.getDayjs(formData.end_time.getTime()))}）`} <span className="text-red-500">*</span>
                  </label>
                  <DateTimePicker
                    value={formData.end_time}
                    onChange={(date) => handleChange('end_time', date)}
                    placeholder="选择结束时间"
                  />
                </div>
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
                  {loading ? '创建中...' : '创建即时任务'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    const now = new Date();
                    const endTime = new Date(now.getTime() + 30 * 60 * 1000); // 加30分钟
                    setFormData({
                      title: '',
                      content: '',
                      start_time: now,
                      end_time: endTime,
                      is_star: false,
                      tags: '',
                      contact: '',
                      remark: ''
                    });
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
  title: '增加即时任务',
  jsx: <AddPage />
};

