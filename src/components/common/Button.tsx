// src/components/common/Button.tsx
// 프로젝트 내에서 이동시 to 속성 사용
// 외부링크 이동시 anchor + href 속성 사용
// 스크롤 이동시 toScroll 속성 사용
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from '@/assets/scss/components/button.module.scss';
import stickyStyles from '@/assets/scss/components/sticky.module.scss';
import { getStickyHeightForScroll } from '@/utils/stickyUtils';

// 객체에서 특정 키들을 제외한 새로운 객체를 반환하는 유틸리티 함수
function omitProps<T, K extends keyof T>(obj: T, keysToOmit: K[]): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>;
  keysToOmit.forEach((key) => {
    delete result[key as string];
  });
  return result as Omit<T, K>;
}

// 터치 이벤트 인터페이스
interface TouchList {
  length: number;
  [index: number]: { clientX: number; clientY: number };
}

interface CustomTouchEvent {
  touches: TouchList;
}

// 버튼 사이즈 타입 정의
type ButtonSize = 'xs' | 'sm' | '' | 'lg' | 'xl';

// 버튼 효과 타입 정의
type ButtonEffect =
  | 'ripple'
  | 'pulse'
  | 'scale'
  | 'shadow'
  | 'rotate'
  | 'shake'
  | 'jello'
  | false;

// 리플 효과 타입 정의
interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: number;
}

// 스크롤 관련 타입 정의
interface ScrollToOptions {
  target: string;
  offset?: number;
  duration?: number;
  eventTarget: HTMLElement;
}

// 스크롤 유틸리티 함수 - sticky 높이를 고려한 스크롤 (Tabs와 동일한 로직)
function scrollToElementWithStickyOffset(
  element: HTMLElement,
  spyOffset: number = 0,
  eventTarget: HTMLElement
): void {
  const elementRect = element.getBoundingClientRect();
  const elementTop = window.pageYOffset + elementRect.top;

  // 목표 스크롤 위치 계산
  const targetScrollY = elementTop - spyOffset;

  // 스크롤 방향에 따른 sticky 높이 가져오기
  const stickyHeight = getStickyHeightForScroll(targetScrollY);

  // 최종 스크롤 위치 (sticky 높이 + 추가 오프셋 고려)
  let finalScrollY = targetScrollY - stickyHeight;

  const stickyElement = eventTarget.closest(
    `.${stickyStyles['sticky-wrap']}`
  ) as HTMLElement | null;
  if (
    stickyElement &&
    !stickyElement.classList.contains(stickyStyles['fixed'])
  ) {
    finalScrollY = finalScrollY - stickyElement.offsetHeight;
  }

  window.scrollTo({
    top: Math.max(0, finalScrollY), // 음수 방지
    behavior: 'smooth',
  });
}

// 공통 속성 타입 정의
type CommonButtonProps = {
  size?: ButtonSize;
  not?: boolean; // 'not' prop 추가
  effect?: ButtonEffect; // 버튼 효과 옵션
  toScroll?: string; // 스크롤할 대상 요소의 ID나 선택자
  scrollOffset?: number; // 스크롤 오프셋 (기본값: 0)
  scrollDuration?: number; // 스크롤 애니메이션 지속시간 (기본값: 500ms)
  activeClassName?: string; // 활성화 시 추가할 클래스명
  onScrollToTarget?: (target: string) => void; // 스크롤 시 콜백
};

type ButtonProps =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & CommonButtonProps)
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      anchor?: boolean;
    } & CommonButtonProps)
  | ({ to: string } & Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      'href'
    > &
      CommonButtonProps)
  | ({ toScroll: string } & React.AnchorHTMLAttributes<HTMLAnchorElement> &
      CommonButtonProps);

