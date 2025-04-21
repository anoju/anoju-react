// src/layouts/MainLayout.tsx
import React, { ReactNode, useEffect, useRef } from 'react';
import styles from '@/assets/scss/layouts/layouts.module.scss';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // 좌우 헤더 영역의 너비를 동일하게 조정하는 함수
  const adjustHeaderWidths = () => {
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

    // 윈도우 크기 변경 시 실행
    //window.addEventListener('resize', adjustHeaderWidths);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    // return () => {
    //   window.removeEventListener('resize', adjustHeaderWidths);
    // };
  }, []);

  return (
    <article className={styles.wrapper}>
      <header className={styles.header}>
        <div ref={leftRef} className={styles['header-left']}>
          좌측 버튼 배치
        </div>
        <div className={styles['header-center']}>
          <h1 className={styles['header-title']}>페이지 타이틀</h1>
        </div>
        <div ref={rightRef} className={styles['header-right']}>
          우측 버튼 배치
        </div>
      </header>
      <main className={styles.body}>{children}</main>
      <footer className={styles.footer}>
        Copyright © 2025 ANOJU. All rights reserved.
      </footer>
    </article>
  );
};

export default MainLayout;
