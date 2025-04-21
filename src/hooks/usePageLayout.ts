// src/hooks/usePageLayout.ts
import { useEffect } from 'react';
import { useLayout, LayoutConfig } from '@/contexts/LayoutContext';

/**
 * 페이지별 레이아웃 설정을 쉽게 적용할 수 있는 커스텀 훅
 * @param config 레이아웃 설정
 * @param deps 의존성 배열 (선택 사항)
 */
export function usePageLayout(config: Partial<LayoutConfig>) {
  const { updateConfig, resetConfig } = useLayout();

  useEffect(() => {
    // 페이지 마운트 시 레이아웃 설정 업데이트
    updateConfig(config);

    // 페이지 언마운트 시 레이아웃 설정 초기화
    return () => {
      resetConfig();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount and unmount

  return useLayout();
}
