// src/hooks/useSticky.ts
import { useContext } from 'react';
import { StickyContext } from '@/contexts/StickyContext';

// 컨텍스트 사용을 위한 훅
export function useSticky() {
  const context = useContext(StickyContext);
  if (context === undefined) {
    throw new Error('useSticky must be used within a StickyProvider');
  }
  return context;
}

export default useSticky;
