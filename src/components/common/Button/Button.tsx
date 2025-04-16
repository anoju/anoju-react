// src/components/common/Button.tsx
import React from 'react';
import { Link } from 'react-router-dom';

// 타입 정의 수정
type ButtonProps =
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      isAnchor?: boolean;
    })
  | ({ to: string } & Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      'href'
    >);

const Button: React.FC<ButtonProps> = (props) => {
  // to 속성이 있으면 Link
  if ('to' in props && props.to) {
    const { to, children, ...rest } = props;
    return (
      <Link to={to} {...rest}>
        {children}
      </Link>
    );
  }

  // isAnchor 속성이 있으면 a
  type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    isAnchor?: boolean;
  };

  if ('isAnchor' in props) {
    const { href, onClick, children, ...rest } = props as AnchorProps;

    // 새로운 객체를 만들어 isAnchor를 제외한 나머지 props만 전달
    const anchorProps = Object.fromEntries(
      Object.entries(rest).filter(([key]) => key !== 'isAnchor')
    );

    const handleClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      if (href === '#') {
        e.preventDefault();
      }
      if (onClick) onClick(e);
    };

    return (
      <a href={href} onClick={handleClick} {...anchorProps}>
        {children}
      </a>
    );
  }

  // 기본은 button
  const { children, ...rest } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...rest}>
      {children}
    </button>
  );
};

export default Button;
