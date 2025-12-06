# API 客户端使用指南

基于 Axios 的 API 客户端，自动管理 JWT Token 和 baseURL，支持请求/响应拦截器。

## ⚠️ 重要说明

**所有请求都会自动添加 `/api` 前缀！**

例如：
- 配置的 baseURL：`http://localhost:8000`
- 请求路径：`/auth/login`
- 实际请求：`http://localhost:8000/api/auth/login`

## 🚀 快速开始

### 1. 导入客户端

```typescript
import api from '@api/client';
// 或按需导入
import { apiGet, apiPost, apiPut, apiDelete } from '@api/client';
```

### 2. 基本使用

```typescript
// GET 请求（实际请求：baseURL/api/users）
const users = await api.get('/users');

// POST 请求（实际请求：baseURL/api/users）
const newUser = await api.post('/users', {
  name: '张三',
  email: 'zhangsan@example.com'
});

// PUT 请求（实际请求：baseURL/api/users/123）
const updatedUser = await api.put('/users/123', {
  name: '李四'
});

// PATCH 请求（实际请求：baseURL/api/users/123）
const patchedUser = await api.patch('/users/123', {
  status: 'active'
});

// DELETE 请求（实际请求：baseURL/api/users/123）
await api.delete('/users/123');
```

## 📖 API 文档

### GET 请求

```typescript
apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T>
```

**示例**：
```typescript
// 获取用户列表
const users = await apiGet<User[]>('/users');

// 带查询参数
const users = await apiGet<User[]>('/users', {
  params: { page: 1, limit: 10 }
});
```

### POST 请求

```typescript
apiPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
```

**示例**：
```typescript
// 创建用户
const user = await apiPost<User>('/users', {
  name: '张三',
  email: 'zhangsan@example.com'
});
```

### PUT 请求

```typescript
apiPut<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
```

**示例**：
```typescript
// 更新用户（完整更新）
const user = await apiPut<User>('/users/123', {
  name: '李四',
  email: 'lisi@example.com'
});
```

### PATCH 请求

```typescript
apiPatch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
```

**示例**：
```typescript
// 更新用户（部分更新）
const user = await apiPatch<User>('/users/123', {
  status: 'inactive'
});
```

### DELETE 请求

```typescript
apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
```

**示例**：
```typescript
// 删除用户
await apiDelete('/users/123');
```

### 文件上传

```typescript
apiUpload<T>(
  url: string, 
  formData: FormData, 
  onUploadProgress?: (progressEvent: any) => void
): Promise<T>
```

**示例**：
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('description', '文件描述');

const result = await api.upload('/files/upload', formData, (progressEvent) => {
  const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  console.log(`上传进度: ${percent}%`);
});
```

### 文件下载

```typescript
apiDownload(url: string, filename?: string, config?: AxiosRequestConfig): Promise<void>
```

**示例**：
```typescript
// 下载文件
await api.download('/files/123/download', 'document.pdf');
```

## 🔧 高级用法

### 自定义请求配置

```typescript
// 自定义超时时间
const data = await apiGet('/slow-api', {
  timeout: 60000 // 60秒
});

// 自定义请求头
const data = await apiPost('/api/data', { name: 'test' }, {
  headers: {
    'X-Custom-Header': 'value'
  }
});

// 取消请求
const controller = new AbortController();
const data = await apiGet('/api/data', {
  signal: controller.signal
});
// 稍后取消
controller.abort();
```

### 直接使用 Axios 实例

如果需要更底层的控制，可以直接使用 axios 实例：

```typescript
import api from '@api/client';

// 自定义请求
const response = await api.client.request({
  method: 'GET',
  url: '/custom',
  // ... 其他配置
});
```

## 🔐 认证机制

### 自动附加 JWT Token

客户端会自动从 `useUserLog` store 中读取 JWT Token 并附加到请求头：

```typescript
Authorization: Bearer <your-jwt-token>
```

### 自动登出

当服务器返回 401 状态码时，客户端会自动调用 `logout()` 清除登录信息。

## ⚙️ 拦截器说明

### 请求拦截器

自动执行以下操作：
1. 从 `useUserLog` store 读取 `apiBaseUrl` 并设置为 baseURL
2. 从 `useUserLog` store 读取 `jwtToken` 并添加到请求头
3. 如果未配置 baseURL，抛出错误

### 响应拦截器

自动处理以下错误：
- **401 Unauthorized**: 自动登出，提示"认证失败，请重新登录"
- **403 Forbidden**: 提示"没有权限访问此资源"
- **404 Not Found**: 提示"请求的资源不存在"
- **500 Internal Server Error**: 提示"服务器内部错误，请稍后重试"
- **网络错误**: 提示"网络连接失败，请检查网络"
- **超时**: 提示"请求超时，请稍后重试"

## 📝 完整示例

### React 组件中使用

```typescript
import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@api/client';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取任务列表
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Task[]>('/tasks');
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 创建任务
  const createTask = async (title: string) => {
    try {
      const newTask = await apiPost<Task>('/tasks', { title });
      setTasks([...tasks, newTask]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

### TypeScript 类型定义

```typescript
// 定义响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// 使用类型
const response = await apiGet<ApiResponse<User>>('/user/profile');
const user = response.data;
```

## ⚠️ 注意事项

1. **配置 API URL**: 使用前必须先通过 `SetAndTestURL` 组件配置 API 地址
2. **错误处理**: 始终使用 try-catch 捕获异常
3. **类型安全**: 建议为所有 API 响应定义 TypeScript 类型
4. **CORS**: 确保后端正确配置 CORS
5. **Token 刷新**: 当前不支持自动刷新 Token，需要手动实现

## 🔗 相关文档

- [Axios 官方文档](https://axios-http.com/)
- [useUserLog Store 文档](../store/useUserLog/README.md)

