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
      resize = 'none',
      onChange,
      onFocus,
      onBlur,
      placeholder,
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
    const [textareaHeight, setTextareaHeight] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const hiddenTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const isControlled = value !== undefined;
    const compositionRef = useRef(false); // IME 입력 감지용

    // autoSize 설정 추출
    const { minRows, maxRows } = typeof autoSize === 'object' ? autoSize : {};

    // autoSize가 활성화되어 있을 때는 resize를 'none'으로 강제 설정
    const effectiveResize = autoSize ? 'none' : resize;

    // 숨겨진 textarea에서 실제 높이 측정
    const calculateHeight = useCallback(() => {
      if (!autoSize || !textareaRef.current || !hiddenTextareaRef.current)
        return null;

      const mainTextarea = textareaRef.current;
      const hiddenTextarea = hiddenTextareaRef.current;

      // 주요 Textarea에서 스타일 복사
      const mainStyle = window.getComputedStyle(mainTextarea);

      // 숨겨진 textarea에 같은 스타일 적용
      const copyStyles = (source: CSSStyleDeclaration, target: HTMLElement) => {
        const properties = [
          'width',
          'padding',
          'paddingTop',
          'paddingRight',
          'paddingBottom',
          'paddingLeft',
          'border',
          'borderTop',
          'borderRight',
          'borderBottom',
          'borderLeft',
          'lineHeight',
          'fontSize',
          'fontFamily',
          'fontWeight',
          'letterSpacing',
          'boxSizing',
        ];

        properties.forEach((property) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: 동적 스타일 속성 할당
          target.style[property] = source.getPropertyValue(property);
        });
      };

      // 스타일 복사 함수 호출
      copyStyles(mainStyle, hiddenTextarea);

      // 텍스트 값 복사 (줄바꿈 유지를 위한 placeholder 처리)
      const currentValue = textValue || placeholder || '';
      hiddenTextarea.value = currentValue;

      // 측정 전 높이 초기화
      hiddenTextarea.style.height = 'auto';

      // 스크롤 높이 측정
      let height = hiddenTextarea.scrollHeight;

      // 최소/최대 행 제한 적용
      const lineHeight = parseFloat(mainStyle.lineHeight) || 22;
      const paddingTop = parseFloat(mainStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(mainStyle.paddingBottom) || 0;
      const paddingHeight = paddingTop + paddingBottom;

      if (minRows !== undefined) {
        const minHeight = minRows * lineHeight + paddingHeight;
        height = Math.max(height, minHeight);
      }

      if (maxRows !== undefined) {
        const maxHeight = maxRows * lineHeight + paddingHeight;
        height = Math.min(height, maxHeight);
      }

      return height;
    }, [autoSize, textValue, placeholder, minRows, maxRows]);

    // 높이 업데이트 함수
    const updateHeight = useCallback(() => {
      if (!autoSize) return;

      const height = calculateHeight();
      if (height !== null) {
        setTextareaHeight(height);
      }
    }, [autoSize, calculateHeight]);

    // 값 변경 핸들러
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      // 비제어 컴포넌트일 때만 내부 상태 업데이트
      if (!isControlled) {
        setTextValue(newValue);
      }

      // 높이 재조정
      if (autoSize && !compositionRef.current) {
        updateHeight();
      }

      // 외부 onChange 콜백 호출
      if (onChange) {
        onChange(e);
      }
    };

    // 포커스 이벤트 핸들러
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true);
      if (onFocus) onFocus(e);
    };

    // 블러 이벤트 핸들러
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false);
      if (onBlur) onBlur(e);
    };

    // IME 입력 이벤트 처리
    const handleCompositionStart = () => {
      compositionRef.current = true;
    };

    const handleCompositionEnd = () => {
      compositionRef.current = false;
      // IME 입력 완료 후 높이 재조정
      if (autoSize) {
        updateHeight();
      }
    };

    // 초기 및 값 변경 시 높이 조정
    useEffect(() => {
      if (autoSize) {
        updateHeight();
      }
    }, [autoSize, textValue, updateHeight]);

    // 외부 value 변경 시 처리
    useEffect(() => {
      if (isControlled && value !== textValue) {
        setTextValue(String(value || ''));
      }
    }, [isControlled, value, textValue]);

    // 컴포넌트 마운트 시 초기 높이 조정
    useEffect(() => {
      if (autoSize && textareaRef.current) {
        updateHeight();

        // DOM이 완전히 로드된 후 한번 더 실행
        if (document.readyState === 'complete') {
          updateHeight();
        } else {
          const handleDomLoaded = () => updateHeight();
          document.addEventListener('DOMContentLoaded', handleDomLoaded);
          return () =>
            document.removeEventListener('DOMContentLoaded', handleDomLoaded);
        }
      }
    }, [autoSize, updateHeight]);

    // 윈도우 리사이즈 이벤트 처리
    useEffect(() => {
      if (autoSize) {
        const handleResize = () => updateHeight();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }
    }, [autoSize, updateHeight]);

    // Textarea 표시 값
    const displayValue = isControlled ? value : textValue;

    // CSS 클래스 생성
    const wrapperClassName = cx(
      styles.textarea,
      {
        [styles.focused]: focused,
        [styles.disabled]: disabled,
        [styles['resize-none']]: effectiveResize === 'none',
        [styles['resize-both']]: effectiveResize === 'both',
        [styles['resize-horizontal']]: effectiveResize === 'horizontal',
        [styles['resize-vertical']]: effectiveResize === 'vertical',
      },
      className
    );

    const textareaClassName = cx(styles.native, {
      [styles['auto-size']]: !!autoSize,
    });

    // 최대 길이 초과 여부
    const isExceeded =
      maxLength !== undefined && String(displayValue).length > maxLength;

    // textareaHeight에 따른 인라인 스타일 계산
    const textareaStyle: CSSProperties = {};
    if (textareaHeight !== null && autoSize) {
      textareaStyle.height = `${textareaHeight}px`;

      // 최대 높이에 도달했을 때 스크롤 가능하도록 설정
      if (maxRows !== undefined && textareaRef.current) {
        const mainStyle = window.getComputedStyle(textareaRef.current);
        const lineHeight = parseFloat(mainStyle.lineHeight) || 22;
        const paddingHeight =
          (parseFloat(mainStyle.paddingTop) || 0) +
          (parseFloat(mainStyle.paddingBottom) || 0);
        const maxHeight = maxRows * lineHeight + paddingHeight;

        textareaStyle.overflowY =
          textareaHeight >= maxHeight ? 'auto' : 'hidden';
      } else {
        textareaStyle.overflowY = 'hidden';
      }
    }

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
            style={textareaStyle}
            value={displayValue}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={placeholder}
            rows={1}
            {...restProps}
          />

          {/* 숨겨진 textarea (높이 계산용) */}
          {autoSize && (
            <textarea
              ref={hiddenTextareaRef}
              aria-hidden="true"
              tabIndex={-1}
              className={cx(styles.native, styles['hidden-textarea'])}
              rows={1}
              readOnly
            />
          )}
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
