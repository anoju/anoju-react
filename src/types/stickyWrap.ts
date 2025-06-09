// src/types/stickyWrap.ts
// StickyWrap 인스턴스 상태 타입
export interface StickyWrapState {
  id: string;
  height: number;
  width: number;
  isFixed: boolean;
  order: number;
  element: HTMLElement;
  scrolling: boolean;
  isHidden: boolean; // scrolling 옵션 시 숨김 상태
  offsetTop: number;
  originalTop: number; // 원래 위치
  originalLeft: number; // 원래 왼쪽 위치
}

// 컨텍스트 타입 정의
export interface StickyWrapContextType {
  instances: Map<string, StickyWrapState>;
  registerInstance: (id: string, state: StickyWrapState) => void;
  updateInstance: (id: string, updates: Partial<StickyWrapState>) => void;
  unregisterInstance: (id: string) => void;
  getTopOffset: (currentId: string) => number;
  updateStackedPositions: () => void;
}
