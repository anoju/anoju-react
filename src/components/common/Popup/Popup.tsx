// src/components/common/Popup/Popup.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import PopupManager from './PopupManager';
import styles from '@/assets/scss/components/popup.module.scss';
import { Button } from '@/components/common';

export type PopupType = 'modal' | 'full' | 'bottom';

export interface PopupProps {
  id?: string;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  type?: PopupType;
  visible?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  onCancel?: () => void;
  afterOpen?: () => void;
  afterClose?: () => void;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  destroyOnClose?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
  style?: CSSProperties;
  zIndex?: number;
  showCloseButton?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  focusTriggerAfterClose?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  id,
  title = '팝업',
  children,
  footer = null,
  type = 'modal',
  visible = false,
  onClose,
  onOk,
  onCancel,
  afterOpen,
  afterClose,
  closeOnClickOutside = true,
  closeOnEsc = true,
  destroyOnClose = false,
  width,
  height,
  className = '',
  bodyClassName = '',
  footerClassName = '',
  style,
  zIndex,
  showCloseButton = true,
  maskClosable = true,
  keyboard = true,
  focusTriggerAfterClose = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [popupZIndex, setPopupZIndex] = useState(zIndex || 1000);
  
  const popupRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleIdRef = useRef<string>(id ? `${id}-title` : `popup-title-${Date.now()}`);
  const popupIdRef = useRef<string>(id || `popup-${Date.now()}`);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 포털 컨테이너 생성 및 관리
  useEffect(() => {
    if (visible && !containerRef.current) {
      // 컨테이너 생성
      const container = document.createElement('div');
      container.id = `popup-container-${popupIdRef.current}`;
      document.body.appendChild(container);
      containerRef.current = container;
    }

    // 클린업
    return () => {
      if (containerRef.current && !visible) {
        // 애니메이션이 끝난 후 제거
        setTimeout(() => {
          containerRef.current?.remove();
          containerRef.current = null;
        }, 300);
      }
    };
  }, [visible]);

  // 팝업이 열릴 때 포커스 처리
  const handleFocus = useCallback(() => {
    if (isVisible && popupRef.current) {
      // 현재 포커스된 요소 저장
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // 팝업 내부의 첫 번째 포커스 가능한 요소로 포커스 이동
      const focusableElements = popupRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        popupRef.current.focus();
      }
    }
  }, [isVisible]);

  // 팝업이 닫힐 때 포커스 복원
  const restoreFocus = useCallback(() => {
    if (focusTriggerAfterClose && previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus();
    }
  }, [focusTriggerAfterClose]);

  // 팝업 닫기 핸들러
  const handleClose = useCallback(() => {
    setAnimationClass('closing');
    
    setTimeout(() => {
      setIsVisible(false);
      setIsMounted(false);
      
      // 팝업 매니저에서 제거
      PopupManager.unregister(popupIdRef.current);
      
      // 포커스 복원
      restoreFocus();
      
      // 콜백 실행
      onClose?.();
      afterClose?.();
    }, 300); // 애니메이션 시간과 동일
  }, [onClose, afterClose, restoreFocus]);

  // ESC 키 핸들러
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (keyboard && closeOnEsc && e.key === 'Escape' && isVisible) {
      // 현재 팝업이 최상위 팝업인지 확인
      const isTopPopup = PopupManager.isTopPopup(popupIdRef.current);
      if (isTopPopup) {
        handleClose();
      }
    }
  }, [keyboard, closeOnEsc, isVisible, handleClose]);

  // 외부 클릭 핸들러
  const handleClickOutside = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (maskClosable && closeOnClickOutside && e.target === e.currentTarget) {
      handleClose();
    }
  }, [maskClosable, closeOnClickOutside, handleClose]);

  // visible prop 변경 감지
  useEffect(() => {
    if (visible && !isMounted) {
      // 팝업 매니저에 등록
      const newZIndex = PopupManager.register(popupIdRef.current);
      setPopupZIndex(zIndex || newZIndex);
      
      setIsMounted(true);
      // 다음 프레임에서 애니메이션 시작
      requestAnimationFrame(() => {
        setIsVisible(true);
        setAnimationClass('opening');
        
        // 애니메이션 완료 후 콜백 실행
        setTimeout(() => {
          setAnimationClass('');
          afterOpen?.();
        }, 300);
      });
    } else if (!visible && isMounted) {
      handleClose();
    }
  }, [visible, isMounted, handleClose, afterOpen, zIndex]);

  // 키보드 이벤트 리스너
  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isVisible, handleKeyDown]);

  // 포커스 처리
  useEffect(() => {
    if (isVisible) {
      // 약간의 지연을 주어 DOM이 완전히 렌더링된 후 포커스 처리
      const timer = setTimeout(() => {
        handleFocus();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, handleFocus]);

  // 팝업 최대 높이 계산
  const calculateMaxHeight = useCallback(() => {
    if (popupRef.current) {
      const popWrap = popupRef.current.querySelector(`.${styles['pop-wrap']}`);
      if (popWrap) {
        const windowHeight = window.innerHeight;
        const padding = type === 'full' ? 0 : 40; // full 타입이 아닐 때만 패딩 적용
        const maxHeight = windowHeight - padding;
        (popWrap as HTMLElement).style.maxHeight = `${maxHeight}px`;
      }
    }
  }, [type]);

  // 윈도우 리사이즈 시 최대 높이 재계산
  useEffect(() => {
    if (isVisible) {
      calculateMaxHeight();
      window.addEventListener('resize', calculateMaxHeight);
      return () => {
        window.removeEventListener('resize', calculateMaxHeight);
      };
    }
  }, [isVisible, calculateMaxHeight]);

  // 렌더링하지 않음
  if (!isMounted || !containerRef.current) return null;

  // 팝업 클래스 조합
  const popupClass = [
    styles.popup,
    styles[type],
    animationClass ? styles[animationClass] : '',
    className,
  ].filter(Boolean).join(' ');

  // 팝업 스타일 조합
  const popupStyle: CSSProperties = {
    ...style,
    zIndex: popupZIndex,
  };

  // 팝업 내용 스타일
  const contentStyle: CSSProperties = {};
  if (width) {
    contentStyle.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height && type !== 'full') {
    contentStyle.height = typeof height === 'number' ? `${height}px` : height;
  }

  const popupContent = (
    <div
      ref={popupRef}
      id={popupIdRef.current}
      className={popupClass}
      style={popupStyle}
      role="dialog"
      aria-hidden={!isVisible}
      aria-labelledby={titleIdRef.current}
      onClick={handleClickOutside}
      tabIndex={-1}
    >
      <article className={styles['pop-wrap']} style={contentStyle}>
        <div className={styles['pop-head']}>
          <div>
            <h1 id={titleIdRef.current}>{title}</h1>
            {showCloseButton && (
              <Button
                not
                type="button"
                className={styles['pop-close']}
                onClick={handleClose}
                aria-label="팝업창 닫기"
              />
            )}
          </div>
        </div>
        
        <div className={[styles['pop-body'], bodyClassName].filter(Boolean).join(' ')}>
          {children}
        </div>
        
        {footer && (
          <div className={[styles['pop-foot'], footerClassName].filter(Boolean).join(' ')}>
            {footer}
          </div>
        )}
      </article>
    </div>
  );

  // 포털을 통한 렌더링
  return createPortal(popupContent, containerRef.current);
};

export default Popup;
