// src/layouts/GuideLayout.tsx
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from '@/assets/scss/layouts/layouts.module.scss';

interface GuideLayoutProps {
  children: ReactNode;
}

const GuideLayout: React.FC<GuideLayoutProps> = ({ children }) => {
  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideSidebar}>
        <nav>
          <ul>
            <li>
              <Link to="/guide/button">Button</Link>
            </li>
            <li>
              <Link to="/guide/input">Input</Link>
            </li>
            <li>
              <Link to="/guide/modal">Modal</Link>
            </li>
            {/* 추가 컴포넌트 가이드 링크 */}
          </ul>
        </nav>
      </div>
      <div className={styles.guideContent}>{children}</div>
    </div>
  );
};

export default GuideLayout;
