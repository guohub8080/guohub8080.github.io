import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserLogState, UserInfo } from './types.ts';
import { DEFAULT_VALUES } from './defaultValues.ts';
import { PERSIST_CONFIG } from './persistConfig.ts';

/**
 * 用户登录状态管理 Store
 * 用于管理用户登录相关的所有信息：API URL、JWT、用户信息等
 * 使用 persist 中间件将登录状态持久化到 localStorage
 */
export const userLogStore = create<UserLogState>()(
  persist(
    (set) => ({
      // 使用默认值
      ...DEFAULT_VALUES,
      
      // API URL 相关
      setApiBaseUrl: (url: string) => set({ apiBaseUrl: url }),
      
      // JWT Token 相关
      setJwtToken: (token: string) => set({ 
        jwtToken: token,
        isLoggedIn: token.length > 0
      }),
      
      // Token 过期时间相关
      setTokenExpiresAt: (expiresAt: number | null) => set({ tokenExpiresAt: expiresAt }),
      
      // 用户信息相关
      setUserInfo: (info: UserInfo | null) => set({ userInfo: info }),
      
      // 登录方法
      login: (token: string, userInfo?: UserInfo, expiresAt?: number) => set({ 
        jwtToken: token,
        userInfo: userInfo || null,
        tokenExpiresAt: expiresAt || null,
        isLoggedIn: true
      }),
      
      // 登出方法
      logout: () => set({
        jwtToken: '',
        userInfo: null,
        tokenExpiresAt: null,
        isLoggedIn: false
      }),
      
      // 重置整个 store
      resetStore: () => set(DEFAULT_VALUES),
    }),
    PERSIST_CONFIG
  )
);

/**
 * 用户登录状态 Hook
 * @returns 用户登录状态对象
 */
export default function useUserLog() {
  return userLogStore();
}

