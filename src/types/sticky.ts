// src/types/sticky.ts
// Sticky 인스턴스 상태 타입
export interface StickyState {
  id: string;
  height: number;
  isFixed: boolean;
  order: number;
  element: HTMLElement;
  hideScrolling: boolean;
  isHidden: boolean; // hideScrolling 옵션 시 숨김 상태
  originalTop: number; // 원래 위치
  fixedTop: number; // 고정 시 top 위치
  zIndex: number; // z-index 값
  onChange?: (isFixed: boolean) => void; // 콜백 함수
}

// 컨텍스트 타입 정의
export interface StickyContextType {
  instances: Map<string, StickyState>;
  registerInstance: (id: string, state: StickyState) => void;
  updateInstanceData: (id: string, updates: Partial<StickyState>) => void;
  unregisterInstance: (id: string) => void;
  subscribeToUpdates: (
    id: string,
    callback: (state: StickyState) => void
  ) => () => void;
}
