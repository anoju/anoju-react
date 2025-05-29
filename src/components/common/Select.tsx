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
  ChangeEvent,
} from 'react';
import styles from '@/assets/scss/components/select.module.scss';
import cx from '@/utils/cx';
import { Button } from '@/components/common';
import Popup, { PopupProps } from '@/components/common/Popup/Popup';
import popupStyles from '@/assets/scss/components/popup.module.scss';

// Option Group 타입 정의
export interface SelectOptionGroup<T = string | number> {
  label: ReactNode;
  key: string | number;
  options: SelectOption<T>[];
  disabled?: boolean;
}

// 옵션 아이템 타입 정의 - 인덱스 시그니처 추가
export interface SelectOption<T = string | number> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  groupKey?: string | number; // 그룹 키 (옵션이 그룹의 일부인 경우)
  searchText?: string; // 검색용 텍스트 추가
  [key: string]: unknown; // 인덱스 시그니처 추가로 동적 속성 접근 허용
}

// 팝업 설정 타입 정의
export interface SelectPopupConfig
  extends Omit<PopupProps, 'visible' | 'onClose' | 'type' | 'children'> {
  // Select 전용 팝업 설정을 위한 추가 속성들
  searchPlaceholder?: string; // 검색 입력 플레이스홀더
}

// 셀렉트 컴포넌트 Props 타입 정의
export interface SelectProps<T = string | number> {
  // 옵션 관련
  options: (SelectOption<T> | T | SelectOptionGroup<T>)[];
  optionFilterProp?: string; // 검색 시 필터링할 속성 (기본값: 'label')
  optionLabelProp?: string; // 표시될 레이블 속성 (기본값: 'label')

  // 값 관련
  value?: T | T[];
  defaultValue?: T | T[];
  onChange?: unknown; // 어떤 타입의 콜백이든 받을 수 있도록 범용적으로 설정

  // 플레이스홀더
  placeholder?: string;

  // 상태 관련
  disabled?: boolean;
  loading?: boolean;
  status?: 'error' | 'warning' | 'success';

  // 외관 관련
  className?: string;
  style?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownStyle?: React.CSSProperties;
  size?: 'xs' | 'sm' | '' | 'lg' | 'xl';

  // 기능 관련
  allowClear?: boolean;
  showSearch?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  scrollDropdown?: boolean; // 스크롤 시 드롭다운 위치 조정 여부 (true: 위치 조정, false: 드롭다운 닫기)

  // 팝업 관련 (새로 추가)
  usePopup?: boolean | SelectPopupConfig; // 팝업 사용 여부 또는 팝업 설정

  // 다중 선택 관련
  mode?: 'multiple';
  separator?: string; // 다중 선택 시 separator (기본값: ', ')
  maxCount?: number; // 최대 선택 가능 개수

