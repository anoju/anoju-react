// src/types/toast.ts
import { ReactNode } from 'react';

// 토스트 타입 정의
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

// 토스트 위치 정의
export type ToastPosition = 'top' | 'bottom';

// 토스트 옵션 인터페이스
export interface ToastOptions {
  content?: ReactNode; // 토스트 내용
  duration?: number; // 지속 시간 (밀리초), 0이면 자동으로 닫히지 않음
  position?: ToastPosition; // 표시 위치
  onClose?: () => void; // 닫힐 때 콜백
  key?: string; // 고유 키 (중복 방지용)
  className?: string; // 커스텀 클래스명
}

// 개별 토스트 인터페이스
export interface Toast {
  id: string; // 고유 ID
  type: ToastType; // 토스트 타입
  content: ReactNode; // 내용
  duration: number; // 지속 시간
  position: ToastPosition; // 위치
  onClose?: () => void; // 닫힐 때 콜백
  createdAt: number; // 생성 시간
  key?: string; // 고유 키
  className?: string; // 커스텀 클래스명
}

// 토스트 컨텍스트 인터페이스
export interface ToastContextType {
  toasts: Toast[]; // 모든 토스트 목록
  addToast: (type: ToastType, options: ToastOptions) => () => void; // 토스트 추가 (닫기 함수 반환)
  removeToast: (id: string) => void; // 토스트 제거
  clearToasts: (position?: ToastPosition) => void; // 모든 토스트 제거 (위치별로 가능)
}

// $toast 함수 타입들
export type ToastFunction = (content: ReactNode, options?: Omit<ToastOptions, 'content'>) => () => void;
export type ToastWithOptionsFunction = (options: ToastOptions) => () => void;
export type DefaultToastFunction = (content: ReactNode, options?: ToastOptions) => () => void; // 기본 토스트용

// $toast 유틸리티 인터페이스
export interface ToastUtility {
  // 기본 토스트 (타입 없음)
  (content: ReactNode, options?: ToastOptions): () => void;
  
  // 타입별 토스트
  success: ToastFunction;
  error: ToastFunction;
  warning: ToastFunction;
  info: ToastFunction;
  loading: ToastFunction;
  
  // 옵션 객체로 사용하는 방법들
  config: {
    success: ToastWithOptionsFunction;
    error: ToastWithOptionsFunction;
    warning: ToastWithOptionsFunction;
    info: ToastWithOptionsFunction;
    loading: ToastWithOptionsFunction;
  };
  
  // 유틸리티 함수들
  destroy: (position?: ToastPosition) => void; // 모든 토스트 제거
}
