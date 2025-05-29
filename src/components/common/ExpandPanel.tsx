// src/components/common/ExpandPanel.tsx
import { useEffect, useRef, forwardRef, ReactNode, CSSProperties } from 'react';
import { slideDown, slideUp } from '@/utils/slideAnimation';
import cx from '@/utils/cx';

interface ExpandPanelProps {
  children: ReactNode;
  open?: boolean; // 기본값 false
  id?: string; // 패널에 적용할 ID
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
      id,
      className = '',
      style,
      duration = 300,
      easing = 'easeOut',
      onOpenChange,
      destroyOnClose = false,
    },
    ref
  ) => {
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
          element.style.display = 'block';
        } else {
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
              }
              onOpenChange?.(false);
            },
          });
        }

        prevOpenRef.current = open;
      }
    }, [open, duration, easing, onOpenChange, destroyOnClose]);

    // destroyOnClose가 true이고 닫힌 상태면 렌더링하지 않음
    if (destroyOnClose && !shouldRenderRef.current) {
      return null;
    }

    // 클래스명 생성
    const wrapperClasses = cx(
      'expand-panel',
      open ? 'expand-panel-open' : '',
      className
    );

    return (
      <div ref={ref} className={wrapperClasses} style={style}>
        <div ref={contentRef} className="expand-panel-inner" id={id}>
          {children}
        </div>
      </div>
    );
  }
);

ExpandPanel.displayName = 'ExpandPanel';

export default ExpandPanel;
