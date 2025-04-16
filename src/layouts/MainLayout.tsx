// src/layouts/MainLayout.tsx
import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="page">
      <header>메인 헤더</header>
      <main>{children}</main>
      <footer>메인 푸터</footer>
    </div>
  );
};

export default MainLayout;
