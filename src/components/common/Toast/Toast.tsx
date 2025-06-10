// src/components/common/Toast/Toast.tsx
import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { Toast as ToastType } from '@/types/toast';
import { useToast } from '@/hooks/useToast';
import styles from '@/assets/scss/components/toast.module.scss';

interface ToastProps {
  toast: ToastType;
  index: number; // 토스트의 순서 (애니메이션용)
  totalCount: number; // 전체 토스트 개수
}

// 타입별 아이콘 컴포넌트들
const SuccessIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z"
      fill="currentColor"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM5.70711 5.70711C5.31658 5.31658 4.68342 5.31658 4.29289 5.70711C3.90237 6.09763 3.90237 6.7308 4.29289 7.12132L6.17157 9L4.29289 10.8787C3.90237 11.2692 3.90237 11.9024 4.29289 12.2929C4.68342 12.6834 5.31658 12.6834 5.70711 12.2929L7.58579 10.4142L9.46447 12.2929C9.85499 12.6834 10.4882 12.6834 10.8787 12.2929C11.2692 11.9024 11.2692 11.2692 10.8787 10.8787L9 9L10.8787 7.12132C11.2692 6.7308 11.2692 6.09763 10.8787 5.70711C10.4882 5.31658 9.85499 5.31658 9.46447 5.70711L7.58579 7.58579L5.70711 5.70711Z"
      fill="currentColor"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.86603 2.5C8.48113 1.83333 7.51887 1.83333 7.13397 2.5L1.26795 12.5C0.883055 13.1667 1.36418 14 2.13398 14H13.866C14.6358 14 15.1169 13.1667 14.732 12.5L8.86603 2.5ZM8 5C8.55228 5 9 5.44772 9 6V9C9 9.55228 8.55228 10 8 10C7.44772 10 7 9.55228 7 9V6C7 5.44772 7.44772 5 8 5ZM8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z"
      fill="currentColor"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM8 4C8.55228 4 9 4.44772 9 5C9 5.55228 8.55228 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4ZM8 7C8.55228 7 9 7.44772 9 8V11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11V8C7 7.44772 7.44772 7 8 7Z"
      fill="currentColor"
    />
  </svg>
);

const LoadingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles['loading-spin']}
  >
    <path
      d="M8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 6.92184 14.2002 5.92184 13.6713 5.06629"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 타입별 아이콘 매핑
const iconMap = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
  loading: LoadingIcon,
};

const Toast = forwardRef<HTMLDivElement, ToastProps>(({ toast, index, totalCount }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const { removeToast } = useToast();
  const toastRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(index);

  const IconComponent = iconMap[toast.type];

  // 인덱스 변화 감지 및 애니메이션
  useEffect(() => {
    const prevIndex = prevIndexRef.current;
    const newIndex = index;

    if (prevIndex !== newIndex && isVisible) {
      // 인덱스가 변경되었을 때 (다른 토스트가 추가/제거됨)
      setCurrentIndex(newIndex);
      
      // 토스트가 밀려나는 애니메이션을 위한 클래스 추가
      if (toastRef.current) {
        toastRef.current.classList.add(styles.shifting);
        
        // 애니메이션 완료 후 클래스 제거
        setTimeout(() => {
          if (toastRef.current) {
            toastRef.current.classList.remove(styles.shifting);
          }
        }, 300);
      }
    }

    prevIndexRef.current = newIndex;
  }, [index, isVisible]);

  // 마운트 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setCurrentIndex(index);
    }, 50 + index * 80); // 각 토스트마다 약간의 지연

    return () => clearTimeout(timer);
  }, [index]);

  // 토스트 높이 계산 및 CSS 변수 설정
  useEffect(() => {
    if (toastRef.current && isVisible) {
      const height = toastRef.current.offsetHeight;
      toastRef.current.style.setProperty('--toast-height', `${height}px`);
    }
  }, [isVisible]);

  // 토스트 닫기 처리
  const handleClose = () => {
    if (isLeaving || isRemoving) return;
    
    setIsLeaving(true);
    
    // 먼저 leaving 애니메이션
    setTimeout(() => {
      setIsRemoving(true);
      
      // 그 다음 removing 애니메이션 후 실제 제거
      setTimeout(() => {
        removeToast(toast.id);
      }, 300);
    }, 200);
  };

  // 토스트 클릭 시 닫기 (로딩 타입은 제외)
  const handleClick = () => {
    if (toast.type !== 'loading') {
      handleClose();
    }
  };

  // 마우스 호버 시 스케일 효과
  const [isHovered, setIsHovered] = useState(false);

  // 토스트 클래스명 생성
  const toastClasses = [
    styles.toast,
    styles[toast.type],
    styles[toast.position],
    isVisible ? styles.visible : '',
    isLeaving ? styles.leaving : '',
    isRemoving ? styles.removing : '',
    isHovered && !isLeaving && !isRemoving ? styles.hovered : '',
  ]
    .filter(Boolean)
    .join(' ');

  // 위치 이동에 따른 변환 계산
  const getTransformStyle = () => {
    if (!isVisible || isLeaving || isRemoving) return {};
    
    // 스택 효과: 뒤쪽 토스트들을 살짝 축소하고 투명도 조정
    const stackScale = Math.max(0.95, 1 - (currentIndex * 0.02));
    const stackOpacity = Math.max(0.8, 1 - (currentIndex * 0.1));
    const stackOffset = currentIndex * 2; // 2px씩 오프셋
    
    return {
      transform: `scale(${stackScale}) translateY(${toast.position === 'top' ? stackOffset : -stackOffset}px)`,
      opacity: stackOpacity,
      zIndex: 1000 - currentIndex, // 최신 토스트가 가장 위에
    };
  };

  return (
    <div
      ref={(node) => {
        // ref를 처리하고 toastRef에도 할당
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        toastRef.current = node;
      }}
      className={toastClasses}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--toast-index': currentIndex,
        '--total-count': totalCount,
        '--stagger-delay': `${index * 0.08}s`,
        '--stack-index': currentIndex,
        ...getTransformStyle(),
      } as React.CSSProperties}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.icon}>
        <IconComponent />
      </div>
      <div className={styles.content}>{toast.content}</div>
      {toast.type !== 'loading' && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="토스트 닫기"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;