// 스크롤 유틸리티 함수들
const scrollUtils = {
  // ID나 선택자로 요소 찾기
  getElementByScrollTarget: (target: string): HTMLElement | null => {
    // # 으로 시작하면 ID로 처리
    if (target.startsWith('#')) {
      return document.getElementById(target.slice(1));
    }
    // 그 외에는 querySelector로 처리
    return document.querySelector(target);
  },

  // 요소가 뷰포트에 있는지 확인 (활성화 상태 판단용) - sticky 높이 고려
  isElementInViewport: (element: HTMLElement, offset: number = 0): boolean => {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // sticky 높이 계산
    const currentScrollY =
      window.pageYOffset || document.documentElement.scrollTop;
    const stickyHeight = getStickyHeightForScroll(currentScrollY);

    // sticky 높이를 고려한 최종 오프셋
    const finalOffset = offset + stickyHeight;

    // 더 관대한 조건으로 변경: 요소의 일부라도 뷰포트에 보이면 활성화
    // 요소의 하단이 뷰포트 상단 + offset보다 아래에 있고
    // 요소의 상단이 뷰포트 하단 - offset보다 위에 있으면 뷰포트에 있는 것으로 판단
    return rect.bottom >= finalOffset && rect.top <= windowHeight - finalOffset;
  },

  // 부드러운 스크롤 함수 - sticky 높이를 고려한 버전으로 교체
  scrollToElement: (options: ScrollToOptions): Promise<void> => {
    return new Promise((resolve) => {
      const { target, offset = 0, eventTarget } = options;
      const targetElement = scrollUtils.getElementByScrollTarget(target);

      if (!targetElement) {
        console.warn(`스크롤 대상을 찾을 수 없습니다: ${target}`);
        resolve();
        return;
      }

      // Tabs와 동일한 sticky 스크롤 함수 사용
      scrollToElementWithStickyOffset(targetElement, offset, eventTarget);

      // 스크롤 완료를 기다리기 위한 타이머 (smooth 스크롤은 Promise를 반환하지 않음)
      setTimeout(() => {
        resolve();
      }, options.duration || 500);
    });
  },

  // 현재 활성화된 스크롤 대상 찾기
  getCurrentActiveTarget: (
    targets: string[],
    offset: number = 0
  ): string | null => {
    // 역순으로 확인해서 가장 아래 있는 요소를 우선적으로 활성화
    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      const element = scrollUtils.getElementByScrollTarget(target);

      if (element && scrollUtils.isElementInViewport(element, offset)) {
        return target;
      }
    }
    return null;
  },
};

