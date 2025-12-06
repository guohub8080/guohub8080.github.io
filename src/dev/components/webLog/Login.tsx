import { useState, useEffect } from 'react';
import useUserLog from '../../store/useUserLog/index.ts';
import { Input } from '../../shadcn/components/ui/input.tsx';
import { Button } from '../../shadcn/components/ui/button.tsx';
import { Badge } from '../../shadcn/components/ui/badge.tsx';
import api from '../../api/client.ts';
import guoDT from '../../utils/utDateTime/guoDT.ts';

export const title = '用户登录';

export const jsx = <Login />;

interface LoginProps {
  isSimpleMode?: boolean;
}

/**
 * 用户登录组件
 * 用户输入用户名和密码登录
 * @param isSimpleMode - 是否使用简单模式（默认false）。简单模式下已登录状态只显示用户名和进度条
 */
export default function Login({ isSimpleMode = false }: LoginProps = {}) {
  const { login, isLoggedIn, userInfo, logout, tokenExpiresAt } = useUserLog();
  
  // 登录相关状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<'idle' | 'logging' | 'success' | 'error'>('idle');
  const [loginMessage, setLoginMessage] = useState('');
  
  // 倒计时状态
  const [countdown, setCountdown] = useState<string>('');
  
  // JWT 进度百分比（用于简单模式）
  const [jwtProgress, setJwtProgress] = useState<number>(0);

  // 处理登录
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setLoginStatus('error');
      setLoginMessage('请输入用户名和密码');
      return;
    }

    setLoginStatus('logging');
    setLoginMessage('正在登录...');

    try {
      // 调用登录接口
      const response = await api.post<{
        access_token: string;
        token_type: string;
        nickname: string;
        expires_at: string; // 过期时间（ISO 格式字符串）
      }>('/auth/login', {
        username,
        password
      });

      // 使用后端返回的 expires_at 解析过期时间
      const expirationTime = guoDT.getDayjs(response.expires_at).valueOf();

      // 保存登录信息（使用 access_token）
      login(response.access_token, {
        username: username,
        nickname: response.nickname,
      }, expirationTime);

      setLoginStatus('success');
      setLoginMessage(`登录成功！`);
      
      // 清空密码
      setPassword('');
    } catch (error: any) {
      setLoginStatus('error');
      setLoginMessage(error.message || '登录失败，请检查用户名和密码');
    }
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    setUsername('');
    setPassword('');
    setLoginStatus('idle');
    setLoginMessage('已退出登录');
    setTimeout(() => setLoginMessage(''), 3000);
  };

  // 格式化过期时间
  const formatExpiresTime = (timestamp: number | null) => {
    if (!timestamp) return '';
    // 使用 guoDT 并传递数字时间戳（毫秒）
    const dayjsObj = guoDT.getDayjs(timestamp);
    return guoDT.getFormattedDayjs(dayjsObj, 'YYYY/MM/DD HH:mm:ss');
  };

  // 计算倒计时
  const calculateCountdown = (expiresAt: number | null): string => {
    if (!expiresAt) return '';
    
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) {
      return '已过期';
    }
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}天`);
    if (hours > 0) parts.push(`${hours}小时`);
    if (minutes > 0) parts.push(`${minutes}分钟`);
    parts.push(`${seconds}秒`);
    
    return parts.join(' ');
  };

  // 计算 JWT 进度百分比（假设 JWT 有效期为 24 小时）
  const calculateJwtProgress = (expiresAt: number | null): number => {
    if (!expiresAt) return 0;
    
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 0;
    
    // 假设总有效期为 24 小时（可以根据实际情况调整）
    const totalDuration = 24 * 60 * 60 * 1000; // 24小时
    const progress = (remaining / totalDuration) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  // 倒计时定时器
  useEffect(() => {
    if (!isLoggedIn || !tokenExpiresAt) {
      setCountdown('');
      setJwtProgress(0);
      return;
    }

    // 立即更新一次
    setCountdown(calculateCountdown(tokenExpiresAt));
    setJwtProgress(calculateJwtProgress(tokenExpiresAt));

    // 简单模式：每分钟更新，完整模式：每秒更新
    const updateInterval = isSimpleMode ? 60000 : 1000;
    
    const timer = setInterval(() => {
      const newCountdown = calculateCountdown(tokenExpiresAt);
      setCountdown(newCountdown);
      setJwtProgress(calculateJwtProgress(tokenExpiresAt));
      
      // 如果已过期，自动退出登录
      if (newCountdown === '已过期') {
        logout();
      }
    }, updateInterval);

    return () => clearInterval(timer);
  }, [isLoggedIn, tokenExpiresAt, logout, isSimpleMode]);

  // 获取状态徽章
  const getStatusBadge = () => {
    switch (loginStatus) {
      case 'logging':
        return <Badge variant="secondary" className="text-xs">登录中</Badge>;
      case 'success':
        return <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs">登录成功</Badge>;
      case 'error':
        return <Badge variant="destructive" className="text-xs">登录失败</Badge>;
      default:
        return null;
    }
  };

  // 已登录状态 - 简单模式
  if (isLoggedIn && userInfo && isSimpleMode) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-3 py-2">
            {/* 左侧：已登录标签 + 用户信息 */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs shrink-0">
                已登录
              </Badge>
              <span className="text-xs font-semibold text-green-900 dark:text-green-100 truncate">
                {userInfo.nickname || userInfo.username}
              </span>
              {userInfo.nickname && userInfo.username ? (
                <Badge className="bg-green-100 hover:bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs rounded-full border border-green-200 dark:border-green-700 shrink-0">
                  @{userInfo.username}
                </Badge>
              ) : null}
            </div>
            
            {/* 右侧：退出按钮 */}
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-green-300 hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-900/50 shrink-0 h-7 text-xs px-2"
            >
              退出登录
            </Button>
          </div>
          
          {/* JWT 失效进度条 - 作为底部边框 */}
          <div className="w-full bg-green-200/30 dark:bg-green-900/20 h-1">
            <div 
              className="h-full bg-green-600 dark:bg-green-500 transition-all duration-1000 ease-linear"
              style={{ width: `${jwtProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 已登录状态 - 完整模式
  if (isLoggedIn && userInfo) {
    return (
      <div className="w-full space-y-6 my-8">
        <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 shadow-sm">
          <div className="p-6 space-y-4">
            {/* 头部：状态和退出按钮 */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-600 hover:bg-green-600 text-white shadow-sm">
                    已登录
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    {userInfo.nickname || userInfo.username}
                  </h3>
                  {userInfo.nickname && userInfo.username ? (
                    <Badge className="bg-green-100 hover:bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs rounded-full border border-green-200 dark:border-green-700">
                      @{userInfo.username}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-green-300 hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-900/50"
              >
                退出登录
              </Button>
            </div>

            {/* 过期信息卡片 */}
            {tokenExpiresAt ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 失效时间 */}
                <div className="rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur-sm p-3 border border-green-200/50 dark:border-green-800/50">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-green-700/80 dark:text-green-300/80 mb-1">
                        Token 失效时间
                      </p>
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100 tabular-nums">
                        {formatExpiresTime(tokenExpiresAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 剩余时间 */}
                {countdown ? (
                  <div className={`rounded-lg backdrop-blur-sm p-3 border ${
                    countdown === '已过期' 
                      ? 'bg-red-100/60 dark:bg-red-950/40 border-red-200/50 dark:border-red-800/50' 
                      : 'bg-white/60 dark:bg-black/20 border-green-200/50 dark:border-green-800/50'
                  }`}>
                    <div className="flex items-start gap-2">
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        countdown === '已过期' 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium mb-1 ${
                          countdown === '已过期' 
                            ? 'text-red-700/80 dark:text-red-300/80' 
                            : 'text-green-700/80 dark:text-green-300/80'
                        }`}>
                          剩余时间
                        </p>
                        <p className={`text-sm font-bold tabular-nums ${
                          countdown === '已过期' 
                            ? 'text-red-700 dark:text-red-300' 
                            : 'text-green-700 dark:text-green-300'
                        }`}>
                          {countdown}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // 未登录状态 - 显示登录表单
  return (
    <div className="w-full space-y-6 my-8">
      <div className="space-y-4">
        <div className="space-y-3">
          {/* 用户名 */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              用户名
            </label>
            <Input
              id="username"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="code-font-family text-base h-11"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {/* 密码 */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              密码
            </label>
            <Input
              id="password"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="code-font-family text-base h-11"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {/* 登录按钮 */}
          <Button 
            onClick={handleLogin}
            size="lg"
            disabled={loginStatus === 'logging' || !username.trim() || !password.trim()}
            className="w-full"
          >
            {loginStatus === 'logging' ? '登录中...' : '登录'}
          </Button>
        </div>

        {/* 状态显示区域 */}
        {loginMessage || loginStatus !== 'idle' ? (
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            {getStatusBadge()}
            <span className="text-sm flex-1">{loginMessage}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

