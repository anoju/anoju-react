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
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '@/assets/scss/components/tabs.module.scss';

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  let id;
  do {
    id = `tab-${uniqueIdCounter++}-${Math.random().toString(36).substring(2, 9)}`;
  } while (usedIds.has(id));

  usedIds.add(id);
  return id;
};

// Tab 아이템 인터페이스
export interface TabItem {
  id?: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  to?: string; // 내부 라우팅 경로
}

// Tab 컴포넌트 props
interface TabProps {
  id?: string;
  label: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: (id: string) => void;
  to?: string;
  controls?: string; // aria-controls 속성을 위한 prop
}

// TabPanel 컴포넌트 props
interface TabPanelProps {
  id?: string;
  active?: boolean;
  children: ReactNode;
  labelledby?: string; // aria-labelledby 속성을 위한 prop
}

// Tabs 컴포넌트 props
interface TabsProps {
  children?: ReactNode;
  items?: TabItem[];
  activeTab?: string;
  defaultTab?: string | number; // 문자열 또는 숫자(인덱스) 허용
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'outline' | 'underline' | 'pills';
  alignment?: 'start' | 'center' | 'full';
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
}

// ID 생성 시 중복 방지를 위한 이미 사용된 ID 집합
const usedIds = new Set<string>();

// Tab 컴포넌트
export const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  (
    { id, label, active = false, disabled = false, onClick, to, controls },
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
        onClick(tabId);
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
      >
        {label}
      </div>
    );
  }
);

// TabPanel 컴포넌트
export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ id, active = false, children, labelledby }, ref) => {
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
      >
        {children}
      </div>
    );
  }
);

