// src/components/common/Radio.tsx
import React, {
  createContext,
  useContext,
  useRef,
  forwardRef,
  ChangeEvent,
  useCallback,
  useMemo,
  ReactNode,
  useImperativeHandle,
  useEffect,
} from 'react';
import styles from '@/assets/scss/components/checkRadio.module.scss';

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  return `radio_${uniqueIdCounter++}_${Math.random().toString(36).slice(2, 9)}`;
};

// 라디오 버튼 값 타입 정의
type RadioValue = string | number;

// RadioContext 타입 정의
interface RadioContextType {
  value?: RadioValue;
  onChange: (value: RadioValue) => void;
  name?: string;
  disabled?: boolean;
  registerRadio?: (index: number, handle: RadioHandle | null) => void;
}

// RadioContext 생성
const RadioContext = createContext<RadioContextType | undefined>(undefined);

// 외부에서 호출 가능한 메서드 인터페이스 정의
export interface RadioHandle {
  focus: () => void;
  blur: () => void;
  getValue: () => boolean;
  setValue: () => void;
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
  children?: ReactNode;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  index?: number; // Group 내에서의 인덱스 (자동 등록용)
}

// Radio 컴포넌트
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
      index,
      ...props
    },
    ref
  ) => {
    // RadioContext 사용
    const context = useContext(RadioContext);

    // 상위 그룹의 disabled 상태 반영
    const mergedDisabled = disabled || context?.disabled;

    // Generate a unique ID if not provided
    const radioIdRef = useRef<string>(id || generateUniqueId());
    const radioId = radioIdRef.current;

    // 체크 상태 결정 - context가 있으면 context 값 사용, 없으면 props 값
    const isChecked = useMemo(() => {
      return context ? context.value === value : checked;
    }, [context, value, checked]);

    // input 요소에 대한 참조 생성
    const inputRef = useRef<HTMLInputElement>(null);

    // 컨테이너 요소에 대한 참조 생성
    const rootRef = useRef<HTMLDivElement>(null);

    // 핸들 생성
    const handleRef = useRef<RadioHandle | null>(null);

    // 변경 이벤트 핸들러
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (mergedDisabled) return;

        if (context) {
          context.onChange(value);
        } else if (onChange) {
          onChange(e);
        }
      },
      [context, onChange, value, mergedDisabled]
    );

    // 외부에서 호출 가능한 메서드 정의
    useImperativeHandle(ref, () => {
      const handle = {
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
        getValue: () => {
          return !!isChecked;
        },
        setValue: () => {
          if (mergedDisabled) return; // 비활성화된 경우 동작하지 않음

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
      };

      handleRef.current = handle;
      return handle;
    }, [onChange, context, value, mergedDisabled, isChecked]);

    // RadioGroup에 자동 등록 (index가 제공된 경우)
    useEffect(() => {
      if (
        typeof index === 'number' &&
        context?.registerRadio &&
        handleRef.current
      ) {
        context.registerRadio(index, handleRef.current);

        // 정리 함수
        return () => {
          if (context.registerRadio) {
            context.registerRadio(index, null);
          }
        };
      }
      return undefined;
    }, [context, index]);

    return (
      <div ref={rootRef} className={`${styles.radio} ${className}`}>
        <input
          type="radio"
          id={radioId}
          value={String(value)}
          checked={!!isChecked}
          onChange={handleChange}
          className={`${styles.inp} ${styles.native} ${inputClassName}`}
          disabled={mergedDisabled}
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
  label: ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
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
  getValue: () => string | number | undefined;
  setValue: (value: string | number) => void;
}

// Radio Group component props
interface RadioGroupProps<T extends string | number = string | number> {
  children?: ReactNode;
  options?: (T | RadioOption<T>)[];
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  name?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

// Radio Group component with generic type support
const RadioGroupComponent = forwardRef(
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
      disabled = false,
      style,
      ...rest
    }: RadioGroupProps<T>,
    ref: React.ForwardedRef<RadioGroupHandle>
  ) => {
    // 자식 라디오 컴포넌트에 대한 참조 배열
    const refs = useRef<(RadioHandle | null)[]>([]);

    // 라디오 변경 핸들러
    const handleRadioChange = useCallback(
      (radioValue: RadioValue) => {
        if (!onChange) return;
        onChange(radioValue as T);
      },
      [onChange]
    );

    // Radio 컴포넌트 등록 함수
    const registerRadio = useCallback(
      (index: number, handle: RadioHandle | null) => {
        refs.current[index] = handle;
      },
      []
    );

    // context 값 메모이제이션
    const contextValue = useMemo<RadioContextType>(
      () => ({
        value,
        onChange: handleRadioChange,
        name: name || `radio-group-${generateUniqueId()}`,
        disabled,
        registerRadio,
      }),
      [value, handleRadioChange, name, disabled, registerRadio]
    );

    // useImperativeHandle을 사용하여 외부에서 호출 가능한 메서드 정의
    useImperativeHandle(
      ref,
      () => ({
        focus: (index?: number) => {
          // 인덱스가 제공된 경우 해당 라디오에 포커스
          if (typeof index === 'number' && refs.current[index]) {
            refs.current[index]?.focus();
            return;
          }

          // 인덱스가 제공되지 않은 경우 첫 번째 사용 가능한 라디오에 포커스
          const firstAvailableRadio = refs.current.find((radioRef) => {
            return !!radioRef; // null이 아닌 첫 번째 참조 찾기
          });

          if (firstAvailableRadio) {
            firstAvailableRadio.focus();
          }
        },
        // 현재 선택된 값 반환
        getValue: () => {
          return value;
        },
        // 새 값 설정
        setValue: (newValue: string | number) => {
          if (onChange) {
            onChange(newValue as T);
          }
        },
      }),
      [value, onChange]
    );

    // 옵션에서 Radio 컴포넌트 생성
    const radioOptions = useMemo(() => {
      if (!options) return null;

      return options.map((option, idx) => {
        // 옵션 값 처리
        let optionValue: string | number;
        let optionLabel: ReactNode;
        let optionDisabled = false;
        let optionStyle: React.CSSProperties | undefined;
        let optionClassName = '';

        if (isRadioOption<string | number>(option)) {
          // RadioOption 객체인 경우
          optionValue = option.value;
          optionLabel = option.label;
          optionDisabled = !!option.disabled;
          optionStyle = option.style;
          optionClassName = option.className || '';
        } else {
          // 원시 값인 경우
          optionValue = option as string | number;
          optionLabel = String(option);
        }

        return (
          <Radio
            key={`${String(optionValue)}-${idx}`}
            value={optionValue}
            className={optionClassName}
            style={optionStyle}
            inputClassName={inputClassName}
            iconClassName={iconClassName}
            labelClassName={labelClassName}
            disabled={optionDisabled}
            index={idx}
          >
            {optionLabel}
          </Radio>
        );
      });
    }, [options, inputClassName, iconClassName, labelClassName]);

    // 자식 요소에 index 속성 추가 (ref 대신 index로 처리)
    const childrenWithIndexes = useMemo(() => {
      return React.Children.map(children, (child, idx) => {
        if (React.isValidElement(child) && child.type === Radio) {
          return React.cloneElement(child as React.ReactElement<RadioProps>, {
            ...(typeof child.props === 'object' ? child.props : {}),
            index: idx,
          });
        }
        return child;
      });
    }, [children]);

    return (
      <RadioContext.Provider value={contextValue}>
        <div className={`check-wrap ${className}`} style={style} {...rest}>
          {options ? radioOptions : childrenWithIndexes}
        </div>
      </RadioContext.Provider>
    );
  }
);

// 컴포넌트 이름 설정
RadioGroupComponent.displayName = 'RadioGroup';

// 타입 캐스팅을 사용하여 제네릭 타입 지원
export const RadioGroup = RadioGroupComponent as unknown as <
  T extends string | number = string | number,
>(
  props: RadioGroupProps<T> & { ref?: React.Ref<RadioGroupHandle> }
) => React.ReactElement;

// Radio.Group 정적 속성으로 추가
const RadioWithGroup = Object.assign(Radio, {
  Group: RadioGroup,
});

export default RadioWithGroup;
