import React from 'react';
import { Button } from '../../../shadcn/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shadcn/components/ui/card.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shadcn/components/ui/select.tsx';

/**
 * 风格设置组件
 * 用于配置应用的整体风格和主题
 */
const StyleSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 主题模式 */}
      <div className="space-y-4">
        <label className="text-base font-medium">主题模式</label>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="dark-mode" className="rounded" />
          <label htmlFor="dark-mode" className="text-sm">深色模式</label>
        </div>
      </div>

      {/* 颜色主题 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">颜色主题</label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择颜色主题" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">选择颜色主题</SelectItem>
            <SelectItem value="blue">蓝色主题</SelectItem>
            <SelectItem value="green">绿色主题</SelectItem>
            <SelectItem value="purple">紫色主题</SelectItem>
            <SelectItem value="red">红色主题</SelectItem>
            <SelectItem value="orange">橙色主题</SelectItem>
            <SelectItem value="gray">灰色主题</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 圆角设置 */}
      <div className="space-y-2">
        <label htmlFor="border-radius" className="text-sm font-medium">圆角大小</label>
        <input 
          type="range" 
          id="border-radius" 
          min="0" 
          max="24" 
          step="2" 
          defaultValue="8"
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0px</span>
          <span>24px</span>
        </div>
      </div>

      {/* 间距设置 */}
      <div className="space-y-2">
        <label htmlFor="spacing" className="text-sm font-medium">间距密度</label>
        <select id="spacing" className="w-full p-2 border rounded-md">
          <option value="">选择间距密度</option>
          <option value="compact">紧凑</option>
          <option value="normal">正常</option>
          <option value="relaxed">宽松</option>
          <option value="spacious">很宽松</option>
        </select>
      </div>

      {/* 动画设置 */}
      <div className="space-y-4">
        <label className="text-base font-medium">动画效果</label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="enable-animations" className="text-sm">启用动画</label>
            <input type="checkbox" id="enable-animations" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="reduce-motion" className="text-sm">减少动画</label>
            <input type="checkbox" id="reduce-motion" className="rounded" />
          </div>
        </div>
      </div>

      {/* 预览区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">风格预览</CardTitle>
          <CardDescription className="text-xs">
            这里将显示风格设置的效果
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">卡片标题</h3>
              <p className="text-sm text-muted-foreground">
                这是一个风格预览卡片，展示了当前的样式设置效果。
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm">主要按钮</Button>
              <Button size="sm" variant="outline">次要按钮</Button>
              <Button size="sm" variant="ghost">文本按钮</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <Button>应用设置</Button>
        <Button variant="outline">重置</Button>
        <Button variant="ghost">导出配置</Button>
      </div>
    </div>
  );
};

export default StyleSettings;
