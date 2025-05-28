// src/utils/dialog.tsx
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import Alert, { AlertOptions } from '@/components/common/Popup/Alert';
import Confirm, { ConfirmOptions } from '@/components/common/Popup/Confirm';

// 다이얼로그 인스턴스 관리
interface DialogInstance {
  id: string;
  root: Root;
  destroy: () => void;
}

// 활성 다이얼로그 인스턴스들
const activeDialogs: Map<string, DialogInstance> = new Map();

// 고유 ID 생성
let dialogCounter = 0;
const generateDialogId = (): string => {
  return `dialog_${++dialogCounter}_${Date.now()}`;
};

// 다이얼로그 정리
const cleanupDialog = (id: string): void => {
  const instance = activeDialogs.get(id);
  if (instance) {
    activeDialogs.delete(id); // 인스턴스를 먼저 제거하여 중복 호출 방지

    // React 루트 언마운트
    setTimeout(() => {
      try {
        instance.root.unmount();
      } catch (error) {
        console.warn('Error unmounting dialog root:', error);
      }
    }, 50); // DOM 정리를 위한 최소 지연
  }
};

// 모든 다이얼로그 정리
const cleanupAllDialogs = (): void => {
  activeDialogs.forEach((instance) => {
    try {
      instance.root.unmount();
    } catch (error) {
      console.warn('Error unmounting dialog root:', error);
    }
  });
  activeDialogs.clear();
};

// 알럿 함수
export const $alert = (
  content: React.ReactNode,
  options: Omit<AlertOptions, 'content'> = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const id = generateDialogId();
    const root = createRoot(document.createElement('div'));

    const alertOptions: AlertOptions = {
      ...options,
      content,
      onOk: () => {
        if (options.onOk) {
          options.onOk();
        }
        resolve();
      },
    };

    // 인스턴스 저장
    const instance: DialogInstance = {
      id,
      root,
      destroy: () => cleanupDialog(id),
    };

    activeDialogs.set(id, instance);

    // 컴포넌트 렌더링
    root.render(
      <Alert
        id={id}
        options={alertOptions}
        onClose={() => {
          cleanupDialog(id);
          resolve();
        }}
      />
    );
  });
};

// 컨펌 함수
export const $confirm = (
  content: React.ReactNode,
  options: Omit<ConfirmOptions, 'content'> = {}
): Promise<boolean> => {
  return new Promise((resolve) => {
    const id = generateDialogId();
    const root = createRoot(document.createElement('div'));

    const confirmOptions: ConfirmOptions = {
      ...options,
      content,
      onOk: async () => {
        if (options.onOk) {
          await options.onOk();
        }
        // 결과는 Confirm에서 처리
      },
      onCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
        // 결과는 Confirm에서 처리
      },
    };

    // 인스턴스 저장
    const instance: DialogInstance = {
      id,
      root,
      destroy: () => cleanupDialog(id),
    };

    activeDialogs.set(id, instance);

    // 컴포넌트 렌더링
    root.render(
      <Confirm
        id={id}
        options={confirmOptions}
        onClose={(result) => {
          cleanupDialog(id);
          resolve(result);
        }}
      />
    );
  });
};

// 편의 함수들
export const alert = $alert;
export const confirm = $confirm;

// 타입 re-export
export type { AlertOptions, ConfirmOptions };

// 모든 다이얼로그 닫기
export const closeAllDialogs = (): void => {
  cleanupAllDialogs();
};

// 활성 다이얼로그 개수 확인
export const getActiveDialogCount = (): number => {
  return activeDialogs.size;
};

// 브라우저 새로고침/종료 시 정리
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupAllDialogs);
}

// 기본 내보내기
export default {
  $alert,
  $confirm,
  alert,
  confirm,
  closeAllDialogs,
  getActiveDialogCount,
};
