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
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [isBeforePopup, setIsBeforePopup] = useState(false);
  const [popupZIndex, setPopupZIndex] = useState(() => {
    // CSS 변수에서 기본 z-index 값 가져오기
    if (typeof window !== 'undefined' && window.getComputedStyle) {
      const rootStyle = getComputedStyle(document.documentElement);
      const zIndexValue = rootStyle.getPropertyValue('--pop-z-index').trim();
      const parsedValue = parseInt(zIndexValue, 10);
      return isNaN(parsedValue) ? 200 : parsedValue;
    }
    return 200; // SSR 환경에서의 기본값
  });

  const popupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleIdRef = useRef<string>(
    id ? `${id}-title` : `popup-title-${Date.now()}`
  );
  const popupIdRef = useRef<string>(id || Date.now().toString());
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 포털 컨테이너 생성 및 관리
  useEffect(() => {
    if (visible) {
      if (!containerRef.current) {
        // 컨테이너 생성
        const container = document.createElement('div');
        container.id = `popup-container-${popupIdRef.current}`;
        document.body.appendChild(container);
        containerRef.current = container;
      }

      // 팝업 매니저에 등록
      const newZIndex = PopupManager.register(popupIdRef.current);
      setPopupZIndex(newZIndex);
      setIsRendered(true);

      // 다음 프레임에서 애니메이션 시작
      setTimeout(() => {
        setAnimationClass('show');

        // 애니메이션 완료 후 처리
        setTimeout(() => {
          onOpen?.();
        }, 300);
      });
    } else if (!visible && isRendered) {
      // 닫기 애니메이션 시작
      setAnimationClass('');

      setTimeout(() => {
        setIsRendered(false);

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
  }, [visible, isRendered, onClose, onOpen, focusTriggerAfterClose]);

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
      handleClose();
    }
  }, [maskClosable, handleClose]);

  // 최상위 팝업 확인 및 before 클래스 관리
  useEffect(() => {
    if (isRendered) {
      const checkTopPopup = () => {
        const isTop = PopupManager.isTopPopup(popupIdRef.current);
        setIsBeforePopup(!isTop);
      };

      // 초기 확인
      checkTopPopup();

      // PopupManager의 변경사항을 감지하기 위한 인터벌
      const interval = setInterval(checkTopPopup, 100);

      return () => clearInterval(interval);
    }
  }, [isRendered]);

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
    if (isRendered) {
      // 약간의 지연을 주어 DOM이 완전히 렌더링된 후 포커스 처리
      const timer = setTimeout(() => {
        handleFocus();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isRendered, handleFocus]);

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
    zIndex: popupZIndex,
  };

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
      aria-hidden={!isRendered}
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
