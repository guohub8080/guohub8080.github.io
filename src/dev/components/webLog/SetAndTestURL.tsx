import { useState, useEffect } from 'react';
import useUserLog from '../../store/useUserLog/index.ts';
import { Input } from '../../shadcn/components/ui/input.tsx';
import { Button } from '../../shadcn/components/ui/button.tsx';
import { Badge } from '../../shadcn/components/ui/badge.tsx';

export const title = 'API 配置';

export const jsx = <SetAndTestURL />;

/**
 * API URL 设置和测试组件
 * 用户可以设置后端 API 地址并测试连接
 */
export default function SetAndTestURL() {
  const { apiBaseUrl, setApiBaseUrl, logout } = useUserLog();
  const [inputUrl, setInputUrl] = useState(apiBaseUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // 同步 store 中的 URL 到输入框
  useEffect(() => {
    setInputUrl(apiBaseUrl);
    setIsSaved(true);
  }, [apiBaseUrl]);

  // 监听输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
    setIsSaved(false);
    setTestStatus('idle');
    setTestMessage('');
  };

  // 保存并测试连接
  const handleSaveAndTest = async () => {
    // 规范化 URL：去除空格和末尾的斜杠
    const trimmedUrl = inputUrl.trim().replace(/\/+$/, '');
    
    if (!trimmedUrl) {
      setTestStatus('error');
      setTestMessage('请先输入 API URL');
      return;
    }

    // 验证 URL 格式
    try {
      new URL(trimmedUrl);
    } catch (error) {
      setTestStatus('error');
      setTestMessage('URL 格式不正确，请输入完整的 URL（如：https://api.example.com）');
      return;
    }

    // 如果 URL 有变化，先保存
    if (!isSaved) {
      setApiBaseUrl(trimmedUrl);
      setInputUrl(trimmedUrl); // 同步更新输入框
      setIsSaved(true);
    }

    // 开始测试连接
    setTestStatus('testing');
    setTestMessage('正在测试连接...');

    try {
      // 测试连接（尝试访问根路径或健康检查端点）
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

      // 使用规范化后的 URL 进行测试（使用 /api/health 端点）
      const response = await fetch(`${trimmedUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setTestStatus('success');
        setTestMessage('连接成功！服务器响应正常，配置已保存');
      } else {
        setTestStatus('error');
        
        // 服务器返回错误时自动清除登录信息
        logout();
        
        setTestMessage(`服务器返回错误：${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      setTestStatus('error');
      
      // 连接失败时自动清除登录信息
      logout();
      
      if (error.name === 'AbortError') {
        setTestMessage('连接超时，请检查 URL 是否正确或服务器是否可访问');
      } else if (error.message.includes('fetch')) {
        setTestMessage('网络错误，请检查 URL 或 CORS 配置');
      } else {
        setTestMessage(`连接失败：${error.message}`);
      }
    }
  };

  // 获取状态徽章
  const getStatusBadge = () => {
    switch (testStatus) {
      case 'testing':
        return <Badge variant="secondary" className="text-xs">测试中</Badge>;
      case 'success':
        return <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs">连接成功</Badge>;
      case 'error':
        return <Badge variant="destructive" className="text-xs">连接失败</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6 my-8">
      {/* 主配置区域 */}
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="api-url" className="text-base font-semibold">
              API 服务器地址
            </label>
            {apiBaseUrl && (
              <Badge variant="outline" className="text-xs">
                已配置
              </Badge>
            )}
          </div>
          
          <div className="flex gap-3">
            <Input
              id="api-url"
              type="url"
              placeholder="https://api.example.com"
              value={inputUrl}
              onChange={handleInputChange}
              className="code-font-family text-base h-11 flex-1"
            />
            <Button 
              onClick={handleSaveAndTest}
              size="lg"
              disabled={testStatus === 'testing' || !inputUrl.trim()}
              className="min-w-[140px]"
            >
              {testStatus === 'testing' 
                ? '测试中...' 
                : isSaved 
                  ? '重新测试' 
                  : '保存并测试'}
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            请输入完整的 API 地址（包含 https:// 或 http://），将使用 /api/health 端点进行连接测试
          </p>
        </div>

        {/* 状态显示区域 */}
        {(testMessage || testStatus !== 'idle') && (
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            {getStatusBadge()}
            <span className="text-sm flex-1">{testMessage}</span>
          </div>
        )}
      </div>

    </div>
  );
}

