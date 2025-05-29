// src/hooks/useLoading.ts
import { useState, useEffect } from 'react';
import { 
  showGlobalLoading, 
  hideGlobalLoading, 
  setGlobalLoading, 
  getGlobalLoading,
  type LoadingOptions 
} from '@/utils/loading';

// 내부적으로 LoadingManager의 상태를 구독하는 훅
export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(getGlobalLoading());

  useEffect(() => {
    // 상태 변화를 감지하기 위한 간단한 polling
    // (실제로는 LoadingManager에서 직접 구독하는 것이 더 효율적이지만
    // 기존 API 호환성을 위해 이 방식 사용)
    const interval = setInterval(() => {
      const currentState = getGlobalLoading();
      setIsLoading(currentState);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return {
    isLoading,
    showLoading: (options?: LoadingOptions) => showGlobalLoading(options),
    hideLoading: () => hideGlobalLoading(),
    setLoading: (visible: boolean, options?: LoadingOptions) => setGlobalLoading(visible, options),
    getLoading: () => getGlobalLoading(),
    config: { text: '로딩 중...' } // 기존 호환성을 위한 더미 config
  };
};
