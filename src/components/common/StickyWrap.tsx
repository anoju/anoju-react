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
import cx from '@/utils/cx';

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
  innerClassName?: string;
  onChange?: (isFixed: boolean) => void;
}

// StickyWrap 컴포넌트
const StickyWrap = forwardRef<HTMLDivElement, StickyWrapProps>(
  (
    {
      children,
      hideScrolling = false,
      className = '',
      innerClassName,
      onChange,
      ...props
    },
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
    const onChangeRef = useRef(onChange); // onChange를 ref로 저장하여 안정화

    // context 사용
    const {
      registerInstance,
      updateInstanceData,
      unregisterInstance,
      subscribeToUpdates,
    } = useStickyWrap();

    const id = idRef.current;

    // onChange ref 업데이트
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // 스타일 적용
    const applyStyles = useCallback((state: StickyWrapState) => {
      if (!contentRef.current || !placeholderRef.current || !wrapperRef.current)
        return;

      const element = contentRef.current;
      const placeholder = placeholderRef.current;

      if (state.isFixed) {
        // top 위치 설정
        element.style.top = `${state.fixedTop}px`;
        // placeholder 높이 설정
        placeholder.style.height = `${state.height}px`;
      } else {
        // 일반 스타일로 복원
        element.style.top = '';
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

      // 인스턴스 등록 - onChange를 ref로 전달
      const newInstance: StickyWrapState = {
        id,
        height: rect.height,
        isFixed: false,
        order: Date.now(), // 등록 순서
        element: contentRef.current,
        hideScrolling,
        isHidden: false,
        originalTop: rect.top + scrollTop,
        fixedTop: 0,
        onChange: onChangeRef.current, // ref를 통해 안정화된 함수 전달
      };

      registerInstance(id, newInstance);

      // cleanup
      return () => {
        unregisterInstance(id);
      };
    }, [id, hideScrolling, registerInstance, unregisterInstance]); // onChange는 의존성에서 제거

    // onChange 함수가 변경될 때 인스턴스 업데이트
    useEffect(() => {
      updateInstanceData(id, {
        onChange: onChangeRef.current,
      });
    }, [id, onChange, updateInstanceData]);

    // 크기 변경 감지 (ResizeObserver) - debounce 추가
    useEffect(() => {
      if (!wrapperRef.current) return;

      let resizeObserver: ResizeObserver | null = null;
      let resizeTimeout: NodeJS.Timeout;

      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          // debounce로 연속적인 크기 변경 이벤트 방지
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            if (wrapperRef.current && contentRef.current) {
              const rect = wrapperRef.current.getBoundingClientRect();
              updateInstanceData(id, {
                height: rect.height,
              });
            }
          }, 50); // 50ms debounce
        });

        resizeObserver.observe(wrapperRef.current);
      }

      return () => {
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        clearTimeout(resizeTimeout);
      };
    }, [id, updateInstanceData]);

    // 클래스명 조합
    const wrapperClassName = cx(
      styles['sticky-wrap'],
      currentState?.isFixed ? styles.fixed : '',
      currentState?.isFixed && currentState?.isHidden ? styles.hidden : '',
      className
    );

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
        <div ref={contentRef} className={cx(styles.content, innerClassName)}>
          {children}
        </div>
      </div>
    );
  }
);

StickyWrap.displayName = 'StickyWrap';

export default StickyWrap;
