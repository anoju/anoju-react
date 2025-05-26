// src/components/providers/LoadingProvider.tsx
import React, { ReactNode, useState, useCallback, useEffect } from 'react';
import { LoadingContext } from '@/contexts/loadingContext';
import { LoadingConfig, defaultLoadingConfig } from '@/types/loading';
import { setLoadingContext } from '@/utils/loading';

interface LoadingProviderProps {
  children: ReactNode;
}

// 컨텍스트 제공자 컴포넌트
export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<LoadingConfig>(defaultLoadingConfig);

  // 로딩 표시
  const showLoading = useCallback((newConfig?: LoadingConfig) => {
    const finalConfig = { ...defaultLoadingConfig, ...newConfig };
    setConfig(finalConfig);

    if (finalConfig.delay && finalConfig.delay > 0) {
      // 지연 시간이 있는 경우
      setTimeout(() => {
        setIsLoading(true);
      }, finalConfig.delay);
    } else {
      // 즉시 표시
      setIsLoading(true);
    }
  }, []);

  // 로딩 숨기기
  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // 로딩 상태 설정 (true/false로 간단 제어)
  const setLoading = useCallback(
    (loading: boolean, newConfig?: LoadingConfig) => {
      if (loading) {
        showLoading(newConfig);
      } else {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  // 전역 함수에서 사용할 수 있도록 컨텍스트 설정
  useEffect(() => {
    setLoadingContext({ showLoading, hideLoading, setLoading });
  }, [showLoading, hideLoading, setLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        config,
        showLoading,
        hideLoading,
        setLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
