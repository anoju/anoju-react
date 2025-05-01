// src/components/common/Tabs.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  ReactElement,
  Children,
  cloneElement,
  isValidElement,
  Dispatch,
  SetStateAction,
  ForwardedRef,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '@/assets/scss/components/tabs.module.scss';

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  // 컴포넌트 내에서 사용하는 지역 변수로 변경되었으므로 전역 Set 체크 제거
  const id = `tab_${uniqueIdCounter++}_${Math.random().toString(36).substring(2, 9)}`;
  return id;
};

// Tab 아이템 인터페이스
export interface TabItem {
  id?: string;
  value?: string | number;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  to?: string; // 내부 라우팅 경로
}

// Tab 컴포넌트 props
interface TabProps {
  id?: string;
  value?: string | number;
  index?: number; // 인덱스 prop 추가
  label: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: (value: string | number) => void;
  to?: string;
  controls?: string; // aria-controls 속성을 위한 prop
}

// TabPanel 컴포넌트 props
interface TabPanelProps {
  id?: string;
  value?: string | number;
  index?: number; // 인덱스 prop 추가
  active?: boolean;
  children: ReactNode;
  labelledby?: string; // aria-labelledby 속성을 위한 prop
}

// Tabs 컴포넌트 props
type TabsProps<T extends string | number = string | number> = {
  children?: ReactNode;
  items?: TabItem[];
  value?: T;
  setValue?: Dispatch<SetStateAction<T>> | ((value: T) => void);
  defaultValue?: T;
  onChange?: (value: string | number) => void;
  variant?: 'default' | 'outline' | 'underline' | 'pills';
  alignment?: 'start' | 'center' | 'full';
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  forceUsePathname?: boolean;

  // 이전 속성들 (하위호환성 유지)
  activeTab?: string;
  defaultTab?: string | number;
};

