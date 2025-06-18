// src/components/common/Dropdown.tsx
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  ReactNode,
  CSSProperties,
  cloneElement,
  isValidElement,
  ReactElement,
  MouseEventHandler,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import styles from '@/assets/scss/components/dropdown.module.scss';

// 배치 타입 정의
type PlacementType = 'top' | 'bottom' | 'auto';

// 트리거 타입 정의
type TriggerType = 'click' | 'hover' | 'focus' | 'contextMenu';

// 드롭다운 Props 인터페이스
interface DropdownProps {
  children: ReactNode; // 드롭다운 내용
  trigger: ReactNode; // 드롭다운을 여는 트리거 요소
  triggerType?: TriggerType | TriggerType[]; // 트리거 방식 (기본값: 'click')
  visible?: boolean; // 드롭다운 표시 여부 (외부 제어)
  onVisibleChange?: (visible: boolean) => void; // 표시 상태 변경 콜백
  placement?: PlacementType; // 위치 (auto는 자동 조정)
  disabled?: boolean; // 비활성화
  className?: string; // 드롭다운 래퍼 클래스
  overlayClassName?: string; // 오버레이 클래스
  overlayStyle?: CSSProperties; // 오버레이 스타일
  getPopupContainer?: () => HTMLElement; // 드롭다운이 렌더링될 컨테이너
  autoAdjustOverflow?: boolean; // 자동 위치 조정 여부
  destroyPopupOnHide?: boolean; // 숨김 시 팝업 DOM 제거
  followScroll?: boolean; // 스크롤시 따라가기 여부 (기본 false)
  minWidth?: number; // 최소 너비
  maxWidth?: number; // 최대 너비
  offset?: [number, number]; // [x, y] 오프셋
  mouseEnterDelay?: number; // 마우스 진입 지연 시간 (ms)
  mouseLeaveDelay?: number; // 마우스 이탈 지연 시간 (ms)
}

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  const id = `dropdown_${uniqueIdCounter++}_${Math.random().toString(36).substring(2, 9)}`;
  return id;
};

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      children,
      trigger,
      triggerType = 'click',
      visible: controlledVisible,
      onVisibleChange,
      placement = 'auto',
      disabled = false,
      className = '',
      overlayClassName = '',
      overlayStyle = {},
      getPopupContainer,
      autoAdjustOverflow = true,
      destroyPopupOnHide = false,
      followScroll = false,
      minWidth,
      maxWidth,
      offset = [0, 0],
      mouseEnterDelay = 100,
      mouseLeaveDelay = 100,
    },
    ref
  ) => {
    // 내부 상태 관리
    const [internalVisible, setInternalVisible] = useState(false);
    const [currentPlacement, setCurrentPlacement] = useState<'top' | 'bottom'>(
      'bottom'
    );

    // visible 상태 결정 (외부 제어 우선)
    const isVisible =
      controlledVisible !== undefined ? controlledVisible : internalVisible;

    // 참조 생성
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const idRef = useRef<string>(generateUniqueId());
    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
    const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 트리거 타입 배열 변환 (useMemo로 최적화)
    const triggerTypes = useMemo(() => {
      return Array.isArray(triggerType) ? triggerType : [triggerType];
    }, [triggerType]);

    // 드롭다운 표시/숨김 함수
    const setVisible = useCallback(
      (visible: boolean) => {
        if (disabled) return;

        if (controlledVisible === undefined) {
          setInternalVisible(visible);
        }

        onVisibleChange?.(visible);
      },
      [controlledVisible, onVisibleChange, disabled]
    );

    // 위치 계산 및 조정 함수
    const adjustPosition = useCallback(() => {
      if (!isVisible || !triggerRef.current || !contentRef.current) return;

      const trigger = triggerRef.current;
      const content = contentRef.current;
      const triggerRect = trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      // 스크롤 위치 고려
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      // 기본 위치 계산
      let left = triggerRect.left + scrollLeft + offset[0];
      let top: number;
      let actualPlacement: 'top' | 'bottom' = 'bottom';

      // placement에 따른 초기 위치 설정
      if (placement === 'top') {
        top = triggerRect.top - content.offsetHeight - offset[1];
        actualPlacement = 'top';
      } else if (placement === 'bottom') {
        top = triggerRect.bottom + offset[1];
        actualPlacement = 'bottom';
      } else {
        // auto: 공간이 더 많은 쪽으로 배치
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        if (autoAdjustOverflow) {
          if (spaceBelow >= content.offsetHeight || spaceBelow >= spaceAbove) {
            top = triggerRect.bottom + offset[1];
            actualPlacement = 'bottom';
          } else {
            top = triggerRect.top - content.offsetHeight - offset[1];
            actualPlacement = 'top';
          }
        } else {
          top = triggerRect.bottom + offset[1];
          actualPlacement = 'bottom';
        }
      }

      // 좌우 경계 체크 및 조정
      const windowWidth = window.innerWidth;
      const contentWidth = contentRect.width;

      if (left + contentWidth > windowWidth - 10) {
        left = windowWidth - contentWidth - 10;
      }

      if (left < 10) {
        left = 10;
      }

      // 상하 경계 체크 (auto 모드에서만)
      if (autoAdjustOverflow && placement === 'auto') {
        const windowHeight = window.innerHeight;

        if (
          actualPlacement === 'bottom' &&
          top + content.offsetHeight > windowHeight + scrollTop - 10
        ) {
          // 아래쪽 공간이 부족하면 위로
          const newTop = triggerRect.top - content.offsetHeight - offset[1];
          if (newTop >= scrollTop + 10) {
            top = newTop;
            actualPlacement = 'top';
          }
        } else if (actualPlacement === 'top' && top < scrollTop + 10) {
          // 위쪽 공간이 부족하면 아래로
          top = triggerRect.bottom + offset[1];
          actualPlacement = 'bottom';
        }
      }

      // 크기 조정
      const style: CSSProperties = {
        left: `${left}px`,
        top: `${top}px`,
        ...overlayStyle,
      };

      if (minWidth) {
        style.minWidth = `${minWidth}px`;
      }

      if (maxWidth) {
        style.maxWidth = `${maxWidth}px`;
      }

      // 트리거와 같은 너비로 설정하는 옵션 (필요시)
      if (!minWidth && !maxWidth) {
        style.minWidth = `${triggerRect.width}px`;
      }

      // 스타일 적용
      Object.assign(content.style, style);

      // placement 클래스 업데이트
      if (currentPlacement !== actualPlacement) {
        setCurrentPlacement(actualPlacement);
      }
    }, [
      isVisible,
      placement,
      autoAdjustOverflow,
      offset,
      overlayStyle,
      minWidth,
      maxWidth,
      currentPlacement,
    ]);

    // 트리거 클릭 핸들러
    const handleTriggerClick = useCallback(
      (e: React.MouseEvent) => {
        if (!triggerTypes.includes('click')) return;

        e.preventDefault();
        e.stopPropagation();

        if (disabled) return;

        setVisible(!isVisible);
      },
      [disabled, isVisible, setVisible, triggerTypes]
    );

    // 마우스 진입 핸들러
    const handleMouseEnter = useCallback(() => {
      if (!triggerTypes.includes('hover') || disabled) return;

      // 나가기 타이머 취소
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }

      // 진입 타이머 설정
      hoverTimerRef.current = setTimeout(() => {
        setVisible(true);
      }, mouseEnterDelay);
    }, [triggerTypes, disabled, setVisible, mouseEnterDelay]);

    // 마우스 이탈 핸들러
    const handleMouseLeave = useCallback(() => {
      if (!triggerTypes.includes('hover') || disabled) return;

      // 진입 타이머 취소
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }

      // 이탈 타이머 설정
      leaveTimerRef.current = setTimeout(() => {
        setVisible(false);
      }, mouseLeaveDelay);
    }, [triggerTypes, disabled, setVisible, mouseLeaveDelay]);

    // 포커스 핸들러
    const handleFocus = useCallback(() => {
      if (!triggerTypes.includes('focus') || disabled) return;
      setVisible(true);
    }, [triggerTypes, disabled, setVisible]);

    // 블러 핸들러 (수정된 버전)
    const handleBlur = useCallback(() => {
      if (!triggerTypes.includes('focus') || disabled) return;

      // 포커스가 드롭다운 영역을 완전히 벗어났는지 확인
      setTimeout(() => {
        const focusedElement = document.activeElement;
        const isInsideDropdown = contentRef.current?.contains(
          focusedElement as Node
        );
        const isInsideTrigger = triggerRef.current?.contains(
          focusedElement as Node
        );

        if (!isInsideDropdown && !isInsideTrigger) {
          setVisible(false);
        }
      }, 0);
    }, [triggerTypes, disabled, setVisible]);

    // 컸텍스트 메뉴 핸들러
    const handleContextMenu = useCallback(
      (e: React.MouseEvent) => {
        if (!triggerTypes.includes('contextMenu') || disabled) return;
        e.preventDefault();
        setVisible(!isVisible);
      },
      [triggerTypes, disabled, isVisible, setVisible]
    );

    // 드롭다운 컨텐츠의 마우스 진입 핸들러
    const handleContentMouseEnter = useCallback(() => {
      if (!triggerTypes.includes('hover') || disabled) return;

      // 나가기 타이머 취소
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
    }, [triggerTypes, disabled]);

    // 드롭다운 컨텐츠의 마우스 이탈 핸들러
    const handleContentMouseLeave = useCallback(() => {
      if (!triggerTypes.includes('hover') || disabled) return;

      // 이탈 타이머 설정
      leaveTimerRef.current = setTimeout(() => {
        setVisible(false);
      }, mouseLeaveDelay);
    }, [triggerTypes, disabled, setVisible, mouseLeaveDelay]);

    // 외부 클릭 감지
    useEffect(() => {
      if (!isVisible) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(target) &&
          contentRef.current &&
          !contentRef.current.contains(target)
        ) {
          setVisible(false);
        }
      };

      // 약간의 지연 후 이벤트 리스너 추가 (현재 클릭 이벤트와 충돌 방지)
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isVisible, setVisible]);

    // ESC 키 감지
    useEffect(() => {
      if (!isVisible) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setVisible(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isVisible, setVisible]);

    // 스크롤 감지
    useEffect(() => {
      if (!isVisible) return;

      const handleScroll = () => {
        if (followScroll) {
          // 스크롤시 위치 재조정
          adjustPosition();
        } else {
          // 스크롤시 드롭다운 닫기
          setVisible(false);
        }
      };

      window.addEventListener('scroll', handleScroll, true);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
      };
    }, [isVisible, followScroll, adjustPosition, setVisible]);

    // 리사이즈 감지
    useEffect(() => {
      if (!isVisible) return;

      const handleResize = () => {
        adjustPosition();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [isVisible, adjustPosition]);

    // visible 상태 변경시 위치 조정
    useEffect(() => {
      if (isVisible) {
        // DOM 업데이트 후 위치 조정
        const timer = setTimeout(() => {
          adjustPosition();
        }, 0);

        return () => clearTimeout(timer);
      }
    }, [isVisible, adjustPosition]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
      return () => {
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
        }
        if (leaveTimerRef.current) {
          clearTimeout(leaveTimerRef.current);
        }
      };
    }, []);

    // 트리거 요소에 이벤트 추가
    const enhancedTrigger = isValidElement(trigger)
      ? cloneElement(
          trigger as ReactElement<{
            onClick?: MouseEventHandler<Element>;
            onMouseEnter?: () => void;
            onMouseLeave?: () => void;
            onFocus?: () => void;
            onBlur?: () => void;
            onContextMenu?: (e: React.MouseEvent) => void;
            'aria-expanded'?: boolean;
            'aria-haspopup'?:
              | boolean
              | 'true'
              | 'false'
              | 'menu'
              | 'listbox'
              | 'tree'
              | 'grid'
              | 'dialog';
            'aria-controls'?: string;
          }>,
          {
            onClick: (e: React.MouseEvent) => {
              // 기존 onClick이 있으면 먼저 실행
              const triggerElement = trigger as ReactElement<{
                onClick?: MouseEventHandler<Element>;
              }>;
              const originalOnClick = triggerElement.props.onClick;
              if (originalOnClick) {
                originalOnClick(e);
              }

              // 드롭다운 토글
              if (!e.defaultPrevented) {
                handleTriggerClick(e);
              }
            },
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onContextMenu: handleContextMenu,
            'aria-expanded': isVisible,
            'aria-haspopup': 'true' as const,
            'aria-controls': idRef.current,
          }
        )
      : trigger;

    // 드롭다운 내용 렌더링
    const renderDropdownContent = () => {
      if (!isVisible && destroyPopupOnHide) {
        return null;
      }

      const contentClasses = [
        styles['dropdown-content'],
        styles[`placement-${currentPlacement}`],
        isVisible ? styles.visible : '',
        overlayClassName,
      ]
        .filter(Boolean)
        .join(' ');

      return (
        <div
          ref={contentRef}
          className={contentClasses}
          style={{
            display: isVisible || !destroyPopupOnHide ? 'block' : 'none',
            ...overlayStyle,
          }}
          id={idRef.current}
          role="menu"
          aria-hidden={!isVisible}
          onMouseEnter={handleContentMouseEnter} // hover 모드에서 마우스 진입 시 드롭다운 유지
          onMouseLeave={handleContentMouseLeave} // hover 모드에서 마우스 이탈 시 드롭다운 닫기
          onFocus={handleFocus} // focus 모드에서 포커스 진입 시 드롭다운 유지
          onBlur={handleBlur} // focus 모드에서 포커스 이탈 시 드롭다운 닫기
          tabIndex={-1} // 포커스 가능하도록 설정
          onClick={(e) => e.stopPropagation()} // 내부 클릭시 이벤트 전파 방지
        >
          {children}
        </div>
      );
    };

    // 컨테이너 결정
    const getContainer = useCallback(() => {
      if (getPopupContainer) {
        return getPopupContainer();
      }
      return document.body;
    }, [getPopupContainer]);

    return (
      <div
        ref={(node) => {
          // ref 처리
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          dropdownRef.current = node;
        }}
        className={`${styles.dropdown} ${className}`}
      >
        <div
          ref={triggerRef}
          className={`${styles['dropdown-trigger']} ${disabled ? styles.disabled : ''}`}
        >
          {enhancedTrigger}
        </div>

        {/* Portal을 사용해서 드롭다운 내용을 body에 렌더링 */}
        {createPortal(renderDropdownContent(), getContainer())}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
