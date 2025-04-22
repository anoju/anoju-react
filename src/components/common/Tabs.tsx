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
    id = `tab-${uniqueIdCounter++}`;
  } while (usedIds.has(id));

  usedIds.add(id);
  return id;
};

// Tab 아이템 인터페이스
export interface TabItem {
  id?: string; // 선택 사항으로 변경
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  to?: string; // 내부 라우팅 경로
}

// Tab 컴포넌트 props
interface TabProps {
  id?: string; // 선택 사항으로 변경
  label: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: (id: string) => void;
  to?: string;
  controls?: string; // 추가: aria-controls 속성을 위한 prop
}

// TabPanel 컴포넌트 props
interface TabPanelProps {
  id?: string; // 선택 사항으로 변경
  active?: boolean;
  children: ReactNode;
  labelledby?: string; // 추가: aria-labelledby 속성을 위한 prop
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

// 라벨에 기반한 ID 매핑을 관리하기 위한 맵
const idMap = new Map<ReactNode, string>();

// ID 생성 시 중복 방지를 위한 이미 사용된 ID 집합
const usedIds = new Set<string>();

// Tab 컴포넌트
export const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  (
    { id, label, active = false, disabled = false, onClick, to, controls },
    ref
  ) => {
    const navigate = useNavigate();
    const tabId = id || idMap.get(label) || generateUniqueId();

    // 라벨로 ID를 맵에 저장 (이미 존재하지 않는 경우)
    if (!idMap.has(label) && !id) {
      idMap.set(label, tabId);
    }

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
        aria-disabled={disabled ? disabled : undefined}
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
    const panelId = id || generateUniqueId();
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
  const activeIndicatorRef = useRef<{ left: number; width: number } | null>(
    null
  );

  // 아이템에 ID가 없는 경우 ID 생성 및 할당 (인덱스 기반)
  const processedItems = items?.map((item, index) => {
    if (!item.id) {
      // 라벨이 있으면 라벨 기반, 없으면 인덱스 기반으로 ID 생성
      const labelBasedId =
        item.label && typeof item.label === 'string'
          ? item.label.toLowerCase().replace(/\s+/g, '-')
          : `item-${index}`;

      // 고유성 보장을 위해 접두사 추가
      const generatedId = `tab-${labelBasedId}-${index}`;
      return { ...item, id: generatedId };
    }
    return item;
  });

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

        // 현재 활성 탭 위치 저장
        activeIndicatorRef.current = { left, width };
      }
    }
  }, []);

  // 경로를 기반으로 활성 탭 업데이트 (경로 기반 탭 활성화)
  useEffect(() => {
    if (activeTab) {
      setActiveTabId(activeTab);
      return;
    }

    // defaultTab 처리 (문자열 또는 숫자)
    if (defaultTab !== undefined && !activeTabId) {
      if (typeof defaultTab === 'number' && processedItems) {
        // 인덱스 기반 defaultTab 처리
        const index =
          defaultTab >= 0 && defaultTab < processedItems.length
            ? defaultTab
            : 0;
        if (processedItems[index] && processedItems[index].id) {
          setActiveTabId(processedItems[index].id as string);
          return;
        }
      } else if (typeof defaultTab === 'number' && children) {
        // 자식 컴포넌트가 있는 경우 인덱스 기반 처리
        const tabChildren: ReactElement[] = [];
        Children.forEach(children, (child) => {
          if (isValidElement(child) && child.type === Tab) {
            tabChildren.push(child);
          }
        });

        const index =
          defaultTab >= 0 && defaultTab < tabChildren.length ? defaultTab : 0;
        if (tabChildren[index]) {
          const tabProps = tabChildren[index].props as TabProps;
          const tabId =
            tabProps.id || idMap.get(tabProps.label) || generateUniqueId();
          setActiveTabId(tabId);
          return;
        }
      } else if (typeof defaultTab === 'string') {
        // 문자열 기반 defaultTab 처리 (기존과 동일)
        setActiveTabId(defaultTab);
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
      } else if (!activeTabId && processedItems[0].id) {
        // 아무것도 일치하지 않으면 첫 번째 항목 선택
        setActiveTabId(processedItems[0].id);
      }
    } else if (children) {
      // 탭 컴포넌트들을 배열로 추출
      const tabChildren: ReactElement[] = [];
      Children.forEach(children, (child) => {
        if (isValidElement(child) && child.type === Tab) {
          tabChildren.push(child);
        }
      });

      // 자식 Tab 컴포넌트에서 경로와 일치하는 탭 찾기
      let foundActiveTab = false;

      for (const child of tabChildren) {
        const tabProps = child.props as TabProps;
        const tabId =
          tabProps.id || idMap.get(tabProps.label) || generateUniqueId();

        if (tabProps.to && location.pathname.startsWith(tabProps.to)) {
          setActiveTabId(tabId);
          foundActiveTab = true;
          break;
        }
      }

      // 일치하는 탭이 없고 아직 활성화된 탭이 없으면 첫 번째 탭 선택
      if (!foundActiveTab && !activeTabId && tabChildren.length > 0) {
        const firstTabProps = tabChildren[0].props as TabProps;
        const firstTabId =
          firstTabProps.id ||
          idMap.get(firstTabProps.label) ||
          generateUniqueId();
        setActiveTabId(firstTabId);
      }
    }
  }, [
    activeTab,
    processedItems,
    children,
    location.pathname,
    defaultTab,
    activeTabId,
  ]);

  // Tab ID가 변경될 때마다 인디케이터 업데이트
  useEffect(() => {
    if (activeTabId) {
      // DOM이 업데이트된 후에 인디케이터 위치 계산을 위해 setTimeout 사용
      const timer = setTimeout(() => {
        updateActiveIndicator();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [activeTabId, updateActiveIndicator]);

  // 컴포넌트 마운트 시 인디케이터 초기화
  useEffect(() => {
    // 컴포넌트가 마운트된 후 인디케이터 초기화
    const timer = setTimeout(() => {
      updateActiveIndicator();
    }, 100);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 윈도우 크기 변경 시 인디케이터 위치 업데이트
  useEffect(() => {
    const handleResize = () => {
      updateActiveIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveIndicator]);

  // 탭 클릭 핸들러
  const handleTabClick = (tabId: string) => {
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
    }
  };

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
            const itemId = item.id as string; // 이미 processedItems에서 ID를 생성했으므로 안전
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
  const tabs: ReactElement[] = [];
  const panels: ReactElement[] = [];

  // 탭과 패널 컴포넌트 분리
  const tabComponents: ReactElement[] = [];
  const panelComponents: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === Tab) {
        tabComponents.push(child);
      } else if (child.type === TabPanel) {
        panelComponents.push(child);
      }
    }
  });

  // 각 탭에 고유 ID 할당
  const tabIds: string[] = [];
  tabComponents.forEach((tabComponent) => {
    const tabProps = tabComponent.props as TabProps;
    const tabId =
      tabProps.id || idMap.get(tabProps.label) || generateUniqueId();

    if (!tabProps.id) {
      idMap.set(tabProps.label, tabId);
    }

    tabIds.push(tabId);
  });

  // 탭 컴포넌트 생성
  tabComponents.forEach((tabComponent, index) => {
    // const tabProps = tabComponent.props as TabProps;
    const tabId = tabIds[index];
    const panelId = `panel-${tabId}`;

    tabs.push(
      cloneElement(tabComponent, {
        key: `tab-${tabId}-${index}`,
        id: tabId,
        active: activeTabId === tabId,
        onClick: handleTabClick,
        controls: panelId,
      } as Partial<TabProps>)
    );
  });

  // 패널 컴포넌트 생성 (인덱스 기반으로 탭과 매핑)
  panelComponents.forEach((panelComponent, index) => {
    // 해당 인덱스의 탭 ID가 있으면 사용, 없으면 새로 생성
    const tabId = index < tabIds.length ? tabIds[index] : generateUniqueId();
    const panelId = `panel-${tabId}`;
    const tabElementId = `tab-${tabId}`;

    panels.push(
      cloneElement(panelComponent, {
        key: panelId,
        id: tabId,
        active: activeTabId === tabId,
        labelledby: tabElementId,
      } as Partial<TabPanelProps>)
    );
  });

  return (
    <div className={`${styles.tabs} ${variantClass} ${className}`}>
      <div
        ref={tabsHeaderRef}
        className={`${styles['tabs-header']} ${alignmentClass} ${tabsClassName}`}
      >
        {tabs}
      </div>
      <div className={`${styles['tabs-content']} ${contentClassName}`}>
        {panels}
      </div>
    </div>
  );
};

// 컴포넌트 이름 지정
Tab.displayName = 'Tab';
TabPanel.displayName = 'TabPanel';
Tabs.displayName = 'Tabs';

export default Tabs;
