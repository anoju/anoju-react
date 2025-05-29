// src/components/common/ExpandPanel.tsx
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  ReactNode,
  CSSProperties,
  useCallback,
} from 'react';
import styles from '@/assets/scss/components/expandPanel.module.scss';

interface ExpandPanelProps {
  children: ReactNode;
  open?: boolean; // 기본값 false
  className?: string;
  style?: CSSProperties;
  duration?: number; // 애니메이션 지속시간 (ms), 기본값 300
  onOpenChange?: (open: boolean) => void;
  destroyOnClose?: boolean; // 닫힐 때 children을 DOM에서 제거할지 여부
}

const ExpandPanel = forwardRef<HTMLDivElement, ExpandPanelProps>(
  (
    {
      children,
      open = false,
      className = '',
      style,
      duration = 300,
      onOpenChange,
      destroyOnClose = false,
    },
    ref
  ) => {
    const isOpen = open;
    
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentHeight, setCurrentHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);
    const [shouldRender, setShouldRender] = useState(isOpen);
    
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
    const prevOpenRef = useRef(isOpen);

    // 실제 콘텐츠 높이 측정
    const measureHeight = useCallback(() => {
      if (!contentRef.current) return 0;
      return contentRef.current.offsetHeight;
    }, []);

    // 애니메이션 실행
    const executeAnimation = useCallback((targetOpen: boolean) => {
      if (!contentRef.current) return;

      if (targetOpen) {
        // 열기 애니메이션
        setShouldRender(true);
        setCurrentHeight(0);
        setIsAnimating(true);
        
        // DOM 업데이트 후 실제 높이 측정 및 애니메이션 시작
        requestAnimationFrame(() => {
          if (!contentRef.current) return;
          
          // 임시로 height를 auto로 설정하여 실제 높이 측정
          const originalHeight = contentRef.current.style.height;
          contentRef.current.style.height = 'auto';
          const actualHeight = contentRef.current.scrollHeight;
          contentRef.current.style.height = originalHeight;
          
          requestAnimationFrame(() => {
            setCurrentHeight(actualHeight);
          });
        });
        
        // 애니메이션 완료 후 처리
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }
        
        animationTimerRef.current = setTimeout(() => {
          setCurrentHeight('auto');
          setIsAnimating(false);
          animationTimerRef.current = null;
        }, duration);
        
      } else {
        // 닫기 애니메이션
        const currentActualHeight = contentRef.current.offsetHeight;
        setCurrentHeight(currentActualHeight);
        setIsAnimating(true);
        
        // 두 번의 requestAnimationFrame으로 확실한 DOM 업데이트 보장
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setCurrentHeight(0);
          });
        });
        
        // 애니메이션 완료 후 처리
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }
        
        animationTimerRef.current = setTimeout(() => {
          setIsAnimating(false);
          if (destroyOnClose) {
            setShouldRender(false);
          }
          animationTimerRef.current = null;
        }, duration);
      }
    }, [duration, destroyOnClose]);

    // 첫 렌더링 처리
    useEffect(() => {
      if (isFirstRender) {
        setIsFirstRender(false);
        setShouldRender(isOpen || !destroyOnClose);
        setCurrentHeight(isOpen ? 'auto' : 0);
        return;
      }

      // 상태 변화 시 애니메이션 실행
      if (prevOpenRef.current !== isOpen) {
        executeAnimation(isOpen);
        prevOpenRef.current = isOpen;
        
        // 외부 콜백 호출
        if (onOpenChange) {
          onOpenChange(isOpen);
        }
      }
    }, [isOpen, isFirstRender, executeAnimation, onOpenChange, destroyOnClose]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
      return () => {
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }
      };
    }, []);

    // 윈도우 리사이즈 시 높이 재계산 (열린 상태에서만)
    useEffect(() => {
      if (!isOpen || currentHeight === 0) return;

      const handleResize = () => {
        if (currentHeight === 'auto') {
          // 높이 재측정은 필요 없음 (auto이므로)
          return;
        }
        
        // 애니메이션 중이 아닐 때만 높이 재측정
        if (!isAnimating) {
          const newHeight = contentRef.current.offsetHeight;
          setCurrentHeight(newHeight);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [isOpen, currentHeight, isAnimating, measureHeight]);

    // CSS 변수를 통한 duration 전달
    const cssVariables = {
      '--expand-duration': `${duration}ms`,
    } as CSSProperties;

    // 클래스명 생성
    const wrapperClasses = [
      styles['expand-panel'],
      isOpen ? styles['expand-panel-open'] : styles['expand-panel-closed'],
      isAnimating ? styles['expand-panel-animating'] : '',
      className,
    ].filter(Boolean).join(' ');

    // destroyOnClose가 true이고 shouldRender가 false면 렌더링하지 않음
    if (destroyOnClose && !shouldRender) {
      return null;
    }

    return (
      <div
        ref={(node) => {
          // ref 처리
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          wrapperRef.current = node;
        }}
        className={wrapperClasses}
        style={{
          ...cssVariables,
          ...style,
        }}
      >
        <div
          ref={contentRef}
          className={styles['expand-panel-content']}
          style={{
            height: currentHeight === 'auto' ? 'auto' : `${currentHeight}px`,
          }}
        >
          <div className={styles['expand-panel-inner']}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

ExpandPanel.displayName = 'ExpandPanel';

export default ExpandPanel;
