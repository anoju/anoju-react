// src/layouts/MainLayout.tsx
import React, { ReactNode } from 'react';
import styles from '@/assets/scss/layouts/layouts.module.scss';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>메인 헤더</header>
      <main className={styles.body}>{children}</main>
      <footer className={styles.footer}>메인 푸터</footer>
    </div>
  );
};

export default MainLayout;
