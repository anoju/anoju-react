// src/components/common/Select.tsx
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
  useMemo,
  ReactNode,
  KeyboardEvent,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import styles from '@/assets/scss/components/select.module.scss';
import cx from '@/utils/cx';

// 옵션 아이템 타입 정의
export interface SelectOption<T = string | number> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

// 셀렉트 컴포넌트 Props 타입 정의
export interface SelectProps<T = string | number> {
  options: (SelectOption<T> | T)[];
  value?: T;
  defaultValue?: T;
  onChange?: ((value: T) => void) | Dispatch<SetStateAction<T>>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  dropdownClassName?: string;
  allowClear?: boolean;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  status?: 'error' | 'warning';
  open?: boolean;
  defaultOpen?: boolean;
  onDropdownVisibleChange?: (open: boolean) => void;
}

// 핸들 인터페이스 정의
export interface SelectHandle {
  focus: () => void;
  blur: () => void;
  getValue: () => unknown;
  setValue: (value: unknown) => void;
  getRootElement: () => HTMLElement | null;
}

// 옵션이 SelectOption 타입인지 확인하는 타입 가드
function isSelectOption<T>(
  option: SelectOption<T> | T
): option is SelectOption<T> {
  return (
    typeof option === 'object' &&
    option !== null &&
    'value' in option &&
    'label' in option
  );
}

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  return `select_${uniqueIdCounter++}_${Math.random().toString(36).substring(2, 9)}`;
};

