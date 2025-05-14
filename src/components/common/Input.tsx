// src/components/common/Input.tsx
import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  ChangeEvent,
  FocusEvent,
} from 'react';
import styles from '@/assets/scss/components/input.module.scss';
import cx from '@/utils/cx';

// ---------------------- Types ----------------------

// 개별 input 태그의 속성을 위한 타입 정의
export interface InputFieldProps {
  value?: string | number;
  className?: string;
  type?: string;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  align?: 'left' | 'center' | 'right';
}

// Input 컴포넌트 Props 타입 정의
export interface InputProps {
  // 기본 속성
  id?: string;
  name?: string;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
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
  // 값 제어 함수
  setValue?: (value: string) => void;
  // 기능 관련
  showReset?: boolean;
  showPassword?: boolean;
  beforeEl?: ReactNode;
  afterEl?: ReactNode;
  onlyNumber?: boolean;
  addComma?: boolean;
  // 다중 input 태그 관련
  values?: (string | number)[];
  setValues?: (values: (string | number)[]) => void;
  inputFields?: InputFieldProps[];
  separator?: ReactNode; // 입력 필드 사이에 표시할 구분자
  onChange?: (e: ChangeEvent<HTMLInputElement>, index?: number) => void;
  // 이벤트 핸들러 (override)
  onFocus?: (e: FocusEvent<HTMLInputElement>, index?: number) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>, index?: number) => void;
}

