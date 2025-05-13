// src/components/common/Textarea.tsx
import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  TextareaHTMLAttributes,
  CSSProperties,
  ChangeEvent,
} from 'react';
import styles from '@/assets/scss/components/textarea.module.scss';
import cx from '@/utils/cx';

// autoSize 옵션 타입 정의
export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

// Textarea 컴포넌트 Props 타입 정의
export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  // 기본 속성
  value?: string;
  defaultValue?: string;
  className?: string;
  style?: CSSProperties;
  // 상태 관련
  disabled?: boolean;
  readOnly?: boolean;
  // 특수 기능
  autoSize?: boolean | AutoSizeType;
  maxLength?: number;
  showCount?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  // 이벤트 핸들러
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

// 한 줄 높이 계산을 위한 상수
const LINE_HEIGHT = 1.5; // em 단위
const DEFAULT_FONT_SIZE = 1.4; // rem 단위

// 스크롤 높이를 기준으로 필요한 행 수 계산
const calculateNodeHeight = (
  node: HTMLTextAreaElement,
  minRows?: number,
  maxRows?: number
): number => {
  // 현재 스타일 가져오기
  const style = window.getComputedStyle(node);
  const fontSizeStr =
    style.getPropertyValue('font-size') || `${DEFAULT_FONT_SIZE}rem`;
  const lineHeightStr =
    style.getPropertyValue('line-height') || `${LINE_HEIGHT}`;
  const paddingTopStr = style.getPropertyValue('padding-top') || '0';
  const paddingBottomStr = style.getPropertyValue('padding-bottom') || '0';

  // px 단위로 변환
  const fontSize = parseFloat(fontSizeStr);
  const lineHeight = lineHeightStr.includes('px')
    ? parseFloat(lineHeightStr)
    : fontSize * parseFloat(lineHeightStr);
  const paddingTop = parseFloat(paddingTopStr);
  const paddingBottom = parseFloat(paddingBottomStr);

  console.log(
    'textarea style',
    lineHeight,
    fontSize,
    paddingTop,
    paddingBottom
  );

  // 총 패딩 높이
  const paddingHeight = paddingTop + paddingBottom;

  // 원래 스크롤 높이 저장
  const savedScrollTop = node.scrollTop;

  // 최소/최대 높이 계산
  const minHeight =
    minRows !== undefined
      ? Math.max(minRows * lineHeight + paddingHeight, 0)
      : 0;
  const maxHeight =
    maxRows !== undefined
      ? Math.max(maxRows * lineHeight + paddingHeight, 0)
      : Infinity;

  // 스크롤 높이 기반으로 필요한 높이 계산
  node.style.height = 'auto';
  const scrollHeight = node.scrollHeight;
  let height = scrollHeight;

  // 최소/최대 높이 제한 적용
  if (minHeight) {
    height = Math.max(minHeight, height);
  }
  if (maxHeight !== Infinity) {
    height = Math.min(maxHeight, height);
  }

  // 스크롤 위치 복원
  node.scrollTop = savedScrollTop;

  return height;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      style,
      value,
      defaultValue,
      disabled = false,
      readOnly = false,
      autoSize = false,
      maxLength,
      showCount = false,
      resize = 'vertical',
      onChange,
      onFocus,
      onBlur,
      ...restProps
    },
    ref
  ) => {
    // 내부 상태 및 refs
    const [focused, setFocused] = useState(false);
    const [textValue, setTextValue] = useState<string>(
      value !== undefined
        ? String(value)
        : defaultValue !== undefined
          ? String(defaultValue)
          : ''
    );
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const isControlled = value !== undefined;
    const compositionRef = useRef(false); // IME 입력 감지용

    // autoSize 설정 추출
    const { minRows, maxRows } = typeof autoSize === 'object' ? autoSize : {};

    // 텍스트 값이 변경될 때 높이 조정
    const resizeTextarea = useCallback(() => {
      if (!autoSize || !textareaRef.current) return;

      const height = calculateNodeHeight(textareaRef.current, minRows, maxRows);

      // 계산된 높이로 설정
      textareaRef.current.style.height = `${height}px`;
    }, [autoSize, minRows, maxRows]);

    // 값 변경 핸들러
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      // 비제어 컴포넌트일 때만 내부 상태 업데이트
      if (!isControlled) {
        setTextValue(newValue);
      }

      // 외부 onChange 콜백 호출
      if (onChange) {
        onChange(e);
      }
    };

    // 포커스 이벤트 핸들러
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true);

      if (onFocus) {
        onFocus(e);
      }
    };

    // 블러 이벤트 핸들러
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false);

      if (onBlur) {
        onBlur(e);
      }
    };

    // IME 입력 이벤트 처리
    const handleCompositionStart = () => {
      compositionRef.current = true;
    };

    const handleCompositionEnd = () => {
      compositionRef.current = false;
      // IME 입력 완료 후 높이 재조정
      if (autoSize) {
        setTimeout(resizeTextarea, 0);
      }
    };

    // 초기 및 값 변경 시 높이 조정
    useEffect(() => {
      if (autoSize) {
        resizeTextarea();
      }
    }, [autoSize, textValue, value, resizeTextarea]);

    // 외부 value 변경 시 처리
    useEffect(() => {
      if (isControlled && value !== textValue) {
        setTextValue(String(value || ''));
      }
    }, [isControlled, value, textValue]);

    // Textarea 표시 값
    const displayValue = isControlled ? value : textValue;

    // CSS 클래스 생성
    const wrapperClassName = cx(
      styles.textarea,
      {
        [styles.focused]: focused,
        [styles.disabled]: disabled,
        [styles['resize-none']]: resize === 'none',
        [styles['resize-both']]: resize === 'both',
        [styles['resize-horizontal']]: resize === 'horizontal',
        [styles['resize-vertical']]: resize === 'vertical',
      },
      className
    );

    const textareaClassName = cx(styles.inp, {
      [styles['auto-size']]: !!autoSize,
    });

    // 최대 길이 초과 여부
    const isExceeded =
      maxLength !== undefined && String(displayValue).length > maxLength;

    return (
      <div>
        <div className={wrapperClassName} style={style}>
          <textarea
            ref={(node) => {
              // 내부 ref와 외부 ref 모두 설정
              textareaRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            className={textareaClassName}
            value={displayValue}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            {...restProps}
          />
        </div>

        {/* 글자 수 표시 */}
        {showCount && maxLength && (
          <div
            className={cx(styles.counter, { [styles.exceeded]: isExceeded })}
          >
            {String(displayValue).length} / {maxLength}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
