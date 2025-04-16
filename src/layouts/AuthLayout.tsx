// src/layouts/AuthLayout.tsx
import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <h1>인증</h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