// Tabs 컴포넌트
export const Tabs: React.FC<TabsProps> = ({
  children,
  items,
  activeTab,
  defaultTab,
  onChange,
  variant = 'default',
  alignment = 'start',
  className = '',
  tabsClassName = '',
  contentClassName = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTabId, setActiveTabId] = useState<string>('');
  const tabsHeaderRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef<boolean>(false);

  // 아이템에 ID가 없는 경우 ID 생성 및 할당
  const processedItemsRef = useRef<TabItem[] | undefined>(undefined);

  if (!processedItemsRef.current && items) {
    processedItemsRef.current = items.map((item) => {
      if (!item.id) {
        return { ...item, id: generateUniqueId() };
      }
      return item;
    });
  }

  const processedItems = processedItemsRef.current;

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

  // 자식 컴포넌트 분리 - 미리 분석
  const tabsAndPanels = React.useMemo(() => {
    const tabs: ReactElement[] = [];
    const panels: ReactElement[] = [];

    if (children) {
      Children.forEach(children, (child) => {
        if (isValidElement(child)) {
          if (child.type === Tab) {
            tabs.push(child);
          } else if (child.type === TabPanel) {
            panels.push(child);
          }
        }
      });
    }

    return { tabs, panels };
  }, [children]);

  // 경로를 기반으로 활성 탭 초기화
  useEffect(() => {
    // 이미 초기화가 완료되었으면 아무것도 하지 않음
    if (initializedRef.current) {
      return;
    }

    // 외부에서 activeTab이 전달된 경우
    if (activeTab) {
      setActiveTabId(activeTab);
      initializedRef.current = true;
      return;
    }

    // defaultTab 처리 (문자열 또는 숫자)
    if (defaultTab !== undefined) {
      if (typeof defaultTab === 'number' && processedItems) {
        // 인덱스 기반 defaultTab 처리
        const index =
          defaultTab >= 0 && defaultTab < processedItems.length
            ? defaultTab
            : 0;
        if (processedItems[index] && processedItems[index].id) {
          setActiveTabId(processedItems[index].id as string);
          initializedRef.current = true;
          return;
        }
      } else if (
        typeof defaultTab === 'number' &&
        tabsAndPanels.tabs.length > 0
      ) {
        // 자식 컴포넌트가 있는 경우 인덱스 기반 처리
        const index =
          defaultTab >= 0 && defaultTab < tabsAndPanels.tabs.length
            ? defaultTab
            : 0;

        const tabComponent = tabsAndPanels.tabs[index];
        const tabProps = tabComponent.props as TabProps;
        const tabId = tabProps.id || generateUniqueId();
        setActiveTabId(tabId);
        initializedRef.current = true;
        return;
      } else if (typeof defaultTab === 'string') {
        // 문자열 기반 defaultTab 처리
        setActiveTabId(defaultTab);
        initializedRef.current = true;
        return;
      }
    }

    if (processedItems && processedItems.length > 0) {
      // URL 경로와 일치하는 탭 찾기
      const pathTab = processedItems.find(
        (item) => item.to && location.pathname.startsWith(item.to)
      );
      if (pathTab && pathTab.id) {
        setActiveTabId(pathTab.id);
      } else {
        // 아무것도 일치하지 않으면 첫 번째 항목 선택
        setActiveTabId(processedItems[0].id || '');
      }
      initializedRef.current = true;
    } else if (tabsAndPanels.tabs.length > 0) {
      // URL 경로와 일치하는 탭 찾기
      let foundActiveTab = false;

      for (let i = 0; i < tabsAndPanels.tabs.length; i++) {
        const tabComponent = tabsAndPanels.tabs[i];
        const tabProps = tabComponent.props as TabProps;

        // 이미 disabled 상태의 탭은 건너뛰기
        if (tabProps.disabled) continue;

        // 고유 ID 생성 또는 사용
        const tabId = tabProps.id || `generated-tab-${i}`;

        // 경로 기반 활성화 확인
        if (tabProps.to && location.pathname.startsWith(tabProps.to)) {
          setActiveTabId(tabId);
          foundActiveTab = true;
          break;
        }
      }

      // 일치하는 탭이 없으면 첫 번째 활성화된 탭 선택
      if (!foundActiveTab) {
        // 첫 번째 활성화된 (disabled 아닌) 탭 찾기
        for (let i = 0; i < tabsAndPanels.tabs.length; i++) {
          const tabComponent = tabsAndPanels.tabs[i];
          const tabProps = tabComponent.props as TabProps;

          if (!tabProps.disabled) {
            const tabId = tabProps.id || `generated-tab-${i}`;
            setActiveTabId(tabId);
            break;
          }
        }
      }

      initializedRef.current = true;
    }
  }, [activeTab, processedItems, tabsAndPanels, location.pathname, defaultTab]);

  // location.pathname 변경 시 활성 탭 업데이트
  useEffect(() => {
    // 외부에서 직접 activeTab을 관리하는 경우 무시
    if (activeTab) return;

    // items 속성을 사용하는 경우
    if (processedItems && processedItems.length > 0) {
      // URL 경로와 일치하는 탭 찾기
      const pathTab = processedItems.find(
        (item) => item.to && location.pathname.startsWith(item.to)
      );

      if (pathTab && pathTab.id && pathTab.id !== activeTabId) {
        setActiveTabId(pathTab.id);
      }
    }
    // children을 사용하는 경우
    else if (tabsAndPanels.tabs.length > 0) {
      let foundActiveTab = false;

      for (let i = 0; i < tabsAndPanels.tabs.length; i++) {
        const tabComponent = tabsAndPanels.tabs[i];
        const tabProps = tabComponent.props as TabProps;

        // disabled 상태의 탭은 건너뛰기
        if (tabProps.disabled) continue;

        const generatedTabId = `generated-tab-${i}`;
        const tabId = tabProps.id || generatedTabId;

        if (tabProps.to && location.pathname.startsWith(tabProps.to)) {
          if (tabId !== activeTabId) {
            setActiveTabId(tabId);
          }
          foundActiveTab = true;
          break;
        }
      }

      // 활성화된 탭이 없고, activeTabId도 없으면 첫 번째 탭 선택
      if (!foundActiveTab && !activeTabId && tabsAndPanels.tabs.length > 0) {
        for (let i = 0; i < tabsAndPanels.tabs.length; i++) {
          const tabComponent = tabsAndPanels.tabs[i];
          const tabProps = tabComponent.props as TabProps;

          if (!tabProps.disabled) {
            const tabId = tabProps.id || `generated-tab-${i}`;
            setActiveTabId(tabId);
            break;
          }
        }
      }
    }
  }, [
    location.pathname,
    processedItems,
    tabsAndPanels.tabs,
    activeTabId,
    activeTab,
  ]);

  // 활성 탭이 변경될 때 인디케이터 업데이트
  useEffect(() => {
    if (activeTabId) {
      const timer = setTimeout(() => {
        updateActiveIndicator();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTabId, updateActiveIndicator]);

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

  // activeTab prop이 변경되면 상태 업데이트
  useEffect(() => {
    if (activeTab && activeTab !== activeTabId) {
      setActiveTabId(activeTab);
    }
  }, [activeTab, activeTabId]);

  // 탭 클릭 핸들러
  const handleTabClick = useCallback(
    (tabId: string) => {
      if (tabId === activeTabId) return;

      setActiveTabId(tabId);
      if (onChange) {
        onChange(tabId);
      }

      // items 배열을 사용하는 경우
      if (processedItems) {
        // 탭 클릭시 to 속성이 있으면 해당 경로로 이동
        const clickedTab = processedItems.find((item) => item.id === tabId);
        if (clickedTab?.to) {
          navigate(clickedTab.to);
        }
      } else if (tabsAndPanels.tabs.length > 0) {
        // children을 사용하는 경우, 인덱스로 탭 찾기
        for (let i = 0; i < tabsAndPanels.tabs.length; i++) {
          const tabComponent = tabsAndPanels.tabs[i];
          const tabProps = tabComponent.props as TabProps;
          const generatedTabId = `generated-tab-${i}`;
          const currentTabId = tabProps.id || generatedTabId;

          if (currentTabId === tabId && tabProps.to) {
            navigate(tabProps.to);
            break;
          }
        }
      }
    },
    [activeTabId, onChange, processedItems, tabsAndPanels.tabs, navigate]
  );

  // 변형 클래스 생성
  const variantClass = variant !== 'default' ? styles[variant] : '';
  const alignmentClass = alignment !== 'start' ? styles[alignment] : '';

  // items 속성을 사용하는 경우
  if (processedItems && processedItems.length > 0) {
    return (
      <div className={`${styles.tabs} ${variantClass} ${className}`}>
        <div
          ref={tabsHeaderRef}
          className={`${styles['tabs-header']} ${alignmentClass} ${tabsClassName}`}
        >
          {processedItems.map((item) => {
            const itemId = item.id as string;
            const panelId = `panel-${itemId}`;

            return (
              <Tab
                key={`tab-${itemId}`}
                id={itemId}
                label={item.label}
                active={activeTabId === itemId}
                disabled={item.disabled}
                onClick={handleTabClick}
                to={item.to}
                controls={panelId}
              />
            );
          })}
        </div>
        <div className={`${styles['tabs-content']} ${contentClassName}`}>
          {processedItems.map((item) => {
            const itemId = item.id as string;
            const tabId = `tab-${itemId}`;

            return item.content ? (
              <TabPanel
                key={`panel-${itemId}`}
                id={itemId}
                active={activeTabId === itemId}
                labelledby={tabId}
              >
                {item.content}
              </TabPanel>
            ) : null;
          })}
        </div>
      </div>
    );
  }

  // children을 사용하는 경우 (Tab과 TabPanel 컴포넌트 직접 사용)
  const { tabs, panels } = tabsAndPanels;

  // 인덱스 기반 ID를 사용하여 마크업 생성
  const renderedTabs = tabs.map((tabComponent, index) => {
    const tabProps = tabComponent.props as TabProps;
    const generatedTabId = `generated-tab-${index}`;
    const tabId = tabProps.id || generatedTabId;
    const isActive = index === 0 && !activeTabId ? true : activeTabId === tabId;

    return cloneElement(tabComponent, {
      key: `tab-${tabId}-${index}`,
      id: tabId,
      active: isActive,
      onClick: handleTabClick,
      controls: `panel-${tabId}`,
    } as Partial<TabProps>);
  });

  const renderedPanels = panels.map((panelComponent, index) => {
    if (index >= tabs.length) return null;

    const tabProps = tabs[index].props as TabProps;
    const generatedTabId = `generated-tab-${index}`;
    const tabId = tabProps.id || generatedTabId;
    const isActive = index === 0 && !activeTabId ? true : activeTabId === tabId;

    return cloneElement(panelComponent, {
      key: `panel-${tabId}`,
      id: tabId,
      active: isActive,
      labelledby: `tab-${tabId}`,
    } as Partial<TabPanelProps>);
  });

  return (
    <div className={`${styles.tabs} ${variantClass} ${className}`}>
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
};

// 컴포넌트 이름 지정
Tab.displayName = 'Tab';
TabPanel.displayName = 'TabPanel';
Tabs.displayName = 'Tabs';

export default Tabs;
