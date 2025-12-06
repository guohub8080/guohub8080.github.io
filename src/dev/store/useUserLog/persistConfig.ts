/**
 * 持久化配置
 * 定义哪些字段需要持久化到 localStorage
 */
export const PERSIST_CONFIG = {
  name: 'user-log', // localStorage 中的 key
  partialize: (state: any) => ({
    // API 配置
    apiBaseUrl: state.apiBaseUrl,
    
    // JWT Token
    jwtToken: state.jwtToken,
    
    // Token 过期时间
    tokenExpiresAt: state.tokenExpiresAt,
    
    // 用户信息
    userInfo: state.userInfo,
    
    // 登录状态
    isLoggedIn: state.isLoggedIn,
  }),
} as const;

