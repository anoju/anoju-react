// src/components/common/Checkbox.tsx
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
  const id = `checkbox_${uniqueIdCounter++}_${Math.random().toString(36).substring(2, 9)}`;
  return id;
};

// CheckboxContext 타입 정의 - value가 있는 경우와 없는 경우 모두 처리
interface CheckboxContextType {
  values: (string | number | boolean)[];
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
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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

    // Generate a unique ID if not provided
    const checkboxIdRef = useRef<string>(id || generateUniqueId());
    const checkboxId = checkboxIdRef.current;

    // If inside a group, use the group's state management
    let isChecked = checked;

    if (context) {
      if (context.booleanMode) {
        // Boolean mode (index 기반)
        isChecked = typeof index === 'number' ? !!context.values[index] : false;
      } else {
        // Value mode
        isChecked = context.values.includes(value as any);
      }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (context) {
        if (context.booleanMode) {
          context.onChange(undefined, e.target.checked, index);
        } else {
          context.onChange(value, e.target.checked);
        }
      } else if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={`${styles.checkbox} ${className}`}>
        <input
          type="checkbox"
          id={checkboxId}
          value={value !== undefined ? String(value) : ''}
          checked={isChecked || false}
          onChange={handleChange}
          className={`${styles.inp} ${inputClassName}`}
          disabled={disabled}
          ref={ref}
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

// Checkbox Group component with generic type support
export function CheckboxGroup<
  T extends string | number | boolean = string | number,
>({
  children,
  options,
  values = [],
  onChange,
  className = '',
  inputClassName = '',
  iconClassName = '',
  labelClassName = '',
  ...props
}: CheckboxGroupProps<T>) {
  // value가 없는 경우(boolean 모드) 감지
  const childrenArray = React.Children.toArray(children);
  const hasValueProp =
    childrenArray.length > 0 &&
    React.isValidElement(childrenArray[0]) &&
    'value' in childrenArray[0].props;

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
    values: values as (string | number | boolean)[],
    booleanMode,
    onChange: handleCheckboxChange,
  };

  return (
    <CheckboxContext.Provider value={contextValue}>
      <div className={`check-wrap ${className}`} {...props}>
        {options
          ? // Render checkboxes from options array
            options.map((option, idx) => {
              // Handle both object format { value, label } and string/number format
              const optionValue =
                typeof option === 'object'
                  ? (option as CheckboxOption<any>).value
                  : option;
              const optionLabel =
                typeof option === 'object'
                  ? (option as CheckboxOption<any>).label
                  : option;

              return (
                <Checkbox
                  key={String(optionValue) + idx}
                  value={optionValue as string | number}
                  inputClassName={inputClassName}
                  iconClassName={iconClassName}
                  labelClassName={labelClassName}
                  index={idx}
                >
                  {optionLabel}
                </Checkbox>
              );
            })
          : // Render children normally, and add index prop for boolean mode
            React.Children.map(children, (child, idx) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(
                  child as React.ReactElement<CheckboxProps>,
                  {
                    index: idx,
                    inputClassName:
                      child.props.inputClassName || inputClassName,
                    iconClassName: child.props.iconClassName || iconClassName,
                    labelClassName:
                      child.props.labelClassName || labelClassName,
                  }
                );
              }
              return child;
            })}
      </div>
    </CheckboxContext.Provider>
  );
}

// Static property for Checkbox.Group
export const CheckboxWithGroups = Object.assign(Checkbox, {
  Group: CheckboxGroup,
});

export default CheckboxWithGroups;
