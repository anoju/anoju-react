// src/components/common/Button.tsx
// 프로젝트 내에서 이동시 to 속성 사용
// 외부링크 이동시 anchor + href 속성 사용
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '@/assets/scss/components/button.module.scss';

// 버튼 사이즈 타입 정의
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
  disableRipple?: boolean; // 리플 효과 비활성화 옵션
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

  // 버튼 클래스명 생성 함수
  const getButtonClasses = (
    className?: string,
    size?: ButtonSize,
    not?: boolean
  ) => {
    // not 속성이 true이면 className만 반환
    if (not) {
      return className;
    }

    return [
      styles.button,
      size && styles[size], // size 클래스 추가
      className,
    ]
      .filter(Boolean)
      .join(' ');
  };

  // 리플 효과 생성 함수
  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const isDisabled = 'disableRipple' in props && props.disableRipple;
    const isNotButton = 'not' in props && (props as { not?: boolean }).not;
    
    if (isDisabled || isNotButton) {
      return;
    }

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 버튼 대각선 길이를 기준으로 리플 크기 계산
    const size = Math.max(rect.width, rect.height) * 0.8;

    const newRipple: RippleEffect = {
      x,
      y,
      size,
      id: nextRippleId.current,
    };

    nextRippleId.current += 1;
    setRipples([newRipple]);
  };

  // to 속성이 있으면 Link
  if ('to' in props && props.to) {
    const {
      to,
      children,
      className,
      size,
      not,
      disableRipple,
      onClick,
      ...rest
    } = props;

    // Link 시 target 속성 제외
    const newRest = { ...rest };
    delete newRest.target; // target 속성 제거

    // 클릭 이벤트 핸들러 결합
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      createRipple(e);
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Link
        to={to}
        className={getButtonClasses(className, size, not)}
        onClick={handleLinkClick}
        {...newRest}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
        {!not &&
          !disableRipple &&
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
      disableRipple,
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

      if (onClick) onClick(e);
    };

    return (
      <a
        href={href}
        role="button"
        className={getButtonClasses(className, size, not)}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        {...anchorProps}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
        {!not &&
          !disableRipple &&
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
  const { children, className, size, not, disableRipple, onClick, ...rest } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement> & CommonButtonProps;

  // 클릭 이벤트 핸들러 결합
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      className={getButtonClasses(className, size, not)}
      onClick={handleButtonClick}
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
    >
      {children}
      {!not &&
        !disableRipple &&
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
