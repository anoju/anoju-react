// src/components/common/Expand.tsx
import {
  useState,
  useCallback,
  ReactNode,
  Children,
  isValidElement,
  cloneElement,
  ReactElement,
  CSSProperties,
} from 'react';
import ExpandItem from './ExpandItem';
import ExpandPanel from './ExpandPanel';
import styles from '@/assets/scss/components/expand.module.scss';

// Expand 아이템 인터페이스
export interface ExpandItemData {
  value: number | string;
  title: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  wrap?: boolean;
}

// ExpandItem Props 타입 정의
interface ExpandItemProps {
  value?: number | string;
  title?: ReactNode;
  children?: ReactNode;
  open?: boolean;
  disabled?: boolean;
  duration?: number;
  easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';
  destroyOnClose?: boolean;
  wrap?: boolean;
  className?: string;
  _isControlled?: boolean;
  _onToggle?: (value: number | string) => void;
}

// 단순화된 타입 정의
type ExpandValue = number | string | (number | string)[];

// Expand 컴포넌트 Props
interface ExpandProps {
  children?: ReactNode;
  items?: ExpandItemData[];
  value?: ExpandValue;
  setValue?: (value: ExpandValue) => void;
  onChange?: (value: ExpandValue) => void;
  defaultValue?: ExpandValue;
  className?: string;
  style?: CSSProperties;
  duration?: number;
  easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';
  destroyOnClose?: boolean;
  disabled?: boolean;
  itemsWrap?: boolean;
  toggle?: boolean;
}

// 단일값 타입 가드
function isSingleValue(value: unknown): value is number | string {
  return typeof value === 'number' || typeof value === 'string';
}

// 배열값 타입 가드
function isArrayValue(value: unknown): value is (number | string)[] {
  return Array.isArray(value);
}

// Expand 컴포넌트
function Expand({
  children,
  items,
  value,
  setValue,
  onChange,
  defaultValue,
  className = '',
  style,
  duration = 300,
  easing = 'easeOut',
  destroyOnClose = false,
  disabled = false,
  itemsWrap = true,
  toggle,
}: ExpandProps) {
  // 내부 상태 (value가 제공되지 않은 경우 사용)
  const [internalValue, setInternalValue] = useState<ExpandValue>(
    defaultValue || []
  );

  // 실제 사용할 값 (외부 제어 > 내부 상태)
  const currentValue = value !== undefined ? value : internalValue;

  // 동작 모드 결정 (단일 토글 vs 다중 선택)
  const isToggleMode =
    toggle !== undefined
      ? toggle
      : isSingleValue(currentValue) || isSingleValue(defaultValue);

  // 값 변경 처리 함수
  const handleValueChange = useCallback(
    (newValue: ExpandValue) => {
      if (setValue) {
        setValue(newValue);
      } else {
        setInternalValue(newValue);
      }

      if (onChange) {
        onChange(newValue);
      }
    },
    [setValue, onChange]
  );

  // 아이템 토글 처리
  const handleItemToggle = useCallback(
    (itemValue: number | string) => {
      if (disabled) return;

      if (isToggleMode) {
        // 단일 토글 모드
        const newValue: ExpandValue =
          currentValue === itemValue ? '' : itemValue;
        handleValueChange(newValue);
      } else {
        // 다중 선택 모드
        const currentArray = isArrayValue(currentValue) ? currentValue : [];
        let newArray: (number | string)[];

        if (currentArray.includes(itemValue)) {
          // 이미 선택된 경우 제거
          newArray = currentArray.filter((v) => v !== itemValue);
        } else {
          // 선택되지 않은 경우 추가
          newArray = [...currentArray, itemValue];
        }

        handleValueChange(newArray);
      }
    },
    [currentValue, isToggleMode, disabled, handleValueChange]
  );

  // 아이템이 열린 상태인지 확인
  const isItemOpen = useCallback(
    (itemValue: number | string): boolean => {
      if (isToggleMode) {
        return currentValue === itemValue;
      } else {
        return isArrayValue(currentValue) && currentValue.includes(itemValue);
      }
    },
    [currentValue, isToggleMode]
  );

  // items 방식으로 렌더링
  if (items && items.length > 0) {
    return (
      <div className={`${styles['expand-group']} ${className}`} style={style}>
        {items.map((item, index) => (
          <ExpandItem
            key={`${String(item.value)}-${index}`}
            value={item.value}
            title={item.title}
            open={isItemOpen(item.value)}
            disabled={disabled || item.disabled}
            className={item.className}
            wrap={item.wrap !== undefined ? item.wrap : itemsWrap}
            duration={duration}
            easing={easing}
            destroyOnClose={destroyOnClose}
            _isControlled={true}
            _onToggle={handleItemToggle}
          >
            {item.children}
          </ExpandItem>
        ))}
      </div>
    );
  }

  // children 방식으로 렌더링
  if (children) {
    return (
      <div className={`${styles['expand-group']} ${className}`} style={style}>
        {Children.map(children, (child, index) => {
          if (isValidElement(child) && child.type === ExpandItem) {
            const childProps = child.props as ExpandItemProps;
            const itemValue: number | string =
              childProps.value !== undefined ? childProps.value : index;

            return cloneElement(child as ReactElement<ExpandItemProps>, {
              key: `${String(itemValue)}-${index}`,
              open: isItemOpen(itemValue),
              disabled: disabled || childProps.disabled,
              duration: childProps.duration || duration,
              easing: childProps.easing || easing,
              destroyOnClose:
                childProps.destroyOnClose !== undefined
                  ? childProps.destroyOnClose
                  : destroyOnClose,
              _isControlled: true,
              _onToggle: handleItemToggle,
            });
          }

          return child;
        })}
      </div>
    );
  }

  return null;
}

// Static 속성으로 Item과 Panel 추가
const ExpandWithStatics = Object.assign(Expand, {
  Item: ExpandItem,
  Panel: ExpandPanel,
});

export { ExpandItem, ExpandPanel };
export default ExpandWithStatics;
