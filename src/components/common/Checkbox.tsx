// src/components/common/Checkbox.tsx
import React, {
  createContext,
  useContext,
  useRef,
  forwardRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useImperativeHandle,
  useEffect,
  ChangeEvent,
} from 'react';
import styles from '@/assets/scss/components/checkRadio.module.scss';
import cx from '@/utils/cx';

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  return `checkbox_${uniqueIdCounter++}_${Math.random().toString(36).slice(2, 9)}`;
};

// 체크박스 값 타입 정의
type CheckboxValue = string | number | boolean;
type SetValueFunction<T> =
  | React.Dispatch<React.SetStateAction<T>>
  | ((value: T) => void);

// 유틸리티 함수 - 파라미터가 T 타입의 값을 포함하는지 확인
function includesValue<T>(array: T[], value: unknown): boolean {
  return array.some((item) => item === value);
}

// CheckboxContext 타입 정의
interface CheckboxContextType<T = CheckboxValue> {
  value: T[];
  booleanMode: boolean;
  onChange?: (values: T[]) => void;
  setValue?: SetValueFunction<T[]>;
  name?: string;
  disabled?: boolean;
  registerCheckbox?: (index: number, handle: CheckboxHandle | null) => void;
  isBtn?: boolean;
  isSwitch?: boolean;
  leftLabel?: boolean;
}

// CheckboxContext 생성
const CheckboxContext = createContext<CheckboxContextType | undefined>(
  undefined
);

// 외부에서 호출 가능한 메서드 인터페이스 정의
export interface CheckboxHandle {
  focus: () => void;
  blur: () => void;
  isChecked: () => boolean;
  setValue: (checked: boolean) => void;
  toggle: () => void;
  getRootElement: () => HTMLElement | null;
  getInputElement: () => HTMLInputElement | null;
}

// Individual Checkbox component props
export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  id?: string;
  value?: string | number;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  setValue?: SetValueFunction<boolean>;
  children?: ReactNode;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  isBtn?: boolean;
  isSwitch?: boolean;
  leftLabel?: boolean;
  index?: number; // Group 내에서의 인덱스 (자동 등록용)
}

