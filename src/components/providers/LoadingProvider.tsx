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

  // body 스크롤 잠금 처리
  useEffect(() => {
    if (isLoading && config.bodyLock) {
      // 로딩 시작 및 bodyLock이 true일 때 body 스크롤 비활성화
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        // 로딩 종료 시 원래 스타일로 복원
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLoading, config.bodyLock]);

  // 로딩 표시
  const showLoading = useCallback((newConfig?: LoadingConfig) => {
    const finalConfig = { ...defaultLoadingConfig, ...newConfig };
    setConfig(finalConfig);

    if (finalConfig.delay && finalConfig.delay > 0) {
      // 지연 시간이 있는 경우
      setTimeout(() => {
        setIsLoading(true);
        // onShow 콜백 실행
        if (finalConfig.onShow) {
          finalConfig.onShow();
        }
      }, finalConfig.delay);
    } else {
      // 즉시 표시
      setIsLoading(true);
      // onShow 콜백 실행 (비동기로 실행하여 DOM 업데이트 후 실행)
      setTimeout(() => {
        if (finalConfig.onShow) {
          finalConfig.onShow();
        }
      }, 0);
    }
  }, []);

  // 로딩 숨기기
  const hideLoading = useCallback(() => {
    const currentConfig = config;
    setIsLoading(false);
    
    // onHide 콜백 실행 (비동기로 실행하여 DOM 업데이트 후 실행)
    setTimeout(() => {
      if (currentConfig.onHide) {
        currentConfig.onHide();
      }
    }, 0);
  }, [config]);

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

  // 현재 로딩 상태 반환
  const getLoading = useCallback(() => {
    return isLoading;
  }, [isLoading]);

  // 전역 함수에서 사용할 수 있도록 컨텍스트 설정
  useEffect(() => {
    setLoadingContext({ showLoading, hideLoading, setLoading, getLoading });
  }, [showLoading, hideLoading, setLoading, getLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        config,
        showLoading,
        hideLoading,
        setLoading,
        getLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
