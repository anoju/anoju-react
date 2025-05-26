// src/types/loading.ts
// 로딩 설정을 위한 타입 정의
export interface LoadingConfig {
  text?: string; // 로딩 텍스트
  delay?: number; // 로딩 표시 지연 시간 (ms)
  spinning?: boolean; // 스피너 표시 여부
}

// 컨텍스트의 기본값과 업데이트 함수를 포함하는 타입
export interface LoadingContextProps {
  isLoading: boolean;
  config: LoadingConfig;
  showLoading: (config?: LoadingConfig) => void;
  hideLoading: () => void;
  setLoading: (loading: boolean, config?: LoadingConfig) => void;
}

// 기본 로딩 설정
export const defaultLoadingConfig: LoadingConfig = {
  text: '로딩 중...',
  delay: 0,
  spinning: true,
};
