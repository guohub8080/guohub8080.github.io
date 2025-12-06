/**
 * 用户登录相关类型定义
 * 统一管理所有登录状态：API URL、JWT、用户信息等
 */

/**
 * 用户基本信息
 */
export interface UserInfo {
  id?: string;
  username?: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  [key: string]: any; // 允许扩展其他字段
}

/**
 * 用户登录状态管理
 */
export interface UserLogState {
  // API 相关
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  
  // JWT 相关
  jwtToken: string;
  setJwtToken: (token: string) => void;
  
  // Token 过期时间（时间戳，毫秒）
  tokenExpiresAt: number | null;
  setTokenExpiresAt: (expiresAt: number | null) => void;
  
  // 用户信息
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  
  // 登录状态
  isLoggedIn: boolean;
  
  // 登录方法（设置 JWT 和用户信息）
  login: (token: string, userInfo?: UserInfo, expiresAt?: number) => void;
  
  // 登出方法（清除所有登录信息）
  logout: () => void;
  
  // 重置整个 store
  resetStore: () => void;
}

