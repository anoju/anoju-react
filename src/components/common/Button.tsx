// src/components/common/Button.tsx
// 프로젝트 내에서 이동시 to 속성 사용
// 외부링크 이동시 anchor + href 속성 사용
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '@/assets/scss/components/button.module.scss';

// 터치 이벤트 인터페이스
interface TouchList {
  length: number;
  [index: number]: { clientX: number; clientY: number };
}

interface CustomTouchEvent {
  touches: TouchList;
}

// 버튼 사이즈 타입 정의
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 버튼 효과 타입 정의
type ButtonEffect = 'ripple' | 'pulse' | 'scale' | 'shadow' | 'rotate' | 'shake' | 'jello' | false;

// 리플 효과 타입 정의
interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: number;
}

// 공통 속성 타입 정의
type CommonButtonProps = {
  size?: ButtonSize;
  not?: boolean; // 'not' prop 추가
  effect?: ButtonEffect; // 버튼 효과 옵션
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
      CommonButtonProps);

const Button = React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const nextRippleId = useRef(0);

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
    effect?: ButtonEffect
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

    const target = event.currentTarget;
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

  // to 속성이 있으면 Link
  if ('to' in props && props.to) {
    const { to, children, className, size, not, effect, onClick, ...rest } =
      props;

    // Link 시 target 속성 제외
    const newRest = { ...rest };
    delete newRest.target; // target 속성 제거

    // 클릭 이벤트 핸들러 결합
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
        className={getButtonClasses(className, size, not, effect)}
        onClick={handleLinkClick}
        {...newRest}
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

  // anchor 속성이 있으면 a 태그
  if ('anchor' in props || 'href' in props) {
    const {
      href = '#',
      target,
      onClick,
      children,
      className,
      size,
      not,
      effect,
      ...rest
    } = props;

    // anchor 속성 제거
    const anchorProps = { ...rest };
    delete anchorProps.anchor;

    const handleClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      if (href === '#') {
        e.preventDefault();
      }

      // 리플 효과 추가
      createRipple(e);

      // scale 효과 적용
      if (hasEffect === 'scale') {
        handleScaleEffect(e.currentTarget);
      }

      if (onClick) onClick(e);
    };

    return (
      <a
        href={href}
        role="button"
        className={getButtonClasses(className, size, not, effect)}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        {...anchorProps}
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

  // 기본은 button
  const { children, className, size, not, effect, onClick, ...rest } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement> & CommonButtonProps;

  // 클릭 이벤트 핸들러 결합
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
