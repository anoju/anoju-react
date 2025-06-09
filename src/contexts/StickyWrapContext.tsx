// src/contexts/StickyWrapContext.tsx
import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  ReactNode,
} from 'react';

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
interface StickyWrapContextType {
  instances: Map<string, StickyWrapState>;
  registerInstance: (id: string, state: StickyWrapState) => void;
  updateInstance: (id: string, updates: Partial<StickyWrapState>) => void;
  unregisterInstance: (id: string) => void;
  getTopOffset: (currentId: string) => number;
  updateStackedPositions: () => void;
}

// 컨텍스트 생성
const StickyWrapContext = createContext<StickyWrapContextType | undefined>(
  undefined
);

// Provider 컴포넌트
export const StickyWrapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const instancesRef = useRef<Map<string, StickyWrapState>>(new Map());

  // 인스턴스 등록
  const registerInstance = useCallback(
    (id: string, state: StickyWrapState) => {
      instancesRef.current.set(id, state);
    },
    []
  );

  // 인스턴스 업데이트
  const updateInstance = useCallback(
    (id: string, updates: Partial<StickyWrapState>) => {
      const current = instancesRef.current.get(id);
      if (current) {
        const updated = { ...current, ...updates };
        instancesRef.current.set(id, updated);
      }
    },
    []
  );

  // 인스턴스 제거
  const unregisterInstance = useCallback((id: string) => {
    instancesRef.current.delete(id);
  }, []);

  // 현재 요소보다 위에 있는 fixed 요소들의 높이 합계 계산
  const getTopOffset = useCallback((currentId: string): number => {
    const current = instancesRef.current.get(currentId);
    if (!current) return 0;

    let totalHeight = current.offsetTop;
    
    // 모든 인스턴스를 순회하여 현재 요소보다 앞선 fixed 요소들의 높이를 더함
    Array.from(instancesRef.current.values())
      .filter(
        (instance) =>
          instance.isFixed &&
          !instance.isHidden &&
          instance.order < current.order
      )
      .sort((a, b) => a.order - b.order) // 순서대로 정렬
      .forEach((instance) => {
        totalHeight += instance.height;
      });

    return totalHeight;
  }, []);

  // 스택된 요소들의 위치 업데이트
  const updateStackedPositions = useCallback(() => {
    const fixedInstances = Array.from(instancesRef.current.values())
      .filter((instance) => instance.isFixed)
      .sort((a, b) => a.order - b.order);

    let accumulatedHeight = 0;

    fixedInstances.forEach((instance) => {
      const element = instance.element;
      if (element) {
        // 각 요소의 고유한 offsetTop + 이전 요소들의 누적 높이
        const topPosition = instance.offsetTop + accumulatedHeight;
        
        if (instance.scrolling && instance.isHidden) {
          // scrolling 옵션이 true이고 숨겨진 상태일 때
          element.style.transform = `translateY(-${instance.height}px)`;
          element.style.top = `${topPosition}px`;
        } else {
          // 일반 상태
          element.style.transform = 'translateY(0)';
          element.style.top = `${topPosition}px`;
        }

        // 숨겨지지 않은 요소만 누적 높이에 추가
        if (!instance.isHidden) {
          accumulatedHeight += instance.height;
        }
      }
    });
  }, []);

  const contextValue: StickyWrapContextType = {
    instances: instancesRef.current,
    registerInstance,
    updateInstance,
    unregisterInstance,
    getTopOffset,
    updateStackedPositions,
  };

  return (
    <StickyWrapContext.Provider value={contextValue}>
      {children}
    </StickyWrapContext.Provider>
  );
};

// 컨텍스트 사용을 위한 훅
export const useStickyWrap = () => {
  const context = useContext(StickyWrapContext);
  if (context === undefined) {
    throw new Error('useStickyWrap must be used within a StickyWrapProvider');
  }
  return context;
};

export default StickyWrapContext;