  // 이벤트 핸들러
  onDropdownVisibleChange?: (open: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

// 핸들 인터페이스 정의
export interface SelectHandle {
  focus: () => void;
  blur: () => void;
  getValue: () => unknown;
  setValue: (value: unknown) => void;
  getRootElement: () => HTMLElement | null;
  openDropdown: () => void;
  closeDropdown: () => void;
}

// 옵션이 SelectOption 타입인지 확인하는 타입 가드
function isSelectOption<T>(
  option: SelectOption<T> | T | SelectOptionGroup<T>
): option is SelectOption<T> {
  return (
    typeof option === 'object' &&
    option !== null &&
    'value' in option &&
    'label' in option &&
    !('options' in option)
  );
}

// 옵션이 SelectOptionGroup 타입인지 확인하는 타입 가드
function isSelectOptionGroup<T>(
  option: SelectOption<T> | T | SelectOptionGroup<T>
): option is SelectOptionGroup<T> {
  return (
    typeof option === 'object' &&
    option !== null &&
    'options' in option &&
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
    optionFilterProp = 'label',
    optionLabelProp = 'label',
    value,
    defaultValue,
    onChange,
    placeholder = '선택해주세요',
    disabled = false,
    loading = false,
    status,
    className = '',
    style,
    dropdownClassName = '',
    dropdownStyle,
    allowClear = false,
    size = '',
    showSearch = false,
    open: controlledOpen,
    defaultOpen = false,
    scrollDropdown = false, // 기본값은 false로 설정
    usePopup = false, // 팝업 사용 여부 (새로 추가)
    mode,
    separator = ', ',
    maxCount,
    onDropdownVisibleChange,
    onSearch,
    onClear,
  }: SelectProps<T>,
  ref: React.ForwardedRef<SelectHandle>
) {
  // 팝업 설정 처리
  const popupConfig = useMemo(() => {
    if (usePopup === true) {
      return {} as SelectPopupConfig; // 기본 팝업 설정
    } else if (typeof usePopup === 'object') {
      return usePopup; // 사용자 정의 팝업 설정
    }
    return null; // 팝업 사용하지 않음
  }, [usePopup]);

  const isUsingPopup = popupConfig !== null;

  // 내부 상태 관리
  const [internalValue, setInternalValue] = useState<T | T[] | undefined>(
    value !== undefined ? value : defaultValue
  );
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: string;
    bottom?: string;
    left: string;
    width: string;
  }>({ left: '0', width: '0' });

  // 다중 선택 모드인지 확인
  const isMultiple = mode === 'multiple';

  // DOM 요소 참조
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectId = useRef<string>(generateUniqueId());

  // 포커스 관리
  const [isFocused, setIsFocused] = useState(false);

  // 옵션 데이터 정규화 - 그룹 및 기본 옵션 처리
  const normalizedOptionsData = useMemo(() => {
    // 플랫한 옵션 목록 (그룹 내 옵션 포함)
    const flatOptions: SelectOption<T>[] = [];

    // 그룹 맵 (그룹 키 -> 그룹 정보)
    const groupMap = new Map<string | number, SelectOptionGroup<T>>();

    // 옵션 처리 함수
    options.forEach((item) => {
      if (isSelectOptionGroup<T>(item)) {
        // 그룹인 경우
        groupMap.set(item.key, item);

        // 그룹의 각 옵션에 그룹 키 추가
        item.options.forEach((option) => {
          flatOptions.push({
            ...option,
            groupKey: item.key,
            disabled: option.disabled || item.disabled,
          });
        });
      } else if (isSelectOption<T>(item)) {
        // 단일 옵션인 경우
        flatOptions.push(item);
      } else {
        // 기본 값인 경우 (문자열, 숫자 등)
        flatOptions.push({
          value: item,
          label: String(item),
        });
      }
    });

    return { flatOptions, groupMap };
  }, [options]);

  // 필터링된 옵션 목록 (검색어 적용)
  const filteredOptions = useMemo(() => {
    const { flatOptions } = normalizedOptionsData;

    if (!showSearch || !searchValue.trim()) {
      return flatOptions;
    }

    const lowerSearchValue = searchValue.toLowerCase();

    // optionFilterProp을 활용한 검색 (기본값: 'label')
    return flatOptions.filter((option) => {
      // searchText가 있으면 우선 사용, 없으면 optionFilterProp 사용
      let searchTarget: string;

      if (option.searchText) {
        searchTarget = option.searchText;
      } else if (optionFilterProp in option) {
        searchTarget = String(option[optionFilterProp]);
      } else {
        searchTarget = String(option.label);
      }

      return searchTarget.toLowerCase().includes(lowerSearchValue);
    });
  }, [normalizedOptionsData, searchValue, showSearch, optionFilterProp]);

  // 현재 선택된 옵션 찾기 (단일 선택 모드)
  const selectedOption = useMemo(() => {
    if (isMultiple || internalValue === undefined) return undefined;

    return normalizedOptionsData.flatOptions.find(
      (option) => option.value === internalValue
    );
  }, [internalValue, normalizedOptionsData.flatOptions, isMultiple]);

  // 현재 선택된 옵션들 찾기 (다중 선택 모드)
  const selectedOptions = useMemo(() => {
    if (!isMultiple || !internalValue) return [];

    const selectedValues = Array.isArray(internalValue)
      ? internalValue
      : [internalValue];

    return normalizedOptionsData.flatOptions.filter((option) =>
      selectedValues.includes(option.value)
    );
  }, [internalValue, normalizedOptionsData.flatOptions, isMultiple]);

  // 선택된 옵션의 레이블 표시에 사용할 함수
  const getOptionLabel = useCallback(
    (option: SelectOption<T>) => {
      // optionLabelProp을 활용해 레이블 속성 결정
      if (optionLabelProp in option) {
        return String(option[optionLabelProp]);
      }
      return String(option.label);
    },
    [optionLabelProp]
  );

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

  // 드롭다운 위치 계산 (팝업 모드가 아닐 때만 사용)
  const updateDropdownPosition = useCallback(() => {
    if (isUsingPopup || !selectRef.current || !dropdownRef.current) return;

    const selectRect = selectRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current.offsetHeight;

    // 뷰포트 크기
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // 아래쪽 공간
    const spaceBelow = viewportHeight - selectRect.bottom;
    // 위쪽 공간
    const spaceAbove = selectRect.top;

    // 현재 스크롤 위치 고려
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let left = `${scrollX + selectRect.left}px`;
    const width = `${selectRect.width}px`;

    // 드롭다운이 오른쪽 경계를 넘어가는 경우 처리
    if (selectRect.left + selectRect.width > viewportWidth) {
      const overflowRight = selectRect.left + selectRect.width - viewportWidth;
      left = `${scrollX + selectRect.left - overflowRight - 5}px`; // 5px 여유 공간
    }

    // 아래 공간이 충분하면 아래에 표시, 아니면 위에 표시
    if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
      // 아래에 표시
      setDropdownPosition({
        top: `${selectRect.bottom}px`,
        bottom: 'auto',
        left,
        width,
      });
      dropdownRef.current.classList.remove(styles['dropdown-up']);
    } else {
      // 위에 표시
      setDropdownPosition({
        top: 'auto',
        bottom: `${viewportHeight - (selectRect.top - scrollY)}px`,
        left,
        width,
      });
      dropdownRef.current.classList.add(styles.dropdownUp);
    }
  }, [isUsingPopup]);

