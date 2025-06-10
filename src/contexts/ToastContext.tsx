// src/contexts/ToastContext.tsx
import React, {
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react';
import type {
  Toast,
  ToastType,
  ToastOptions,
  ToastPosition,
} from '@/types/toast';
import { registerToastContext, unregisterToastContext } from '@/utils/toast';
import { generateToastId, defaultToastOptions } from '@/utils/toastHelpers';
import { ToastContext } from '@/hooks/useToast';

// 토스트 프로바이더 Props
interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number; // 최대 토스트 개수 (기본값: 10)
}

// 토스트 프로바이더 컴포넌트
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 10,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 토스트 제거 함수
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    
    // 타이머 정리
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // 토스트 추가 함수
  const addToast = useCallback(
    (type: ToastType, options: ToastOptions): (() => void) => {
      const mergedOptions = { ...defaultToastOptions, ...options };
      const toastId = generateToastId();

      // 같은 key를 가진 토스트가 있으면 제거
      if (options.key) {
        setToasts((prev) => {
          const filtered = prev.filter((toast) => toast.key !== options.key);
          // 제거된 토스트들의 타이머도 정리
          prev.forEach((toast) => {
            if (toast.key === options.key && toast.id !== toastId) {
              const timer = timersRef.current.get(toast.id);
              if (timer) {
                clearTimeout(timer);
                timersRef.current.delete(toast.id);
              }
            }
          });
          return filtered;
        });
      }

      const newToast: Toast = {
        id: toastId,
        type,
        content: mergedOptions.content || options.content || '',
        duration: mergedOptions.duration,
        position: mergedOptions.position,
        onClose: options.onClose,
        createdAt: Date.now(),
        key: options.key,
        className: options.className,
      };

      setToasts((prev) => {
        // 최대 개수 제한
        const updatedToasts = [...prev, newToast];
        if (updatedToasts.length > maxToasts) {
          // 가장 오래된 토스트 제거
          const oldestToast = updatedToasts[0];
          const timer = timersRef.current.get(oldestToast.id);
          if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(oldestToast.id);
          }
          return updatedToasts.slice(1);
        }
        return updatedToasts;
      });

      // 자동 제거 타이머 설정 (duration이 0보다 클 때만)
      if (mergedOptions.duration > 0) {
        const timer = setTimeout(() => {
          removeToast(toastId);
          if (newToast.onClose) {
            newToast.onClose();
          }
        }, mergedOptions.duration);

        timersRef.current.set(toastId, timer);
      }

      // 수동으로 토스트를 닫을 수 있는 함수 반환
      return () => {
        removeToast(toastId);
        if (newToast.onClose) {
          newToast.onClose();
        }
      };
    },
    [maxToasts, removeToast]
  );

  // 모든 토스트 제거 (위치별로 가능)
  const clearToasts = useCallback((position?: ToastPosition) => {
    setToasts((prev) => {
      const toastsToRemove = position 
        ? prev.filter((toast) => toast.position === position)
        : prev;

      // 제거할 토스트들의 타이머 정리
      toastsToRemove.forEach((toast) => {
        const timer = timersRef.current.get(toast.id);
        if (timer) {
          clearTimeout(timer);
          timersRef.current.delete(toast.id);
        }
      });

      return position 
        ? prev.filter((toast) => toast.position !== position)
        : [];
    });
  }, []);

  // 컴포넌트 언마운트 시 모든 타이머 정리
  React.useEffect(() => {
    const timers = timersRef.current; // ref 값을 변수에 복사
    
    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
      });
      timers.clear();
    };
  }, []);

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };

  // $toast 유틸리티에 컨텍스트 등록
  React.useEffect(() => {
    registerToastContext({
      addToast,
      clearToasts,
    });

    return () => {
      unregisterToastContext();
    };
  }, [addToast, clearToasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
