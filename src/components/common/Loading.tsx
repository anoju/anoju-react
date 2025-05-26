// src/components/common/Loading.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLoading } from '@/hooks';
import styles from '@/assets/scss/components/loading.module.scss';

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

const Loading: React.FC = () => {
  const { isLoading, config } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 로딩이 활성화되어 있지 않거나 아직 마운트되지 않았으면 렌더링하지 않음
  if (!isLoading || !mounted) {
    return null;
  }

  const loadingContent = (
    <div
      className={styles['loading-overlay']}
      role="status"
      aria-live="polite"
      aria-label={config.text || '로딩 중'}
    >
      <div className={styles['loading-container']}>
        <div className={styles['loading-content']}>
          {/* 커스텀 아이콘이 있으면 사용, 없으면 기본 스피너 사용 */}
          {config.icon !== null && (
            <div className={styles['loading-icon']}>
              {config.icon || <DefaultSpinner />}
            </div>
          )}
          {config.text && (
            <div className={styles['loading-text']}>{config.text}</div>
          )}
        </div>
      </div>
    </div>
  );

  // Portal을 사용하여 body에 직접 렌더링
  return createPortal(loadingContent, document.body);
};

export default Loading;
