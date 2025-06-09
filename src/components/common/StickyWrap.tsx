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

// 고유 ID 생성 함수
let idCounter = 0;
const generateId = (): string => {
  idCounter += 1;
  return `sticky-wrap-${idCounter}-${Date.now()}`;
};

// StickyWrap Props 인터페이스
export interface StickyWrapProps {
  children: ReactNode;
  hideScrolling?: boolean;
  className?: string;
  onChange?: (isFixed: boolean) => void;
}

// StickyWrap 컴포넌트
const StickyWrap = forwardRef<HTMLDivElement, StickyWrapProps>(
  (
    { children, hideScrolling = false, className = '', onChange, ...props },
    ref
  ) => {
    // 상태 관리
    const [currentState, setCurrentState] = useState<StickyWrapState | null>(
      null
    );

    // ref들
    const wrapperRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const idRef = useRef<string>(generateId());

    // context 사용
    const {
      registerInstance,
      updateInstanceData,
      unregisterInstance,
      subscribeToUpdates,
    } = useStickyWrap();

    const id = idRef.current;

    // 스타일 적용
    const applyStyles = useCallback((state: StickyWrapState) => {
      if (!contentRef.current || !placeholderRef.current || !wrapperRef.current)
        return;

      const element = contentRef.current;
      const placeholder = placeholderRef.current;
      // const wrapper = wrapperRef.current;

      if (state.isFixed) {
        // fixed 스타일
        //const rect = wrapper.getBoundingClientRect();
        // element.style.position = 'fixed';
        // element.style.left = `${rect.left}px`;
        // element.style.width = `${rect.width}px`;
        element.style.top = `${state.fixedTop}px`;
        // element.style.zIndex = '1000';

        // transform 처리 (hideScrolling 옵션)
        if (state.hideScrolling && state.isHidden) {
          element.style.transform = 'translateY(-100%)';
        } else {
          element.style.transform = 'translateY(0)';
        }

        // placeholder 높이 설정
        placeholder.style.height = `${state.height}px`;
      } else {
        // 일반 스타일로 복원
        element.style.position = '';
        element.style.left = '';
        element.style.width = '';
        element.style.top = '';
        element.style.transform = '';
        element.style.zIndex = '';
        placeholder.style.height = '';
      }
    }, []);

    // 상태 변화 구독
    useEffect(() => {
      const unsubscribe = subscribeToUpdates(id, (state) => {
        setCurrentState(state);
        applyStyles(state);
      });

      return unsubscribe;
    }, [id, subscribeToUpdates, applyStyles]);

    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
      if (!wrapperRef.current || !contentRef.current) return;

      // 초기 위치/크기 측정
      const rect = wrapperRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // 인스턴스 등록
      const newInstance: StickyWrapState = {
        id,
        height: rect.height,
        width: rect.width,
        isFixed: false,
        order: Date.now(), // 등록 순서
        element: contentRef.current,
        hideScrolling,
        isHidden: false,
        originalTop: rect.top + scrollTop,
        originalLeft: rect.left,
        fixedTop: 0,
        onChange,
      };

      registerInstance(id, newInstance);

      // cleanup
      return () => {
        unregisterInstance(id);
      };
    }, [id, hideScrolling, onChange, registerInstance, unregisterInstance]);

    // 크기 변경 감지 (ResizeObserver)
    useEffect(() => {
      if (!wrapperRef.current) return;

      let resizeObserver: ResizeObserver | null = null;

      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            updateInstanceData(id, {
              height: rect.height,
              width: rect.width,
              originalLeft: rect.left,
            });
          }
        });

        resizeObserver.observe(wrapperRef.current);
      }

      return () => {
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    }, [id, updateInstanceData]);

    // 클래스명 조합
    const wrapperClassName = [
      styles['sticky-wrap'],
      currentState?.isFixed ? styles.fixed : '',
      currentState?.isFixed && currentState?.isHidden ? styles.hidden : '',
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
