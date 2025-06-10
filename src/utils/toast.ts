// src/utils/toast.ts
import type {
  ToastType,
  ToastOptions,
  ToastUtility,
  DefaultToastFunction,
} from '@/types/toast';

// 토스트 컨텍스트를 전역에서 사용하기 위한 참조
let toastContextRef: {
  addToast: (type: ToastType, options: ToastOptions) => () => void;
  clearToasts: (position?: 'top' | 'bottom') => void;
} | null = null;

// 토스트 컨텍스트 등록 함수 (ToastProvider에서 호출)
export const registerToastContext = (context: typeof toastContextRef): void => {
  toastContextRef = context;
};

// 토스트 컨텍스트 해제 함수
export const unregisterToastContext = (): void => {
  toastContextRef = null;
};

// 에러 처리용 헬퍼 함수
const ensureToastContext = (): NonNullable<typeof toastContextRef> => {
  if (!toastContextRef) {
    throw new Error(
      '$toast를 사용하려면 앱이 ToastProvider로 감싸져 있어야 합니다.'
    );
  }
  return toastContextRef;
};

// 기본 토스트 함수 생성 (타입 없음, info로 처리)
const createDefaultToastFunction = (): DefaultToastFunction => {
  return (
    content: React.ReactNode,
    options: ToastOptions = {}
  ): (() => void) => {
    const context = ensureToastContext();
    return context.addToast(null, { ...options, content });
  };
};

// 기본 토스트 함수 생성 헬퍼
const createToastFunction = (type: ToastType) => {
  return (
    content: React.ReactNode,
    options: Omit<ToastOptions, 'content'> = {}
  ): (() => void) => {
    const context = ensureToastContext();
    return context.addToast(type, { ...options, content });
  };
};

// 옵션 객체를 받는 토스트 함수 생성 헬퍼
const createToastConfigFunction = (type: ToastType) => {
  return (options: ToastOptions): (() => void) => {
    const context = ensureToastContext();
    return context.addToast(type, options);
  };
};

// $toast 유틸리티 객체
const toastUtility: ToastUtility = Object.assign(
  createDefaultToastFunction(), // 기본 함수를 할당
  {
    // 기본 사용법: $toast.success('메시지', { duration: 5000 })
    success: createToastFunction('success'),
    error: createToastFunction('error'),
    warning: createToastFunction('warning'),
    info: createToastFunction('info'),
    loading: createToastFunction('loading'),

    // 옵션 객체 사용법: $toast.config.success({ content: '메시지', duration: 5000 })
    config: {
      success: createToastConfigFunction('success'),
      error: createToastConfigFunction('error'),
      warning: createToastConfigFunction('warning'),
      info: createToastConfigFunction('info'),
      loading: createToastConfigFunction('loading'),
    },

    // 모든 토스트 제거
    destroy: (position?: 'top' | 'bottom'): void => {
      const context = ensureToastContext();
      context.clearToasts(position);
    },
  }
);

export const $toast = toastUtility;

// 개별 토스트 함수들도 별도로 export (선택사항)
export const toastSuccess = $toast.success;
export const toastError = $toast.error;
export const toastWarning = $toast.warning;
export const toastInfo = $toast.info;
export const toastLoading = $toast.loading;

export default $toast;