// Tab 컴포넌트
export const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  (
    {
      id,
      value,
      index,
      label,
      active = false,
      disabled = false,
      onClick,
      to,
      controls,
    },
    ref
  ) => {
    const navigate = useNavigate();

    // 고유 ID 생성, 한 번만 생성되도록 참조로 저장
    const tabIdRef = useRef<string>(id || generateUniqueId());
    const tabId = tabIdRef.current;

    const handleClick = () => {
      if (disabled) return;

      if (to) {
        navigate(to);
      } else if (onClick) {
        // value가 없으면 인덱스 사용
        onClick(value !== undefined ? value : index !== undefined ? index : 0);
      }
    };

    const panelId = controls || `panel-${tabId}`;

    return (
      <div
        ref={ref}
        className={`${styles.tab} ${active ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
        onClick={handleClick}
        role="tab"
        id={`tab-${tabId}`}
        aria-selected={active}
        aria-disabled={disabled}
        aria-controls={panelId}
        tabIndex={disabled ? -1 : 0}
        data-value={value !== undefined ? value : index}
      >
        {label}
      </div>
    );
  }
);

// TabPanel 컴포넌트
export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ id, value, index, active = false, children, labelledby }, ref) => {
    const panelIdRef = useRef<string>(id || generateUniqueId());
    const panelId = panelIdRef.current;
    const tabId = labelledby || `tab-${panelId}`;

    return (
      <div
        ref={ref}
        className={`${styles['tab-panel']} ${active ? styles.active : ''}`}
        role="tabpanel"
        id={`panel-${panelId}`}
        aria-labelledby={tabId}
        hidden={!active}
        data-value={value !== undefined ? value : index}
      >
        {children}
      </div>
    );
  }
);

// Tabs 컴포넌트
export const Tabs = React.forwardRef(
  <T extends string | number = string | number>(
    props: TabsProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      children,
      items,
      value,
      setValue,
      defaultValue,
      onChange,
      variant = 'default',
      alignment = 'start',
      className = '',
      tabsClassName = '',
      contentClassName = '',
      forceUsePathname = false,
      // 이전 속성들 (하위호환성)
      activeTab,
      defaultTab,
    } = props;

    const navigate = useNavigate();
    const location = useLocation();

    // 활성 탭 값 상태 (value 또는 index)
    const [activeValue, setActiveValue] = useState<string | number | undefined>(
      value !== undefined
        ? value
        : defaultValue !== undefined
          ? defaultValue
          : undefined
    );

    const tabsHeaderRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef<boolean>(false);

    // 이전 value 값 저장
    const prevValueRef = useRef<string | number | undefined>(value);

    // 아이템에 ID와 값 생성 및 할당
    const processedItemsRef = useRef<TabItem[] | undefined>(undefined);

    if (!processedItemsRef.current && items) {
      processedItemsRef.current = items.map((item, index) => {
        const newItem = { ...item };

        // ID가 없으면 생성
        if (!newItem.id) {
          newItem.id = generateUniqueId();
        }

        // value가 없으면 index 사용
        if (newItem.value === undefined) {
          newItem.value = index;
        }

        return newItem;
      });
    }

    const processedItems = processedItemsRef.current;

    // 자식 컴포넌트 저장용 참조
    const tabsAndPanelsRef = useRef<{
      tabs: ReactElement[];
      panels: ReactElement[];
      tabIds: string[];
      tabValues: (string | number)[];
    }>({ tabs: [], panels: [], tabIds: [], tabValues: [] });

    // 자식 컴포넌트 분리 및 ID/value 할당
    if (!tabsAndPanelsRef.current.tabs.length && children) {
      const tabs: ReactElement[] = [];
      const panels: ReactElement[] = [];
      const tabIds: string[] = [];
      const tabValues: (string | number)[] = [];

      Children.forEach(children, (child, index) => {
        if (isValidElement(child)) {
          if (child.type === Tab) {
            tabs.push(child);
            const tabProps = child.props as TabProps;
            tabIds.push(tabProps.id || generateUniqueId());

            // value가 없으면 index 사용
            tabValues.push(
              tabProps.value !== undefined ? tabProps.value : index
            );
          } else if (child.type === TabPanel) {
            panels.push(child);
          }
        }
      });

      tabsAndPanelsRef.current = { tabs, panels, tabIds, tabValues };
    }

    const { tabs, panels, tabIds, tabValues } = tabsAndPanelsRef.current;

    // 활성 탭의 위치를 업데이트하는 함수
    const updateActiveIndicator = useCallback(() => {
      if (!tabsHeaderRef.current) return;

      const tabsHeader = tabsHeaderRef.current;
      const activeTab = tabsHeader.querySelector(
        `.${styles.active}`
      ) as HTMLElement;

      if (activeTab) {
        // 탭의 위치 계산
        const left = activeTab.offsetLeft;
        const width = activeTab.offsetWidth;

        // 탭 컨테이너 찾기
        const tabsContainer = tabsHeader.closest(
          `.${styles.tabs}`
        ) as HTMLElement;
        if (tabsContainer) {
          // CSS 변수 적용
          tabsContainer.style.setProperty('--active-tab-left', `${left}px`);
          tabsContainer.style.setProperty('--active-tab-width', `${width}px`);
        }
      }
    }, []);

    // value 또는 defaultValue 기반으로 초기화
    useEffect(() => {
      // 이미 초기화된 경우 건너뛰기
      if (initializedRef.current && !forceUsePathname) {
        return;
      }

      // value prop이 지정된 경우 그것을 사용
      if (value !== undefined) {
        setActiveValue(value);
        initializedRef.current = true;
        return;
      }

      // defaultValue가 지정된 경우
      if (defaultValue !== undefined) {
        setActiveValue(defaultValue);
        initializedRef.current = true;
        return;
      }

      // 이전 방식 지원 (하위호환성)
      if (activeTab !== undefined) {
        setActiveValue(activeTab);
        initializedRef.current = true;
        return;
      }

      if (defaultTab !== undefined) {
        if (typeof defaultTab === 'number') {
          // 인덱스 기반 처리
          if (
            processedItems &&
            defaultTab >= 0 &&
            defaultTab < processedItems.length
          ) {
            setActiveValue(
              processedItems[defaultTab].value !== undefined
                ? processedItems[defaultTab].value!
                : defaultTab
            );
          } else if (
            tabValues.length > 0 &&
            defaultTab >= 0 &&
            defaultTab < tabValues.length
          ) {
            setActiveValue(tabValues[defaultTab]);
          } else {
            setActiveValue(0); // 기본값
          }
        } else {
          // 문자열 기반 처리
          setActiveValue(defaultTab);
        }
        initializedRef.current = true;
        return;
      }

      // 경로 기반 활성화
      if (processedItems && processedItems.length > 0) {
        const pathTab = processedItems.find(
          (item) => item.to && location.pathname.startsWith(item.to)
        );

        if (pathTab && pathTab.value !== undefined) {
          setActiveValue(pathTab.value);
        } else {
          // 첫 번째 활성화 가능한 탭 찾기
          const firstEnabledTab = processedItems.find((item) => !item.disabled);
          if (firstEnabledTab && firstEnabledTab.value !== undefined) {
            setActiveValue(firstEnabledTab.value);
          } else {
            setActiveValue(0); // 기본값
          }
        }
      } else if (tabs.length > 0) {
        // 탭이 직접 자식으로 있는 경우
        let foundActiveTab = false;

        for (let i = 0; i < tabs.length; i++) {
          const tabComponent = tabs[i];
          const tabProps = tabComponent.props as TabProps;

          if (tabProps.disabled) continue;

          if (tabProps.to && location.pathname.startsWith(tabProps.to)) {
            setActiveValue(tabValues[i]);
            foundActiveTab = true;
            break;
          }
        }

        if (!foundActiveTab) {
          // 첫 번째 활성화 가능한 탭 찾기
          for (let i = 0; i < tabs.length; i++) {
            const tabComponent = tabs[i];
            const tabProps = tabComponent.props as TabProps;

            if (!tabProps.disabled) {
              setActiveValue(tabValues[i]);
              break;
            }
          }
        }
      }

      initializedRef.current = true;
    }, [
      value,
      defaultValue,
      activeTab,
      defaultTab,
      processedItems,
      tabs,
      tabValues,
      location.pathname,
      forceUsePathname,
    ]);

    // value prop이 외부에서 변경되면 활성 탭 업데이트
    useEffect(() => {
      // 이전 value와 현재 value가 다르면 업데이트
      if (value !== undefined && value !== prevValueRef.current) {
        setActiveValue(value);
        prevValueRef.current = value;
      }
    }, [value]);

    // location 변경 감지를 위한 useEffect 추가
    useEffect(() => {
      // 초기화된 후에만 URL 변경에 반응
      if (initializedRef.current) {
        // items 방식으로 사용하는 경우
        if (processedItems && processedItems.length > 0) {
          // URL과 일치하는 탭 찾기
          const pathTab = processedItems.find(
            (item) => item.to && location.pathname.startsWith(item.to)
          );

          if (pathTab && pathTab.value !== undefined) {
            // 현재 활성 탭과 다른 경우에만 업데이트
            if (activeValue !== pathTab.value) {
              setActiveValue(pathTab.value);

              // setValue callback이 있는 경우 외부 상태도 업데이트
              if (setValue) {
                setValue(pathTab.value as T);
              }
            }
          }
        }
        // 자식 컴포넌트 방식으로 사용하는 경우
        else if (tabs.length > 0) {
          for (let i = 0; i < tabs.length; i++) {
            const tabComponent = tabs[i];
            const tabProps = tabComponent.props as TabProps;

            // 경로와 일치하는 탭 찾기
            if (tabProps.to && location.pathname.startsWith(tabProps.to)) {
              const tabValue = tabValues[i];

              // 현재 활성 탭과 다른 경우에만 업데이트
              if (activeValue !== tabValue) {
                setActiveValue(tabValue);

                // setValue callback이 있는 경우 외부 상태도 업데이트
                if (setValue) {
                  setValue(tabValue as T);
                }
              }
              break;
            }
          }
        }
      }
    }, [
      location.pathname,
      activeValue,
      processedItems,
      tabs,
      tabValues,
      setValue,
    ]);

    // 활성 탭이 변경될 때 인디케이터 업데이트
    useEffect(() => {
      if (activeValue !== undefined) {
        const timer = setTimeout(() => {
          updateActiveIndicator();
        }, 50);
        return () => clearTimeout(timer);
      }
    }, [activeValue, updateActiveIndicator]);

    // 컴포넌트가 마운트된 후 항상 인디케이터 업데이트
    useEffect(() => {
      const timers = [
        setTimeout(() => updateActiveIndicator(), 50),
        setTimeout(() => updateActiveIndicator(), 200),
        setTimeout(() => updateActiveIndicator(), 500),
      ];

      return () => timers.forEach((timer) => clearTimeout(timer));
    }, [updateActiveIndicator]);

    // 윈도우 크기 변경 시 인디케이터 위치 업데이트
    useEffect(() => {
      const handleResize = () => {
        updateActiveIndicator();
      };

      window.addEventListener('resize', handleResize);

      // 컴포넌트 마운트된 후 초기화
      const timer = setTimeout(() => {
        updateActiveIndicator();
      }, 100);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }, [updateActiveIndicator]);

    // 탭 클릭 핸들러
    const handleTabClick = useCallback(
      (clickedValue: string | number) => {
        // 이미 활성화된 탭 클릭시 중복 실행 방지
        if (clickedValue === activeValue) return;

        // 내부 상태 업데이트
        setActiveValue(clickedValue);

        // 외부 상태 업데이트 (제공된 경우)
        if (setValue) {
          // Dispatch<SetStateAction<T>> 타입과 호환되도록 처리
          if (typeof setValue === 'function') {
            setValue(clickedValue as T);
          }
        }

        // 이전 방식 콜백 지원 (하위호환성)
        if (onChange) {
          onChange(clickedValue);
        }

        // items 배열을 사용하는 경우
        if (processedItems) {
          // 탭 클릭시 to 속성이 있으면 해당 경로로 이동
          const clickedTab = processedItems.find(
            (item) => item.value === clickedValue
          );
          if (clickedTab?.to) {
            navigate(clickedTab.to);
          }
        } else if (tabs.length > 0) {
          // children을 사용하는 경우, value로 탭 찾기
          for (let i = 0; i < tabs.length; i++) {
            if (tabValues[i] === clickedValue) {
              const tabProps = tabs[i].props as TabProps;
              if (tabProps.to) {
                navigate(tabProps.to);
              }
              break;
            }
          }
        }
      },
      [
        activeValue,
        setValue,
        onChange,
        processedItems,
        tabs,
        tabValues,
        navigate,
      ]
    );

    // 변형 클래스 생성
    const variantClass = variant !== 'default' ? styles[variant] : '';
    const alignmentClass = alignment !== 'start' ? styles[alignment] : '';

    // items 속성을 사용하는 경우
    if (processedItems && processedItems.length > 0) {
      const hasAnyContent = processedItems.some((item) => !!item.content);
      const onlyClass = !hasAnyContent ? styles['only-tab'] : '';

      return (
        <div
          className={[styles.tabs, variantClass, onlyClass, className].join(
            ' '
          )}
          ref={ref}
        >
          <div
            ref={tabsHeaderRef}
            className={`${styles['tabs-header']} ${alignmentClass} ${tabsClassName}`}
          >
            {processedItems.map((item, index) => {
              const itemId = item.id as string;
              const itemValue = item.value as string | number;
              const panelId = `panel-${itemId}`;

              return (
                <Tab
                  key={`tab-${itemId}`}
                  id={itemId}
                  value={itemValue}
                  index={index}
                  label={item.label}
                  active={activeValue === itemValue}
                  disabled={item.disabled}
                  onClick={handleTabClick}
                  to={item.to}
                  controls={panelId}
                />
              );
            })}
          </div>
          {hasAnyContent && (
            <div className={`${styles['tabs-content']} ${contentClassName}`}>
              {processedItems.map((item, index) => {
                const itemId = item.id as string;
                const itemValue = item.value as string | number;
                const tabId = `tab-${itemId}`;

                return item.content ? (
                  <TabPanel
                    key={`panel-${itemId}`}
                    id={itemId}
                    value={itemValue}
                    index={index}
                    active={activeValue === itemValue}
                    labelledby={tabId}
                  >
                    {item.content}
                  </TabPanel>
                ) : null;
              })}
            </div>
          )}
        </div>
      );
    }

    // children을 사용하는 경우 (Tab과 TabPanel 컴포넌트 직접 사용)
    const renderedTabs = tabs.map((tabComponent, index) => {
      const tabId = tabIds[index];
      const tabValue = tabValues[index];
      const isActive = activeValue === tabValue;

      return cloneElement(tabComponent, {
        key: `tab-${tabId}-${index}`,
        id: tabId,
        value: tabValue,
        index, // 인덱스 전달
        active: isActive,
        onClick: handleTabClick,
        controls: `panel-${tabId}`,
      } as Partial<TabProps>);
    });

    const renderedPanels = panels.map((panelComponent, index) => {
      if (index >= tabs.length) return null;

      const tabId = tabIds[index];
      const tabValue = tabValues[index];
      const isActive = activeValue === tabValue;

      return cloneElement(panelComponent, {
        key: `panel-${tabId}`,
        id: tabId,
        value: tabValue,
        index, // 인덱스 전달
        active: isActive,
        labelledby: `tab-${tabId}`,
      } as Partial<TabPanelProps>);
    });

    return (
      <div
        className={[styles.tabs, variantClass, className].join(' ')}
        ref={ref}
      >
        <div
          ref={tabsHeaderRef}
          className={`${styles['tabs-header']} ${alignmentClass} ${tabsClassName}`}
        >
          {renderedTabs}
        </div>
        <div className={`${styles['tabs-content']} ${contentClassName}`}>
          {renderedPanels}
        </div>
      </div>
    );
  }
);

// 컴포넌트 이름 지정
Tab.displayName = 'Tab';
TabPanel.displayName = 'TabPanel';
Tabs.displayName = 'Tabs';

export default Tabs;
