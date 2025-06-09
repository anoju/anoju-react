// src/types/stickyWrap.ts
// StickyWrap 인스턴스 상태 타입
export interface StickyWrapState {
  id: string;
  height: number;
  width: number;
  isFixed: boolean;
  order: number;
  element: HTMLElement;
  hideScrolling: boolean;
  isHidden: boolean; // hideScrolling 옵션 시 숨김 상태
  originalTop: number; // 원래 위치
  originalLeft: number; // 원래 왼쪽 위치
  fixedTop: number; // 고정 시 top 위치
  onChange?: (isFixed: boolean) => void; // 콜백 함수
}

// 컨텍스트 타입 정의
export interface StickyWrapContextType {
  instances: Map<string, StickyWrapState>;
  registerInstance: (id: string, state: StickyWrapState) => void;
  updateInstanceData: (id: string, updates: Partial<StickyWrapState>) => void;
  unregisterInstance: (id: string) => void;
  subscribeToUpdates: (
    id: string,
    callback: (state: StickyWrapState) => void
  ) => () => void;
}