// InputRefs 인터페이스 정의
interface InputRefs {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

// 커스텀 훅 반환 타입 정의
interface UseInputValueReturn extends InputRefs {
  inputValue: string;
  setInputValue: (value: string) => void;
  inputValues: string[];
  setInputValues: (values: (string | number)[]) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => void;
  isControlled: boolean;
  isMultipleInputs: boolean;
}

// ---------------------- Utils ----------------------

/**
 * 숫자 형식을 포맷팅하는 유틸리티 함수
 */
function formatNumberWithComma(value: string, addComma: boolean): string {
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
}

// ---------------------- Custom Hooks ----------------------

/**
 * 입력값 관리를 위한 커스텀 훅
 */
function useInputValue(props: {
  value?: string | number;
  defaultValue?: string | number;
  values?: (string | number)[];
  setValue?: (value: string) => void;
  setValues?: (values: (string | number)[]) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>, index?: number) => void;
  onlyNumber?: boolean;
  addComma?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  inputFields?: InputFieldProps[];
}): UseInputValueReturn {
  const {
    value,
    defaultValue,
    values,
    setValue,
    setValues,
    onChange,
    onlyNumber,
    addComma,
    disabled,
    readOnly,
    inputFields = [],
  } = props;

  // 상태 관리
  const [inputValue, setInputValue] = useState<string>(
    value !== undefined
      ? String(value)
      : defaultValue !== undefined
        ? String(defaultValue)
        : ''
  );

  const [inputValues, setInputValues] = useState<string[]>(
    values ? values.map((val) => (val !== undefined ? String(val) : '')) : []
  );

  // 참조 객체들
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isControlled = value !== undefined || values !== undefined;
  const isMultipleInputs = values !== undefined;

  // 값 직접 설정 함수
  const handleSetValue = useCallback(
    (newValue: string) => {
      setInputValue(newValue);

      // 외부에서 제공한 setValue 호출
      if (setValue) {
        setValue(newValue);
      }
    },
    [setValue]
  );

  // 다중 값 직접 설정 함수
  const handleSetValues = useCallback(
    (newValues: (string | number)[]) => {
      const stringValues = newValues.map((val) =>
        val !== undefined ? String(val) : ''
      );
      setInputValues(stringValues);

      // 외부에서 제공한 setValues 호출
      if (setValues) {
        setValues(newValues);
      }
    },
    [setValues]
  );

  // 외부 value/values prop이 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(String(value));
    }
    if (values !== undefined) {
      const newInputValues = values.map((val) =>
        val !== undefined ? String(val) : ''
      );
      setInputValues(newInputValues);
    }
  }, [value, values]);

  // 입력 처리 핸들러
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
      let newValue = e.target.value;

      // 숫자만 입력 처리
      if (onlyNumber) {
        newValue = formatNumberWithComma(newValue, !!addComma);
        // DOM 요소 값 직접 업데이트 (controlled input 문제 해결)
        e.target.value = newValue;
      }

      if (isMultipleInputs && index !== undefined) {
        // 다중 input 태그 처리, 값을 복사하여 변경
        const newValues = [...inputValues];
        newValues[index] = newValue;
        setInputValues(newValues);

        // 외부에서 제공한 setValues 사용
        if (setValues) {
          setValues(newValues);
        }

        // 자동 포커스 이동 처리
        const currentInputRef = inputRefs.current[index];
        if (currentInputRef) {
          const currentField = inputFields[index] || {};
          const maxLength = currentField.maxLength || 0;

          // 최대 길이에 도달했을 때 다음 필드로 포커스 이동
          if (maxLength > 0 && newValue.length >= maxLength) {
            // 다음 입력 가능한 필드 찾기
            let nextIndex = -1;
            for (let i = index + 1; i < inputRefs.current.length; i++) {
              const nextInput = inputRefs.current[i];
              if (!nextInput) continue;

              const fieldProps = inputFields[i] || {};
              const fieldDisabled =
                fieldProps.disabled !== undefined
                  ? fieldProps.disabled
                  : disabled;
              const fieldReadOnly =
                fieldProps.readOnly !== undefined
                  ? fieldProps.readOnly
                  : readOnly;

              if (!fieldDisabled && !fieldReadOnly) {
                nextIndex = i;
                break;
              }
            }

            // 다음 필드로 포커스 이동
            if (nextIndex !== -1) {
              const nextInput = inputRefs.current[nextIndex];
              if (nextInput) {
                nextInput.focus();
              }
            }
          }

          // 값이 비어있고 백스페이스/Delete 키를 눌렀을 때 이전 필드로 포커스 이동
          else if (
            newValue.length === 0 &&
            e.nativeEvent instanceof InputEvent &&
            e.nativeEvent.inputType === 'deleteContentBackward'
          ) {
            // 이전 입력 가능한 필드 찾기
            let prevIndex = -1;
            for (let i = index - 1; i >= 0; i--) {
              const prevInput = inputRefs.current[i];
              if (!prevInput) continue;

              const fieldProps = inputFields[i] || {};
              const fieldDisabled =
                fieldProps.disabled !== undefined
                  ? fieldProps.disabled
                  : disabled;
              const fieldReadOnly =
                fieldProps.readOnly !== undefined
                  ? fieldProps.readOnly
                  : readOnly;

              if (!fieldDisabled && !fieldReadOnly) {
                prevIndex = i;
                break;
              }
            }

            // 이전 필드로 포커스 이동
            if (prevIndex !== -1) {
              const prevInput = inputRefs.current[prevIndex];
              if (prevInput) {
                prevInput.focus();

                // 이전 필드의 커서를 맨 끝으로 이동
                const length = prevInput.value.length;
                setTimeout(() => {
                  if (prevInput.setSelectionRange) {
                    prevInput.setSelectionRange(length, length);
                  }
                }, 0);
              }
            }
          }
        }
      } else {
        // 단일 input 태그 처리
        // Controlled 컴포넌트 상태 업데이트
        setInputValue(newValue);

        // 외부에서 제공한 setValue 사용
        if (setValue) {
          setValue(newValue);
        }
      }

      // 외부 onChange 콜백 호출
      if (onChange) {
        onChange(e, index);
      }
    },
    [
      onlyNumber,
      addComma,
      isMultipleInputs,
      inputValues,
      onChange,
      inputFields,
      disabled,
      readOnly,
      setValue,
      setValues,
    ]
  );

  return {
    inputValue,
    setInputValue: handleSetValue,
    inputValues,
    setInputValues: handleSetValues,
    handleChange,
    isControlled,
    isMultipleInputs,
    inputRef,
    inputRefs,
  };
}

/**
 * 포커스 상태를 관리하는 커스텀 훅
 */
function useFocusState(props: {
  onFocus?: (e: FocusEvent<HTMLInputElement>, index?: number) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>, index?: number) => void;
}) {
  const { onFocus, onBlur } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>, index?: number) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e, index);
      }
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>, index?: number) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e, index);
      }
    },
    [onBlur]
  );

  return { isFocused, handleFocus, handleBlur };
}

