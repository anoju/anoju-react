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

// CheckboxContext 타입 정의
interface CheckboxContextType {
  values: (string | number)[];
  onChange: (value: string | number, checked: boolean) => void;
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
  value: string | number;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
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
    const isChecked = context ? context.values.includes(value) : checked;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (context) {
        context.onChange(value, e.target.checked);
      } else if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={`${styles.checkbox} ${className}`}>
        <input
          type="checkbox"
          id={checkboxId}
          value={value}
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
interface CheckboxGroupProps<T extends string | number = string | number> {
  children?: React.ReactNode;
  options?: (T | CheckboxOption<T>)[];
  values?: T[];
  onChange?: (values: T[]) => void;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
}

// Checkbox Group component with generic type support
export function CheckboxGroup<T extends string | number = string | number>({
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
  const handleCheckboxChange = (
    checkboxValue: string | number,
    isChecked: boolean
  ) => {
    if (onChange) {
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
    values: values as (string | number)[],
    onChange: handleCheckboxChange,
  };

  return (
    <CheckboxContext.Provider value={contextValue}>
      <div className={`check-wrap ${className}`} {...props}>
        {options
          ? // Render checkboxes from options array
            options.map((option) => {
              // Handle both object format { value, label } and string/number format
              const optionValue =
                typeof option === 'object'
                  ? (option as CheckboxOption<T>).value
                  : option;
              const optionLabel =
                typeof option === 'object'
                  ? (option as CheckboxOption<T>).label
                  : option;

              return (
                <Checkbox
                  key={String(optionValue)}
                  value={optionValue}
                  inputClassName={inputClassName}
                  iconClassName={iconClassName}
                  labelClassName={labelClassName}
                >
                  {optionLabel}
                </Checkbox>
              );
            })
          : // Render children normally if no options provided
            children}
      </div>
    </CheckboxContext.Provider>
  );
}

// Static property for Checkbox.Group
export const CheckboxWithGroups = Object.assign(Checkbox, {
  Group: CheckboxGroup,
});

export default CheckboxWithGroups;
