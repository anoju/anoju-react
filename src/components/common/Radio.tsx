// src/components/common/Radio.tsx
import React, {
  createContext,
  useContext,
  useRef,
  forwardRef,
  ChangeEvent,
  useImperativeHandle,
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

// 외부에서 호출 가능한 메서드 인터페이스 정의
export interface RadioHandle {
  focus: () => void;
  blur: () => void;
  isChecked: () => boolean;
  select: () => void;
  getRootElement: () => HTMLElement | null;
  getInputElement: () => HTMLInputElement | null;
}

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
export const Radio = forwardRef<RadioHandle, RadioProps>(
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

    // input 요소에 대한 참조 생성
    const inputRef = useRef<HTMLInputElement>(null);
    
    // 컨테이너 요소에 대한 참조 생성
    const rootRef = useRef<HTMLDivElement>(null);

    // useImperativeHandle을 사용하여 외부에서 호출 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      blur: () => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      },
      isChecked: () => {
        return !!isChecked;
      },
      select: () => {
        if (disabled) return; // 비활성화된 경우 동작하지 않음
        
        // 이미 선택된 경우 작업 필요 없음
        if (isChecked) return;
        
        // 그룹 내에서의 처리
        if (context) {
          context.onChange(value);
        } else if (onChange && inputRef.current) {
          // 외부 onChange 호출
          const fakeEvent = {
            target: { checked: true },
            currentTarget: { checked: true },
            preventDefault: () => {},
            stopPropagation: () => {},
          } as unknown as ChangeEvent<HTMLInputElement>;
          
          onChange(fakeEvent);
        }
        
        // DOM 요소를 직접 업데이트
        if (inputRef.current) {
          inputRef.current.checked = true;
        }
      },
      getRootElement: () => rootRef.current,
      getInputElement: () => inputRef.current,
    }));

    return (
      <div ref={rootRef} className={`${styles.radio} ${className}`}>
        <input
          type="radio"
          id={radioId}
          value={String(value)}
          checked={isChecked || false}
          onChange={handleChange}
          className={`${styles.inp} ${styles.native} ${inputClassName}`}
          disabled={disabled}
          name={context?.name}
          ref={inputRef}
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

// 외부에서 호출 가능한 그룹 메서드 인터페이스 정의
export interface RadioGroupHandle {
  focus: (index?: number) => void;
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
export const RadioGroup = forwardRef(
  <T extends string | number = string | number>(
    {
      children,
      options,
      value,
      onChange,
      className = '',
      inputClassName = '',
      iconClassName = '',
      labelClassName = '',
      name,
      ...rest
    }: RadioGroupProps<T>,
    ref: React.ForwardedRef<RadioGroupHandle>
  ) => {
    // 자식 라디오 컴포넌트에 대한 참조 배열
    const refs = useRef<(RadioHandle | null)[]>([]);

    // useImperativeHandle을 사용하여 외부에서 호출 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
      focus: (index?: number) => {
        // 인덱스가 제공된 경우 해당 라디오에 포커스
        if (typeof index === 'number' && refs.current[index]) {
          refs.current[index]?.focus();
          return;
        }

        // 인덱스가 제공되지 않은 경우 첫 번째 사용 가능한 라디오에 포커스
        const firstAvailableRadio = refs.current.find((_, idx) => {
          if (options) {
            const optionObj = options[idx];
            if (isRadioOption<string | number>(optionObj)) {
              // 옵션이 객체인 경우 disabled 속성 확인
              return !optionObj.disabled;
            }
            return true; // 옵션이 객체가 아닌 경우 기본적으로 활성화 상태
          }
          return true; // 옵션이 없는 경우 기본적으로 활성화 상태
        });

        if (firstAvailableRadio) {
          firstAvailableRadio.focus();
        }
      },
    }));

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
        <div className={`check-wrap ${className}`} {...rest}>
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
                  optionDisabled = !!option.disabled;
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
                    ref={(el) => {
                      // refs 배열에 참조 저장
                      refs.current[idx] = el;
                    }}
                  >
                    {optionLabel}
                  </Radio>
                );
              })
            : // Render children normally
              React.Children.map(children, (child, idx) => {
                if (React.isValidElement<RadioProps>(child)) {
                  // ref를 이용한 직접 수정 방식 대신 필요한 속성만 포함
                  return React.cloneElement(child, {
                    key: child.key || `radio-child-${idx}`,
                  });
                }
                return child;
              })}
        </div>
      </RadioContext.Provider>
    );
  }
) as unknown as React.ForwardRefExoticComponent<RadioGroupProps<string | number> & React.RefAttributes<RadioGroupHandle>>;

// 컴포넌트 이름 설정 (ESLint 경고 없이)
RadioGroup.displayName = 'RadioGroup';

// Static property for Radio.Group
export const RadioWithGroups = Object.assign(Radio, {
  Group: RadioGroup,
});

export default RadioWithGroups;
