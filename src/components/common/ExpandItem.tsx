// src/components/common/ExpandItem.tsx
import { useState, forwardRef, ReactNode, CSSProperties } from 'react';
import ExpandPanel from './ExpandPanel';
import styles from '@/assets/scss/components/expandItem.module.scss';

interface ExpandItemProps {
  children: ReactNode;
  title: ReactNode; // 제목 (문자열 또는 React 요소)
  value?: boolean; // 외부 상태로 제어할 때 사용
  setValue?: (value: boolean) => void; // 외부 상태 변경 함수
  defaultOpen?: boolean; // 기본 열림 상태 (기본값 false)
  wrap?: boolean; // 버튼이 제목을 감쌀지 여부 (기본값 true)
  className?: string;
  style?: CSSProperties;
  duration?: number; // 애니메이션 지속시간 (ms), 기본값 300
  easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut'; // 이징 함수
  onOpenChange?: (open: boolean) => void;
  destroyOnClose?: boolean; // 닫힐 때 children을 DOM에서 제거할지 여부
  disabled?: boolean; // 비활성화 상태
}

const ExpandItem = forwardRef<HTMLDivElement, ExpandItemProps>(
  (
    {
      children,
      title,
      value,
      setValue,
      defaultOpen = false,
      wrap = true,
      className = '',
      style,
      duration = 300,
      easing = 'easeOut',
      onOpenChange,
      destroyOnClose = false,
      disabled = false,
    },
    ref
  ) => {
    // 내부 상태 (value가 제공되지 않은 경우에만 사용)
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // 실제 사용할 open 상태 (외부 제어 > 내부 상태)
    const isOpen = value !== undefined ? value : internalOpen;

    // 상태 변경 함수
    const handleToggle = () => {
      if (disabled) return;

      const newValue = !isOpen;

      if (setValue) {
        // 외부 상태 변경
        setValue(newValue);
      } else {
        // 내부 상태 변경
        setInternalOpen(newValue);
      }

      // 콜백 호출
      if (onOpenChange) {
        onOpenChange(newValue);
      }
    };

    // 클래스명 생성
    const wrapperClasses = [
      styles['expand-item'],
      isOpen ? styles['expand-item-open'] : styles['expand-item-closed'],
      disabled ? styles['expand-item-disabled'] : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // 화살표 아이콘 컴포넌트
    const ArrowIcon = () => (
      <svg
        className={styles['expand-item-arrow']}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    );

    return (
      <div ref={ref} className={wrapperClasses} style={style}>
        {wrap ? (
          // wrap=true: 버튼이 제목을 감쌈
          <button
            type="button"
            className={styles['expand-item-header-wrap']}
            onClick={handleToggle}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-controls="expand-panel-content"
          >
            <div className={styles['expand-item-title']}>{title}</div>
            <ArrowIcon />
          </button>
        ) : (
          // wrap=false: 제목과 버튼이 분리
          <div className={styles['expand-item-header-split']}>
            <div className={styles['expand-item-title']}>{title}</div>
            <button
              type="button"
              className={styles['expand-item-toggle-btn']}
              onClick={handleToggle}
              disabled={disabled}
              aria-expanded={isOpen}
              aria-controls="expand-panel-content"
              aria-label={isOpen ? '접기' : '펼치기'}
            >
              <ArrowIcon />
            </button>
          </div>
        )}

        <ExpandPanel
          open={isOpen}
          duration={duration}
          easing={easing}
          destroyOnClose={destroyOnClose}
          className={styles['expand-item-content']}
        >
          <div id="expand-panel-content">{children}</div>
        </ExpandPanel>
      </div>
    );
  }
);

ExpandItem.displayName = 'ExpandItem';

export default ExpandItem;
