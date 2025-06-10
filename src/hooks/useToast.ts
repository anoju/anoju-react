// src/hooks/useToast.ts
import { useContext } from 'react';
import type { ToastContextType } from '@/types/toast';

// 토스트 컨텍스트 생성 (Context 자체는 여기서 생성)
import { createContext } from 'react';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 컨텍스트 훅
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast는 ToastProvider 내에서 사용해야 합니다.');
  }
  return context;
};
