// src/contexts/StickyWrapContext.tsx
import React, {
  createContext,
  useRef,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import type {
  StickyWrapState,
  StickyWrapContextType,
} from '@/types/stickyWrap';

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

// 컨텍스트 생성
const StickyWrapContext = createContext<StickyWrapContextType | undefined>(
  undefined
);

// Provider 컴포넌트
const StickyWrapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const instancesRef = useRef<Map<string, StickyWrapState>>(new Map());
  const subscribersRef = useRef<Map<string, (state: StickyWrapState) => void>>(
    new Map()
  );
  const lastScrollYRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false); // 처리 중 플래그 추가

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
    const updates: Array<{ id: string; state: StickyWrapState; wasFixed: boolean }> = [];

    // 각 인스턴스를 순서대로 처리
    instances.forEach((instance) => {
      const shouldBeFixed =
        scrollTop >= instance.originalTop - accumulatedHeight;

      // 스크롤 방향 감지 (hideScrolling 옵션용)
      let newIsHidden = instance.isHidden;
      if (instance.hideScrolling && shouldBeFixed) {
        const scrollDirection =
          scrollTop > lastScrollYRef.current ? 'down' : 'up';

        if (scrollDirection === 'down') {
          newIsHidden = true;
        } else if (scrollDirection === 'up') {
          newIsHidden = false;
        }
      }

      // 상태가 변경된 경우
      if (
        shouldBeFixed !== instance.isFixed ||
        newIsHidden !== instance.isHidden
      ) {
        const updatedState: StickyWrapState = {
          ...instance,
          isFixed: shouldBeFixed,
          isHidden: newIsHidden,
          fixedTop: accumulatedHeight,
        };

        instancesRef.current.set(instance.id, updatedState);
        updates.push({ 
          id: instance.id, 
          state: updatedState, 
          wasFixed: instance.isFixed 
        });
      }

      // 고정되고 숨겨지지 않은 경우 누적 높이에 추가
      if (shouldBeFixed && !newIsHidden) {
        accumulatedHeight += instance.height;
      }
    });

    lastScrollYRef.current = scrollTop;

    // 위치 재계산: 모든 고정된 요소들의 위치를 다시 계산
    // 숨겨진 요소들을 고려하여 fixedTop을 재설정
    const fixedInstances = Array.from(instancesRef.current.values())
      .filter((instance) => instance.isFixed)
      .sort((a, b) => a.originalTop - b.originalTop);

    let currentTop = 0;
    fixedInstances.forEach((instance) => {
      const updatedState = {
        ...instance,
        fixedTop: instance.isHidden ? currentTop - instance.height : currentTop,
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
          wasFixed: instance.isFixed 
        });
      }

      // 숨겨지지 않은 요소만 다음 위치에 영향을 줌
      if (!instance.isHidden) {
        currentTop += instance.height;
      }
    });

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

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledResizeHandler);
    };
  }, [throttledScrollHandler, throttledResizeHandler]);

  // 인스턴스 등록
  const registerInstance = useCallback(
    (id: string, state: StickyWrapState) => {
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
    (id: string, updates: Partial<StickyWrapState>) => {
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
    (id: string, callback: (state: StickyWrapState) => void) => {
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

  const contextValue: StickyWrapContextType = {
    instances: instancesRef.current,
    registerInstance,
    updateInstanceData,
    unregisterInstance,
    subscribeToUpdates,
  };

  return (
    <StickyWrapContext.Provider value={contextValue}>
      {children}
    </StickyWrapContext.Provider>
  );
};

export { StickyWrapProvider, StickyWrapContext };
export default StickyWrapProvider;
