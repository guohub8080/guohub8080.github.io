/**
 * 用户登录默认值
 * 集中管理所有登录信息的初始值
 */
export const DEFAULT_VALUES = {
  // API 基础 URL，默认为空字符串
  apiBaseUrl: '',
  
  // JWT Token，默认为空字符串
  jwtToken: '',
  
  // Token 过期时间，默认为 null
  tokenExpiresAt: null,
  
  // 用户信息，默认为 null
  userInfo: null,
  
  // 登录状态，默认为未登录
  isLoggedIn: false,
} as const;

export type DefaultValues = typeof DEFAULT_VALUES;

