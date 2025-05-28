// src/utils/globalDialog.ts
import { $alert, $confirm, AlertOptions, ConfirmOptions } from './dialog';

// 전역 객체에 dialog 함수들 추가
declare global {
  interface Window {
    $alert: typeof $alert;
    $confirm: typeof $confirm;
  }
}

// 브라우저 환경에서만 전역 함수 등록
if (typeof window !== 'undefined') {
  window.$alert = $alert;
  window.$confirm = $confirm;
}

// 타입 안전성을 위한 전역 함수 재정의
export const registerGlobalDialogs = (): void => {
  if (typeof window !== 'undefined') {
    window.$alert = $alert;
    window.$confirm = $confirm;
  }
};

// 자동 등록 (모듈이 import될 때 실행)
registerGlobalDialogs();

export type { AlertOptions, ConfirmOptions };
export { $alert, $confirm };
