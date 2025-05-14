// src/components/common/Input.tsx
import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  ReactNode,
  ChangeEvent,
  FocusEvent,
} from 'react';
import styles from '@/assets/scss/components/input.module.scss';
import cx from '@/utils/cx';

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
  // 필요한 다른 input 속성들을 여기에 추가할 수 있습니다
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
  // 기능 관련
  isReset?: boolean;
  showPassword?: boolean;
  beforeEl?: ReactNode;
  afterEl?: ReactNode;
  onlyNumber?: boolean;
  addComma?: boolean;
  // 다중 input 태그 관련
  values?: (string | number)[];
  inputFields?: InputFieldProps[];
  separator?: ReactNode; // 입력 필드 사이에 표시할 구분자
  onChange?: (e: ChangeEvent<HTMLInputElement>, index?: number) => void;
  // 이벤트 핸들러 (override)
  onFocus?: (e: FocusEvent<HTMLInputElement>, index?: number) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>, index?: number) => void;
}

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
      isReset = true,
      showPassword = false,
      beforeEl,
      afterEl,
      onlyNumber = false,
      addComma = false,

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
    // 내부 상태 관리
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
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [buttonsWidth, setButtonsWidth] = useState<number | null>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const isControlled = value !== undefined || values !== undefined;
    const isMultipleInputs = values !== undefined;

    // 비밀번호 표시 상태 결정
    const actualType = type === 'password' && passwordVisible ? 'text' : type;

    // 외부 value/values prop이 변경되면 내부 상태 업데이트
    useEffect(() => {
      if (isControlled) {
        if (value !== undefined) {
          setInputValue(String(value));
        }
        if (values !== undefined) {
          const newInputValues = values.map((val) =>
            val !== undefined ? String(val) : ''
          );
          setInputValues(newInputValues);
        }
      }
    }, [value, values, isControlled]);

    // 입력값 초기화 함수
    const handleReset = () => {
      if (!disabled && !readOnly) {
        if (isMultipleInputs) {
          // 모든 input 필드 초기화 (disabled 상태 유지)
          const newValues = inputValues.map((_, index) => {
            // disabled 상태의 input은 그대로 현재 값을 유지
            const fieldProps = inputFields[index] || {};
            const fieldDisabled =
              fieldProps.disabled !== undefined
                ? fieldProps.disabled
                : disabled;

            if (fieldDisabled) {
              return inputValues[index]; // disabled 필드는 값 유지
            }
            return ''; // disabled가 아닌 필드만 초기화
          });

          setInputValues(newValues);

          // multiValues 업데이트
          if (values) {
            // 해당 페이지의 handleInputChange 함수를 한 번만 호출
            // 각각의 인덱스마다 호출하면 오류 발생 가능성이 있음
            if (onChange) {
              // 전체 값을 다루는 하나의 이벤트 생성
              const syntheticEvent = {
                target: { name: 'reset-all-fields' },
                currentTarget: { name: 'reset-all-fields' },
                type: 'reset',
                preventDefault: () => {},
                stopPropagation: () => {},
              } as unknown as React.ChangeEvent<HTMLInputElement>;

              // 전체 값을 한번에 변경하는 스페셜 콜백 호출
              onChange(syntheticEvent, -1); // -1은 전체 필드 초기화를 의미
            }
          }

          // 포커스 설정 - 첫 번째 사용 가능한 필드에 포커스
          const firstEnabledInputIndex = inputRefs.current.findIndex(
            (input, index) => {
              const fieldProps = inputFields[index] || {};
              const fieldDisabled =
                fieldProps.disabled !== undefined
                  ? fieldProps.disabled
                  : disabled;
              const fieldReadOnly =
                fieldProps.readOnly !== undefined
                  ? fieldProps.readOnly
                  : readOnly;

              return input && !fieldDisabled && !fieldReadOnly;
            }
          );

          if (
            firstEnabledInputIndex !== -1 &&
            inputRefs.current[firstEnabledInputIndex]
          ) {
            inputRefs.current[firstEnabledInputIndex].focus();
          }
        } else {
          // 단일 input 초기화
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
          return (
            parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1]
          );
        }
        // 소수점이 없는 경우
        return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

      return numberValue;
    };

    // 입력 처리 핸들러
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index?: number
    ) => {
      let newValue = e.target.value;

      // 숫자만 입력 처리
      if (onlyNumber) {
        newValue = formatNumberWithComma(newValue);

        // DOM 요소 값 직접 업데이트 (controlled input 문제 해결)
        e.target.value = newValue;
      }

      if (isMultipleInputs && index !== undefined) {
        // 다중 input 태그 처리, 값을 복사하여 변경
        const newValues = [...inputValues];
        newValues[index] = newValue;
        setInputValues(newValues);
      } else {
        // 단일 input 태그 처리
        // 내부 상태 업데이트 (controlled 여부와 관계없이)
        if (!isControlled) {
          setInputValue(newValue);
        }
      }

      // 외부 onChange 콜백 호출
      if (onChange) {
        onChange(e, index);
      }
    };

    // 포커스 처리 핸들러
    const handleFocus = (
      e: React.FocusEvent<HTMLInputElement>,
      index?: number
    ) => {
      setIsFocused(true);

      if (onFocus) {
        onFocus(e, index);
      }
    };

    // 블러 처리 핸들러
    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement>,
      index?: number
    ) => {
      setIsFocused(false);

      if (onBlur) {
        onBlur(e, index);
      }
    };

    // 컴포넌트 영역 클릭 시 input에 포커스를 주는 핸들러
    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // 클릭된 요소가 input, button, select 등의 폼 요소가 아닌 경우에만
      // 요소의 태그명 확인
      const tagName = (e.target as HTMLElement).tagName.toLowerCase();
      const isFormControl = [
        'input',
        'button',
        'select',
        'textarea',
        'option',
      ].includes(tagName);

      // 폼 요소가 아니면서 disabled나 readonly가 아닌 상태에서만 포커스 부여
      if (!isFormControl && !disabled && !readOnly) {
        if (isMultipleInputs) {
          // 다중 input의 경우 disabled, readonly가 아닌 첫 번째 요소에 포커스
          const firstEnabledInputIndex = inputRefs.current.findIndex(
            (input, index) => {
              const fieldProps = inputFields[index] || {};
              const fieldDisabled =
                fieldProps.disabled !== undefined
                  ? fieldProps.disabled
                  : disabled;
              const fieldReadOnly =
                fieldProps.readOnly !== undefined
                  ? fieldProps.readOnly
                  : readOnly;

              return input && !fieldDisabled && !fieldReadOnly;
            }
          );

          if (
            firstEnabledInputIndex !== -1 &&
            inputRefs.current[firstEnabledInputIndex]
          ) {
            inputRefs.current[firstEnabledInputIndex].focus();
          }
        } else {
          // 단일 input의 경우 해당 input에 포커스
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }
    };

    // 클래스 이름 생성
    const wrapperClasses = cx(styles.input, className, {
      [styles.disabled]: disabled,
      [styles.focused]: isFocused,
      [styles['with-before']]: !!beforeEl,
      [styles['with-after']]: !!afterEl,
      [styles['with-buttons']]:
        !!(
          isReset &&
          (inputValue || inputValues.some((val) => val)) &&
          !disabled &&
          !readOnly
        ) || !!(type === 'password' && showPassword && !disabled && !readOnly),
    });

    // 다중 input 태그 렌더링
    const renderInputFields = () => {
      if (!isMultipleInputs || !values) return null;

      // 구분자가 있는 경우, 필드와 구분자를 번갈아가며 표시
      if (separator && values.length > 1) {
        const elements: ReactNode[] = [];

        values.forEach((_, index) => {
          // 각 필드를 생성
          const fieldElement = createInputField(index);
          elements.push(
            <React.Fragment key={`input-field-${index}`}>
              {fieldElement}
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
    };

    // 개별 입력 필드 생성 함수
    const createInputField = (index: number) => {
      // 개별 input 태그의 속성 가져오기
      const fieldProps = inputFields[index] || {};

      // 현재 input 태그의 값
      const currentValue = inputValues[index];

      // 개별 속성 또는 기본 컴포넌트 속성 사용
      const fieldType = fieldProps.type !== undefined ? fieldProps.type : type;
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

      // 비밀번호 표시 상태 결정
      const fieldActualType =
        fieldType === 'password' && passwordVisible ? 'text' : fieldType;

      // 필드 클래스 이름 생성
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
            // 첫 번째 필드의 경우 외부 ref도 연결
            if (index === 0) {
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
    };

    // 리셋 버튼 렌더링 조건
    const showResetButton =
      isReset &&
      !disabled &&
      !readOnly &&
      ((isMultipleInputs &&
        // 다중 입력 필드일 때: disabled가 아닌 필드 중에서 값이 있는 필드가 하나라도 있는지 확인
        inputValues.some((value, index) => {
          const fieldProps = inputFields[index] || {};
          const fieldDisabled =
            fieldProps.disabled !== undefined ? fieldProps.disabled : disabled;
          const fieldReadOnly =
            fieldProps.readOnly !== undefined ? fieldProps.readOnly : readOnly;
          return value && !fieldDisabled && !fieldReadOnly;
        })) ||
        // 단일 입력 필드일 때
        (!isMultipleInputs && inputValue));

    // 비밀번호 토글 버튼 렌더링 조건
    const showPasswordToggle =
      type === 'password' && showPassword && !disabled && !readOnly;

    // 버튼 영역 너비 계산을 위한 useLayoutEffect
    useLayoutEffect(() => {
      // 버튼 영역이 존재하고, 버튼이 표시될 조건일 때만 너비 계산
      if (buttonsRef.current && (showResetButton || showPasswordToggle)) {
        // 현재 버튼 영역의 너비 측정
        const width = buttonsRef.current.offsetWidth;
        // 너비가 0보다 크고 현재 저장된 너비와 다른 경우에만 업데이트
        if (width > 0 && width !== buttonsWidth) {
          setButtonsWidth(width);
        }
      }
    }, [
      // 버튼 영역에 영향을 주는 상태들을 의존성 배열에 추가
      inputValue,
      inputValues,
      showResetButton,
      showPasswordToggle,
      passwordVisible,
      buttonsWidth,
    ]);

    const inputClasses = cx(
      styles.native,
      inputClassName,
      align ? styles[`align-${align}`] : ''
    );

    // 단일 input 태그의 표시 값
    const displayValue =
      isControlled && !isMultipleInputs
        ? onlyNumber && addComma && value !== undefined && value !== ''
          ? formatNumberWithComma(String(value))
          : value
        : inputValue;

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
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleFocus(e)}
            onBlur={(e) => handleBlur(e)}
            {...restProps}
          />
        )}

        {/* 입력 필드 뒤에 표시할 요소들 - 항상 렌더링하고 너비 고정 */}
        <div
          className={styles['inp-buttons']}
          ref={buttonsRef}
          style={{
            width: buttonsWidth ? `${buttonsWidth}px` : 'auto',
            visibility:
              showResetButton || showPasswordToggle ? 'visible' : 'hidden',
          }}
        >
          {/* 리셋 버튼 */}
          {showResetButton && (
            <button
              type="button"
              className={styles['inp-reset']}
              onClick={handleReset}
              aria-label="입력 내용 지우기"
            />
          )}

          {/* 비밀번호 표시 토글 버튼 */}
          {showPasswordToggle && (
            <button
              type="button"
              className={cx(styles['password-toggle'], {
                [styles.visible]: passwordVisible,
              })}
              onClick={togglePasswordVisibility}
              aria-label={passwordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
            />
          )}
        </div>

        {/* 사용자 정의 추가 요소 */}
        {afterEl && <div className={styles['inp-after']}>{afterEl}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
