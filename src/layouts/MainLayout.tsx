// src/layouts/MainLayout.tsx
import React, { ReactNode, useEffect, useRef, useCallback } from 'react';
import styles from '@/assets/scss/layouts/layouts.module.scss';
import { useLayout } from '@/contexts/LayoutContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const { config } = useLayout();

  // 좌우 헤더 영역의 너비를 동일하게 조정하는 함수 (useCallback으로 메모이제이션)
  const adjustHeaderWidths = useCallback(() => {
    if (leftRef.current && rightRef.current) {
      // 초기 너비 설정 제거
      leftRef.current.style.minWidth = 'auto';
      rightRef.current.style.minWidth = 'auto';

      // requestAnimationFrame 사용하여 브라우저 렌더링 최적화
      requestAnimationFrame(() => {
        if (leftRef.current && rightRef.current) {
          const leftWidth = leftRef.current.offsetWidth;
          const rightWidth = rightRef.current.offsetWidth;

          // 둘 중 더 큰 너비를 사용
          const maxWidth = Math.max(leftWidth, rightWidth);

          // 양쪽 열에 같은 너비 적용
          leftRef.current.style.minWidth = `${maxWidth}px`;
          rightRef.current.style.minWidth = `${maxWidth}px`;
        }
      });
    }
  }, []); // 빈 의존성 배열로 함수 재생성 방지

  useEffect(() => {
    // 마운트 시 한 번만 실행
    adjustHeaderWidths();

    // 윈도우 리사이즈 시에도 실행
    window.addEventListener('resize', adjustHeaderWidths);

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', adjustHeaderWidths);
    };
  }, [adjustHeaderWidths]);

  // config 변경 시에만 한 번 실행 (별도 useEffect로 분리)
  useEffect(() => {
    // 약간의 딜레이 후 실행하여 DOM이 업데이트된 후 계산
    const timeoutId = setTimeout(() => {
      adjustHeaderWidths();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [config.leftButtons, config.rightButtons, adjustHeaderWidths]);

  return (
    <article className={styles.wrapper}>
      {config.showHeader && (
        <header className={styles.header}>
          <div ref={leftRef} className={styles['header-left']}>
            {config.leftButtons}
          </div>
          <div className={styles['header-center']}>
            <h1 className={styles['header-title']}>{config.title}</h1>
          </div>
          <div ref={rightRef} className={styles['header-right']}>
            {config.rightButtons}
          </div>
        </header>
      )}
      <main className={styles.body}>{children}</main>
      {config.showFooter && (
        <footer className={styles.footer}>
          Copyright © 2025 ANOJU. All rights reserved.
        </footer>
      )}
    </article>
  );
};

export default MainLayout;
