// src/layouts/EmptyLayout.tsx
import React, { ReactNode } from 'react';

interface EmptyLayoutProps {
  children: ReactNode;
}

const EmptyLayout: React.FC<EmptyLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default EmptyLayout;
