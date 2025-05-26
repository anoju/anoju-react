// src/contexts/loadingContext.ts
import { createContext } from 'react';
import { LoadingContextProps, defaultLoadingConfig } from '@/types/loading';

// 컨텍스트 생성
export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  config: defaultLoadingConfig,
  showLoading: () => {},
  hideLoading: () => {},
  setLoading: () => {},
});
