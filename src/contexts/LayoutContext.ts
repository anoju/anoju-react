// src/contexts/LayoutContext.ts
import { useContext } from 'react';
import {
  LayoutContext,
  LayoutConfig,
  LayoutContextProps,
} from './LayoutContextDefinition';

// Re-export types and context
export { LayoutContext };
export type { LayoutConfig, LayoutContextProps };

// 컨텍스트 사용을 위한 훅
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
