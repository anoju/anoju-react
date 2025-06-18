// src/hooks/useToast.ts
import { useContext, createContext } from 'react';
import type { ToastContextType } from '@/types/toast';

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

// 컨텍스트 훅
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast는 ToastProvider 내에서 사용해야 합니다.');
  }
  return context;
};
