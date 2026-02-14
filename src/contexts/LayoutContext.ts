// src/contexts/LayoutContext.tsx
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
  return useContext(LayoutContext);
};
