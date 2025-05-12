// src/components/common/Tooltip.tsx
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import styles from '@/assets/scss/components/tooltip.module.scss';
import { Button } from '@/components/common';

interface TooltipProps {
  children?: ReactNode; // 툴팁 내용
  head?: ReactNode | boolean; // 툴팁 헤더 (trigger)
  className?: string;
  maxWidth?: number; // 최대 너비 (px), 기본값은 window width
  triggerClassName?: string;
  contentClassName?: string;
  btnLabel?: string; // 기본 버튼 사용 시 aria-label
  isMobile?: boolean; // 모바일 동작 모드
  bodyShow?: boolean; // 툴팁 바디 표시 여부
  setBodyShow?: (isShow: boolean) => void; // 툴팁 바디 표시 여부를 외부에서 제어하기 위한 콜백
  showTarget?: HTMLElement | null; // 툴팁이 표시될 기준 요소
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children, // 툴팁 내용
      head = true, // 기본값은 true (기본 헤더 표시)
      className = '',
      maxWidth, // 기본값은 undefined (window width)
      triggerClassName = '',
      contentClassName = '',
      btnLabel = '자세한 내용 확인',
      isMobile = false, // 기본값은 PC 모드
      bodyShow = false, // 기본값은 숨김
      setBodyShow, // 툴팁 바디 표시 여부를 외부에서 제어하기 위한 콜백
      showTarget = null, // 기본값은 null
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(bodyShow);
    const [showAnimation, setShowAnimation] = useState(false);
    const [positionClass, setPositionClass] = useState('top'); // 기본값은 top으로 설정
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const prevBodyShowRef = useRef(bodyShow);

    // bodyShow props가 변경되면 isVisible 상태도 업데이트
    useEffect(() => {
      if (bodyShow !== prevBodyShowRef.current) {
        if (bodyShow) {
          setIsVisible(true);
          // 애니메이션을 위한 약간의 지연
          requestAnimationFrame(() => {
            adjustPositionRef.current();
            setTimeout(() => {
              setShowAnimation(true);
            }, 20);
          });
        } else {
          setShowAnimation(false);
          // 애니메이션이 완료된 후 완전히 숨김
          setTimeout(() => {
            setIsVisible(false);
          }, 300);
        }
        prevBodyShowRef.current = bodyShow;
      }
    }, [bodyShow]);

    // adjustPosition 함수를 저장할 ref
    const adjustPositionRef = useRef<() => void>(() => {});

    // 툴팁 위치 조정 함수 정의
    // (adjustPosition 함수는 여기서 정의하고 ref에 저장하여 다른 후크에서 사용함)
    useLayoutEffect(() => {
      // 이 함수는 매번 렌더링할 때마다 재정의되지만, ref에 저장되어 순환 의존성 문제를 피함
      adjustPositionRef.current = () => {
        if (!bodyRef.current || !arrowRef.current) return;

        // 기준 요소 결정: 헤더가 있으면 헤더, 없으면 showTarget 사용
        let targetElement: DOMRect;
        if (head !== false && triggerRef.current) {
          targetElement = triggerRef.current.getBoundingClientRect();
        } else if (showTarget) {
          targetElement = showTarget.getBoundingClientRect();
        } else {
          return; // 기준 요소가 없으면 조정하지 않음
        }

        const tooltipBody = bodyRef.current;
        const arrow = arrowRef.current;

        // 툴팁 너비 설정
        // maxWidth 옵션이 설정된 경우 해당 값을 사용, 아니면 window width - 20px
        const windowWidth = window.innerWidth - 20; // 여백 10px씩
        const tooltipMaxWidth = maxWidth
          ? Math.min(maxWidth, windowWidth)
          : windowWidth;
        tooltipBody.style.maxWidth = `${tooltipMaxWidth}px`;

        // 기본 위치 설정 (target 요소의 중앙)
        const targetCenterX = targetElement.left + targetElement.width / 2;

        // 툴팁이 보이게 함
        tooltipBody.classList.add(styles.show);

        // 실제 크기를 가져오기 위해 DOM 측정
        const bodyWidth = tooltipBody.offsetWidth;

        let leftPos = targetCenterX - bodyWidth / 2;

        // 윈도우 왼쪽 경계 체크
        if (leftPos < 10) {
          leftPos = 10;
        }

        // 윈도우 오른쪽 경계 체크
        if (leftPos + bodyWidth > window.innerWidth - 10) {
          leftPos = window.innerWidth - bodyWidth - 10;
        }

        tooltipBody.style.left = `${leftPos}px`;

        // 화살표 위치 조정 (항상 target의 중앙에)
        const arrowLeftPos = targetCenterX - leftPos;
        arrow.style.left = `${arrowLeftPos}px`;

        // 세로 위치 결정 (하단 표시가 기본, 공간 부족시 상단으로)
        const spaceBelow = window.innerHeight - targetElement.bottom;
        const tooltipHeight = tooltipBody.offsetHeight;
        const needsTopPosition = spaceBelow < tooltipHeight + 10;

        // 현재 설정된 position 속성과 실제 필요한 위치가 다른 경우 변경
        const newPositionClass = needsTopPosition ? 'bottom' : 'top';
        if (positionClass !== newPositionClass) {
          setPositionClass(newPositionClass);
        }

        // 세로 위치 적용
        if (needsTopPosition) {
          // 위에 표시
          tooltipBody.style.top = `${targetElement.top - tooltipHeight}px`;
        } else {
          // 아래에 표시
          tooltipBody.style.top = `${targetElement.bottom}px`;
        }
      };
      // 필요한 모든 값들을 이 후크의 의존성에 포함하여 최신 값으로 유지
    }, [head, maxWidth, showTarget, positionClass]);

