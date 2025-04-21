// src/layouts/MainLayout.tsx
import React, { ReactNode, useEffect, useRef } from 'react';
import styles from '@/assets/scss/layouts/layouts.module.scss';
import { useLayout } from '@/contexts/LayoutContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const { config } = useLayout();

  // 좌우 헤더 영역의 너비를 동일하게 조정하는 함수
  const adjustHeaderWidths = () => {
    console.log('adjustHeaderWidths called');
    if (leftRef.current && rightRef.current) {
      // 초기 너비 설정 제거
      leftRef.current.style.minWidth = 'auto';
      rightRef.current.style.minWidth = 'auto';

      // 잠시 기다린 후 너비 측정
      setTimeout(() => {
        if (leftRef.current && rightRef.current) {
          const leftWidth = leftRef.current.offsetWidth;
          const rightWidth = rightRef.current.offsetWidth;

          // 둘 중 더 큰 너비를 사용
          const maxWidth = Math.max(leftWidth, rightWidth);

          // 양쪽 열에 같은 너비 적용
          leftRef.current.style.minWidth = `${maxWidth}px`;
          rightRef.current.style.minWidth = `${maxWidth}px`;
        }
      }, 0);
    }
  };

  useEffect(() => {
    // 페이지 로드 시 실행
    adjustHeaderWidths();
  }, [config.leftButtons, config.rightButtons]);

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
