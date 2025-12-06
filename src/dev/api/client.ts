/**
 * API 客户端 - 基于 Axios
 * 自动使用 useUserLog store 中的配置
 * 自动附加 JWT Token 到请求头
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { userLogStore } from '../store/useUserLog/index.ts';

/**
 * 规范化 URL，确保正确拼接
 * @param baseUrl 基础 URL
 * @param endpoint 端点路径
 * @returns 规范化后的完整 URL
 */
function normalizeUrl(baseUrl: string, endpoint: string): string {
  // 移除 baseUrl 末尾的斜杠
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  
  // 确保 endpoint 以斜杠开头（除非是完整 URL）
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    // endpoint 是完整 URL，直接返回
    return endpoint;
  }
  
  // 确保 endpoint 以 / 开头
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 拼接 baseUrl + /api + endpoint
  return `${normalizedBase}/api${normalizedEndpoint}`;
}

/**
 * 创建 axios 实例
 */
const apiClient: AxiosInstance = axios.create({
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器：自动添加 baseURL 和 JWT Token
 */
apiClient.interceptors.request.use(
  (config) => {
    const { apiBaseUrl, jwtToken } = userLogStore.getState();

    // 检查是否配置了 API URL
    if (!apiBaseUrl) {
      throw new Error('API Base URL 未配置，请先在设置中配置 API 地址');
    }

    // 规范化 URL
    if (config.url) {
      config.url = normalizeUrl(apiBaseUrl, config.url);
    } else {
      config.baseURL = apiBaseUrl.replace(/\/+$/, ''); // 移除末尾斜杠
    }

    // 添加 JWT Token
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器：统一处理错误
 */
apiClient.interceptors.response.use(
  (response) => {
    // 2xx 状态码会触发这个函数
    return response;
  },
  (error: AxiosError) => {
    // 非 2xx 状态码会触发这个函数
    
    // 处理 401 未授权（Token 过期或无效）
    if (error.response?.status === 401) {
      userLogStore.getState().logout();
      return Promise.reject(new Error('认证失败，请重新登录'));
    }

    // 处理 403 禁止访问
    if (error.response?.status === 403) {
      return Promise.reject(new Error('没有权限访问此资源'));
    }

    // 处理 404 未找到
    if (error.response?.status === 404) {
      return Promise.reject(new Error('请求的资源不存在'));
    }

    // 处理 500 服务器错误
    if (error.response?.status === 500) {
      return Promise.reject(new Error('服务器内部错误，请稍后重试'));
    }

    // 处理网络错误
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      return Promise.reject(new Error('网络连接失败，请检查网络'));
    }

    // 处理超时
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      return Promise.reject(new Error('请求超时，请稍后重试'));
    }

    // 其他错误
    const errorMessage = (error.response?.data as any)?.message || error.message || '请求失败';
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * GET 请求
 * @param url 请求路径
 * @param config 请求配置
 */
export async function apiGet<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/**
 * POST 请求
 * @param url 请求路径
 * @param data 请求数据
 * @param config 请求配置
 */
export async function apiPost<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

/**
 * PUT 请求
 * @param url 请求路径
 * @param data 请求数据
 * @param config 请求配置
 */
export async function apiPut<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

/**
 * PATCH 请求
 * @param url 请求路径
 * @param data 请求数据
 * @param config 请求配置
 */
export async function apiPatch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

/**
 * DELETE 请求
 * @param url 请求路径
 * @param config 请求配置
 */
export async function apiDelete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

/**
 * 文件上传
 * @param url 请求路径
 * @param formData 表单数据
 * @param onUploadProgress 上传进度回调
 */
export async function apiUpload<T = any>(
  url: string,
  formData: FormData,
  onUploadProgress?: (progressEvent: any) => void
): Promise<T> {
  const response = await apiClient.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
}

/**
 * 文件下载
 * @param url 请求路径
 * @param filename 文件名
 * @param config 请求配置
 */
export async function apiDownload(url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> {
  const response = await apiClient.get(url, {
    ...config,
    responseType: 'blob',
  });

  // 创建下载链接
  const blob = new Blob([response.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

// 默认导出
export default {
  client: apiClient,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
  upload: apiUpload,
  download: apiDownload,
};