// Select 컴포넌트
function Select<T = string | number>(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = '선택해주세요',
    disabled = false,
    className = '',
    style,
    dropdownClassName = '',
    allowClear = false,
    size = 'medium',
    loading = false,
    status,
    open: controlledOpen,
    defaultOpen = false,
    onDropdownVisibleChange,
  }: SelectProps<T>,
  ref: React.ForwardedRef<SelectHandle>
) {
  // 내부 상태 관리
  const [internalValue, setInternalValue] = useState<T | undefined>(
    value !== undefined ? value : defaultValue
  );
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // DOM 요소 참조
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectId = useRef<string>(generateUniqueId());

  // 포커스 관리
  const [isFocused, setIsFocused] = useState(false);

  // 옵션 데이터 정규화 - 모든 옵션을 SelectOption 형태로 변환
  const normalizedOptions = useMemo(() => {
    return options.map((option): SelectOption<T> => {
      if (isSelectOption<T>(option)) {
        return option;
      }
      return {
        value: option,
        label: String(option),
      };
    });
  }, [options]);

  // 현재 선택된 옵션 찾기
  const selectedOption = useMemo(() => {
    if (internalValue === undefined) return undefined;
    return normalizedOptions.find((option) => option.value === internalValue);
  }, [internalValue, normalizedOptions]);

  // 외부 제어 모드일 경우 value prop이 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // 외부 제어 모드일 경우 open prop이 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  // 옵션 스크롤 함수
  const scrollOptionIntoView = useCallback((index: number) => {
    if (!dropdownRef.current) return;

    const optionElements = dropdownRef.current.querySelectorAll(
      `.${styles.option}`
    );
    if (index >= 0 && index < optionElements.length) {
      const optionElement = optionElements[index] as HTMLElement;
      optionElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, []);

  // 드롭다운 토글 함수
  const toggleDropdown = useCallback(() => {
    if (disabled) return;

    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (onDropdownVisibleChange) {
      onDropdownVisibleChange(newIsOpen);
    }

    // 드롭다운이 열리면 현재 선택된 항목 활성화
    if (newIsOpen && internalValue !== undefined) {
      const index = normalizedOptions.findIndex(
        (option) => option.value === internalValue
      );
      setActiveIndex(index);
    }
  }, [
    disabled,
    isOpen,
    internalValue,
    normalizedOptions,
    onDropdownVisibleChange,
  ]);

  // 값 업데이트 핸들러
  const updateValue = useCallback(
    (newValue: T | undefined) => {
      // 내부 상태 업데이트
      if (value === undefined) {
        setInternalValue(newValue);
      }

      // 외부 onChange 콜백 호출 (newValue가 있는 경우만)
      if (onChange && newValue !== undefined) {
        // as를 사용한 안전한 타입 캐스팅
        if (typeof onChange === 'function') {
          (onChange as (value: T) => void)(newValue);
        }
      }
    },
    [value, onChange]
  );

  // 옵션 선택 함수
  const handleOptionSelect = useCallback(
    (option: SelectOption<T>) => {
      if (option.disabled) return;

      // 값 업데이트
      updateValue(option.value);

      // 드롭다운 닫기
      if (controlledOpen === undefined) {
        setIsOpen(false);
      }

      if (onDropdownVisibleChange) {
        onDropdownVisibleChange(false);
      }
    },
    [updateValue, controlledOpen, onDropdownVisibleChange]
  );

  // 값 지우기 함수
  const handleClear = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      // 내부 상태 업데이트
      if (value === undefined) {
        setInternalValue(undefined);
      }

      // onChange가 Dispatch<SetStateAction<T>> 타입인 경우,
      // React의 함수형 업데이트 패턴을 사용하여 undefined로 설정
      if (onChange && typeof onChange === 'function') {
        try {
          // 타입 안전을 보장하기 위해 any 사용
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (onChange as any)(() => undefined);
        } catch (error) {
          // 오류 발생 시 조용히 무시 (외부 상태 리셋은 선택 사항)
          console.log('Select clear value failed', error);
        }
      }
    },
    [value, onChange]
  );

  // 키보드 조작 함수
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (
            isOpen &&
            activeIndex >= 0 &&
            activeIndex < normalizedOptions.length
          ) {
            // 현재 활성화된 옵션 선택
            handleOptionSelect(normalizedOptions[activeIndex]);
          } else {
            // 드롭다운 토글
            toggleDropdown();
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            toggleDropdown();
          } else {
            // 다음 활성화 가능한 옵션으로 이동
            let nextIndex = activeIndex;
            do {
              nextIndex = (nextIndex + 1) % normalizedOptions.length;
            } while (
              normalizedOptions[nextIndex].disabled &&
              nextIndex !== activeIndex
            );
            setActiveIndex(nextIndex);
            scrollOptionIntoView(nextIndex);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            toggleDropdown();
          } else {
            // 이전 활성화 가능한 옵션으로 이동
            let prevIndex = activeIndex;
            do {
              prevIndex =
                prevIndex <= 0 ? normalizedOptions.length - 1 : prevIndex - 1;
            } while (
              normalizedOptions[prevIndex].disabled &&
              prevIndex !== activeIndex
            );
            setActiveIndex(prevIndex);
            scrollOptionIntoView(prevIndex);
          }
          break;

        case 'Escape':
          e.preventDefault();
          if (isOpen) {
            setIsOpen(false);
            if (onDropdownVisibleChange) {
              onDropdownVisibleChange(false);
            }
          }
          break;

        case 'Tab':
          if (isOpen) {
            setIsOpen(false);
            if (onDropdownVisibleChange) {
              onDropdownVisibleChange(false);
            }
          }
          break;

        default:
          break;
      }
    },
    [
      disabled,
      isOpen,
      activeIndex,
      normalizedOptions,
      handleOptionSelect,
      toggleDropdown,
      onDropdownVisibleChange,
      scrollOptionIntoView,
    ]
  );

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
        if (onDropdownVisibleChange) {
          onDropdownVisibleChange(false);
        }
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside as unknown as EventListener
    );
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside as unknown as EventListener
      );
    };
  }, [isOpen, onDropdownVisibleChange]);

  // 드롭다운 위치 조정 (열릴 때)
  useEffect(() => {
    if (!isOpen || !selectRef.current || !dropdownRef.current) return;

    const updatePosition = () => {
      const selectRect = selectRef.current?.getBoundingClientRect();
      if (!selectRect || !dropdownRef.current) return;

      const dropdownHeight = dropdownRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - selectRect.bottom;
      const spaceAbove = selectRect.top;

      // 아래 공간이 충분하면 아래에 표시, 아니면 위에 표시
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        dropdownRef.current.style.top = `${selectRect.height}px`;
        dropdownRef.current.style.bottom = 'auto';
        dropdownRef.current.classList.remove(styles.dropdownUp);
      } else {
        dropdownRef.current.style.bottom = `${selectRect.height}px`;
        dropdownRef.current.style.top = 'auto';
        dropdownRef.current.classList.add(styles.dropdownUp);
      }

      // 너비 동기화
      dropdownRef.current.style.width = `${selectRect.width}px`;
    };

    updatePosition();

    // 창 크기 변경 시 위치 업데이트
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // 외부 메서드 정의
  React.useImperativeHandle(ref, () => {
    return {
      focus: () => {
        selectRef.current?.focus();
      },
      blur: () => {
        selectRef.current?.blur();
      },
      getValue: () => {
        return internalValue;
      },
      setValue: (value: unknown) => {
        updateValue(value as T);
      },
      getRootElement: () => {
        return selectRef.current;
      },
    };
  }, [internalValue, updateValue]);

  // 클래스 이름 생성
  const selectClassName = cx(
    styles.select,
    styles[size],
    {
      [styles.disabled]: disabled,
      [styles.open]: isOpen,
      [styles.focused]: isFocused,
      [styles.error]: status === 'error',
      [styles.warning]: status === 'warning',
      //[styles.clearable]: allowClear && selectedOption,
    },
    className
  );

  // 포커스 이벤트 핸들러
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      ref={selectRef}
      className={selectClassName}
      style={style}
      tabIndex={disabled ? -1 : 0}
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-disabled={disabled}
      aria-controls={`${selectId.current}-dropdown`}
      aria-labelledby={`${selectId.current}-label`}
    >
      <div className={styles.selectInner}>
        {selectedOption ? (
          <div className={styles.value} id={`${selectId.current}-label`}>
            {selectedOption.label}
          </div>
        ) : (
          <div className={styles.placeholder} id={`${selectId.current}-label`}>
            {placeholder}
          </div>
        )}

        <div className={styles.suffixWrapper}>
          {allowClear && selectedOption && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              aria-label="지우기"
              tabIndex={-1}
            >
              <span className={styles.clearIcon} aria-hidden="true" />
            </button>
          )}

          {loading ? (
            <span className={styles.loadingIcon} aria-hidden="true" />
          ) : (
            <span
              className={cx(styles.arrow, { [styles.arrowActive]: isOpen })}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={cx(styles.dropdown, dropdownClassName)}
          id={`${selectId.current}-dropdown`}
          role="listbox"
          aria-labelledby={`${selectId.current}-label`}
        >
          {normalizedOptions.length > 0 ? (
            <ul className={styles.options}>
              {normalizedOptions.map((option, index) => (
                <li
                  key={`${index}-${String(option.value)}`}
                  className={cx(styles.option, {
                    [styles.optionSelected]: option.value === internalValue,
                    [styles.optionActive]: index === activeIndex,
                    [styles.optionDisabled]: option.disabled,
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionSelect(option);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  aria-selected={option.value === internalValue}
                  aria-disabled={option.disabled}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>목록이 없습니다</div>
          )}
        </div>
      )}
    </div>
  );
}

// 컴포넌트 이름 설정
Select.displayName = 'Select';

// 타입 캐스팅을 사용하여 제네릭 타입 지원
const SelectWithRef = forwardRef(Select) as <T = string | number>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<SelectHandle> }
) => React.ReactElement;

export default SelectWithRef;
