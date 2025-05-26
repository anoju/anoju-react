// src/utils/loading.ts
import { LoadingConfig } from '@/types/loading';

// 전역 로딩 함수들을 위한 참조 저장소
let loadingContext: {
  showLoading: (config?: LoadingConfig) => void;
  hideLoading: () => void;
  setLoading: (loading: boolean, config?: LoadingConfig) => void;
  getLoading: () => boolean;
} | null = null;

// LoadingProvider에서 호출되는 함수로 전역 함수에서 사용할 컨텍스트 설정
export const setLoadingContext = (context: {
  showLoading: (config?: LoadingConfig) => void;
  hideLoading: () => void;
  setLoading: (loading: boolean, config?: LoadingConfig) => void;
  getLoading: () => boolean;
}) => {
  loadingContext = context;
};

// 전역 로딩 표시 함수
export const showGlobalLoading = (config?: LoadingConfig) => {
  if (loadingContext) {
    loadingContext.showLoading(config);
  } else {
    console.warn('LoadingProvider가 설정되지 않았습니다.');
  }
};

// 전역 로딩 숨기기 함수
export const hideGlobalLoading = () => {
  if (loadingContext) {
    loadingContext.hideLoading();
  } else {
    console.warn('LoadingProvider가 설정되지 않았습니다.');
  }
};

// 전역 로딩 상태 설정 함수
export const setGlobalLoading = (loading: boolean, config?: LoadingConfig) => {
  if (loadingContext) {
    loadingContext.setLoading(loading, config);
  } else {
    console.warn('LoadingProvider가 설정되지 않았습니다.');
  }
};

// 전역 로딩 상태 가져오기 함수
export const getGlobalLoading = (): boolean => {
  if (loadingContext) {
    return loadingContext.getLoading();
  } else {
    console.warn('LoadingProvider가 설정되지 않았습니다.');
    return false;
  }
};

// Promise와 함께 로딩을 자동으로 관리하는 헬퍼 함수
export const withLoading = async <T>(
  promise: Promise<T>,
  config?: LoadingConfig
): Promise<T> => {
  try {
    showGlobalLoading(config);
    const result = await promise;
    return result;
  } finally {
    hideGlobalLoading();
  }
};

// 비동기 함수를 래핑하여 로딩을 자동으로 관리하는 헬퍼 함수
export const wrapWithLoading = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  config?: LoadingConfig
) => {
  return async (...args: T): Promise<R> => {
    return withLoading(fn(...args), config);
  };
};
