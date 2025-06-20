// src/components/common/PageTransition.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '@/assets/scss/components/pageTransition.module.scss';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  transitionType?:
    | 'fade'
    | 'slide-right'
    | 'slide-left'
    | 'slide-up'
    | 'slide-down';
  duration?: number; // ms
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  transitionType = 'fade',
  duration = 300,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    // 페이지 변경 시 애니메이션 트리거
    setIsAnimating(true);

    // 퇴장 애니메이션 시간의 절반 후에 새 컨텐츠로 교체
    const switchTimer = setTimeout(() => {
      setDisplayChildren(children);
    }, duration / 2);

    // 전체 애니메이션 완료 후 상태 리셋
    const completeTimer = setTimeout(() => {
      setIsAnimating(false);
    }, duration);

    return () => {
      clearTimeout(switchTimer);
      clearTimeout(completeTimer);
    };
  }, [location.pathname, children, duration]);

  // CSS 변수로 duration 전달
  const style = {
    '--transition-duration': `${duration}ms`,
  } as React.CSSProperties;

  return (
    <div
      className={`${styles.container} ${styles[transitionType]} ${
        isAnimating ? styles.animating : ''
      } ${className}`}
      style={style}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