  // 옵션 스크롤 함수
  const scrollOptionIntoView = useCallback((index: number) => {
    if (!dropdownRef.current) return;

    const optionElements = dropdownRef.current.querySelectorAll(
      `.${styles.option}:not(.${styles['option-disabled']})`
    );

    if (index >= 0 && index < optionElements.length) {
      const optionElement = optionElements[index] as HTMLElement;
      optionElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, []);

  // 드롭다운 열기 함수
  const openDropdown = useCallback(() => {
    if (disabled || loading) return;

    setIsOpen(true);

    if (onDropdownVisibleChange) {
      onDropdownVisibleChange(true);
    }

    // 검색창에 포커스 (팝업 모드가 아닐 때만)
    if (showSearch && !isUsingPopup) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }

    // 팝업 모드가 아닐 때만 위치 계산
    if (!isUsingPopup) {
      // 지연 실행하여 DOM이 업데이트된 후 위치 계산
      setTimeout(() => {
        updateDropdownPosition();
      }, 0);
    }
  }, [
    disabled,
    loading,
    showSearch,
    isUsingPopup,
    onDropdownVisibleChange,
    updateDropdownPosition,
  ]);

  // 드롭다운 닫기 함수
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchValue('');

    if (onDropdownVisibleChange) {
      onDropdownVisibleChange(false);
    }
  }, [onDropdownVisibleChange]);

  // 드롭다운 토글 함수
  const toggleDropdown = useCallback(() => {
    if (disabled || loading) return;

    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [disabled, loading, isOpen, openDropdown, closeDropdown]);

  // 값 업데이트 핸들러
  const updateValue = useCallback(
    (newValue: T | T[] | undefined) => {
      // 내부 상태 업데이트
      if (value === undefined) {
        setInternalValue(newValue);
      }

      // 외부 onChange 콜백 호출 (newValue가 있는 경우만)
      if (onChange && newValue !== undefined) {
        // 일반 함수인 경우
        if (typeof onChange === 'function') {
          try {
            // 단일 값인지 배열인지 확인
            if (Array.isArray(newValue)) {
              // 다중 선택일 경우
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (onChange as any)(newValue);
            } else {
              // 단일 선택일 경우
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (onChange as any)(newValue);
            }
          } catch (error) {
            console.error('Select onChange error:', error);
            // 오류 발생 시 기본 실행 방법
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (onChange as any)(newValue);
          }
        }
      }
    },
    [value, onChange]
  );

  // 다중 선택 옵션 토글 함수
  const toggleOption = useCallback(
    (option: SelectOption<T>) => {
      if (option.disabled || disabled || loading) return;

      if (isMultiple) {
        const currentValues = Array.isArray(internalValue)
          ? [...internalValue]
          : internalValue !== undefined
            ? [internalValue]
            : [];

        const valueIndex = currentValues.indexOf(option.value);

        if (valueIndex > -1) {
          // 이미 선택된 경우 제거
          currentValues.splice(valueIndex, 1);
        } else {
          // 아직 선택되지 않은 경우 추가
          // 최대 선택 개수 확인
          if (maxCount !== undefined && currentValues.length >= maxCount) {
            return; // 최대 선택 개수에 도달한 경우 추가하지 않음
          }
          currentValues.push(option.value);
        }

        updateValue(currentValues);
      } else {
        // 단일 선택 모드
        updateValue(option.value);
        closeDropdown(); // 단일 선택 시 드롭다운/팝업 닫기
      }
    },
    [
      internalValue,
      isMultiple,
      disabled,
      loading,
      maxCount,
      updateValue,
      closeDropdown,
    ]
  );

  // 값 지우기 함수
  const handleClear = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      // 내부 상태 업데이트
      if (value === undefined) {
        setInternalValue(isMultiple ? [] : undefined);
      }

      // onChange 호출
      if (onChange) {
        if (typeof onChange === 'function') {
          try {
            if (isMultiple) {
              // 다중 선택일 경우 빈 배열로 설정
              const emptyArray = [] as unknown as T[];
              (
                onChange as
                  | ((value: T[]) => void)
                  | Dispatch<SetStateAction<T[]>>
              )(emptyArray);
            } else {
              // 단일 선택일 경우
              // 일반 함수로 처리하고, 타입 캐스팅을 통해 안전하게 처리
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (onChange as any)(undefined);
              // 단일 선택 모드에서 null이나 undefined는 React.useState에서도 잘 처리됨
            }
          } catch (error) {
            console.error('Select clear value failed', error);
            // 오류 발생 시 기본 실행 방법
            if (isMultiple) {
              const emptyArray = [] as unknown as T[];
              (onChange as (value: T[]) => void)(emptyArray);
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (onChange as any)(undefined);
            }
          }
        }
      }

      // onClear 콜백 호출
      if (onClear) {
        onClear();
      }
    },
    [value, onChange, onClear, isMultiple]
  );

  // 검색 입력 핸들러
  const handleSearchInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setSearchValue(inputValue);

      if (onSearch) {
        onSearch(inputValue);
      }
    },
    [onSearch]
  );

  // 키보드 조작 함수
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || loading || isUsingPopup) return; // 팝업 모드에서는 키보드 네비게이션 비활성화

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen) {
            if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
              // 현재 활성화된 옵션 선택
              const option = filteredOptions[activeIndex];
              if (!option.disabled) {
                toggleOption(option);
              }
            }
          } else {
            // 드롭다운 열기
            openDropdown();
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            openDropdown();
          } else {
            // 다음 활성화 가능한 옵션으로 이동
            let nextIndex = activeIndex;
            do {
              nextIndex = (nextIndex + 1) % filteredOptions.length;
              if (nextIndex === activeIndex) break; // 모든 옵션이 비활성화된 경우 무한 루프 방지
            } while (
              filteredOptions[nextIndex].disabled &&
              nextIndex !== activeIndex
            );

            if (!filteredOptions[nextIndex].disabled) {
              setActiveIndex(nextIndex);
              scrollOptionIntoView(nextIndex);
            }
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            openDropdown();
          } else {
            // 이전 활성화 가능한 옵션으로 이동
            let prevIndex = activeIndex;
            do {
              prevIndex =
                prevIndex <= 0 ? filteredOptions.length - 1 : prevIndex - 1;
              if (prevIndex === activeIndex) break; // 모든 옵션이 비활성화된 경우 무한 루프 방지
            } while (
              filteredOptions[prevIndex].disabled &&
              prevIndex !== activeIndex
            );

            if (!filteredOptions[prevIndex].disabled) {
              setActiveIndex(prevIndex);
              scrollOptionIntoView(prevIndex);
            }
          }
          break;

        case 'Escape':
          e.preventDefault();
          if (isOpen) {
            closeDropdown();
          }
          break;

        case 'Tab':
          if (isOpen) {
            closeDropdown();
          }
          break;

        case 'Backspace':
          if (
            isMultiple &&
            Array.isArray(internalValue) &&
            internalValue.length > 0 &&
            !searchValue
          ) {
            // 검색어가 없을 때 Backspace를 누르면 마지막 선택 항목 제거
            const newValues = [...internalValue];
            newValues.pop();
            updateValue(newValues);
          }
          break;

        default:
          break;
      }
    },
    [
      disabled,
      loading,
      isUsingPopup,
      isOpen,
      activeIndex,
      filteredOptions,
      toggleOption,
      openDropdown,
      closeDropdown,
      scrollOptionIntoView,
      isMultiple,
      internalValue,
      searchValue,
      updateValue,
    ]
  );

  // 외부 클릭 감지 (팝업 모드가 아닐 때만)
  useEffect(() => {
    if (isUsingPopup) return; // 팝업 모드에서는 외부 클릭 감지 비활성화

    const handleClickOutside = (event: Event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown, isUsingPopup]);

  // 드롭다운 위치 조정 (열릴 때) - 팝업 모드가 아닐 때만
  useEffect(() => {
    if (!isOpen || isUsingPopup) return;

    // 초기 위치 설정
    updateDropdownPosition();

    // 리사이즈 이벤트 핸들러
    const handleResize = () => {
      if (scrollDropdown) {
        // scrollDropdown이 true인 경우: 드롭다운 위치 조정
        updateDropdownPosition();
      } else {
        // scrollDropdown이 false인 경우: 드롭다운 닫기
        closeDropdown();
      }
    };

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      if (scrollDropdown) {
        // scrollDropdown이 true인 경우: 드롭다운 위치 조정
        updateDropdownPosition();
      } else {
        // scrollDropdown이 false인 경우: 드롭다운 닫기
        closeDropdown();
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    isOpen,
    updateDropdownPosition,
    scrollDropdown,
    closeDropdown,
    isUsingPopup,
  ]);

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
        updateValue(value as T | T[]);
      },
      getRootElement: () => {
        return selectRef.current;
      },
      openDropdown: () => {
        openDropdown();
      },
      closeDropdown: () => {
        closeDropdown();
      },
    };
  }, [internalValue, updateValue, openDropdown, closeDropdown]);

  // 클래스 이름 생성
  const selectClassName = cx(
    styles.select,
    styles[size],
    {
      [styles.disabled]: disabled,
      [styles.loading]: loading,
      [styles.open]: isOpen,
      [styles.focused]: isFocused,
      [styles.error]: status === 'error',
      [styles.warning]: status === 'warning',
      [styles.success]: status === 'success',
      [styles.multiple]: isMultiple,
      [styles.popup]: isUsingPopup, // 팝업 모드 클래스 추가
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

  // 다중 선택 모드에서 현재 선택된 값 텍스트 생성
  const selectedValueText = useMemo(() => {
    if (!isMultiple || !selectedOptions.length) return '';

    return selectedOptions
      .map((option) => getOptionLabel(option))
      .join(separator);
  }, [isMultiple, selectedOptions, separator, getOptionLabel]);

  // 선택된 값이 있는지 확인 (클리어 버튼 표시 여부)
  const hasValue = useMemo(() => {
    if (isMultiple) {
      return Array.isArray(internalValue) && internalValue.length > 0;
    }
    return internalValue !== undefined;
  }, [isMultiple, internalValue]);

  // 옵션 그룹화
  const groupedOptions = useMemo(() => {
    if (filteredOptions.length === 0) return [];

    const { groupMap } = normalizedOptionsData;

    // 그룹별 옵션 맵
    const groups = new Map<string | number | undefined, SelectOption<T>[]>();

    // 각 옵션을 그룹에 따라 분류
    filteredOptions.forEach((option) => {
      const groupKey = option.groupKey;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }

      groups.get(groupKey)?.push(option);
    });

    // 결과를 그룹별로 구성
    const result: {
      group?: SelectOptionGroup<T>;
      options: SelectOption<T>[];
    }[] = [];

    // 그룹이 없는 옵션 먼저 처리
    if (groups.has(undefined)) {
      result.push({
        options: groups.get(undefined) || [],
      });
    }

    // 그룹이 있는 옵션 처리
    Array.from(groups.keys())
      .filter((key) => key !== undefined)
      .forEach((groupKey) => {
        if (groupKey !== undefined) {
          result.push({
            group: groupMap.get(groupKey),
            options: groups.get(groupKey) || [],
          });
        }
      });

    return result;
  }, [filteredOptions, normalizedOptionsData]);

  // 옵션이 현재 선택되어 있는지 확인하는 함수
  const isOptionSelected = useCallback(
    (option: SelectOption<T>) => {
      if (isMultiple) {
        // 다중 선택 모드
        if (Array.isArray(internalValue)) {
          return internalValue.includes(option.value);
        }
        return false;
      } else {
        // 단일 선택 모드
        return option.value === internalValue;
      }
    },
    [isMultiple, internalValue]
  );

  // 팝업에서 검색 입력 핸들러 (팝업 내부에서 이벤트 전파 중지)
  const handlePopupSearchInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation(); // 팝업 내부 클릭 이벤트 전파 중지
      handleSearchInput(e);
    },
    [handleSearchInput]
  );

  // 팝업에서 옵션 클릭 핸들러
  const handlePopupOptionClick = useCallback(
    (option: SelectOption<T>) => {
      toggleOption(option);

      // 단일 선택 모드에서는 선택 후 자동으로 팝업 닫기
      // (toggleOption 내부에서 이미 closeDropdown이 호출되지만, 팝업에서는 명시적으로 처리)
      if (!isMultiple) {
        // 약간의 지연을 두어 선택 애니메이션이 보이도록 함
        setTimeout(() => {
          closeDropdown();
        }, 100);
      }
    },
    [toggleOption, isMultiple, closeDropdown]
  );

  // 옵션 리스트 렌더링 함수 (드롭다운과 팝업에서 공통으로 사용)
  const renderOptionsList = useCallback(
    (isInPopup: boolean = false) => {
      if (filteredOptions.length === 0) {
        return <div className={styles.empty}>목록이 없습니다</div>;
      }

      return (
        <div className={styles['options-wrap']}>
          {groupedOptions.map((group, groupIndex) => (
            <React.Fragment key={`group-${groupIndex}`}>
              {group.group && (
                <div className={styles['option-group']}>
                  {group.group.label}
                </div>
              )}
              <ul className={styles['options-list']}>
                {group.options.map((option, index) => {
                  const isSelected = isOptionSelected(option);
                  const globalIndex = filteredOptions.findIndex(
                    (opt) => opt.value === option.value
                  );

                  // maxCount에 도달했는지 확인
                  const isMaxCountReached =
                    isMultiple &&
                    maxCount !== undefined &&
                    Array.isArray(internalValue) &&
                    internalValue.length >= maxCount &&
                    !isSelected; // 이미 선택된 항목은 제외

                  const isDisabled = option.disabled || isMaxCountReached;

                  return (
                    <li
                      key={`${index}-${String(option.value)}`}
                      className={cx(styles.option, {
                        [styles['option-selected']]: isSelected,
                        [styles['option-active']]:
                          !isInPopup && globalIndex === activeIndex, // 팝업에서는 active 상태 비활성화
                        [styles['option-disabled']]: isDisabled,
                      })}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) {
                          if (isInPopup) {
                            handlePopupOptionClick(option);
                          } else {
                            toggleOption(option);
                          }
                        }
                      }}
                      onMouseEnter={() => {
                        if (!isDisabled && !isInPopup) {
                          setActiveIndex(globalIndex);
                        }
                      }}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isDisabled}
                      title={
                        isMaxCountReached
                          ? `최대 ${maxCount}개까지 선택 가능합니다`
                          : undefined
                      }
                    >
                      {isMultiple && (
                        <span className={styles['option-check']} />
                      )}
                      {getOptionLabel(option)}
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          ))}
        </div>
      );
    },
    [
      filteredOptions,
      groupedOptions,
      isOptionSelected,
      isMultiple,
      maxCount,
      internalValue,
      activeIndex,
      getOptionLabel,
      handlePopupOptionClick,
      toggleOption,
      setActiveIndex,
    ]
  );

  // 검색 입력 렌더링 함수 (드롭다운과 팝업에서 공통으로 사용)
  const renderSearchInput = useCallback(
    (isInPopup: boolean = false) => {
      if (!showSearch) return null;

      return (
        <div className={styles['search-wrap']}>
          <input
            ref={isInPopup ? undefined : searchInputRef}
            type="text"
            className={styles['search-input']}
            value={searchValue}
            onChange={isInPopup ? handlePopupSearchInput : handleSearchInput}
            placeholder="검색..."
            onClick={(e) => e.stopPropagation()}
            aria-label="옵션 검색"
          />
        </div>
      );
    },
    [showSearch, searchValue, handlePopupSearchInput, handleSearchInput]
  );

  // 팝업 제목 생성
  const popupTitle = useMemo(() => {
    if (popupConfig?.title) {
      return popupConfig.title;
    }
    return placeholder || '선택해주세요';
  }, [popupConfig?.title, placeholder]);

  return (
    <>
      <div
        ref={selectRef}
        className={selectClassName}
        style={style}
        tabIndex={disabled || loading ? -1 : 0}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled || loading}
        aria-controls={`${selectId.current}-dropdown`}
        aria-labelledby={`${selectId.current}-label`}
      >
        <div className={styles['select-inner']}>
          {isMultiple && selectedOptions.length > 0 ? (
            <div
              className={styles.value}
              id={`${selectId.current}-label`}
              title={selectedValueText}
            >
              {selectedValueText}
            </div>
          ) : selectedOption ? (
            <div
              className={styles.value}
              id={`${selectId.current}-label`}
              title={getOptionLabel(selectedOption)}
            >
              {getOptionLabel(selectedOption)}
            </div>
          ) : (
            <div
              className={styles.placeholder}
              id={`${selectId.current}-label`}
            >
              {placeholder}
            </div>
          )}

          <div className={styles['suffix-wrap']}>
            {allowClear && hasValue && (
              <button
                type="button"
                className={styles['btn-clear']}
                onClick={handleClear}
                aria-label="지우기"
                tabIndex={-1}
              >
                <span className={styles['ico-clear']} aria-hidden="true" />
              </button>
            )}

            {loading ? (
              <span className={styles['ico-loading']} aria-hidden="true" />
            ) : (
              <span
                className={cx(styles.arrow, {
                  [styles['arrow-active']]: isOpen,
                })}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* 일반 드롭다운 렌더링 (팝업 모드가 아닐 때만) */}
        {!isUsingPopup && isOpen && (
          <div
            ref={dropdownRef}
            className={cx(styles.dropdown, dropdownClassName)}
            id={`${selectId.current}-dropdown`}
            role="listbox"
            aria-labelledby={`${selectId.current}-label`}
            style={{
              ...dropdownStyle,
              position: 'fixed',
              ...dropdownPosition,
            }}
          >
            {renderSearchInput(false)}
            {renderOptionsList(false)}
          </div>
        )}
      </div>

      {/* 팝업 렌더링 (팝업 모드일 때만) */}
      {isUsingPopup && (
        <Popup
          {...popupConfig}
          type="bottom"
          visible={isOpen}
          onClose={closeDropdown}
          title={popupTitle}
          className={cx(popupStyles['select-popup'], popupConfig?.className)}
          bodyClassName={cx(
            styles['select-popup-body'],
            popupConfig?.bodyClassName
          )}
          footer={
            isMultiple && (
              <Button size="lg" className="primary" onClick={closeDropdown}>
                확인
              </Button>
            )
          }
        >
          <div className={styles['select-popup-content']}>
            {renderSearchInput(true)}
            {renderOptionsList(true)}
          </div>
        </Popup>
      )}
    </>
  );
}

// 컴포넌트 이름 설정
Select.displayName = 'Select';

// 타입 캐스팅을 사용하여 제네릭 타입 지원
const SelectWithRef = forwardRef(Select) as <T = string | number>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<SelectHandle> }
) => React.ReactElement;

export default SelectWithRef;
