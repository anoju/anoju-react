// src/components/common/Radio.tsx
import React, {
  createContext,
  useContext,
  useRef,
  forwardRef,
  ChangeEvent,
} from 'react';
import styles from '@/assets/scss/components/checkRadio.module.scss';

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  const id = `radio_${uniqueIdCounter++}_${Math.random().toString(36).substring(2, 9)}`;
  return id;
};

// 라디오 버튼 값 타입 정의
type RadioValue = string | number;

// RadioContext 타입 정의
interface RadioContextType {
  value?: RadioValue;
  onChange: (value: RadioValue) => void;
  name?: string;
}

// Create a context for the Radio Group
const RadioContext = createContext<RadioContextType | undefined>(undefined);

// Individual Radio component props
interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type' | 'checked'
  > {
  id?: string;
  value: RadioValue; // value는 필수
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

// Individual Radio component
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      id,
      value,
      checked,
      onChange,
      children,
      className = '',
      inputClassName = '',
      iconClassName = '',
      labelClassName = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Check if inside a RadioGroup
    const context = useContext(RadioContext);

    // Generate a unique ID if not provided
    const radioIdRef = useRef<string>(id || generateUniqueId());
    const radioId = radioIdRef.current;

    // If inside a group, use the group's state management
    let isChecked = checked;

    if (context) {
      isChecked = context.value === value;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (context) {
        context.onChange(value);
      } else if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={`${styles.radio} ${className}`}>
        <input
          type="radio"
          id={radioId}
          value={String(value)}
          checked={isChecked || false}
          onChange={handleChange}
          className={`${styles.native} ${inputClassName}`}
          disabled={disabled}
          name={context?.name}
          ref={ref}
          {...props}
        />
        <i className={`${styles.ico} ${iconClassName}`} aria-hidden="true"></i>
        {children && (
          <label
            className={`${styles.lbl} ${labelClassName}`}
            htmlFor={radioId}
          >
            {children}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// Option type for Radio Group
interface RadioOption<T extends string | number = string | number> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

// 라디오 옵션 가드 함수
function isRadioOption<T extends string | number>(
  option: unknown
): option is RadioOption<T> {
  return (
    typeof option === 'object' &&
    option !== null &&
    'value' in option &&
    'label' in option
  );
}

// Radio Group component props
interface RadioGroupProps<T extends string | number = string | number> {
  children?: React.ReactNode;
  options?: (T | RadioOption<T>)[];
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  name?: string;
}

// Radio Group component with generic type support
export function RadioGroup<T extends string | number = string | number>({
  children,
  options,
  value,
  onChange,
  className = '',
  inputClassName = '',
  iconClassName = '',
  labelClassName = '',
  name,
  ...props
}: RadioGroupProps<T>) {
  const handleRadioChange = (radioValue: string | number) => {
    if (!onChange) return;
    onChange(radioValue as T);
  };

  // 자동 name 생성
  const nameRef = useRef<string>(name || `radio-group-${generateUniqueId()}`);
  const groupName = nameRef.current;

  const contextValue: RadioContextType = {
    value,
    onChange: handleRadioChange,
    name: groupName,
  };

  return (
    <RadioContext.Provider value={contextValue}>
      <div className={`check-wrap ${className}`} {...props}>
        {options
          ? // Render radios from options array
            options.map((option, idx) => {
              // 타입 안전한 처리
              let optionValue: string | number;
              let optionLabel: React.ReactNode;
              let optionDisabled = false;

              if (isRadioOption<string | number>(option)) {
                // RadioOption 객체인 경우
                optionValue = option.value;
                optionLabel = option.label;
                optionDisabled = option.disabled || false;
              } else {
                // 원시 값인 경우
                optionValue = option as string | number;
                optionLabel = option;
              }

              return (
                <Radio
                  key={`${String(optionValue)}-${idx}`}
                  value={optionValue}
                  inputClassName={inputClassName}
                  iconClassName={iconClassName}
                  labelClassName={labelClassName}
                  disabled={optionDisabled}
                >
                  {optionLabel}
                </Radio>
              );
            })
          : // Render children normally
            children}
      </div>
    </RadioContext.Provider>
  );
}

// Static property for Radio.Group
export const RadioWithGroups = Object.assign(Radio, {
  Group: RadioGroup,
});

export default RadioWithGroups;
