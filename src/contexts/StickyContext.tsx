// src/contexts/StickyContext.tsx
import React, {
  createContext,
  useRef,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import type { StickyState, StickyContextType } from '@/types/sticky';

// throttle 유틸리티 함수
function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limit: number
): (...args: T) => void {
  let inThrottle: boolean;
  return function (this: void, ...args: T) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// CSS 변수 업데이트 함수들
function updateStickyHeightCSSVariables(
  currentHeight: number,
  minHeight: number,
  maxHeight: number
): void {
  const htmlElement = document.documentElement;
  htmlElement.style.setProperty('--sticky-height', `${currentHeight}px`);
  htmlElement.style.setProperty('--sticky-min-height', `${minHeight}px`);
  htmlElement.style.setProperty('--sticky-max-height', `${maxHeight}px`);
}

// 컨텍스트 생성
const StickyContext = createContext<StickyContextType | undefined>(undefined);

// Provider 컴포넌트
const StickyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const instancesRef = useRef<Map<string, StickyState>>(new Map());
  const subscribersRef = useRef<Map<string, (state: StickyState) => void>>(
    new Map()
  );
  const lastScrollYRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false); // 처리 중 플래그 추가
  const lastStickyHeightsRef = useRef<{
    current: number;
    min: number;
    max: number;
  }>({ current: 0, min: 0, max: 0 }); // 마지막 sticky 높이들 저장

  // 모든 인스턴스의 상태를 순차적으로 처리
  const processAllInstances = useCallback(() => {
    // 이미 처리 중이면 중복 실행 방지
    if (processingRef.current) return;
    processingRef.current = true;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const instances = Array.from(instancesRef.current.values()).sort(
      (a, b) => a.originalTop - b.originalTop
    ); // DOM 순서대로 정렬

    let accumulatedHeight = 0;
    const updates: Array<{
      id: string;
      state: StickyState;
      wasFixed: boolean;
    }> = [];

    // 각 인스턴스를 순서대로 처리
    instances.forEach((instance) => {
      const shouldBeFixed =
        scrollTop >= instance.originalTop - accumulatedHeight;

      // 스크롤 방향 감지 (hideScrolling 옵션용)
      let newIsHidden = instance.isHidden;
      if (instance.hideScrolling && shouldBeFixed) {
        const scrollDirection =
          scrollTop > lastScrollYRef.current ? 'down' : 'up';

        // 아래로 스크롤: 고정된 위치에서 요소 높이만큼 더 스크롤했을 때 숨김
        if (scrollDirection === 'down') {
          const hideThreshold =
            instance.originalTop - accumulatedHeight + instance.height;
          if (scrollTop >= hideThreshold) {
            newIsHidden = true;
          } else {
            newIsHidden = false;
          }
        }
        // 위로 스크롤: 숨김 해제
        else if (scrollDirection === 'up') {
          newIsHidden = false;
        }
      }

      // 상태가 변경된 경우
      if (
        shouldBeFixed !== instance.isFixed ||
        newIsHidden !== instance.isHidden
      ) {
        const updatedState: StickyState = {
          ...instance,
          isFixed: shouldBeFixed,
          isHidden: newIsHidden,
          fixedTop: accumulatedHeight,
        };

        instancesRef.current.set(instance.id, updatedState);
        updates.push({
          id: instance.id,
          state: updatedState,
          wasFixed: instance.isFixed,
        });
      }

      // 고정되고 숨겨지지 않은 경우 누적 높이에 추가
      if (shouldBeFixed && !newIsHidden) {
        accumulatedHeight += instance.height;
      }
    });

    lastScrollYRef.current = scrollTop;

    // 위치 및 z-index 재계산: 모든 고정된 요소들의 위치와 z-index를 다시 계산
    const fixedInstances = Array.from(instancesRef.current.values())
      .filter((instance) => instance.isFixed)
      .sort((a, b) => a.originalTop - b.originalTop);

    let currentTop = 0;
    let currentStickyHeight = 0; // 현재 화면에 보이는 sticky 요소들의 총 높이
    let minStickyHeight = 0; // hideScrolling이 false인 요소들의 높이 총합
    let maxStickyHeight = 0; // 모든 sticky 요소들의 높이 총합
    const baseZIndex = 200; // 기본 z-index 시작값

    fixedInstances.forEach((instance, index) => {
      const updatedState = {
        ...instance,
        fixedTop: instance.isHidden ? currentTop - instance.height : currentTop,
        zIndex: baseZIndex - index, // 첫 번째: 200, 두 번째: 199, 세 번째: 198...
      };

      instancesRef.current.set(instance.id, updatedState);

      // updates 배열에서 해당 인스턴스 찾아서 업데이트하거나 추가
      const existingUpdateIndex = updates.findIndex(
        (update) => update.id === instance.id
      );
      if (existingUpdateIndex >= 0) {
        updates[existingUpdateIndex].state = updatedState;
      } else {
        updates.push({
          id: instance.id,
          state: updatedState,
          wasFixed: instance.isFixed,
        });
      }

      // 높이 계산
      maxStickyHeight += instance.height; // 모든 고정된 요소의 높이 합산

      if (!instance.hideScrolling) {
        // hideScrolling이 false인 요소들만 min 높이에 포함
        minStickyHeight += instance.height;
      }

      // 숨겨지지 않은 요소만 다음 위치에 영향을 줌
      if (!instance.isHidden) {
        currentTop += instance.height;
        currentStickyHeight += instance.height; // 현재 보이는 높이에 추가
      }
    });

    // CSS 변수 업데이트 - 높이가 변경된 경우에만
    const lastHeights = lastStickyHeightsRef.current;
    if (
      currentStickyHeight !== lastHeights.current ||
      minStickyHeight !== lastHeights.min ||
      maxStickyHeight !== lastHeights.max
    ) {
      updateStickyHeightCSSVariables(
        currentStickyHeight,
        minStickyHeight,
        maxStickyHeight
      );
      lastStickyHeightsRef.current = {
        current: currentStickyHeight,
        min: minStickyHeight,
        max: maxStickyHeight,
      };
    }

    // 스타일 업데이트 및 onChange 콜백 호출
    requestAnimationFrame(() => {
      updates.forEach(({ id, state, wasFixed }) => {
        const subscriber = subscribersRef.current.get(id);
        if (subscriber) {
          subscriber(state);
        }

        // onChange 콜백 호출 - fixed 상태가 실제로 변경된 경우에만
        if (state.onChange && state.isFixed !== wasFixed) {
          // setTimeout으로 지연 실행하여 상태 업데이트 후 콜백 실행
          setTimeout(() => {
            if (state.onChange) {
              state.onChange(state.isFixed);
            }
          }, 0);
        }
      });

      // 처리 완료 플래그 해제
      processingRef.current = false;
    });
  }, []);

  // throttled 스크롤 핸들러
  const throttledScrollHandler = useRef(
    throttle(() => {
      processAllInstances();
    }, 16)
  ).current;

  // throttled 리사이즈 핸들러
  const throttledResizeHandler = useRef(
    throttle(() => {
      // 모든 인스턴스의 크기 정보 업데이트
      instancesRef.current.forEach((instance) => {
        if (instance.element && instance.element.parentElement) {
          const rect = instance.element.parentElement.getBoundingClientRect();
          const updatedInstance = {
            ...instance,
            height: rect.height,
          };
          instancesRef.current.set(instance.id, updatedInstance);
        }
      });
      processAllInstances();
    }, 100)
  ).current;

  // 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });
    window.addEventListener('resize', throttledResizeHandler);

    // 컴포넌트 마운트 시 초기 CSS 변수 설정
    updateStickyHeightCSSVariables(0, 0, 0);

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledResizeHandler);
      // 컴포넌트 언마운트 시 CSS 변수 초기화
      updateStickyHeightCSSVariables(0, 0, 0);
    };
  }, [throttledScrollHandler, throttledResizeHandler]);

  // 인스턴스 등록
  const registerInstance = useCallback(
    (id: string, state: StickyState) => {
      instancesRef.current.set(id, state);

      // 초기 위치 체크
      setTimeout(() => {
        processAllInstances();
      }, 0);
    },
    [processAllInstances]
  );

  // 인스턴스 데이터 업데이트
  const updateInstanceData = useCallback(
    (id: string, updates: Partial<StickyState>) => {
      const current = instancesRef.current.get(id);
      if (current) {
        const updated = { ...current, ...updates };
        instancesRef.current.set(id, updated);

        // onChange 함수 업데이트인 경우에는 processAllInstances 호출하지 않음
        if (!('onChange' in updates)) {
          processAllInstances();
        }
      }
    },
    [processAllInstances]
  );

  // 인스턴스 제거
  const unregisterInstance = useCallback(
    (id: string) => {
      instancesRef.current.delete(id);
      subscribersRef.current.delete(id);
      processAllInstances(); // 다른 요소들의 위치 재계산
    },
    [processAllInstances]
  );

  // 상태 업데이트 구독
  const subscribeToUpdates = useCallback(
    (id: string, callback: (state: StickyState) => void) => {
      subscribersRef.current.set(id, callback);

      // 현재 상태 즉시 전달
      const currentState = instancesRef.current.get(id);
      if (currentState) {
        callback(currentState);
      }

      // 구독 해제 함수 반환
      return () => {
        subscribersRef.current.delete(id);
      };
    },
    []
  );

  const contextValue: StickyContextType = {
    instances: instancesRef.current,
    registerInstance,
    updateInstanceData,
    unregisterInstance,
    subscribeToUpdates,
  };

  return (
    <StickyContext.Provider value={contextValue}>
      {children}
    </StickyContext.Provider>
  );
};

export { StickyProvider, StickyContext };
export default StickyProvider;