    // 툴팁 표시
    const showTooltip = useCallback(() => {
      if (isVisible) return;

      setIsVisible(true);

      // DOM 업데이트 후 애니메이션 적용 및 위치 조정
      requestAnimationFrame(() => {
        adjustPositionRef.current();
        // 애니메이션을 위한 약간의 지연
        setTimeout(() => {
          setShowAnimation(true);
        }, 20);
      });
    }, [isVisible]);

    // 툴팁 숨기기
    const hideTooltip = useCallback(() => {
      setShowAnimation(false);
      // 애니메이션이 완료된 후 완전히 숨김
      setTimeout(() => {
        setIsVisible(false);
        // 외부 상태 업데이트 콜백이 제공된 경우 호출
        if (setBodyShow && bodyShow) {
          setBodyShow(false);
        }
      }, 300);
    }, [setBodyShow, bodyShow]);

    // 외부 클릭 감지 - document.body에 이벤트 리스너 추가
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        // 이벤트가 툴팁 내부에서 발생했는지 확인
        if (
          tooltipRef.current &&
          bodyRef.current &&
          isVisible &&
          // 툴팁 컨테이너나 바디가 클릭 이벤트를 포함하지 않는 경우
          !tooltipRef.current.contains(event.target as Node) &&
          !bodyRef.current.contains(event.target as Node)
        ) {
          hideTooltip();
        }
      };

      // 캡처 단계에서 이벤트 처리 (버블링 이벤트보다 먼저 실행)
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }, [hideTooltip, isVisible]);

    // body 내부 클릭 이벤트 전파 중지 (툴팁 유지 위함)
    const handleBodyClick = useCallback((e: React.MouseEvent) => {
      // 툴팁 내부 클릭 시 이벤트 전파 중지
      e.stopPropagation();
    }, []);

    // 윈도우 크기 변경 시 위치 조정
    useEffect(() => {
      if (!isVisible) return;

      const handleResize = (): void => {
        adjustPositionRef.current();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [isVisible]);

    // 스크롤 시 위치 조정
    useEffect(() => {
      if (!isVisible) return;

      const handleScroll = (): void => {
        adjustPositionRef.current();
      };

      window.addEventListener('scroll', handleScroll, true);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
      };
    }, [isVisible]);

    // showTarget이 변경되면 위치 조정
    useEffect(() => {
      if (isVisible && showTarget) {
        // 약간 지연시켜 DOM이 완전히 업데이트된 후 실행
        setTimeout(() => adjustPositionRef.current(), 0);
      }
    }, [showTarget, isVisible]);

    // 초기 표시 시 위치 설정
    useEffect(() => {
      if (isVisible) {
        // 첫 렌더링 시 위치 조정
        adjustPositionRef.current();

        // 약간의 지연 후 다시 조정 (더 안정적인 위치 계산)
        setTimeout(() => adjustPositionRef.current(), 50);
      }
    }, [isVisible]);

    // 기본 헤더 렌더링 (i 아이콘)
    const defaultHead = useMemo(
      () => (
        <Button
          not
          className={`${styles['tooltip-btn']} ${triggerClassName}`}
          aria-label={btnLabel}
        >
          <i className={styles['i-ico-tooltip']} aria-hidden="true" />
        </Button>
      ),
      [triggerClassName, btnLabel]
    );

    // 툴팁 내용 클래스
    const tooltipBodyClass = [
      styles['tooltip-body'],
      styles[positionClass],
      isVisible ? styles.show : '',
      showAnimation ? styles.open : '',
      contentClassName,
    ]
      .filter(Boolean)
      .join(' ');

    // 헤더 이벤트 핸들러
    const handleHeadMouseEnter = useCallback(() => {
      if (!isMobile) {
        showTooltip();
      }
    }, [isMobile, showTooltip]);

    const handleHeadMouseLeave = useCallback(() => {
      if (!isMobile) {
        hideTooltip();
      }
    }, [isMobile, hideTooltip]);

    const handleHeadClick = useCallback(() => {
      if (isMobile) {
        if (isVisible) {
          hideTooltip();
        } else {
          showTooltip();
        }
      }
    }, [isMobile, isVisible, showTooltip, hideTooltip]);

    return (
      <div
        ref={(node) => {
          // ref를 처리하고 tooltipRef에도 할당
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          tooltipRef.current = node;
        }}
        className={`${styles['tooltip-wrap']} ${className}`}
        // head가 있고 모바일 모드가 아닐 때 전체 래퍼에 마우스 이벤트 적용
        onMouseEnter={
          !isMobile && head !== false ? handleHeadMouseEnter : undefined
        }
        onMouseLeave={
          !isMobile && head !== false ? handleHeadMouseLeave : undefined
        }
      >
        {head !== false && (
          <div
            ref={triggerRef}
            className={styles['tooltip-head']}
            onClick={handleHeadClick} // 클릭 이벤트는 헤더에만 유지 (모바일 모드용)
          >
            {head === true ? defaultHead : head}
          </div>
        )}

        {isVisible && (
          <div
            ref={bodyRef}
            className={tooltipBodyClass}
            role="tooltip"
            onClick={handleBodyClick} // 내부 클릭 시 이벤트 전파 방지
          >
            <i ref={arrowRef} className={styles['tooltip-arr']} />
            <div className={styles['tooltip-inner']}>
              {children}
              {isMobile && (
                <button
                  type="button"
                  className={styles['tooltip-close']}
                  onClick={hideTooltip}
                  aria-label="툴팁 닫기"
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
