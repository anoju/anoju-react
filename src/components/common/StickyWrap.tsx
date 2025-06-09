// src/components/common/StickyWrap.tsx
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  forwardRef,
} from 'react';
import { useStickyWrap } from '@/hooks/useStickyWrap';
import type { StickyWrapState } from '@/types/stickyWrap';
import styles from '@/assets/scss/components/stickyWrap.module.scss';

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

// 고유 ID 생성 함수
let idCounter = 0;
const generateId = (): string => {
  idCounter += 1;
  return `sticky-wrap-${idCounter}-${Date.now()}`;
};

// StickyWrap Props 인터페이스
export interface StickyWrapProps {
  children: ReactNode;
  offsetTop?: number;
  scrolling?: boolean;
  className?: string;
  onChange?: (isFixed: boolean) => void;
}

// StickyWrap 컴포넌트
const StickyWrap = forwardRef<HTMLDivElement, StickyWrapProps>(
  (
    {
      children,
      offsetTop = 0,
      scrolling = false,
      className = '',
      onChange,
      ...props
    },
    ref
  ) => {
    // 상태 관리
    const [isFixed, setIsFixed] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    // ref들
    const wrapperRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const idRef = useRef<string>(generateId());
    const lastScrollYRef = useRef<number>(0);
    const originalRectRef = useRef<DOMRect | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // context 사용
    const {
      registerInstance,
      updateInstance,
      unregisterInstance,
      updateStackedPositions,
    } = useStickyWrap();

    const id = idRef.current;

    // 크기 및 위치 정보 업데이트
    const updateDimensions = useCallback(() => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // 원래 위치 정보 저장
      if (!originalRectRef.current) {
        originalRectRef.current = {
          ...rect,
          top: rect.top + scrollTop,
        } as DOMRect;
      }

      // 인스턴스 정보 업데이트
      updateInstance(id, {
        height: rect.height,
        width: rect.width,
        originalTop: originalRectRef.current.top,
        originalLeft: rect.left,
      });
    }, [id, updateInstance]);

    // 스크롤 위치 확인 및 fixed 상태 결정
    const checkPosition = useCallback(() => {
      if (!wrapperRef.current || !originalRectRef.current) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const shouldBeFixed =
        scrollTop + offsetTop >= originalRectRef.current.top;

      // 스크롤 방향 감지 (scrolling 옵션용)
      let newIsHidden = isHidden;
      if (scrolling && isFixed) {
        const scrollDirection =
          scrollTop > lastScrollYRef.current ? 'down' : 'up';

        if (scrollDirection === 'down') {
          newIsHidden = true;
        } else if (scrollDirection === 'up') {
          newIsHidden = false;
        }
      }

      lastScrollYRef.current = scrollTop;

      // 상태 변경이 필요한 경우에만 업데이트
      if (shouldBeFixed !== isFixed || newIsHidden !== isHidden) {
        setIsFixed(shouldBeFixed);
        setIsHidden(scrolling ? newIsHidden : false);

        // placeholder 높이 설정
        if (placeholderRef.current) {
          if (shouldBeFixed) {
            const rect = wrapperRef.current.getBoundingClientRect();
            placeholderRef.current.style.height = `${rect.height}px`;
          } else {
            placeholderRef.current.style.height = '';
          }
        }

        // 인스턴스 상태 업데이트
        updateInstance(id, {
          isFixed: shouldBeFixed,
          isHidden: scrolling ? newIsHidden : false,
        });

        // onChange 콜백 호출
        if (onChange && shouldBeFixed !== isFixed) {
          onChange(shouldBeFixed);
        }

        // 모든 스택된 요소들의 위치 업데이트
        requestAnimationFrame(() => {
          updateStackedPositions();
        });
      }
    }, [
      isFixed,
      isHidden,
      scrolling,
      offsetTop,
      id,
      updateInstance,
      updateStackedPositions,
      onChange,
    ]);

    // 스타일 적용
    const applyStyles = useCallback(() => {
      if (!contentRef.current || !originalRectRef.current) return;

      const element = contentRef.current;

      if (isFixed) {
        // fixed 스타일
        element.style.left = `${originalRectRef.current.left}px`;
        element.style.width = `${originalRectRef.current.width}px`;

        // element 참조를 인스턴스에 저장
        updateInstance(id, {
          element: element,
        });

        // 위치 업데이트는 Context에서 일괄 처리
        requestAnimationFrame(() => {
          updateStackedPositions();
        });
      } else {
        // 일반 스타일로 복원
        element.style.top = '';

        // fixed가 해제되었을 때도 다른 요소들의 위치 업데이트
        requestAnimationFrame(() => {
          updateStackedPositions();
        });
      }
    }, [isFixed, id, updateInstance, updateStackedPositions]);

    // 상태 변경 시 스타일 적용
    useEffect(() => {
      applyStyles();
    }, [applyStyles]);

    // throttled 핸들러들 - 직접 throttle 적용
    const throttledScrollHandler = useRef(
      throttle(() => {
        checkPosition();
      }, 16)
    ).current;

    const throttledResizeHandler = useRef(
      throttle(() => {
        updateDimensions();
        checkPosition();
      }, 100)
    ).current;

    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
      if (!wrapperRef.current) return;

      // order 설정 (등록 순서)
      const currentOrder = Date.now();

      // 초기 위치/크기 측정
      const rect = wrapperRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      originalRectRef.current = {
        ...rect,
        top: rect.top + scrollTop,
      } as DOMRect;

      // 인스턴스 등록
      const newInstance: StickyWrapState = {
        id,
        height: rect.height,
        width: rect.width,
        isFixed: false,
        order: currentOrder,
        element: contentRef.current!,
        scrolling,
        isHidden: false,
        offsetTop,
        originalTop: originalRectRef.current.top,
        originalLeft: rect.left,
      };

      registerInstance(id, newInstance);

      // ResizeObserver 설정
      if (window.ResizeObserver) {
        resizeObserverRef.current = new ResizeObserver(throttledResizeHandler);
        resizeObserverRef.current.observe(wrapperRef.current);
      }

      // 이벤트 리스너 등록
      window.addEventListener('scroll', throttledScrollHandler);
      window.addEventListener('resize', throttledResizeHandler);

      // 초기 위치 체크
      setTimeout(() => {
        checkPosition();
      }, 0);

      // cleanup
      return () => {
        window.removeEventListener('scroll', throttledScrollHandler);
        window.removeEventListener('resize', throttledResizeHandler);

        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }

        unregisterInstance(id);
      };
    }, [
      id,
      scrolling,
      offsetTop,
      registerInstance,
      unregisterInstance,
      throttledScrollHandler,
      throttledResizeHandler,
      checkPosition,
    ]);

    // 클래스명 조합
    const wrapperClassName = [
      styles['sticky-wrap'],
      isFixed ? styles.fixed : '',
      isFixed && isHidden ? styles.hidden : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={(node) => {
          wrapperRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={wrapperClassName}
        {...props}
      >
        {/* 고정 시 자리를 차지할 placeholder */}
        <div ref={placeholderRef} className={styles.placeholder} />

        {/* 실제 컨텐츠 */}
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
);

StickyWrap.displayName = 'StickyWrap';

export default StickyWrap;