// Individual Checkbox component
export const Checkbox = forwardRef<CheckboxHandle, CheckboxProps>(
  (
    {
      id,
      value,
      checked,
      indeterminate = false,
      onChange,
      setValue: setValueProp,
      children,
      className = '',
      inputClassName = '',
      iconClassName = '',
      labelClassName = '',
      disabled = false,
      isBtn = false,
      isSwitch = false,
      leftLabel = false,
      index,
      ...props
    },
    ref
  ) => {
    // CheckboxContext 사용
    const context = useContext(CheckboxContext);

    // 그룹에서 상속받은 속성 적용
    const mergedDisabled = disabled || context?.disabled;
    const mergedIsBtn = isBtn || context?.isBtn;
    const mergedIsSwitch = isSwitch || context?.isSwitch;
    const mergedLeftLabel = leftLabel || context?.leftLabel;

    // 내부 상태 관리 - checked prop이 undefined일 때만 사용
    const [internalChecked, setInternalChecked] = useState(false);

    // Generate a unique ID if not provided
    const checkboxIdRef = useRef<string>(id || generateUniqueId());
    const checkboxId = checkboxIdRef.current;

    // input 요소에 대한 참조 생성
    const inputRef = useRef<HTMLInputElement>(null);

    // 컨테이너 요소에 대한 참조 생성
    const rootRef = useRef<HTMLDivElement>(null);

    // 핸들 참조
    const handleRef = useRef<CheckboxHandle | null>(null);

    // indeterminate 상태 적용
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // 체크 상태 결정 로직
    const isChecked = useMemo(() => {
      if (context) {
        // 그룹 내에서의 체크 상태 결정
        if (context.booleanMode) {
          // Boolean mode (index 기반)
          return typeof index === 'number' ? !!context.value[index] : false;
        }
        // Value mode
        return value !== undefined && includesValue(context.value, value);
      } else if (checked !== undefined) {
        // 외부에서 제공된 checked prop이 있는 경우
        return checked;
      }
      // 독립형 체크박스로 사용되며 checked prop이 없는 경우, 내부 상태 사용
      return internalChecked;
    }, [context, index, value, checked, internalChecked]);

    // 상태 변경 처리 함수
    const updateCheckedState = useCallback(
      (newChecked: boolean) => {
        // 비활성화된 경우 무시
        if (mergedDisabled) {
          return;
        }

        // 상태 업데이트 처리
        if (context) {
          // 그룹 내에서의 변경 처리
          if (context.booleanMode) {
            // Boolean 모드 (인덱스 기반)
            if (typeof index === 'number') {
              const newValues = [...context.value];
              newValues[index] = newChecked;

              // setValue가 있으면 사용, 없으면 onChange 사용
              if (context.setValue) {
                context.setValue(newValues);
              } else if (context.onChange) {
                context.onChange(newValues);
              }
            }
          } else if (value !== undefined) {
            // Value 모드
            let newValues: typeof context.value;

            if (newChecked) {
              // 값 추가 (중복 방지)
              if (includesValue(context.value, value)) {
                newValues = [...context.value];
              } else {
                newValues = [...context.value, value];
              }
            } else {
              // 값 제거
              newValues = context.value.filter((v) => v !== value);
            }

            // setValue가 있으면 사용, 없으면 onChange 사용
            if (context.setValue) {
              context.setValue(newValues);
            } else if (context.onChange) {
              context.onChange(newValues);
            }
          }
        } else if (setValueProp) {
          // 외부 setValue 핸들러가 있는 경우
          setValueProp(newChecked);
        } else if (checked === undefined) {
          // 독립형 체크박스이고 checked prop이 없는 경우, 내부 상태 업데이트
          setInternalChecked(newChecked);
        }

        // DOM 요소의 checked 값도 직접 변경 (필요한 경우)
        if (
          inputRef.current &&
          checked === undefined &&
          !context &&
          !setValueProp
        ) {
          inputRef.current.checked = newChecked;
        }
      },
      [context, value, index, mergedDisabled, setValueProp, checked]
    );

    // 변경 이벤트 핸들러
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        // 항상 onChange 핸들러 호출 (제공된 경우)
        if (onChange) {
          onChange(e);
        }

        // 체크 상태 업데이트
        updateCheckedState(e.target.checked);
      },
      [onChange, updateCheckedState]
    );

    // 외부에서 호출 가능한 메서드 정의
    useImperativeHandle(ref, () => {
      const handle: CheckboxHandle = {
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
        setValue: (checked: boolean) => {
          // 비활성화된 경우 무시
          if (mergedDisabled) {
            return;
          }

          if (onChange) {
            // 포커스 유지를 위해 현재 액티브 요소 저장
            const activeElement = document.activeElement;

            // 가짜 이벤트 생성
            const fakeEvent = {
              target: { checked },
              currentTarget: { checked },
              preventDefault: () => {},
              stopPropagation: () => {},
            } as unknown as ChangeEvent<HTMLInputElement>;

            onChange(fakeEvent);

            // 포커스 유지
            if (activeElement === inputRef.current) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }

          // 체크 상태 업데이트
          updateCheckedState(checked);
        },
        toggle: () => {
          // 비활성화된 경우 동작하지 않음
          if (mergedDisabled) return;

          // 현재 상태의 반대 값으로 설정
          handle.setValue(!isChecked);
        },
        getRootElement: () => rootRef.current,
        getInputElement: () => inputRef.current,
      };

      handleRef.current = handle;
      return handle;
    }, [onChange, mergedDisabled, isChecked, updateCheckedState]);

    // CheckboxGroup에 자동 등록 (index가 제공된 경우)
    useEffect(() => {
      if (
        typeof index === 'number' &&
        context?.registerCheckbox &&
        handleRef.current
      ) {
        context.registerCheckbox(index, handleRef.current);

        // 정리 함수
        return () => {
          if (context.registerCheckbox) {
            context.registerCheckbox(index, null);
          }
        };
      }
      return undefined;
    }, [context, index]);

    // 클래스 계산
    const checkboxClasses = cx(styles.checkbox, className, {
      [styles.btn]: mergedIsBtn,
      [styles.switch]: mergedIsSwitch,
    });

    return (
      <div ref={rootRef} className={checkboxClasses}>
        {children && mergedLeftLabel && (
          <label
            className={cx(styles.lbl, labelClassName)}
            htmlFor={checkboxId}
          >
            {children}
          </label>
        )}
        <input
          type="checkbox"
          id={checkboxId}
          value={value !== undefined ? String(value) : ''}
          checked={!!isChecked}
          onChange={handleChange}
          className={cx(styles.inp, styles.native, inputClassName)}
          disabled={mergedDisabled}
          ref={inputRef}
          {...props}
        />
        <i className={cx(styles.ico, iconClassName)} aria-hidden="true" />
        {children && !mergedLeftLabel && (
          <label
            className={cx(styles.lbl, labelClassName)}
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
export interface CheckboxOption<T extends string | number = string | number> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
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
  blur: (index?: number) => void;
  getValue: () => CheckboxValue[];
  setValue: (values: CheckboxValue[]) => void;
  toggleAll: (checked: boolean) => void;
}

// Checkbox Group component props
export interface CheckboxGroupProps<
  T extends string | number | boolean = string | number,
> {
  children?: ReactNode;
  options?: (T | CheckboxOption<T extends string | number ? T : never>)[];
  value?: T[];
  onChange?: (values: T[]) => void;
  setValue?: SetValueFunction<T[]>;
  name?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  style?: React.CSSProperties;
  isBtn?: boolean;
  isSwitch?: boolean;
  leftLabel?: boolean;
}

// Checkbox Group component with generic type support
const CheckboxGroupComponent = forwardRef(
  <T extends string | number | boolean = string | number>(
    {
      children,
      options,
      value = [],
      onChange,
      setValue,
      name,
      disabled = false,
      className = '',
      inputClassName = '',
      iconClassName = '',
      labelClassName = '',
      style,
      isBtn = false,
      isSwitch = false,
      leftLabel = false,
      ...rest
    }: CheckboxGroupProps<T>,
    ref: React.ForwardedRef<CheckboxGroupHandle>
  ) => {
    // 자식 체크박스 컴포넌트에 대한 참조 배열
    const refs = useRef<(CheckboxHandle | null)[]>([]);

    // value가 없는 경우(boolean 모드) 감지
    const booleanMode = useMemo(() => {
      // 옵션이 제공된 경우 boolean 모드 아님
      if (options) return false;

      // 자식을 배열로 변환
      const childrenArray = React.Children.toArray(children);

      // 자식이 없으면 기본값으로 false
      if (childrenArray.length === 0) return false;

      // 첫 번째 자식이 유효한 React 엘리먼트인지 체크
      if (!React.isValidElement(childrenArray[0])) return false;

      // 첫 번째 자식 엘리먼트에서 value prop이 있는지 확인
      const firstChild = childrenArray[0] as React.ReactElement<{
        value?: unknown;
      }>;
      return firstChild.props.value === undefined;
    }, [children, options]);

    // Checkbox 컴포넌트 등록 함수
    const registerCheckbox = useCallback(
      (index: number, handle: CheckboxHandle | null) => {
        refs.current[index] = handle;
      },
      []
    );

    // 그룹 값이 변경될 때 호출되는 함수
    const handleGroupValueChange = useCallback(
      (newValues: CheckboxValue[]) => {
        // 타입 안전한 변환
        const typedValues = newValues.filter((v): v is T => {
          return (
            typeof v === 'string' ||
            typeof v === 'number' ||
            typeof v === 'boolean'
          );
        });

        // 외부 상태 업데이트
        if (setValue) {
          setValue(typedValues);
        }

        // onChange 콜백 호출
        if (onChange) {
          onChange(typedValues);
        }
      },
      [setValue, onChange]
    );

    // context 값 메모이제이션
    const contextValue = useMemo<CheckboxContextType>(
      () => ({
        value: value as CheckboxValue[],
        booleanMode,
        onChange: (newValues: CheckboxValue[]) => {
          handleGroupValueChange(newValues);
        },
        setValue: (newValues: CheckboxValue[]) => {
          handleGroupValueChange(newValues);
        },
        name,
        disabled,
        registerCheckbox,
        isBtn,
        isSwitch,
        leftLabel,
      }),
      [
        value,
        booleanMode,
        handleGroupValueChange,
        name,
        disabled,
        registerCheckbox,
        isBtn,
        isSwitch,
        leftLabel,
      ]
    );

    // useImperativeHandle을 사용하여 외부에서 호출 가능한 메서드 정의
    useImperativeHandle(
      ref,
      () => ({
        focus: (index?: number) => {
          // 인덱스가 제공된 경우 해당 체크박스에 포커스
          if (typeof index === 'number' && refs.current[index]) {
            refs.current[index]?.focus();
            return;
          }

          // 인덱스가 제공되지 않은 경우 첫 번째 사용 가능한 체크박스에 포커스
          const firstAvailableCheckbox = refs.current.find(
            (checkbox) => !!checkbox
          );
          if (firstAvailableCheckbox) {
            firstAvailableCheckbox.focus();
          }
        },
        blur: (index?: number) => {
          // 인덱스가 제공된 경우 해당 체크박스에서 포커스 해제
          if (typeof index === 'number' && refs.current[index]) {
            refs.current[index]?.blur();
            return;
          }

          // 현재 포커스된 체크박스가 이 그룹에 속한 것이면 포커스 해제
          const activeElement = document.activeElement;
          const activeIndex = refs.current.findIndex(
            (checkbox) =>
              checkbox &&
              checkbox.getInputElement &&
              checkbox.getInputElement() === activeElement
          );

          if (activeIndex !== -1 && refs.current[activeIndex]) {
            refs.current[activeIndex]?.blur();
          }
        },
        getValue: () => {
          return value as CheckboxValue[];
        },
        setValue: (newValues: CheckboxValue[]) => {
          handleGroupValueChange(newValues);
        },
        toggleAll: (checked: boolean) => {
          if (options) {
            // 모든 옵션의 값 가져오기 (disabled가 아닌 것만)
            const allValues = options
              .map((option) => {
                if (isCheckboxOption<string | number>(option)) {
                  return option.disabled ? null : option.value;
                }
                return typeof option === 'boolean'
                  ? null
                  : (option as string | number);
              })
              .filter((val): val is string | number => val !== null);

            // 새 값 생성
            const newValues = checked ? (allValues as CheckboxValue[]) : [];
            handleGroupValueChange(newValues);
          } else if (booleanMode) {
            // 불리언 모드: 모든 체크박스를 checked 값으로 설정
            const checkboxCount = React.Children.count(children);
            const newValues = Array(checkboxCount).fill(
              checked
            ) as CheckboxValue[];
            handleGroupValueChange(newValues);
          }
        },
      }),
      [options, children, booleanMode, value, handleGroupValueChange]
    );

    // 옵션에서 Checkbox 컴포넌트 생성
    const checkboxOptions = useMemo(() => {
      if (!options) return null;

      return options.map((option, idx) => {
        // 옵션 값 처리
        let optionValue: string | number | undefined;
        let optionLabel: ReactNode;
        let optionDisabled = false;
        let optionStyle: React.CSSProperties | undefined;
        let optionClassName = '';

        if (isCheckboxOption<string | number>(option)) {
          // CheckboxOption 객체인 경우
          optionValue = option.value;
          optionLabel = option.label;
          optionDisabled = !!option.disabled;
          optionStyle = option.style;
          optionClassName = option.className || '';
        } else {
          // 원시 값인 경우
          optionValue =
            typeof option === 'boolean'
              ? undefined
              : (option as string | number);
          optionLabel = String(option);
        }

        return (
          <Checkbox
            key={`${String(optionValue || idx)}-${idx}`}
            value={optionValue}
            disabled={optionDisabled}
            inputClassName={inputClassName}
            iconClassName={iconClassName}
            labelClassName={labelClassName}
            className={optionClassName}
            style={optionStyle}
            index={idx}
            isBtn={isBtn}
            isSwitch={isSwitch}
            leftLabel={leftLabel}
          >
            {optionLabel}
          </Checkbox>
        );
      });
    }, [
      options,
      inputClassName,
      iconClassName,
      labelClassName,
      isBtn,
      isSwitch,
      leftLabel,
    ]);

    // 자식 요소에 index 속성 추가
    const childrenWithIndexes = useMemo(() => {
      return React.Children.map(children, (child, idx) => {
        if (React.isValidElement(child) && child.type === Checkbox) {
          return React.cloneElement(
            child as React.ReactElement<CheckboxProps>,
            {
              ...(typeof child.props === 'object' ? child.props : {}),
              index: idx,
            }
          );
        }
        return child;
      });
    }, [children]);

    return (
      <CheckboxContext.Provider value={contextValue}>
        <div className={cx('check-wrap', className)} style={style} {...rest}>
          {options ? checkboxOptions : childrenWithIndexes}
        </div>
      </CheckboxContext.Provider>
    );
  }
);

// 컴포넌트 이름 설정
CheckboxGroupComponent.displayName = 'CheckboxGroup';

// 타입 캐스팅을 사용하여 제네릭 타입 지원
export const CheckboxGroup = CheckboxGroupComponent as unknown as <
  T extends string | number | boolean = string | number,
>(
  props: CheckboxGroupProps<T> & { ref?: React.Ref<CheckboxGroupHandle> }
) => React.ReactElement;

// Static property for Checkbox.Group
const CheckboxWithGroup = Object.assign(Checkbox, {
  Group: CheckboxGroup,
});

export default CheckboxWithGroup;
