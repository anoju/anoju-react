// src/components/common/Toast/ToastContainer.tsx
import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/useToast';
import Toast from './Toast';
import styles from '@/assets/scss/components/toast.module.scss';

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  // 위치별로 토스트 분리 및 정렬
  const { topToasts, bottomToasts } = useMemo(() => {
    const top = toasts.filter((toast) => toast.position === 'top');
    const bottom = toasts.filter((toast) => toast.position === 'bottom');

    // 상단: 최신이 위에 (역순 정렬)
    const sortedTop = [...top].sort((a, b) => b.createdAt - a.createdAt);

    // 하단: 최신이 아래에 (정순 정렬)
    const sortedBottom = [...bottom].sort((a, b) => a.createdAt - b.createdAt);

    return {
      topToasts: sortedTop,
      bottomToasts: sortedBottom,
    };
  }, [toasts]);

  // 포털을 위한 컨테이너가 없으면 렌더링하지 않음
  if (typeof window === 'undefined') {
    return null;
  }

  const portalContainer = document.body;

  return createPortal(
    <>
      {/* 상단 토스트 컨테이너 */}
      {topToasts.length > 0 && (
        <div
          className={`${styles['toast-container']} ${styles.top}`}
          aria-live="polite"
          aria-label="상단 알림"
        >
          {topToasts.map((toast, index) => (
            <Toast
              key={toast.id}
              toast={toast}
              index={index}
              totalCount={topToasts.length}
            />
          ))}
        </div>
      )}

      {/* 하단 토스트 컨테이너 */}
      {bottomToasts.length > 0 && (
        <div
          className={`${styles['toast-container']} ${styles.bottom}`}
          aria-live="polite"
          aria-label="하단 알림"
        >
          {bottomToasts.map((toast, index) => (
            <Toast
              key={toast.id}
              toast={toast}
              index={index}
              totalCount={bottomToasts.length}
            />
          ))}
        </div>
      )}
    </>,
    portalContainer
  );
};

export default ToastContainer;
