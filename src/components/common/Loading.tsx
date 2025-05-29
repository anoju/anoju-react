// src/components/common/Loading.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import loadingManager from '@/utils/loading';
import type { LoadingOptions } from '@/utils/loading';
import styles from '@/assets/scss/components/loading.module.scss';

interface LoadingState {
  isVisible: boolean;
  options: LoadingOptions;
}

// 기본 스피너 컴포넌트
const DefaultSpinner: React.FC = () => (
  <div className={styles['loading-spinner']} aria-hidden="true">
    <svg
      className={styles['loading-svg']}
      viewBox="0 0 50 50"
      width="40"
      height="40"
    >
      <circle
        className={styles['loading-circle']}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="80"
        strokeDashoffset="60"
      />
    </svg>
  </div>
);

// Loading 컴포넌트
const Loading: React.FC = () => {
  const [state, setState] = useState<LoadingState>({
    isVisible: false,
    options: {}
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = loadingManager.subscribe(setState);
    return unsubscribe;
  }, []);

  if (!state.isVisible || !mounted) {
    return null;
  }

  const { options } = state;

  const loadingContent = (
    <div
      className={styles['loading-overlay']}
      role="status"
      aria-live="polite"
      aria-label={options.text || '로딩 중'}
    >
      <div className={styles['loading-container']}>
        <div className={styles['loading-content']}>
          {options.icon !== null && (
            <div className={styles['loading-icon']}>
              {options.icon || <DefaultSpinner />}
            </div>
          )}
          {options.text && (
            <div className={styles['loading-text']}>{options.text}</div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(loadingContent, document.body);
};

export default Loading;
