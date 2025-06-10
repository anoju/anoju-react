// src/utils/toastHelpers.ts
import type { ToastOptions } from '@/types/toast';

// 고유 ID 생성을 위한 카운터
let toastIdCounter = 0;

export const generateToastId = (): string => {
  return `toast_${++toastIdCounter}_${Date.now()}`;
};

// 기본값
export const defaultToastOptions: Required<
  Omit<ToastOptions, 'content' | 'onClose' | 'key'>
> = {
  duration: 3000, // 3초
  position: 'top',
  className: '',
  showCloseBtn: false, // 닫기 버튼 노출
};
