// src/components/common/Button.tsx
// 프로젝트 내에서 이동시 to 속성 사용
// 외부링크 이동시 anchor + href 속성 사용
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '@/assets/scss/components/button.module.scss';

type ButtonProps =
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      anchor?: boolean;
    })
  | ({ to: string } & Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      'href'
    >);

const Button: React.FC<ButtonProps> = (props) => {
  const buttonClasses = [
    styles.button,
    // elevated && styles.elevated,
    // size && styles[size],
    // variant && styles[variant]
  ]
    .filter(Boolean)
    .join(' ');

  // to 속성이 있으면 Link
  if ('to' in props && props.to) {
    const { to, children, ...rest } = props;

    // Link 시 target 속성 제외
    const newRest = { ...rest };
    delete newRest.target; // target 속성 제거

    return (
      <Link to={to} className={buttonClasses} {...newRest}>
        {children}
      </Link>
    );
  }

  // anchor 속성이 있으면 a 태그
  if ('anchor' in props || 'href' in props) {
    const { href = '#', target, onClick, children, ...rest } = props;

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
        className={buttonClasses}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  // 기본은 button
  const { children, ...rest } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={buttonClasses} {...rest}>
      {children}
    </button>
  );
};

export default Button;