const Button = React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [isScrollActive, setIsScrollActive] = useState(false);
  const nextRippleId = useRef(0);
  const scrollCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // 스크롤 활성화 상태 확인
  const checkScrollActiveState = useCallback(() => {
    if (!props.toScroll) return;

    const element = scrollUtils.getElementByScrollTarget(props.toScroll);
    if (element) {
      const isActive = scrollUtils.isElementInViewport(
        element,
        props.scrollOffset || 0
      );

      // 디버깅용 로그 (개발 중에만 사용)
      // if (process.env.NODE_ENV === 'development') {
      //   const rect = element.getBoundingClientRect();
      //   const currentScrollY =
      //     window.pageYOffset || document.documentElement.scrollTop;
      //   const stickyHeight = getStickyHeightForScroll(currentScrollY);
      //   console.log('Button Scroll check:', {
      //     target: props.toScroll,
      //     isActive,
      //     currentActive: isScrollActive,
      //     elementTop: rect.top,
      //     elementBottom: rect.bottom,
      //     windowHeight: window.innerHeight,
      //     userOffset: props.scrollOffset || 0,
      //     stickyHeight,
      //     finalOffset: (props.scrollOffset || 0) + stickyHeight,
      //   });
      // }

      if (isActive !== isScrollActive) {
        setIsScrollActive(isActive);
      }
    }
  }, [props.toScroll, props.scrollOffset, isScrollActive]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    if (!props.toScroll) {
      setIsScrollActive(false);
      return;
    }

    let rafId: number;

    // requestAnimationFrame을 사용한 스크롤 이벤트 핸들러
    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        checkScrollActiveState();
      });
    };

    // 리사이즈 이벤트 핸들러
    const handleResize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        checkScrollActiveState();
      });
    };

    // 초기 상태 확인
    checkScrollActiveState();

    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // 주기적으로 상태 확인 (동적 콘텐츠 변경 대응)
    scrollCheckInterval.current = setInterval(checkScrollActiveState, 500); // 500ms로 더 빠르게

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollCheckInterval.current) {
        clearInterval(scrollCheckInterval.current);
      }
    };
  }, [props.toScroll, props.scrollOffset, checkScrollActiveState]);

  // 사라지는 리플 제거
  useEffect(() => {
    if (ripples.length > 0) {
      const timeoutId = setTimeout(() => {
        setRipples([]);
      }, 800); // 애니메이션 시간보다 조금 길게 설정

      return () => clearTimeout(timeoutId);
    }
  }, [ripples]);

  // 이펙트 효과 적용 여부 확인
  const hasEffect = props.effect !== undefined ? props.effect : 'ripple';

  // 버튼 클래스명 생성 함수
  const getButtonClasses = (
    className?: string,
    size?: ButtonSize,
    not?: boolean,
    effect?: ButtonEffect,
    isScrollActive?: boolean,
    activeClassName?: string
  ) => {
    // not 속성이 true이면 className만 반환
    if (not) {
      return className;
    }

    const classes = [
      styles.button,
      size && styles[size], // size 클래스 추가
      effect === 'pulse' && styles['button-pulse'],
      effect === 'shadow' && styles['button-shadow'],
      effect === 'rotate' && styles['button-rotate'],
      effect === 'shake' && styles['button-shake'],
      effect === 'jello' && styles['button-jello'],
      isScrollActive && activeClassName, // 스크롤 활성화 시 추가 클래스
      isScrollActive && styles['scroll-active'], // 기본 스크롤 활성화 클래스
      className,
    ].filter(Boolean);

    return classes.join(' ');
  };

  // 리플 효과 생성 함수
  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    // effect가 'ripple'이 아니면 리플 효과를 적용하지 않음
    if (hasEffect !== 'ripple' || (props as { not?: boolean }).not) {
      return;
    }

    const target = event.currentTarget || event.target;

    // currentTarget이 null인 경우 에러 방지
    if (!target) {
      console.warn('Button createRipple: currentTarget is null');
      return;
    }

    const rect = target.getBoundingClientRect();

    // 모바일 터치 이벤트인지 확인
    const nativeEvent = event.nativeEvent;
    const isTouchEvent = 'touches' in nativeEvent;

    // X, Y 좌표 가져오기
    let pageX: number;
    let pageY: number;

    if (isTouchEvent) {
      // touches 속성이 있는 경우 터치 이벤트로 처리
      const touchEvent = nativeEvent as CustomTouchEvent;
      if (touchEvent.touches.length > 0) {
        pageX = touchEvent.touches[0].clientX;
        pageY = touchEvent.touches[0].clientY;
      } else {
        // 터치가 없는 경우 기본 좌표 사용
        pageX = event.clientX;
        pageY = event.clientY;
      }
    } else {
      // 마우스 이벤트
      pageX = event.clientX;
      pageY = event.clientY;
    }

    const x = pageX - rect.left;
    const y = pageY - rect.top;

    // 대각선 계산을 통한 버튼 크기 가져오기
    const size = Math.max(
      Math.max(rect.width, rect.height) * 1.5, // 버튼의 가장 큰 측면 1.5배
      Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) * 1.1 // 대각선 길이의 1.1배
    );

    const newRipple: RippleEffect = {
      x,
      y,
      size,
      id: nextRippleId.current,
    };

    nextRippleId.current += 1;
    setRipples([newRipple]);
  };

  // 크기 확대/축소 효과 함수
  const handleScaleEffect = (element: HTMLElement) => {
    if (hasEffect === 'scale') {
      // 기존 애니메이션 제거
      element.classList.remove(styles['button-scale']);

      // 강제 리플로우를 트리거해 애니메이션 리셋
      void element.offsetWidth;

      // 애니메이션 클래스 추가
      element.classList.add(styles['button-scale']);
    }
  };

  // 스크롤 함수 (sticky 높이 고려)
  const handleScrollTo = async (target: string, eventTarget: HTMLElement) => {
    try {
      await scrollUtils.scrollToElement({
        target,
        offset: props.scrollOffset || 0,
        duration: props.scrollDuration || 500,
        eventTarget,
      });

      // 스크롤 완료 후 콜백 실행
      if (props.onScrollToTarget) {
        props.onScrollToTarget(target);
      }
    } catch (error) {
      console.error('스크롤 중 오류 발생:', error);
    }
  };

  // to 속성이 있으면 Link
  if ('to' in props && props.to) {
    const {
      to,
      children,
      className,
      size,
      not,
      effect,
      onClick,
      activeClassName,
    } = props;

    // Link에서 지원하지 않는 속성들 제거
    const rest = omitProps(props, [
      'to',
      'children',
      'className',
      'size',
      'not',
      'effect',
      'onClick',
      'activeClassName',
      'target',
      'toScroll',
      'scrollOffset',
      'scrollDuration',
      'onScrollToTarget',
    ]);

    // 클릭 이벤트 핸들러
    const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      createRipple(e);

      // scale 효과 적용
      if (hasEffect === 'scale') {
        handleScaleEffect(e.currentTarget);
      }

      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Link
        to={to}
        className={getButtonClasses(
          className,
          size,
          not,
          effect,
          isScrollActive,
          activeClassName
        )}
        onClick={handleLinkClick}
        {...rest}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
        {hasEffect === 'ripple' &&
          !not &&
          ripples.map((ripple) => (
            <span
              key={ripple.id}
              className={styles.ripple}
              style={{
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}
      </Link>
    );
  }

  // toScroll이 있으면 anchor 모드로 처리 (a 태그)
  if (props.toScroll || 'anchor' in props || 'href' in props) {
    const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement> &
      CommonButtonProps & {
        anchor?: boolean;
      };

    const {
      href,
      target,
      onClick,
      children,
      className,
      size,
      not,
      effect,
      toScroll,
      activeClassName,
    } = anchorProps;

    // DOM에 전달하지 않을 커스텀 속성들 제거
    const rest = omitProps(anchorProps, [
      'href',
      'target',
      'onClick',
      'children',
      'className',
      'size',
      'not',
      'effect',
      'toScroll',
      'activeClassName',
      'anchor',
      'scrollOffset',
      'scrollDuration',
      'onScrollToTarget',
    ]);

    // toScroll이 있으면 href 설정, 없으면 기본값 '#'
    const finalHref = toScroll || href || '#';

    const handleClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      // toScroll이 있으면 스크롤 우선 실행
      if (toScroll) {
        e.preventDefault();
        const eventTarget = e.currentTarget || e.target;
        handleScrollTo(toScroll, eventTarget);
      } else if (finalHref === '#') {
        e.preventDefault();
      }

      // 리플 효과 추가
      createRipple(e);

      // scale 효과 적용
      if (hasEffect === 'scale') {
        handleScaleEffect(e.currentTarget);
      }

      if (onClick) {
        onClick(e);
      }
    };

    return (
      <a
        href={finalHref}
        role="button"
        className={getButtonClasses(
          className,
          size,
          not,
          effect,
          isScrollActive,
          activeClassName
        )}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        {...rest}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
        {hasEffect === 'ripple' &&
          !not &&
          ripples.map((ripple) => (
            <span
              key={ripple.id}
              className={styles.ripple}
              style={{
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}
      </a>
    );
  }

  // 기본은 button (기본 버튼 모드)
  const { children, className, size, not, effect, onClick, ...rest } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement> & CommonButtonProps;

  // 클릭 이벤트 핸들러 결합
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);

    // scale 효과 적용
    if (hasEffect === 'scale') {
      handleScaleEffect(e.currentTarget);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      className={getButtonClasses(className, size, not, effect)}
      onClick={handleButtonClick}
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
    >
      {children}
      {hasEffect === 'ripple' &&
        !not &&
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
