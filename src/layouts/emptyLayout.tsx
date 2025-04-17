// src/layouts/emptyLayout.tsx
import React, { ReactNode } from 'react';

interface emptyLayoutProps {
  children: ReactNode;
}

const emptyLayout: React.FC<emptyLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default emptyLayout;
