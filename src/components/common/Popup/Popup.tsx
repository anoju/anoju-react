// src/components/common/Popup/Popup.tsx.part1
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  CSSProperties,
} from 'react';
import { isMobile } from '@/utils/device';
import { createPortal } from 'react-dom';
import PopupManager, { POPUP_PRIORITY, type PopupPriority } from './PopupManager';
import styles from '@/assets/scss/components/popup.module.scss';
import { Button } from '@/components/common';
import cx from '@/utils/cx';

export type PopupType = 'modal' | 'full' | 'bottom';

export interface PopupProps {
  id?: string;
  title?: ReactNode;
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  type?: PopupType;
  visible?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  closeOnEsc?: boolean;
  width?: string | number;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  style?: CSSProperties;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
  keyboard?: boolean;
  focusTriggerAfterClose?: boolean;
  maskClosable?: boolean;
  priority?: PopupPriority; // 팝업 우선순위 추가
}

const Popup: React.FC<PopupProps> = ({
  id,
  title = '',
  children,
  header = null,
  footer = null,
  type = 'modal',
  visible = false,
  onClose,
  onOpen,
  closeOnEsc = true,
  width,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  style,
  hideHeader = false,
  hideCloseButton = false,
  keyboard = true,
  focusTriggerAfterClose = true,
  maskClosable = true,
  priority = POPUP_PRIORITY.NORMAL, // 기본값은 일반 우선순위
}) => {
  const isMobileDevice = isMobile();

  const [isRendered, setIsRendered] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [isBeforePopup, setIsBeforePopup] = useState(false);
  const [popupZIndex, setPopupZIndex] = useState<number | undefined>(undefined);
  // baseZIndex 상태 제거 (사용하지 않음)

  const popupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleIdRef = useRef<string>(
    id ? `${id}-title` : `popup-title-${Date.now()}`
  );
  const popupIdRef = useRef<string>(
    id || `popup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isRegisteredRef = useRef<boolean>(false);

  // PopupManager 상태 변화 콜백
  const handlePopupStateChange = useCallback(
    (popupId: string, isTopPopup: boolean) => {
      if (popupId === popupIdRef.current) {
        setIsBeforePopup(!isTopPopup);
      }
    },
    []
  );

  // 팝업 열기 처리
  useEffect(() => {
    if (visible && !isRendered) {
      // 포털 컨테이너 생성
      if (!containerRef.current) {
        const container = document.createElement('div');
        container.id = `popup-container-${popupIdRef.current}`;
        document.body.appendChild(container);
        containerRef.current = container;
      }

      setIsRendered(true);
    }
  }, [visible, isRendered]);

  // 팝업이 렌더링된 직후 z-index 설정 및 PopupManager 등록
  useEffect(() => {
    if (
      isRendered &&
      popupRef.current &&
      popupZIndex === undefined &&
      !isRegisteredRef.current
    ) {
      // 팝업 매니저에 우선순위와 함께 등록
      PopupManager.register(
        popupIdRef.current,
        priority, // 우선순위 전달
        handlePopupStateChange
      );

      isRegisteredRef.current = true;

      // 최종 z-index 계산 및 설정
      const finalZIndex = PopupManager.calculateActualZIndex(
        popupIdRef.current
      );
      setPopupZIndex(finalZIndex);

      // 초기 before 상태 설정
      const isTop = PopupManager.isTopPopup(popupIdRef.current);
      setIsBeforePopup(!isTop);

      // z-index 설정 후 애니메이션 시작
      setTimeout(() => {
        setAnimationClass('show');

        // 애니메이션 완료 후 처리
        setTimeout(() => {
          onOpen?.();
        }, 300);
      }, 10); // 약간의 지연으로 z-index 적용 후 애니메이션 시작
    }
  }, [isRendered, popupZIndex, onOpen, handlePopupStateChange, priority]);

  // PopupManager 상태 변화 감지 및 업데이트
  useEffect(() => {
    if (isRegisteredRef.current) {
      // 등록 완료 후 주기적으로 상태 확인 및 업데이트
      const intervalId = setInterval(() => {
        const isTop = PopupManager.isTopPopup(popupIdRef.current);
        setIsBeforePopup(!isTop);
      }, 50); // 50ms마다 확인

      // 5초 후 인터벌 정리 (안정성을 위해)
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 5000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  // 팝업 닫기 처리
  useEffect(() => {
    if (!visible && isRendered) {
      // 닫기 애니메이션 시작
      setAnimationClass('');

      setTimeout(() => {
        setIsRendered(false);
        setPopupZIndex(undefined); // z-index 상태 초기화
        setIsBeforePopup(false); // before 상태 초기화
        isRegisteredRef.current = false; // 등록 상태 초기화

        // 팝업 매니저에서 제거
        PopupManager.unregister(popupIdRef.current);

        // 포커스 복원
        if (
          focusTriggerAfterClose &&
          previousFocusRef.current &&
          previousFocusRef.current.focus
        ) {
          previousFocusRef.current.focus();
        }

        // 콜백 실행
        onClose?.();

        // 컨테이너 제거
        if (containerRef.current) {
          containerRef.current.remove();
          containerRef.current = null;
        }
      }, 300); // 애니메이션 시간과 동일
    }
  }, [visible, isRendered, onClose, focusTriggerAfterClose]);

  // 팝업이 열릴 때 포커스 처리
  const handleFocus = useCallback(() => {
    if (isRendered && popupRef.current) {
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
  }, [isRendered]);

  // 팝업 닫기 핸들러
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // ESC 키 핸들러
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (keyboard && closeOnEsc && e.key === 'Escape' && isRendered) {
        // 현재 팝업이 최상위 팝업인지 확인
        const isTopPopup = PopupManager.isTopPopup(popupIdRef.current);
        if (isTopPopup) {
          handleClose();
        }
      }
    },
    [keyboard, closeOnEsc, isRendered, handleClose]
  );

  // 딤 영역 클릭 핸들러
  const handleDimmClick = useCallback(() => {
    if (maskClosable) {
      // 현재 팝업이 최상위 팝업인지 확인 후 닫기
      const isTopPopup = PopupManager.isTopPopup(popupIdRef.current);
      if (isTopPopup) {
        handleClose();
      }
    }
  }, [maskClosable, handleClose]);

  // 키보드 이벤트 리스너
  useEffect(() => {
    if (isRendered) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isRendered, handleKeyDown]);

  // 포커스 처리
  useEffect(() => {
    if (isRendered && animationClass === 'show' && !isBeforePopup) {
      // 최상위 팝업이고 애니메이션이 시작된 후 포커스 처리
      const timer = setTimeout(() => {
        handleFocus();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isRendered, animationClass, isBeforePopup, handleFocus]);

  // 팝업 최대 높이 계산
  const calculateMaxHeight = useCallback(() => {
    if (popupRef.current) {
      const popWrap = popupRef.current.querySelector(`.${styles['pop-wrap']}`);
      if (popWrap && type !== 'full') {
        const popupHeight = popupRef.current?.offsetHeight;
        const style = window.getComputedStyle(popupRef.current);
        const padding =
          parseInt(style.paddingTop) + parseInt(style.paddingBottom);
        const maxHeight = popupHeight - padding;
        (popWrap as HTMLElement).style.maxHeight = `${maxHeight}px`;
      }
    }
  }, [type]);

  // 윈도우 리사이즈 시 최대 높이 재계산
  useEffect(() => {
    if (isRendered) {
      calculateMaxHeight();
      window.addEventListener('resize', calculateMaxHeight);
      return () => {
        window.removeEventListener('resize', calculateMaxHeight);
      };
    }
  }, [isRendered, calculateMaxHeight]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    const currentPopupId = popupIdRef.current;
    return () => {
      // 컴포넌트가 언마운트될 때 PopupManager에서 상태 변화 콜백 제거
      PopupManager.removePopupStateChangeCallback(currentPopupId);
      // 만약 여전히 등록되어 있다면 제거
      if (isRegisteredRef.current) {
        PopupManager.unregister(currentPopupId);
      }
    };
  }, []);

  // 렌더링하지 않음
  if (!isRendered || !containerRef.current) return null;

  // 팝업 클래스 조합
  const popupClass = cx(
    styles.popup,
    styles[type],
    animationClass ? styles[animationClass] : '',
    isBeforePopup ? styles.before : '',
    className
  );

  // 팝업 스타일 조합
  const popupStyle: CSSProperties = {
    ...style,
  };

  // z-index 설정 (우선순위에 따라 결정됨)
  if (popupZIndex !== undefined) {
    popupStyle.zIndex = popupZIndex;
  }

  // 팝업 내용 스타일
  const contentStyle: CSSProperties = {};
  if (width) {
    contentStyle.width = typeof width === 'number' ? `${width}px` : width;
  }

  const popupContent = (
    <div
      ref={popupRef}
      id={popupIdRef.current}
      className={popupClass}
      style={popupStyle}
      role="dialog"
      aria-hidden={isBeforePopup && isMobileDevice ? true : undefined}
      inert={isBeforePopup && !isMobileDevice ? true : undefined}
      aria-labelledby={titleIdRef.current}
      tabIndex={hideHeader || !title ? -1 : undefined}
    >
      <div className={styles['pop-mask']} onClick={handleDimmClick} />
      <article className={cx(styles['pop-wrap'])} style={contentStyle}>
        {!hideHeader && (
          <div className={cx(styles['pop-head'], headerClassName)}>
            <div>
              {title && (
                <h1 ref={titleRef} id={titleIdRef.current} tabIndex={-1}>
                  {title}
                </h1>
              )}
              {header}
              {!hideCloseButton && (
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
        )}
        <div
          className={cx(
            styles['pop-body'],
            !hideHeader ? styles['before-head'] : '',
            footer ? styles['next-foot'] : '',
            bodyClassName
          )}
        >
          {children}
        </div>

        {footer && (
          <div className={cx(styles['pop-foot'], footerClassName)}>
            <div>{footer}</div>
          </div>
        )}
      </article>
    </div>
  );

  // 포털을 통한 렌더링
  return createPortal(popupContent, containerRef.current);
};

export default Popup;
