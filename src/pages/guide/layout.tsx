// src/pages/guide/layout.tsx
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface GuideLayoutProps {
  children: ReactNode;
}

const GuideLayout: React.FC<GuideLayoutProps> = ({ children }) => {
  return (
    <div>
      <div>
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
      {children}
    </div>
  );
};

export default GuideLayout;
