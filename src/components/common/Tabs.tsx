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

// Tab 아이템 인터페이스
export interface TabItem {
  id: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  to?: string; // 내부 라우팅 경로
}

// Tab 컴포넌트 props
interface TabProps {
  id: string;
  label: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: (id: string) => void;
  to?: string;
}

// TabPanel 컴포넌트 props
interface TabPanelProps {
  id: string;
  active?: boolean;
  children: ReactNode;
}

// Tabs 컴포넌트 props
interface TabsProps {
  children?: ReactNode;
  items?: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'outline' | 'underline' | 'pills';
  alignment?: 'start' | 'center' | 'full';
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
}

// Tab 컴포넌트
export const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ id, label, active = false, disabled = false, onClick, to }, ref) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (disabled) return;

      if (to) {
        navigate(to);
      } else if (onClick) {
        onClick(id);
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.tab} ${active ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
        onClick={handleClick}
        role="tab"
        aria-selected={active}
        aria-disabled={disabled ? disabled : undefined}
        tabIndex={disabled ? -1 : 0}
      >
        {label}
      </div>
    );
  }
);

// TabPanel 컴포넌트
export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ id, active = false, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles['tab-panel']} ${active ? styles.active : ''}`}
        role="tabpanel"
        id={`panel-${id}`}
        aria-labelledby={`tab-${id}`}
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

    // 먼저 defaultTab이 있으면 사용
    if (defaultTab && !activeTabId) {
      setActiveTabId(defaultTab);
      return;
    }

    if (items) {
      // URL 경로와 일치하는 탭 찾기
      const pathTab = items.find(
        (item) => item.to && location.pathname.startsWith(item.to)
      );
      if (pathTab) {
        setActiveTabId(pathTab.id);
      } else if (items.length > 0 && !activeTabId) {
        // 아무것도 일치하지 않으면 첫 번째 항목 선택
        setActiveTabId(items[0].id);
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
        if (tabProps.to && location.pathname.startsWith(tabProps.to)) {
          setActiveTabId(tabProps.id);
          foundActiveTab = true;
          break;
        }
      }

      // 일치하는 탭이 없고 아직 활성화된 탭이 없으면 첫 번째 탭 선택
      if (!foundActiveTab && !activeTabId && tabChildren.length > 0) {
        const firstTabProps = tabChildren[0].props as TabProps;
        setActiveTabId(firstTabProps.id);
      }
    }
  }, [activeTab, items, children, location.pathname, defaultTab, activeTabId]);

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
    if (items) {
      // 탭 클릭시 to 속성이 있으면 해당 경로로 이동
      const clickedTab = items.find((item) => item.id === tabId);
      if (clickedTab?.to) {
        navigate(clickedTab.to);
      }
    }
  };

  // 변형 클래스 생성
  const variantClass = variant !== 'default' ? styles[variant] : '';
  const alignmentClass = alignment !== 'start' ? styles[alignment] : '';

  // items 속성을 사용하는 경우
  if (items && items.length > 0) {
    return (
      <div className={`${styles.tabs} ${variantClass} ${className}`}>
        <div
          ref={tabsHeaderRef}
          className={`${styles['tabs-header']} ${alignmentClass} ${tabsClassName}`}
        >
          {items.map((item) => (
            <Tab
              key={`tab-${item.id}`}
              id={item.id}
              label={item.label}
              active={activeTabId === item.id}
              disabled={item.disabled}
              onClick={handleTabClick}
              to={item.to}
            />
          ))}
        </div>
        <div className={`${styles['tabs-content']} ${contentClassName}`}>
          {items.map((item) =>
            item.content ? (
              <TabPanel
                key={`panel-${item.id}`}
                id={item.id}
                active={activeTabId === item.id}
              >
                {item.content}
              </TabPanel>
            ) : null
          )}
        </div>
      </div>
    );
  }

  // children을 사용하는 경우 (Tab과 TabPanel 컴포넌트 직접 사용)
  const tabs: ReactElement[] = [];
  const panels: ReactElement[] = [];

  // 첫번째 순회: 모든 탭과 패널을 수집
  const tabsMap = new Map<string, ReactElement>();
  const panelsMap = new Map<string, ReactElement>();

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === Tab) {
        const props = child.props as TabProps;
        tabsMap.set(props.id, child);
      } else if (child.type === TabPanel) {
        const props = child.props as TabPanelProps;
        panelsMap.set(props.id, child);
      }
    }
  });

  // 두번째 순회: 탭과 패널을 배열에 추가 (순서 유지)
  let tabIndex = 0;
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === Tab) {
        const tabProps = child.props as TabProps;

        // Tab 컴포넌트 복제 및 속성 추가
        tabs.push(
          cloneElement(child, {
            key: `tab-${tabProps.id}-${tabIndex++}`,
            active: activeTabId === tabProps.id,
            onClick: handleTabClick,
          } as Partial<TabProps>)
        );
      } else if (child.type === TabPanel) {
        const panelProps = child.props as TabPanelProps;

        // TabPanel 컴포넌트 복제 및 속성 추가
        panels.push(
          cloneElement(child, {
            key: `panel-${panelProps.id}`,
            active: activeTabId === panelProps.id,
          } as Partial<TabPanelProps>)
        );
      }
    }
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
