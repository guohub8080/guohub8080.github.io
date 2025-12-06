/**
 * 标题编号 Context
 * 用于管理文章中 H2/H3/H4 的自动编号
 */

import React, { createContext, useContext, useCallback, ReactNode, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface HeadingCounter {
  h2: number;
  h3: number;
  h4: number;
}

interface HeadingNumberContextValue {
  registerH2: () => string;
  registerH3: () => string;
  registerH4: () => string;
  resetCounter: () => void;
}

const HeadingNumberContext = createContext<HeadingNumberContextValue | null>(null);

interface HeadingNumberProviderProps {
  children: ReactNode;
  enabled?: boolean; // 是否启用编号
}

export const HeadingNumberProvider: React.FC<HeadingNumberProviderProps> = ({ 
  children, 
  enabled = true 
}) => {
  const location = useLocation();
  const counterRef = useRef<HeadingCounter>({
    h2: 0,
    h3: 0,
    h4: 0,
  });
  
  // 路由变化时重置计数器
  useEffect(() => {
    counterRef.current = {
      h2: 0,
      h3: 0,
      h4: 0,
    };
  }, [location.pathname]);

  const registerH2 = useCallback(() => {
    if (!enabled) return '';
    
    counterRef.current = {
      h2: counterRef.current.h2 + 1,
      h3: 0, // 重置下级
      h4: 0,
    };
    
    return `${counterRef.current.h2}`;
  }, [enabled]);

  const registerH3 = useCallback(() => {
    if (!enabled) return '';
    
    counterRef.current = {
      ...counterRef.current,
      h3: counterRef.current.h3 + 1,
      h4: 0, // 重置下级
    };
    
    return `${counterRef.current.h2}.${counterRef.current.h3}`;
  }, [enabled]);

  const registerH4 = useCallback(() => {
    if (!enabled) return '';
    
    counterRef.current = {
      ...counterRef.current,
      h4: counterRef.current.h4 + 1,
    };
    
    return `${counterRef.current.h2}.${counterRef.current.h3}.${counterRef.current.h4}`;
  }, [enabled]);

  const resetCounter = useCallback(() => {
    counterRef.current = {
      h2: 0,
      h3: 0,
      h4: 0,
    };
  }, []);

  const value: HeadingNumberContextValue = useMemo(() => ({
    registerH2,
    registerH3,
    registerH4,
    resetCounter,
  }), [registerH2, registerH3, registerH4, resetCounter]);

  return (
    <HeadingNumberContext.Provider value={value}>
      {children}
    </HeadingNumberContext.Provider>
  );
};

export const useHeadingNumber = () => {
  return useContext(HeadingNumberContext);
};

