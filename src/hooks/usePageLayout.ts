// src/hooks/usePageLayout.ts
import { useEffect, useRef } from 'react';
import { useLayout, LayoutConfig } from '@/contexts/LayoutContext';

/**
 * 페이지별 레이아웃 설정을 쉽게 적용할 수 있는 커스텀 훅
 * @param config 레이아웃 설정
 * @param deps 의존성 배열 (선택 사항)
 */
export function usePageLayout(config: Partial<LayoutConfig>) {
  const { updateConfig, resetConfig } = useLayout();

  // 초기 렌더링 시의 config를 저장하여 불필요한 의존성 변경을 방지
  // (대부분의 경우 페이지 레이아웃 설정은 마운트/언마운트 시에만 변경되면 됨)
  const savedConfig = useRef(config);

  useEffect(() => {
    // 페이지 마운트 시 레이아웃 설정 업데이트
    updateConfig(savedConfig.current);

    // 페이지 언마운트 시 레이아웃 설정 초기화
    return () => {
      resetConfig();
    };
  }, [updateConfig, resetConfig]); // savedConfig is a ref, so it's stable

  return useLayout();
}