// ---------------------- Components ----------------------

/**
 * 리셋 버튼 컴포넌트
 */
const ResetButton = React.memo(
  ({ show, onClick }: { show: boolean; onClick: () => void }) => (
    <button
      type="button"
      className={`${styles['inp-reset']} ${!show ? styles['inp-hidden'] : ''}`}
      onClick={onClick}
      aria-label="입력 내용 지우기"
    />
  )
);

ResetButton.displayName = 'ResetButton';

/**
 * 비밀번호 토글 버튼 컴포넌트
 */
const PasswordToggleButton = React.memo(
  ({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) => (
    <button
      type="button"
      className={cx(styles['password-toggle'], {
        [styles.visible]: isVisible,
      })}
      onClick={onClick}
      aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
    />
  )
);

PasswordToggleButton.displayName = 'PasswordToggleButton';

// ---------------------- Main Component ----------------------

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      // 기본 속성
      id,
      className = '',
      inputClassName = '',
      style,

      // 상태
      disabled = false,
      readOnly = false,

      // 스타일 관련
      align,

      // Input 콘텐츠 관련
      value,
      defaultValue,
      placeholder,
      type = 'text',

      // 기능 관련
      showReset = true,
      showPassword = false,
      beforeEl,
      afterEl,
      onlyNumber = false,
      addComma = false,

      // 값 제어 함수
      setValue,
      setValues,

      // 다중 input 태그 관련
      values,
      inputFields = [],
      separator,

      // 이벤트 핸들러
      onChange,
      onFocus,
      onBlur,

      // 나머지 속성
      ...restProps
    },
    ref
  ) => {
    // 입력값 상태 관리 훅
    const {
      inputValue,
      setInputValue,
      inputValues,
      setInputValues,
      handleChange,
      isControlled,
      isMultipleInputs,
      inputRef,
      inputRefs,
    } = useInputValue({
      value,
      defaultValue,
      values,
      onChange,
      onlyNumber,
      addComma,
      disabled,
      readOnly,
      inputFields,
      setValue,
      setValues,
    });

    // 포커스 상태 관리 훅
    const { isFocused, handleFocus, handleBlur } = useFocusState({
      onFocus,
      onBlur,
    });

    // 참조 객체들
    const buttonsRef = useRef<HTMLDivElement>(null);

    // 비밀번호 표시 상태
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const actualType = type === 'password' && passwordVisible ? 'text' : type;

    // 입력값 초기화 함수
    const handleReset = useCallback(() => {
      if (disabled || readOnly) return;

      if (isMultipleInputs) {
        // 모든 input 필드 초기화 (disabled 상태 유지)
        const newValues = inputValues.map((_, index) => {
          // disabled 상태의 input은 그대로 현재 값을 유지
          const fieldProps = inputFields[index] || {};
          const fieldDisabled =
            fieldProps.disabled !== undefined ? fieldProps.disabled : disabled;

          if (fieldDisabled) {
            return inputValues[index]; // disabled 필드는 값 유지
          }
          return ''; // disabled가 아닌 필드만 초기화
        });

        setInputValues(newValues);

        // onChange 콜백 호출 - 전체 필드 초기화를 의미하는 -1 인덱스 전달
        if (onChange) {
          const syntheticEvent = {
            target: { name: 'reset-all-fields' },
            currentTarget: { name: 'reset-all-fields' },
            type: 'reset',
            preventDefault: () => {},
            stopPropagation: () => {},
          } as unknown as React.ChangeEvent<HTMLInputElement>;

          onChange(syntheticEvent, -1);
        }

        // 자동 포커스 이동 설정 - 첫 번째 입력 가능한 필드에 포커스
        const nextEnabledInput = inputRefs.current.find((el, idx) => {
          if (!el) return false;
          const fieldProps = inputFields[idx] || {};
          const fieldDisabled =
            fieldProps.disabled !== undefined ? fieldProps.disabled : disabled;
          const fieldReadOnly =
            fieldProps.readOnly !== undefined ? fieldProps.readOnly : readOnly;
          return !fieldDisabled && !fieldReadOnly;
        });

        if (nextEnabledInput) {
          nextEnabledInput.focus();
        }
      } else {
        // 단일 input 초기화
        setInputValue('');

        // ref 사용하여 실제 DOM 업데이트
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
    }, [
      disabled,
      readOnly,
      isMultipleInputs,
      inputValues,
      inputFields,
      setInputValues,
      onChange,
      setInputValue,
      inputRef,
      inputRefs,
    ]);

    // 비밀번호 표시 토글 함수
    const togglePasswordVisibility = useCallback(() => {
      if (!disabled && !readOnly) {
        setPasswordVisible((prev) => !prev);
      }
    }, [disabled, readOnly]);

    // 컴포넌트 영역 클릭 시 input에 포커스를 주는 핸들러
    const handleWrapperClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        // 클릭된 요소가 폼 요소가 아닌 경우에만 포커스 처리
        const tagName = (e.target as HTMLElement).tagName.toLowerCase();
        const isFormControl = [
          'input',
          'button',
          'select',
          'textarea',
          'option',
        ].includes(tagName);

        if (isFormControl || disabled || readOnly) return;

        if (isMultipleInputs) {
          // 다중 input의 경우 사용 가능한 첫 번째 필드에 포커스
          const nextEnabledInput = inputRefs.current.find((el, idx) => {
            if (!el) return false;
            const fieldProps = inputFields[idx] || {};
            const fieldDisabled =
              fieldProps.disabled !== undefined
                ? fieldProps.disabled
                : disabled;
            const fieldReadOnly =
              fieldProps.readOnly !== undefined
                ? fieldProps.readOnly
                : readOnly;
            return !fieldDisabled && !fieldReadOnly;
          });

          if (nextEnabledInput) {
            nextEnabledInput.focus();
          }
        } else if (inputRef.current) {
          // 단일 input의 경우 직접 포커스
          inputRef.current.focus();
        }
      },
      [isMultipleInputs, inputFields, disabled, readOnly, inputRefs, inputRef]
    );

    // 개별 입력 필드 생성 함수
    const createInputField = useCallback(
      (index: number) => {
        // 필드 속성 설정
        const fieldProps = inputFields[index] || {};
        const currentValue = inputValues[index];
        const fieldType =
          fieldProps.type !== undefined ? fieldProps.type : type;
        const fieldAlign =
          fieldProps.align !== undefined ? fieldProps.align : align;
        const fieldDisabled =
          fieldProps.disabled !== undefined ? fieldProps.disabled : disabled;
        const fieldReadOnly =
          fieldProps.readOnly !== undefined ? fieldProps.readOnly : readOnly;
        const fieldPlaceholder =
          fieldProps.placeholder !== undefined
            ? fieldProps.placeholder
            : placeholder;
        const fieldClassName =
          fieldProps.className !== undefined
            ? fieldProps.className
            : inputClassName;

        // 비밀번호 필드 처리
        const fieldActualType =
          fieldType === 'password' && passwordVisible ? 'text' : fieldType;

        // 스타일 클래스
        const inputClasses = cx(
          styles.native,
          fieldClassName,
          fieldAlign ? styles[`align-${fieldAlign}`] : ''
        );

        return (
          <input
            key={`input-field-${index}`}
            ref={(el) => {
              inputRefs.current[index] = el;
              // 첫 번째 필드는 외부 ref와 연결
              if (index === 0 && el) {
                if (typeof ref === 'function') {
                  ref(el);
                } else if (ref) {
                  ref.current = el;
                }
              }
            }}
            type={fieldActualType}
            className={inputClasses}
            value={currentValue}
            placeholder={fieldPlaceholder}
            disabled={fieldDisabled}
            readOnly={fieldReadOnly}
            onChange={(e) => handleChange(e, index)}
            onFocus={(e) => handleFocus(e, index)}
            onBlur={(e) => handleBlur(e, index)}
            {...restProps}
            {...(fieldProps.maxLength && { maxLength: fieldProps.maxLength })}
          />
        );
      },
      [
        inputValues,
        type,
        align,
        disabled,
        readOnly,
        placeholder,
        inputClassName,
        passwordVisible,
        handleChange,
        handleFocus,
        handleBlur,
        inputFields,
        ref,
        restProps,
        inputRefs,
      ]
    );

    // 다중 input 태그 렌더링
    const renderInputFields = useCallback(() => {
      if (!isMultipleInputs || !values) return null;

      // 구분자가 있는 경우, 필드와 구분자 번갈아 표시
      if (separator && values.length > 1) {
        const elements: ReactNode[] = [];

        values.forEach((_, index) => {
          // 각 필드 생성
          elements.push(
            <React.Fragment key={`input-field-${index}`}>
              {createInputField(index)}
            </React.Fragment>
          );

          // 마지막 필드가 아니면 구분자 추가
          if (index < values.length - 1) {
            elements.push(
              <div
                className={styles['inp-separator']}
                key={`separator-${index}`}
              >
                {separator}
              </div>
            );
          }
        });

        return elements;
      }

      // 구분자가 없는 경우, 기본 렌더링
      return values.map((_, index) => createInputField(index));
    }, [isMultipleInputs, values, separator, createInputField]);

    // 리셋 버튼 표시 조건
    const showResetButton =
      showReset &&
      !disabled &&
      !readOnly &&
      ((isMultipleInputs &&
        // 다중 입력 필드에서 값이 있는 필드가 하나라도 있는지 확인
        inputValues.some((value, index) => {
          const fieldProps = inputFields[index] || {};
          const fieldDisabled =
            fieldProps.disabled !== undefined ? fieldProps.disabled : disabled;
          const fieldReadOnly =
            fieldProps.readOnly !== undefined ? fieldProps.readOnly : readOnly;
          return value && !fieldDisabled && !fieldReadOnly;
        })) ||
        // 단일 입력 필드에서 값이 있는지 확인
        (!isMultipleInputs && !!inputValue));

    // 비밀번호 토글 버튼 표시 조건
    const showPasswordToggle =
      type === 'password' && showPassword && !disabled && !readOnly;

    // 버튼 영역 표시 조건
    const hasButtons =
      (showReset && !disabled && !readOnly) || showPasswordToggle;

    // 단일 input 태그의 표시 값 계산
    const displayValue =
      isControlled && !isMultipleInputs
        ? onlyNumber && addComma && value !== undefined && value !== ''
          ? formatNumberWithComma(String(value), true)
          : value
        : inputValue;

    // 클래스 이름 생성
    const wrapperClasses = cx(styles.input, className, {
      [styles.disabled]: disabled,
      [styles.focused]: isFocused,
      [styles['with-before']]: !!beforeEl,
      [styles['with-after']]: !!afterEl,
      [styles['with-buttons']]: hasButtons,
    });

    // 입력 필드 클래스 이름
    const inputClasses = cx(
      styles.native,
      inputClassName,
      align ? styles[`align-${align}`] : ''
    );

    return (
      <div
        className={wrapperClasses}
        style={style}
        onClick={handleWrapperClick}
      >
        {/* 입력 필드 앞에 표시할 요소 */}
        {beforeEl && <div className={styles['inp-before']}>{beforeEl}</div>}

        {/* 실제 입력 필드 - 다중 또는 단일 */}
        {isMultipleInputs ? (
          renderInputFields()
        ) : (
          <input
            ref={(node) => {
              // 전달된 ref와 내부 ref 모두 설정
              if (node) {
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                inputRef.current = node;
              }
            }}
            id={id}
            type={actualType}
            className={inputClasses}
            value={displayValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleFocus(e)}
            onBlur={(e) => handleBlur(e)}
            {...restProps}
          />
        )}

        {/* 입력 필드 뒤에 표시할 버튼 영역 */}
        {hasButtons && (
          <div className={styles['inp-buttons']} ref={buttonsRef}>
            {/* 리셋 버튼 */}
            {showReset && (
              <ResetButton show={showResetButton} onClick={handleReset} />
            )}

            {/* 비밀번호 토글 버튼 */}
            {showPasswordToggle && (
              <PasswordToggleButton
                isVisible={passwordVisible}
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
        )}

        {/* 사용자 정의 추가 요소 */}
        {afterEl && <div className={styles['inp-after']}>{afterEl}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
