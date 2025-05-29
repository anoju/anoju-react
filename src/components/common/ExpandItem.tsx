// src/components/common/ExpandItem.tsx
import { useState, useRef, forwardRef, ReactNode, CSSProperties } from 'react';
import ExpandPanel from './ExpandPanel';
import styles from '@/assets/scss/components/expand.module.scss';

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  const id = `expand-item_${uniqueIdCounter++}_${Math.random().toString(36).substring(2, 9)}`;
  return id;
};

interface ExpandItemProps {
  children: ReactNode;
  title: ReactNode; // 제목 (문자열 또는 React 요소)
  value?: number | string; // 아이템의 고유 식별값
  open?: boolean; // 외부 상태로 제어할 때 사용 (기존 value에서 변경)
  setOpen?: (open: boolean) => void; // 외부 상태 변경 함수 (기존 setValue에서 변경)
  defaultOpen?: boolean; // 기본 열림 상태 (기본값 false)
  wrap?: boolean; // 버튼이 제목을 감쌀지 여부 (기본값 true)
  className?: string;
  style?: CSSProperties;
  duration?: number; // 애니메이션 지속시간 (ms), 기본값 300
  easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut'; // 이징 함수
  onChange?: (open: boolean) => void;
  destroyOnClose?: boolean; // 닫힐 때 children을 DOM에서 제거할지 여부
  disabled?: boolean; // 비활성화 상태
  // Expand 컴포넌트에서 사용할 내부 props
  _isControlled?: boolean; // 내부용: 부모 컴포넌트에서 제어되는지 여부
  _onToggle?: (value: number | string) => void; // 내부용: 부모 컴포넌트에서 토글 처리
}

const ExpandItem = forwardRef<HTMLDivElement, ExpandItemProps>(
  (
    {
      children,
      title,
      value,
      open,
      setOpen,
      defaultOpen = false,
      wrap = true,
      className = '',
      style,
      duration = 300,
      easing = 'easeOut',
      onChange,
      destroyOnClose = false,
      disabled = false,
      _isControlled = false,
      _onToggle,
    },
    ref
  ) => {
    // 고유 ID 생성 (후크로 한 번만 생성됨)
    const uniqueIdRef = useRef<string>(generateUniqueId());
    const panelId = uniqueIdRef.current;

    // 내부 상태 (open이 제공되지 않은 경우에만 사용)
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // 실제 사용할 open 상태 (외부 제어 > 내부 상태)
    const isOpen = open !== undefined ? open : internalOpen;

    // 상태 변경 함수
    const handleToggle = () => {
      if (disabled) return;

      // Expand 컴포넌트에서 제어되는 경우
      if (_isControlled && _onToggle && value !== undefined) {
        _onToggle(value);
        return;
      }

      const newValue = !isOpen;

      if (setOpen) {
        // 외부 상태 변경
        setOpen(newValue);
      } else {
        // 내부 상태 변경
        setInternalOpen(newValue);
      }

      // 콜백 호출
      if (onChange) {
        onChange(newValue);
      }
    };

    // 클래스명 생성
    const wrapperClasses = [
      styles['expand-item'],
      isOpen ? styles['expand-item-open'] : '',
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
            aria-controls={panelId}
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
              aria-controls={panelId}
              aria-label={isOpen ? '접기' : '펼치기'}
            >
              <ArrowIcon />
            </button>
          </div>
        )}

        <ExpandPanel
          id={panelId}
          open={isOpen}
          duration={duration}
          easing={easing}
          destroyOnClose={destroyOnClose}
          className={styles['expand-item-content']}
        >
          {children}
        </ExpandPanel>
      </div>
    );
  }
);

ExpandItem.displayName = 'ExpandItem';

export default ExpandItem;
