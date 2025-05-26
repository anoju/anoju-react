// src/hooks/useLoading.ts
import { useContext } from 'react';
import { LoadingContext } from '@/contexts/loadingContext';

// 컨텍스트 사용을 위한 훅
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
