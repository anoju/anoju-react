// src/components/common/Checkbox.tsx
import React, {
  createContext,
  useContext,
  useRef,
  forwardRef,
  ChangeEvent,
  useState,
  useImperativeHandle,
} from 'react';
import styles from '@/assets/scss/components/checkRadio.module.scss';

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  const id = `checkbox_${uniqueIdCounter++}_${Math.random().toString(36).substring(2, 9)}`;
  return id;
};

// 체크박스 값 타입 정의
type CheckboxValue = string | number | boolean;

// CheckboxContext 타입 정의 - value가 있는 경우와 없는 경우 모두 처리
interface CheckboxContextType {
  values: CheckboxValue[];
  booleanMode: boolean;
  onChange: (
    value: string | number | boolean | undefined,
    checked: boolean,
    index?: number
  ) => void;
}

// Create a context for the Checkbox Group
const CheckboxContext = createContext<CheckboxContextType | undefined>(
  undefined
);

// 외부에서 호출 가능한 메서드 인터페이스 정의
export interface CheckboxHandle {
  focus: () => void;
}

// Individual Checkbox component props
interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  id?: string;
  value?: string | number; // value를 선택적으로 변경
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  index?: number; // Group 내에서의 인덱스 (boolean 모드용)
}

// Individual Checkbox component
export const Checkbox = forwardRef<CheckboxHandle, CheckboxProps>(
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
      index,
      ...props
    },
    ref
  ) => {
    // Check if inside a CheckboxGroup
    const context = useContext(CheckboxContext);

    // 내부 상태 관리 - checked prop이 undefined일 때만 사용
    const [internalChecked, setInternalChecked] = useState(false);

    // Generate a unique ID if not provided
    const checkboxIdRef = useRef<string>(id || generateUniqueId());
    const checkboxId = checkboxIdRef.current;

    // 체크 상태 결정 로직
    let isChecked: boolean;

    if (context) {
      // 그룹 내에서의 체크 상태 결정
      if (context.booleanMode) {
        // Boolean mode (index 기반)
        isChecked = typeof index === 'number' ? !!context.values[index] : false;
      } else {
        // Value mode
        isChecked =
          value !== undefined &&
          context.values.includes(value as CheckboxValue);
      }
    } else if (checked !== undefined) {
      // 외부에서 제공된 checked prop이 있는 경우
      isChecked = checked;
    } else {
      // 독립형 체크박스로 사용되며 checked prop이 없는 경우, 내부 상태 사용
      isChecked = internalChecked;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (context) {
        // 그룹 내에서의 변경 처리
        if (context.booleanMode) {
          context.onChange(undefined, e.target.checked, index);
        } else {
          context.onChange(value, e.target.checked);
        }
      } else if (onChange) {
        // 외부 onChange 핸들러가 있는 경우
        onChange(e);
      } else if (checked === undefined) {
        // 독립형 체크박스이고 checked prop이 없는 경우, 내부 상태 업데이트
        setInternalChecked(e.target.checked);
      }
    };

    // input 요소에 대한 참조 생성
    const inputRef = useRef<HTMLInputElement>(null);

    // useImperativeHandle을 사용하여 외부에서 호출 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
    }));

    return (
      <div className={`${styles.checkbox} ${className}`}>
        <input
          type="checkbox"
          id={checkboxId}
          value={value !== undefined ? String(value) : ''}
          checked={isChecked || false}
          onChange={handleChange}
          className={`${styles.native} ${inputClassName}`}
          disabled={disabled}
          ref={inputRef}
          {...props}
        />
        <i className={`${styles.ico} ${iconClassName}`} aria-hidden="true"></i>
        {children && (
          <label
            className={`${styles.lbl} ${labelClassName}`}
            htmlFor={checkboxId}
          >
            {children}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Option type for Checkbox Group
interface CheckboxOption<T extends string | number = string | number> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

// 체크박스 옵션 가드 함수
function isCheckboxOption<T extends string | number>(
  option: unknown
): option is CheckboxOption<T> {
  return (
    typeof option === 'object' &&
    option !== null &&
    'value' in option &&
    'label' in option
  );
}

// Checkbox Group 핸들 인터페이스
export interface CheckboxGroupHandle {
  focus: (index?: number) => void;
}

// Checkbox Group component props
interface CheckboxGroupProps<
  T extends string | number | boolean = string | number,
> {
  children?: React.ReactNode;
  options?: (T | CheckboxOption<T extends string | number ? T : never>)[];
  values?: T[];
  onChange?: (values: T[]) => void;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
}

// Checkbox Group component
const CheckboxGroupWithRef = <
  T extends string | number | boolean = string | number,
>(
  props: CheckboxGroupProps<T> & {
    ref?: React.ForwardedRef<CheckboxGroupHandle>;
  }
) => {
  const {
    children,
    options,
    values = [],
    onChange,
    className = '',
    inputClassName = '',
    iconClassName = '',
    labelClassName = '',
    ref,
    ...rest
  } = props;

  // refs 배열 참조 생성
  const refs = useRef<(CheckboxHandle | null)[]>([]);

  // ref 노출을 위한 useImperativeHandle 설정
  useImperativeHandle(ref, () => ({
    focus: (index?: number) => {
      // 인덱스가 제공된 경우 해당 체크박스에 포커스
      if (typeof index === 'number' && refs.current[index]) {
        refs.current[index]?.focus();
        return;
      }

      // 인덱스가 제공되지 않은 경우 첫 번째 사용 가능한 체크박스에 포커스
      const firstAvailableCheckbox = refs.current.find((_, idx) => {
        if (options) {
          const optionObj = options[idx];
          if (isCheckboxOption<string | number>(optionObj)) {
            // 옵션이 객체인 경우 disabled 속성 확인
            return !optionObj.disabled;
          }
          return true; // 옵션이 객체가 아닌 경우 기본적으로 활성화 상태
        }
        return true; // 옵션이 없는 경우 기본적으로 활성화 상태
      });

      if (firstAvailableCheckbox) {
        firstAvailableCheckbox.focus();
      }
    },
  }));

  // value가 없는 경우(boolean 모드) 감지
  const childrenArray = React.Children.toArray(children);

  // 타입 안전하게 isValidElement 및 'props' 접근
  const hasValueProp =
    childrenArray.length > 0 &&
    React.isValidElement<{ value?: unknown }>(childrenArray[0]) &&
    childrenArray[0].props.value !== undefined;

  const booleanMode = !hasValueProp && options === undefined;

  const handleCheckboxChange = (
    checkboxValue: string | number | boolean | undefined,
    isChecked: boolean,
    index?: number
  ) => {
    if (!onChange) return;

    if (booleanMode && typeof index === 'number') {
      // Boolean 모드 처리 (인덱스 기반)
      const newValues = [...values];
      // 타입 안전성을 위해 검증
      newValues[index] = isChecked as T;
      onChange(newValues);
    } else {
      // Value 모드 처리
      if (isChecked) {
        // Add value to array
        onChange([...values, checkboxValue as T]);
      } else {
        // Remove value from array
        onChange(values.filter((value) => value !== checkboxValue));
      }
    }
  };

  const contextValue: CheckboxContextType = {
    values: values as CheckboxValue[],
    booleanMode,
    onChange: handleCheckboxChange,
  };

  return (
    <CheckboxContext.Provider value={contextValue}>
      <div className={`check-wrap ${className}`} {...rest}>
        {options
          ? // Render checkboxes from options array
            options.map((option, idx) => {
              // 타입 안전한 처리
              let optionValue: string | number | undefined;
              let optionLabel: React.ReactNode;
              let optionDisabled = false;

              if (isCheckboxOption<string | number>(option)) {
                // CheckboxOption 객체인 경우
                optionValue = option.value;
                optionLabel = option.label;
                optionDisabled = !!option.disabled;
              } else {
                // 원시 값인 경우
                optionValue =
                  typeof option === 'boolean'
                    ? undefined
                    : (option as string | number);
                optionLabel = option;
              }

              return (
                <Checkbox
                  key={`${String(optionValue || idx)}-${idx}`}
                  value={optionValue}
                  disabled={optionDisabled}
                  inputClassName={inputClassName}
                  iconClassName={iconClassName}
                  labelClassName={labelClassName}
                  index={idx}
                  ref={(el) => {
                    // refs 배열에 참조 저장
                    refs.current[idx] = el;
                  }}
                >
                  {optionLabel}
                </Checkbox>
              );
            })
          : // Render children normally, and add index prop for boolean mode
            React.Children.map(children, (child, idx) => {
              if (React.isValidElement<CheckboxProps>(child)) {
                // 자식 컴포넌트 복제 (ref를 직접 전달하지 않음)
                return React.cloneElement(child, {
                  index: idx,
                  inputClassName: child.props.inputClassName || inputClassName,
                  iconClassName: child.props.iconClassName || iconClassName,
                  labelClassName: child.props.labelClassName || labelClassName,
                  key: child.key || `checkbox-child-${idx}`,
                });
              }
              return child;
            })}
      </div>
    </CheckboxContext.Provider>
  );
};

// forwardRef로 감싸기
export const CheckboxGroup = forwardRef(CheckboxGroupWithRef) as <
  T extends string | number | boolean = string | number,
>(
  props: CheckboxGroupProps<T> & {
    ref?: React.ForwardedRef<CheckboxGroupHandle>;
  }
) => React.ReactElement;

// 컴포넌트 이름 설정
(CheckboxGroup as any).displayName = 'CheckboxGroup';

// Static property for Checkbox.Group
export const CheckboxWithGroups = Object.assign(Checkbox, {
  Group: CheckboxGroup,
});

export default CheckboxWithGroups;
