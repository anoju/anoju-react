// src/components/common/Checkbox.tsx
import React, {
  createContext,
  useContext,
  useRef,
  forwardRef,
  ChangeEvent,
} from 'react';

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
      <div className={`checkbox ${className}`}>
        <input
          type="checkbox"
          id={checkboxId}
          value={value}
          checked={isChecked || false}
          onChange={handleChange}
          className={inputClassName}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <i className={`ico ${iconClassName}`} aria-hidden="true"></i>
        <label className={`lbl ${labelClassName}`} htmlFor={checkboxId}>
          {children}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Option type for Checkbox Group
interface CheckboxOption {
  value: string | number;
  label: React.ReactNode;
}

// Checkbox Group component props
interface CheckboxGroupProps {
  children?: React.ReactNode;
  options?: (string | number | CheckboxOption)[];
  values?: (string | number)[];
  onChange?: (values: (string | number)[]) => void;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
}

// Checkbox Group component
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  children,
  options,
  values = [],
  onChange,
  className = '',
  inputClassName = '',
  iconClassName = '',
  labelClassName = '',
  ...props
}) => {
  const handleCheckboxChange = (
    checkboxValue: string | number,
    isChecked: boolean
  ) => {
    if (onChange) {
      if (isChecked) {
        // Add value to array
        onChange([...values, checkboxValue]);
      } else {
        // Remove value from array
        onChange(values.filter((value) => value !== checkboxValue));
      }
    }
  };

  const contextValue: CheckboxContextType = {
    values,
    onChange: handleCheckboxChange,
  };

  return (
    <CheckboxContext.Provider value={contextValue}>
      <div className={`form-wrap ${className}`} {...props}>
        {options
          ? // Render checkboxes from options array
            options.map((option) => {
              // Handle both object format { value, label } and string/number format
              const optionValue =
                typeof option === 'object'
                  ? (option as CheckboxOption).value
                  : option;
              const optionLabel =
                typeof option === 'object'
                  ? (option as CheckboxOption).label
                  : option;

              return (
                <Checkbox
                  key={optionValue}
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
};

// Static property for Checkbox.Group
const CheckboxComponent = Object.assign(Checkbox, {
  Group: CheckboxGroup,
});

export default CheckboxComponent;
