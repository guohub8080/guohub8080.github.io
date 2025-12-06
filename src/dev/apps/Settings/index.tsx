import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '../../shadcn/components/ui/card.tsx';
import { Button } from '../../shadcn/components/ui/button.tsx';
import { Badge } from '../../shadcn/components/ui/badge.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shadcn/components/ui/select.tsx';
import { Slider } from '../../shadcn/components/ui/slider.tsx';
import useGlobalSettings from '../../store/useGlobalSettings';
import { useNavigate } from 'react-router-dom';
import { isEmpty, isNil } from 'lodash';
import { ArrowLeft } from 'lucide-react';
import SetAndTestURL from '../../components/webLog/SetAndTestURL.tsx';

/**
 * 设置页面组件
 * 包含主题设置、中文字体、英文字体和代码字体设置
 */
const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  // 从 useGlobalSettings 获取所有设置
  const {
    theme,
    setTheme,
    mainDynamicBackround,
    setMainDynamicBackround,
    chineseFontFamily,
    englishFontFamily,
    codeFontFamily,
    japaneseFontFamily,
    fontWeightLight,
    fontWeightNormal,
    fontWeightMedium,
    fontWeightSemibold,
    fontWeightBold,
    lastVisitedUrl,
    bookSideWidth,
    bookContentWidth,
    bookContentPadding,
    bookSideContentGap,
    setChineseFontFamily,
    setEnglishFontFamily,
    setCodeFontFamily,
    setJapaneseFontFamily,
    setFontWeightLight,
    setFontWeightNormal,
    setFontWeightMedium,
    setFontWeightSemibold,
    setFontWeightBold,
    setBookSideWidth,
    setBookContentWidth,
    setBookContentPadding,
    setBookSideContentGap,
    resetFontSettings,
  } = useGlobalSettings();

  // 返回上次浏览的页面
  const handleBackToLastVisited = () => {
    if (!isEmpty(lastVisitedUrl) && !isNil(lastVisitedUrl)) {
      navigate(lastVisitedUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 返回按钮 - 左上角 */}
      {!isEmpty(lastVisitedUrl) && !isNil(lastVisitedUrl) && (
        <div className="mb-4">
          <Button 
            variant="default" 
            size="sm"
            onClick={handleBackToLastVisited}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="mr-1">返回上次浏览</span>
          </Button>
        </div>
      )}
      
      {/* 标题区域 - 居中 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">网页浏览偏好设置</h1>
        <p className="text-muted-foreground">欢迎来到方块郭的想象工厂，这里是配置中心</p>
      </div>

      <div className="space-y-6">
        {/* 主题设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">主题设置</CardTitle>
            <CardDescription>
              选择你喜欢的配色主题
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">主题模式</label>
                <Select 
                  value={theme} 
                  onValueChange={(value: any) => setTheme(value)}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="选择主题模式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ 亮色模式</SelectItem>
                    <SelectItem value="dark">🌙 暗色模式</SelectItem>
                    <SelectItem value="blue">🔵 蓝色主题</SelectItem>
                    <SelectItem value="green">🟢 绿色主题</SelectItem>
                    <SelectItem value="purple">🟣 紫色主题</SelectItem>
                    <SelectItem value="system">💻 跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">背景样式</label>
                <Select 
                  value={mainDynamicBackround}
                  onValueChange={(value: any) => setMainDynamicBackround(value)}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="选择背景样式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradient">🎨 渐变背景</SelectItem>
                    <SelectItem value="aurora">🌌 极光背景</SelectItem>
                    <SelectItem value="none">⬜ 纯色背景</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 书籍设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">书籍设置</CardTitle>
            <CardDescription>
              配置书籍阅读页面的布局参数
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 侧边栏宽度 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">侧边栏宽度</label>
                  <Badge variant="secondary">{bookSideWidth}px</Badge>
                </div>
                <Slider
                  value={[bookSideWidth]}
                  onValueChange={(value) => setBookSideWidth(value[0])}
                  min={200}
                  max={400}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  调整书籍目录侧边栏的宽度（200-400px）
                </p>
              </div>

              {/* 内容区宽度 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">内容区宽度</label>
                  <Badge variant="secondary">{bookContentWidth}px</Badge>
                </div>
                <Slider
                  value={[bookContentWidth]}
                  onValueChange={(value) => setBookContentWidth(value[0])}
                  min={600}
                  max={1200}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  调整书籍内容区域的最大宽度（600-1200px）
                </p>
              </div>

              {/* 内容区内边距 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">内容区内边距</label>
                  <Badge variant="secondary">{bookContentPadding}px</Badge>
                </div>
                <Slider
                  value={[bookContentPadding]}
                  onValueChange={(value) => setBookContentPadding(value[0])}
                  min={10}
                  max={60}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  调整内容区域的内边距（10-60px）
                </p>
              </div>

              {/* 侧边栏与内容区间距 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">侧边栏与内容区间距</label>
                  <Badge variant="secondary">{bookSideContentGap}px</Badge>
                </div>
                <Slider
                  value={[bookSideContentGap]}
                  onValueChange={(value) => setBookSideContentGap(value[0])}
                  min={0}
                  max={40}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  调整侧边栏和内容区之间的间距（0-40px）
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 字体设置 - 单个卡片内部分栏 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">字体设置</CardTitle>
            <CardDescription>
              配置中文字体、英文字体和代码字体，让阅读更加舒适
            </CardDescription>
            <CardAction>
              <Button
                variant="destructive"
                size="sm"
                onClick={resetFontSettings}
              >
                重置
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 字体设置选项 - 四栏布局 */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 中文字体设置 */}
                <div className="space-y-4">
                  <div className="space-y-4">
                    {/* 中文默认字体 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">中文默认字体</label>
                      <Select
                        value={chineseFontFamily || "system"}
                        onValueChange={(value) => setChineseFontFamily(value === "system" ? null : value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择中文默认字体" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minsans-v">MiSans</SelectItem>
                          <SelectItem value="syht-cn-v">思源黑体</SelectItem>
                          <SelectItem value="syst-cn-v">思源宋体</SelectItem>
                          <SelectItem value="system">系统默认字体</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 英文字体设置 */}
                <div className="space-y-4">
                  <div className="space-y-4">
                    {/* 英文默认字体 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">英文默认字体</label>
                      <Select
                        value={englishFontFamily || "follow-chinese"}
                        onValueChange={(value) => setEnglishFontFamily(value === "follow-chinese" ? null : value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="跟随中文字体" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow-chinese">跟随中文</SelectItem>
                          <SelectItem value="minsans-v">MiSans</SelectItem>
                          <SelectItem value="syht-cn-v">思源黑体</SelectItem>
                          <SelectItem value="syst-cn-v">思源宋体</SelectItem>
                          <SelectItem value="jb-mono">JetBrains Mono</SelectItem>
                          <SelectItem value="consolas">Consolas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 代码字体设置 */}
                <div className="space-y-4">
                  <div className="space-y-4">
                    {/* 代码字体 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">代码字体</label>
                      <Select
                        value={codeFontFamily || "follow-english"}
                        onValueChange={(value) => setCodeFontFamily(value === "follow-english" ? null : value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="跟随英文字体" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow-english">跟随英文</SelectItem>
                          <SelectItem value="minsans-v">MiSans</SelectItem>
                          <SelectItem value="syht-cn-v">思源黑体</SelectItem>
                          <SelectItem value="syst-cn-v">思源宋体</SelectItem>
                          <SelectItem value="jb-mono">JetBrains Mono</SelectItem>
                          <SelectItem value="consolas">Consolas</SelectItem>
                          <SelectItem value="system">系统默认等宽字体</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 其他东亚字体设置（日文） */}
                <div className="space-y-4">
                  <div className="space-y-4">
                    {/* 日文字体 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">东亚字体</label>
                      <Select
                        value={japaneseFontFamily || "follow-chinese"}
                        onValueChange={(value) => setJapaneseFontFamily(value === "follow-chinese" ? null : value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="跟随中文字体" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow-chinese">跟随中文</SelectItem>
                          <SelectItem value="minsans-v">MiSans</SelectItem>
                          <SelectItem value="syht-jp-v">思源黑体</SelectItem>
                          <SelectItem value="syst-jp-v">思源宋体</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 字重设置 */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold mb-4">字重设置</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  调整 Tailwind 字重类的具体数值，body 默认使用 font-normal
                </p>
                <div className="space-y-4">
                  {/* font-light */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[100px]">font-light</Badge>
                        <Badge variant="secondary">{fontWeightLight}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightLight]}
                        onValueChange={(value) => setFontWeightLight(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-light sm:pl-[116px]">
                      轻字重预览 Light Weight Preview
                    </p>
                  </div>

                  {/* font-normal */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="min-w-[100px]">font-normal</Badge>
                        <Badge variant="default">{fontWeightNormal}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightNormal]}
                        onValueChange={(value) => setFontWeightNormal(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-normal sm:pl-[116px]">
                      正常字重预览 Normal Weight Preview（默认）
                    </p>
                  </div>

                  {/* font-medium */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[100px]">font-medium</Badge>
                        <Badge variant="secondary">{fontWeightMedium}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightMedium]}
                        onValueChange={(value) => setFontWeightMedium(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-medium sm:pl-[116px]">
                      中等字重预览 Medium Weight Preview
                    </p>
                  </div>

                  {/* font-semibold */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[100px]">font-semibold</Badge>
                        <Badge variant="secondary">{fontWeightSemibold}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightSemibold]}
                        onValueChange={(value) => setFontWeightSemibold(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-semibold sm:pl-[116px]">
                      半粗字重预览 Semibold Weight Preview
                    </p>
                  </div>

                  {/* font-bold */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[100px]">font-bold</Badge>
                        <Badge variant="secondary">{fontWeightBold}</Badge>
                      </div>
                      <Slider
                        value={[fontWeightBold]}
                        onValueChange={(value) => setFontWeightBold(value[0])}
                        min={100}
                        max={900}
                        step={1}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-base font-bold sm:pl-[116px]">
                      粗字重预览 Bold Weight Preview
                    </p>
                  </div>
                </div>
              </div>

              {/* 字体预览区域 */}
              <div className="pt-4">
                <div className="p-6 border rounded-lg bg-muted/50 space-y-4">
                  {/* 中文预览 */}
                  <div>
                    <div className="text-lg">
                      文字预览：欢迎来到方块郭的想象工厂，我的域名是“guohub.top”。
                    </div>
                    <div>
                      Welcome to the imagination factory of Guohub. My domain name is "guohub.top".
                    </div>
                     <div>
                       ,.!?;:""''()[]{'{'}{'}'} 《》「」【】、。，；：！？…—·@#$%&amp;*+-=/&lt;&gt;~`|\
                     </div>
                  </div>



                  {/* 代码字体预览 */}
                  <div>
                    <div className="p-3 bg-slate-900 text-slate-100 rounded code-font-family text-sm">
                      <div>// 这是代码字体预览</div>
                      <div>function hello() {`{`}</div>
                      <div className='px-4'>    console.log("Hello, World!");</div>
                      <div className='px-4'>  return "代码字体显示效果";</div>
                      <div>{`}`}</div>
                    </div>
                  </div>

                  {/* 日文字体预览 */}
                  <div className="jp-font">
                    <div className="text-sm text-muted-foreground mb-1">东亚字体预览（日文）：</div>
                    <div>こんにちは、世界！日本語のフォントプレビューです。</div>
                    <div>ひらがな・カタカナ・漢字が正しく表示されています。</div>
                  </div>

                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API 配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">API 配置</CardTitle>
            <CardDescription>
              配置后端 API 服务器地址并测试连接
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetAndTestURL />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
