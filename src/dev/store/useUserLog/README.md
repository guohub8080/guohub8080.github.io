# useUserLog - 用户登录状态管理

基于 Zustand 的用户登录状态管理，包含 API 配置、JWT Token、用户信息等，数据自动持久化到 localStorage。

## 📦 功能特性

- ✅ API 基础 URL 管理
- ✅ JWT Token 自动存储
- ✅ 用户信息管理
- ✅ 登录状态自动判断
- ✅ 自动持久化到 localStorage
- ✅ TypeScript 类型安全

## 🚀 基本使用

### 1. 导入 Hook

```typescript
import useUserLog from '@dev/store/useUserLog';
```

### 2. 在组件中使用

```typescript
function LoginComponent() {
  const { 
    apiBaseUrl, 
    setApiBaseUrl,
    jwtToken,
    isLoggedIn,
    login,
    logout,
    userInfo
  } = useUserLog();

  // 设置 API URL
  const handleSetApiUrl = () => {
    setApiBaseUrl('https://api.example.com');
  };

  // 登录
  const handleLogin = async () => {
    const token = 'your-jwt-token';
    const userInfo = {
      id: '123',
      username: 'testuser',
      email: 'test@example.com'
    };
    login(token, userInfo);
  };

  // 登出
  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <p>登录状态: {isLoggedIn ? '已登录' : '未登录'}</p>
      {isLoggedIn && <p>用户名: {userInfo?.username}</p>}
      <button onClick={handleLogin}>登录</button>
      <button onClick={handleLogout}>登出</button>
    </div>
  );
}
```

### 3. 在 API 请求中使用

```typescript
import { userLogStore } from '@dev/store/useUserLog';
import axios from 'axios';

// 创建 axios 实例
const api = axios.create();

// 请求拦截器：自动添加 JWT Token
api.interceptors.request.use((config) => {
  const { apiBaseUrl, jwtToken } = userLogStore.getState();
  
  // 设置基础 URL
  if (apiBaseUrl) {
    config.baseURL = apiBaseUrl;
  }
  
  // 添加 JWT Token
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }
  
  return config;
});

// 响应拦截器：处理 401 未授权
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，自动登出
      userLogStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 📖 API 文档

### State 字段

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `apiBaseUrl` | `string` | `''` | API 基础 URL |
| `jwtToken` | `string` | `''` | JWT Token |
| `userInfo` | `UserInfo \| null` | `null` | 用户信息对象 |
| `isLoggedIn` | `boolean` | `false` | 登录状态（自动根据 token 判断） |

### 方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `setApiBaseUrl` | `(url: string)` | 设置 API 基础 URL |
| `setJwtToken` | `(token: string)` | 设置 JWT Token（自动更新登录状态） |
| `setUserInfo` | `(info: UserInfo \| null)` | 设置用户信息 |
| `login` | `(token: string, userInfo?: UserInfo)` | 登录（同时设置 token 和用户信息） |
| `logout` | `()` | 登出（清除 token 和用户信息） |
| `resetStore` | `()` | 重置整个 store 到初始状态 |

### UserInfo 类型

```typescript
interface UserInfo {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  [key: string]: any; // 允许扩展其他字段
}
```

## 🔧 高级用法

### 直接访问 store（不使用 Hook）

```typescript
import { userLogStore } from '@dev/store/useUserLog';

// 在非组件中使用
const state = userLogStore.getState();
console.log('当前 API URL:', state.apiBaseUrl);

// 订阅状态变化
const unsubscribe = userLogStore.subscribe((state) => {
  console.log('登录状态变化:', state.isLoggedIn);
});

// 取消订阅
unsubscribe();
```

### 选择性订阅

```typescript
function UserProfile() {
  // 只订阅需要的字段，减少不必要的重渲染
  const userInfo = useUserLog((state) => state.userInfo);
  const isLoggedIn = useUserLog((state) => state.isLoggedIn);
  
  if (!isLoggedIn) return <div>请先登录</div>;
  
  return <div>欢迎, {userInfo?.username}</div>;
}
```

## 💾 数据持久化

所有数据自动保存到 `localStorage`，key 为 `user-log`。

持久化字段：
- `apiBaseUrl`
- `jwtToken`
- `userInfo`
- `isLoggedIn`

刷新页面后状态会自动恢复。

## 🔒 安全注意事项

1. **JWT Token 存储在 localStorage 中**，请确保网站使用 HTTPS
2. **不要在 Token 中存储敏感信息**，使用短期 Token + 刷新机制
3. **及时清理过期 Token**，建议在响应拦截器中处理 401 错误
4. **不要直接存储密码**到 store 中

## 📝 示例：完整登录流程

```typescript
import useUserLog from '@dev/store/useUserLog';
import api from '@/api'; // 配置好拦截器的 axios 实例

function LoginPage() {
  const { login, isLoggedIn, apiBaseUrl, setApiBaseUrl } = useUserLog();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 初始化时设置 API URL
  useEffect(() => {
    if (!apiBaseUrl) {
      setApiBaseUrl('https://api.example.com');
    }
  }, []);

  const handleLogin = async () => {
    try {
      // 调用登录接口
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      // 保存登录信息
      login(token, {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      });
      
      console.log('登录成功！');
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
        placeholder="用户名"
      />
      <input 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密码"
      />
      <button type="submit">登录</button>
    </form>
  );
}
```

