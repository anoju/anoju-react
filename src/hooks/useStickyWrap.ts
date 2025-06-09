// src/hooks/useStickyWrap.ts
import { useContext } from 'react';
import { StickyWrapContext } from '@/contexts/StickyWrapContext';

// 컨텍스트 사용을 위한 훅
export function useStickyWrap() {
  const context = useContext(StickyWrapContext);
  if (context === undefined) {
    throw new Error('useStickyWrap must be used within a StickyWrapProvider');
  }
  return context;
}

export default useStickyWrap;
