// src/types/loading.ts
import { ReactNode } from 'react';

// 로딩 설정을 위한 타입 정의
export interface LoadingConfig {
  text?: string; // 로딩 텍스트
  delay?: number; // 로딩 표시 지연 시간 (ms)
  icon?: ReactNode; // 커스텀 로딩 아이콘 (기본값은 스피너)
  bodyLock?: boolean; // body 스크롤 잠금 여부 (기본값 false)
  onShow?: () => void; // 로딩 표시 후 실행할 함수
  onHide?: () => void; // 로딩 숨기기 후 실행할 함수
}

// 컨텍스트의 기본값과 업데이트 함수를 포함하는 타입
export interface LoadingContextProps {
  isLoading: boolean;
  config: LoadingConfig;
  showLoading: (config?: LoadingConfig) => void;
  hideLoading: () => void;
  setLoading: (loading: boolean, config?: LoadingConfig) => void;
  getLoading: () => boolean; // 현재 로딩 상태 반환
}

// 기본 로딩 설정
export const defaultLoadingConfig: LoadingConfig = {
  text: '로딩 중...',
  delay: 0,
  icon: undefined, // undefined면 기본 스피너 사용
  bodyLock: false,
  onShow: undefined,
  onHide: undefined,
};
