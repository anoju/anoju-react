// src/components/common/Button.tsx
// 프로젝트 내에서 이동시 to 속성 사용
// 외부링크 이동시 anchor + href 속성 사용
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '@/assets/scss/components/button.module.scss';

// 버튼 사이즈 타입 정의
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 공통 속성 타입 정의
type CommonButtonProps = {
  size?: ButtonSize;
  not?: boolean; // 'not' prop 추가
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

  // to 속성이 있으면 Link
  if ('to' in props && props.to) {
    const { to, children, className, size, not, ...rest } = props;

    // Link 시 target 속성 제외
    const newRest = { ...rest };
    delete newRest.target; // target 속성 제거

    return (
      <Link
        to={to}
        className={getButtonClasses(className, size, not)}
        {...newRest}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
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
      </a>
    );
  }

  // 기본은 button
  const { children, className, size, not, ...rest } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement> & CommonButtonProps;

  return (
    <button
      type="button"
      className={getButtonClasses(className, size, not)}
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
