// src/components/common/ExpandPanel.tsx
import React, {
  useEffect,
  useRef,
  forwardRef,
  ReactNode,
  CSSProperties,
} from 'react';
import { slideDown, slideUp } from '@/utils/slideAnimation';
import styles from '@/assets/scss/components/expandPanel.module.scss';

interface ExpandPanelProps {
  children: ReactNode;
  open?: boolean; // 기본값 false
  className?: string;
  style?: CSSProperties;
  duration?: number; // 애니메이션 지속시간 (ms), 기본값 300
  easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut'; // 이징 함수
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
      easing = 'easeOut',
      onOpenChange,
      destroyOnClose = false,
    },
    ref
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const isFirstRenderRef = useRef(true);
    const prevOpenRef = useRef(open);
    const shouldRenderRef = useRef(open || !destroyOnClose);

    // open 상태 변화 감지 및 애니메이션 실행
    useEffect(() => {
      if (!contentRef.current) return;

      const element = contentRef.current;

      // 첫 렌더링 처리
      if (isFirstRenderRef.current) {
        isFirstRenderRef.current = false;
        
        if (open) {
          // 첫 렌더링에서 열린 상태 - display: block만 설정
          element.style.display = 'block';
        } else {
          // 첫 렌더링에서 닫힌 상태 - display: none만 설정
          element.style.display = 'none';
        }
        
        prevOpenRef.current = open;
        shouldRenderRef.current = open || !destroyOnClose;
        return;
      }

      // 상태가 변경된 경우에만 애니메이션 실행
      if (prevOpenRef.current !== open) {
        if (open) {
          // 열기 애니메이션
          shouldRenderRef.current = true;
          
          slideDown(element, {
            duration,
            easing,
            onComplete: () => {
              onOpenChange?.(true);
            },
          });
        } else {
          // 닫기 애니메이션
          slideUp(element, {
            duration,
            easing,
            onComplete: () => {
              if (destroyOnClose) {
                shouldRenderRef.current = false;
                // 강제 리렌더링을 위해 스타일 변경
                if (wrapperRef.current) {
                  wrapperRef.current.style.display = 'none';
                  requestAnimationFrame(() => {
                    if (wrapperRef.current) {
                      wrapperRef.current.style.display = '';
                    }
                  });
                }
              }
              onOpenChange?.(false);
            },
          });
        }
        
        prevOpenRef.current = open;
      }
    }, [open, duration, easing, onOpenChange, destroyOnClose]);

    // 클래스명 생성
    const wrapperClasses = [
      styles['expand-panel'],
      open ? styles['expand-panel-open'] : styles['expand-panel-closed'],
      className,
    ].filter(Boolean).join(' ');

    // destroyOnClose가 true이고 닫힌 상태면 렌더링하지 않음
    if (destroyOnClose && !shouldRenderRef.current) {
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
        style={style}
      >
        <div
          ref={contentRef}
          className={styles['expand-panel-content']}
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
