// src/components/common/Input.tsx
import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  ReactNode,
  ChangeEvent,
  FocusEvent,
} from 'react';
import styles from '@/assets/scss/components/input.module.scss';
import cx from '@/utils/cx';

// Input 컴포넌트 Props 타입 정의
export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'prefix' | 'className'
  > {
  // 기본 속성
  id?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
  inputClassName?: string;
  // 상태
  disabled?: boolean;
  readOnly?: boolean;
  // 스타일 관련
  align?: 'left' | 'center' | 'right';
  // Input 콘텐츠 관련
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  // 기능 관련
  isReset?: boolean;
  showPassword?: boolean;
  beforeEl?: ReactNode;
  afterEl?: ReactNode;
  onlyNumber?: boolean;
  addComma?: boolean;
  // 이벤트 핸들러
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      // 기본 속성
      id,
      className = '',
      wrapperClassName = '',
      inputClassName = '',
      style,
      
      // 상태
      disabled = false,
      readOnly = false,
      
      // 스타일 관련
      align = 'left',
      
      // Input 콘텐츠 관련
      value,
      defaultValue,
      placeholder,
      type = 'text',
      
      // 기능 관련
      isReset = true,
      showPassword = false,
      beforeEl,
      afterEl,
      onlyNumber = false,
      addComma = false,
      
      // 이벤트 핸들러
      onChange,
      onFocus,
      onBlur,
      
      // 나머지 속성
      ...restProps
    },
    ref
  ) => {
    // 내부 상태 관리
    const [inputValue, setInputValue] = useState<string>(
      value !== undefined
        ? String(value)
        : defaultValue !== undefined
        ? String(defaultValue)
        : ''
    );
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isControlled = value !== undefined;

    // 비밀번호 표시 상태 결정
    const actualType = type === 'password' && passwordVisible ? 'text' : type;

    // 외부 value prop이 변경되면 내부 상태 업데이트
    useEffect(() => {
      if (isControlled && value !== undefined) {
        setInputValue(String(value));
      }
    }, [value, isControlled]);

    // 입력값 초기화 함수
    const handleReset = () => {
      if (!disabled && !readOnly) {
        // 내부 상태 업데이트
        setInputValue('');
        
        // ref 사용하여 실제 DOM 업데이트 (리액트 외부 이벤트 발생 모방)
        if (inputRef.current) {
          inputRef.current.value = '';
          
          // 변경 이벤트 발생
          const event = new Event('input', { bubbles: true });
          inputRef.current.dispatchEvent(event);
          
          // 포커스 설정
          inputRef.current.focus();
        }
        
        // onChange 콜백 호출
        if (onChange) {
          const syntheticEvent = {
            target: { value: '' },
            currentTarget: { value: '' },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }
    };

    // 비밀번호 표시 토글 함수
    const togglePasswordVisibility = () => {
      if (!disabled && !readOnly) {
        setPasswordVisible((prev) => !prev);
      }
    };

    // 숫자 및 콤마 처리 함수
    const formatNumberWithComma = (value: string): string => {
      if (!value) return '';
      
      // 숫자와 소수점만 허용
      let numberValue = value.replace(/[^\d.]/g, '');
      
      // 소수점이 두 개 이상이면 첫 번째 소수점만 유지
      const decimalCount = numberValue.split('.').length - 1;
      if (decimalCount > 1) {
        const parts = numberValue.split('.');
        numberValue = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // 콤마 추가
      if (addComma) {
        // 소수점이 있는 경우
        if (numberValue.includes('.')) {
          const parts = numberValue.split('.');
          return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
        }
        // 소수점이 없는 경우
        return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      
      return numberValue;
    };

    // 입력 처리 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // 숫자만 입력 처리
      if (onlyNumber) {
        newValue = formatNumberWithComma(newValue);
        
        // DOM 요소 값 직접 업데이트 (controlled input 문제 해결)
        e.target.value = newValue;
      }
      
      // 내부 상태 업데이트 (controlled 여부와 관계없이)
      if (!isControlled) {
        setInputValue(newValue);
      }
      
      // 외부 onChange 콜백 호출
      if (onChange) {
        onChange(e);
      }
    };

    // 포커스 처리 핸들러
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      if (onFocus) {
        onFocus(e);
      }
    };

    // 블러 처리 핸들러
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      if (onBlur) {
        onBlur(e);
      }
    };

    // 최종 input 값 (콤마 추가/제거 처리)
    const displayValue = isControlled 
      ? (onlyNumber && addComma && value !== undefined && value !== '' 
          ? formatNumberWithComma(String(value)) 
          : value) 
      : inputValue;

    // 리셋 버튼 렌더링 조건
    const showResetButton = isReset && inputValue && !disabled && !readOnly;
    
    // 비밀번호 토글 버튼 렌더링 조건
    const showPasswordToggle = type === 'password' && showPassword && !disabled && !readOnly;

    // 클래스 이름 생성
    const wrapperClasses = cx(
      styles['input-wrap'],
      wrapperClassName,
      {
        [styles.disabled]: disabled,
        [styles.focused]: isFocused,
        [styles['with-before']]: !!beforeEl,
        [styles['with-after']]: !!(afterEl || showResetButton || showPasswordToggle),
      }
    );

    const inputClasses = cx(
      styles.input,
      inputClassName,
      styles[`align-${align}`],
      {
        [styles.disabled]: disabled,
      }
    );

    return (
      <div className={`${wrapperClasses} ${className}`} style={style}>
        {/* 입력 필드 앞에 표시할 요소 */}
        {beforeEl && <div className={styles['input-before']}>{beforeEl}</div>}
        
        {/* 실제 입력 필드 */}
        <input
          ref={(node) => {
            // 전달된 ref와 내부 ref 모두 설정
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
          id={id}
          type={actualType}
          className={inputClasses}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restProps}
        />
        
        {/* 입력 필드 뒤에 표시할 요소들 */}
        <div className={styles['input-buttons']}>
          {/* 리셋 버튼 */}
          {showResetButton && (
            <button
              type="button"
              className={styles['input-reset']}
              onClick={handleReset}
              aria-label="입력 내용 지우기"
            />
          )}
          
          {/* 비밀번호 표시 토글 버튼 */}
          {showPasswordToggle && (
            <button
              type="button"
              className={cx(
                styles['password-toggle'],
                { [styles.visible]: passwordVisible }
              )}
              onClick={togglePasswordVisibility}
              aria-label={passwordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
            />
          )}
          
          {/* 사용자 정의 추가 요소 */}
          {afterEl && <div className={styles['input-after']}>{afterEl}</div>}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
