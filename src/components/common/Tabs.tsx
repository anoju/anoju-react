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
import { useLocation, Link } from 'react-router-dom';
import styles from '@/assets/scss/components/tabs.module.scss';
import stickyStyles from '@/assets/scss/components/sticky.module.scss';
import cx from '@/utils/cx';
import { getStickyHeightForScroll } from '@/utils/stickyUtils';

// 고유 ID 생성을 위한 유틸리티 함수
let uniqueIdCounter = 0;
const generateUniqueId = (): string => {
  const id = `tab_${uniqueIdCounter++}_${Math.random().toString(36).substring(2, 9)}`;
  return id;
};

// 스크롤 유틸리티 함수 - sticky 높이를 고려한 스크롤
function scrollToElementWithStickyOffset(
  element: HTMLElement,
  spyOffset: number = 0,
  eventTarget: HTMLElement
): void {
  const elementRect = element.getBoundingClientRect();
  const elementTop = window.pageYOffset + elementRect.top;

  // 목표 스크롤 위치 계산
  const targetScrollY = elementTop - spyOffset;

  // 스크롤 방향에 따른 sticky 높이 가져오기
  const stickyHeight = getStickyHeightForScroll(targetScrollY);

  // 최종 스크롤 위치 (sticky 높이 + 추가 오프셋 고려)
  let finalScrollY = targetScrollY - stickyHeight;

  const stickyElement = eventTarget.closest(
    `.${stickyStyles['sticky-wrap']}`
  ) as HTMLElement | null;
  if (
    stickyElement &&
    !stickyElement.classList.contains(stickyStyles['fixed'])
  ) {
    finalScrollY = finalScrollY - stickyElement.offsetHeight;
  }

  window.scrollTo({
    top: Math.max(0, finalScrollY), // 음수 방지
    behavior: 'smooth',
  });
}

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
  scrollSpy?: boolean; // 스크롤스파이 모드인지 여부
  spyOffset?: number; // 스크롤스파이 오프셋
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

// Improved type definition for setValue - more flexible
type SetValueFunction<T> = T extends string
  ? Dispatch<SetStateAction<string>> | ((value: string) => void)
  : T extends number
    ? Dispatch<SetStateAction<number>> | ((value: number) => void)
    : Dispatch<SetStateAction<T>> | ((value: T) => void);

// Tabs 컴포넌트 props with improved generic handling
type TabsProps<T extends string | number = string | number> = {
  children?: ReactNode;
  items?: TabItem[];
  value?: T;
  setValue?: SetValueFunction<T>;
  defaultValue?: T;
  onChange?: (value: string | number) => void;
  type?: 'line' | 'round' | 'txt';
  align?: 'left' | 'center' | 'right' | '';
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  forceUsePathname?: boolean;
  // 스크롤스파이 옵션
  scrollSpy?: boolean; // 스크롤스파이 활성화 여부
  spyOffset?: number; // 스크롤스파이 오프셋 (px)
  scrollContainer?: string | HTMLElement; // 스크롤 컨테이너 지정
};

// Tab 컴포넌트
export const Tab = React.forwardRef<HTMLAnchorElement, TabProps>(
  (
    {
      id,
      value,
      index,
      label,
      active = false,
      disabled = undefined,
      onClick,
      to,
      scrollSpy = false,
      spyOffset = 0,
      controls,
    },
    ref
  ) => {
    const location = useLocation();

    // 고유 ID 생성, 한 번만 생성되도록 참조로 저장
    const tabIdRef = useRef<string>(id || generateUniqueId());
    const tabId = tabIdRef.current;

    // 현재 페이지 여부 확인 (to 속성이 있고 현재 경로와 일치하는 경우)
    const isCurrentPage = to && location.pathname.startsWith(to);

    const handleClick = (e: React.MouseEvent) => {
      // Link에서는 preventDefault를 하지 않음 (to 속성이 없는 경우에만)
      if (!to) {
        e.preventDefault();
      }

      if (disabled) return;

      // scrollSpy 모드 처리
      if (scrollSpy && value !== undefined) {
        // 스크롤스파이 모드에서 value를 앵커로 사용
        const targetElement = document.getElementById(String(value));
        if (targetElement) {
          // sticky 높이를 고려한 스크롤 함수 사용
          const eventTarget = (e.currentTarget || e.target) as HTMLElement;
          scrollToElementWithStickyOffset(
            targetElement,
            spyOffset,
            eventTarget
          );
        }
      }

      // onClick 실행 (상태 업데이트를 위해)
      if (onClick) {
        // value가 없으면 인덱스 사용
        onClick(value !== undefined ? value : index !== undefined ? index : 0);
      }
    };

    const panelId = controls || `panel-${tabId}`;
    // scrollSpy 모드에서는 value를 href로 사용, 아니면 기본 panelId 사용
    const href = scrollSpy && value !== undefined ? `#${value}` : `#${panelId}`;

    return (
      <li role="presentation" className={styles['tab-li']}>
        {to ? (
          <Link
            ref={ref}
            role="tab"
            className={cx(
              styles.tab,
              active ? styles.active : '',
              disabled ? styles.disabled : ''
            )}
            to={to}
            aria-selected={active}
            aria-disabled={disabled}
            aria-current={isCurrentPage ? 'page' : undefined}
            onClick={handleClick}
          >
            {label}
          </Link>
        ) : (
          <a
            ref={ref}
            role="tab"
            id={`tab-${tabId}`}
            className={cx(
              styles.tab,
              active ? styles.active : '',
              disabled ? styles.disabled : ''
            )}
            href={href}
            aria-controls={panelId}
            aria-selected={active}
            aria-disabled={disabled}
            data-value={value !== undefined ? value : index}
            onClick={handleClick}
          >
            {label}
          </a>
        )}
      </li>
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
        className={cx(styles['tab-panel'], active ? styles.active : '')}
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

// Tabs 컴포넌트 시작
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
      type = 'line',
      align = '',
      className = '',
      tabsClassName = '',
      contentClassName = '',
      forceUsePathname = false,
      // 스크롤스파이 옵션
      scrollSpy = false,
      spyOffset = 0,
      scrollContainer,
    } = props;

    const location = useLocation();

    // 활성 탭 값 상태 (value 또는 index)
    const [activeValue, setActiveValue] = useState<string | number | undefined>(
      value !== undefined
        ? value
        : defaultValue !== undefined
          ? defaultValue
          : undefined
    );

    // 스크롤 관련 상태 추가
    const [isScrollable, setIsScrollable] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const tablistRef = useRef<HTMLUListElement>(null);
    const initializedRef = useRef<boolean>(false);

    // debounce를 위한 타이머 참조
    const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

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

    // 스크롤 가능 여부를 체크하는 함수
    const checkScrollable = useCallback(() => {
      if (!tablistRef.current) return;

      const element = tablistRef.current;
      const scrollable = element.scrollWidth > element.clientWidth;
      setIsScrollable(scrollable);

      if (scrollable) {
        // 스크롤 방향 체크
        const scrollLeft = element.scrollLeft;
        const maxScrollLeft = element.scrollWidth - element.clientWidth;

        // 왼쪽으로 스크롤 가능 여부 (스크롤이 오른쪽으로 되어있을 때)
        setCanScrollLeft(scrollLeft > 0);

        // 오른쪽으로 스크롤 가능 여부 (스크롤이 왼쪽에 여유공간이 있을 때)
        setCanScrollRight(scrollLeft < maxScrollLeft);
      } else {
        // 스크롤이 불가능하면 모두 false
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }
    }, []);

    // 활성 탭을 스크롤 중앙으로 이동시키는 함수
    const scrollToActiveTab = useCallback(() => {
      if (!tablistRef.current) return;

      const tablist = tablistRef.current;
      const activeTab = tablist.querySelector(
        `.${styles.active}`
      ) as HTMLElement;

      if (!activeTab) return;

      // 스크롤 가능한 컨테이너인지 확인
      const containerWidth = tablist.clientWidth;
      const scrollWidth = tablist.scrollWidth;

      // 스크롤이 필요없는 경우 (모든 탭이 보이는 경우)
      if (scrollWidth <= containerWidth) return;

      // 활성 탭의 위치 정보
      const tabLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;
      const tabCenter = tabLeft + tabWidth / 2;

      // 컨테이너의 중앙 위치
      const containerCenter = containerWidth / 2;

      // 목표 스크롤 위치 (활성 탭이 중앙에 오도록)
      let targetScrollLeft = tabCenter - containerCenter;

      // 스크롤 범위 제한
      const maxScrollLeft = scrollWidth - containerWidth;
      targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));

      // 현재 스크롤 위치와 차이가 있을 때만 스크롤
      const currentScrollLeft = tablist.scrollLeft;
      const scrollDiff = Math.abs(targetScrollLeft - currentScrollLeft);

      // 5px 이하의 차이는 무시 (불필요한 스크롤 방지)
      if (scrollDiff > 5) {
        // 부드러운 스크롤 애니메이션
        tablist.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth',
        });
      }
    }, []);

    // 활성 탭의 위치를 업데이트하는 함수 (debounce 적용)
    const updateActiveIndicator = useCallback(() => {
      // 기존 타이머가 있으면 취소
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 새로운 타이머 설정 (150ms 지연)
      debounceTimerRef.current = setTimeout(() => {
        if (!tablistRef.current) return;

        const tablist = tablistRef.current;
        const activeTab = tablist.querySelector(
          `.${styles.active}`
        ) as HTMLElement;

        if (activeTab) {
          // 탭의 위치 계산
          const left = activeTab.offsetLeft;
          const width = activeTab.offsetWidth;

          // 탭 컨테이너 찾기
          const tabsContainer = tablist.closest(
            `.${styles.tabs}`
          ) as HTMLElement;
          if (tabsContainer) {
            // CSS 변수 적용
            tabsContainer.style.setProperty('--active-tab-left', `${left}px`);
            tabsContainer.style.setProperty('--active-tab-width', `${width}px`);
          }

          // 활성 탭을 중앙으로 스크롤
          scrollToActiveTab();
        }
      }, 150);
    }, [scrollToActiveTab]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);
    // 마우스 드래그 스크롤 기능
    useEffect(() => {
      if (!tablistRef.current) return;

      const tablist = tablistRef.current;
      let isMouseDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let hasMoved = false; // 마우스가 이동했는지 추적

      const handleMouseDown = (e: MouseEvent) => {
        // 스크롤이 가능한 상태에서만 드래그 활성화
        if (!isScrollable) return;

        isMouseDown = true;
        startX = e.pageX - tablist.offsetLeft;
        scrollLeft = tablist.scrollLeft;
        hasMoved = false; // 초기화
      };

      const handleMouseLeave = () => {
        if (isMouseDown) {
          isMouseDown = false;
          setIsDragging(false);
          hasMoved = false;
        }
      };

      const handleMouseUp = () => {
        if (isMouseDown) {
          isMouseDown = false;
          setIsDragging(false);
          hasMoved = false;
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isMouseDown) return;

        const x = e.pageX - tablist.offsetLeft;
        const distance = Math.abs(x - startX);

        // 5px 이상 이동한 경우에만 드래그로 처리
        if (distance > 5 && !hasMoved) {
          hasMoved = true;
          setIsDragging(true);
        }

        if (hasMoved) {
          e.preventDefault();
          const walk = (x - startX) * 1; // 스크롤 속도 조절
          tablist.scrollLeft = scrollLeft - walk;
        }
      };

      // 스크롤 이벤트 핸들러 (스크롤 방향 상태 업데이트용)
      const handleScroll = () => {
        if (!isScrollable) return;

        const scrollLeft = tablist.scrollLeft;
        const maxScrollLeft = tablist.scrollWidth - tablist.clientWidth;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < maxScrollLeft);
      };

      // 이벤트 리스너 추가
      tablist.addEventListener('mousedown', handleMouseDown);
      tablist.addEventListener('mouseleave', handleMouseLeave);
      tablist.addEventListener('mouseup', handleMouseUp);
      tablist.addEventListener('mousemove', handleMouseMove);
      tablist.addEventListener('scroll', handleScroll, { passive: true });

      // 클린업
      return () => {
        tablist.removeEventListener('mousedown', handleMouseDown);
        tablist.removeEventListener('mouseleave', handleMouseLeave);
        tablist.removeEventListener('mouseup', handleMouseUp);
        tablist.removeEventListener('mousemove', handleMouseMove);
        tablist.removeEventListener('scroll', handleScroll);
      };
    }, [isScrollable]);

    // ResizeObserver를 사용하여 탭 컨테이너 크기 변화 감지
    useEffect(() => {
      if (!tablistRef.current) return;

      const tablist = tablistRef.current;

      const resizeObserver = new ResizeObserver(() => {
        checkScrollable();
      });

      resizeObserver.observe(tablist);

      // 초기 실행
      checkScrollable();

      return () => {
        resizeObserver.disconnect();
      };
    }, [checkScrollable]);
    // 스크롤스파이 기능
    useEffect(() => {
      if (!scrollSpy) return;

      // 스크롤 컨테이너 결정
      const getScrollContainer = (): Element | Window => {
        if (scrollContainer) {
          if (typeof scrollContainer === 'string') {
            const element = document.querySelector(scrollContainer);
            return element || window;
          }
          return scrollContainer;
        }
        return window;
      };

      // 현재 보이는 섹션 찾기
      const findActiveSection = (): string | number | undefined => {
        if (!processedItems && tabs.length === 0) return undefined;

        // value를 가진 아이템들 수집 (스크롤스파이에서는 value가 앵커 ID역할)
        const validAnchors: Array<{ value: string | number; anchor: string }> =
          [];

        if (processedItems) {
          processedItems.forEach((item) => {
            if (item.value !== undefined) {
              validAnchors.push({
                value: item.value,
                anchor: String(item.value),
              });
            }
          });
        } else if (tabs.length > 0) {
          tabs.forEach((tabComponent, index) => {
            const tabProps = tabComponent.props as TabProps;
            const tabValue =
              tabProps.value !== undefined ? tabProps.value : index;
            validAnchors.push({ value: tabValue, anchor: String(tabValue) });
          });
        }

        if (validAnchors.length === 0) return undefined;

        // 각 앵커 요소의 위치 확인
        const scrollTop = scrollContainer
          ? scrollContainer instanceof HTMLElement
            ? scrollContainer.scrollTop
            : window.pageYOffset
          : window.pageYOffset;

        // 현재 보이는 영역에서 가장 적합한 섹션 찾기
        let currentActiveValue: string | number | undefined;
        let closestMatch:
          | { value: string | number; distance: number }
          | undefined;

        // 모든 앵커들의 위치를 확인하고 가장 적합한 것을 찾기
        // for (const { value: itemValue, anchor: anchorId } of validAnchors) {
        validAnchors.forEach(({ value: itemValue, anchor: anchorId }) => {
          const element = document.getElementById(anchorId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = scrollTop + rect.top;

            // 요소가 화면 상단에 도달했거나 지나갔을 때
            const htmlElement = document.documentElement;
            const stickyHeight =
              parseInt(htmlElement.style.getPropertyValue('--sticky-height')) ||
              0;
            const triggerPoint = scrollTop + spyOffset + stickyHeight;

            if (elementTop <= triggerPoint) {
              const distance = triggerPoint - elementTop;
              if (!closestMatch || distance < closestMatch.distance) {
                closestMatch = { value: itemValue, distance };
              }
            }
          }
        });

        // 가장 적합한 매치가 있으면 사용, 없으면 첫 번째 앵커 사용
        if (closestMatch) {
          currentActiveValue = closestMatch.value;
        } else if (validAnchors.length > 0) {
          // 아무것도 트리거되지 않았으면 첫 번째 앵커 사용 (페이지 맨 위에 있을 때)
          currentActiveValue = validAnchors[0].value;
        }

        return currentActiveValue;
      };

      // 스크롤 이벤트 핸들러
      const handleScroll = () => {
        const activeSection = findActiveSection();
        if (activeSection !== undefined && activeSection !== activeValue) {
          setActiveValue(activeSection);

          // 외부 상태도 업데이트
          if (setValue) {
            if (typeof activeSection === 'string') {
              const stringSetValue = setValue as
                | Dispatch<SetStateAction<string>>
                | ((value: string) => void);
              stringSetValue(activeSection);
            } else if (typeof activeSection === 'number') {
              const numberSetValue = setValue as
                | Dispatch<SetStateAction<number>>
                | ((value: number) => void);
              numberSetValue(activeSection);
            }
          }

          // onChange 콜백 호출
          if (onChange) {
            onChange(activeSection);
          }
        }
      };

      // 스크롤 이벤트 등록
      const container = getScrollContainer();
      const eventOptions = { passive: true };

      // 쓰로틀링을 위한 타이머
      let scrollTimer: NodeJS.Timeout;
      const throttledScroll = () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(handleScroll, 16); // 60fps
      };

      container.addEventListener('scroll', throttledScroll, eventOptions);

      // 초기 상태 확인
      handleScroll();

      // 클린업
      return () => {
        container.removeEventListener('scroll', throttledScroll);
        clearTimeout(scrollTimer);
      };
    }, [
      scrollSpy,
      spyOffset,
      scrollContainer,
      processedItems,
      tabs,
      activeValue,
      setValue,
      onChange,
    ]);

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

      // 경로 기반 활성화
      if (processedItems && processedItems.length > 0) {
        // Longest Prefix Match
        const matchedTabs = processedItems.filter(
          (item) => item.to && location.pathname.startsWith(item.to)
        );

        const pathTab = matchedTabs.sort(
          (a, b) => (b.to as string).length - (a.to as string).length
        )[0];

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
        let bestMatchIndex = -1;
        let maxMatchLength = -1;

        for (let i = 0; i < tabs.length; i++) {
          const tabComponent = tabs[i];
          const tabProps = tabComponent.props as TabProps;

          if (tabProps.disabled) continue;

          if (tabProps.to && location.pathname.startsWith(tabProps.to)) {
            const matchLength = tabProps.to.length;
            if (matchLength > maxMatchLength) {
              maxMatchLength = matchLength;
              bestMatchIndex = i;
            }
          }
        }

        if (bestMatchIndex !== -1) {
          setActiveValue(tabValues[bestMatchIndex]);
          foundActiveTab = true;
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
          // Longest Prefix Match
          const matchedTabs = processedItems.filter(
            (item) => item.to && location.pathname.startsWith(item.to)
          );

          const pathTab = matchedTabs.sort(
            (a, b) => (b.to as string).length - (a.to as string).length
          )[0];

          if (pathTab && pathTab.value !== undefined) {
            // 현재 활성 탭과 다른 경우에만 업데이트
            if (activeValue !== pathTab.value) {
              setActiveValue(pathTab.value);

              // setValue callback이 있는 경우 외부 상태도 업데이트
              if (setValue) {
                // 타입 안전하게 setValue 호출
                if (typeof pathTab.value === 'string') {
                  // string 타입 처리
                  const stringSetValue = setValue as
                    | Dispatch<SetStateAction<string>>
                    | ((value: string) => void);
                  stringSetValue(pathTab.value);
                } else if (typeof pathTab.value === 'number') {
                  // number 타입 처리
                  const numberSetValue = setValue as
                    | Dispatch<SetStateAction<number>>
                    | ((value: number) => void);
                  numberSetValue(pathTab.value);
                }
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
                  // 타입 안전하게 setValue 호출
                  if (typeof tabValue === 'string') {
                    // string 타입 처리
                    const stringSetValue = setValue as
                      | Dispatch<SetStateAction<string>>
                      | ((value: string) => void);
                    stringSetValue(tabValue);
                  } else if (typeof tabValue === 'number') {
                    // number 타입 처리
                    const numberSetValue = setValue as
                      | Dispatch<SetStateAction<number>>
                      | ((value: number) => void);
                    numberSetValue(tabValue);
                  }
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

    // 활성 탭이 변경될 때 인디케이터 업데이트 (debounce 적용된 함수 사용)
    useEffect(() => {
      if (activeValue !== undefined) {
        updateActiveIndicator();
      }
    }, [activeValue, updateActiveIndicator]);

    // 컴포넌트가 마운트된 후 인디케이터 업데이트
    useEffect(() => {
      const timer = setTimeout(() => {
        updateActiveIndicator();
      }, 100);

      return () => clearTimeout(timer);
    }, [updateActiveIndicator]);

    // 윈도우 크기 변경 시 인디케이터 위치 업데이트
    useEffect(() => {
      const handleResize = () => {
        updateActiveIndicator();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [updateActiveIndicator]);
    // 탭 클릭 핸들러 - 상태 업데이트만 처리 (페이지 이동은 Link가 담당)
    const handleTabClick = useCallback(
      (clickedValue: string | number) => {
        // to 속성이 없고 이미 활성화된 탭 클릭시 중복 실행 방지
        if (clickedValue === activeValue) {
          // to 속성이 있는지 확인
          let hasTo = false;

          // items 배열을 사용하는 경우
          if (processedItems) {
            const clickedTab = processedItems.find(
              (item) => item.value === clickedValue
            );
            hasTo = !!clickedTab?.to;
          } else if (tabs.length > 0) {
            // children을 사용하는 경우
            for (let i = 0; i < tabs.length; i++) {
              if (tabValues[i] === clickedValue) {
                const tabProps = tabs[i].props as TabProps;
                hasTo = !!tabProps.to;
                break;
              }
            }
          }

          // to 속성이 없으면 중복 실행 방지
          if (!hasTo) {
            return;
          }
        }

        // 내부 상태 업데이트
        setActiveValue(clickedValue);

        // 외부 상태 업데이트 (제공된 경우)
        if (setValue) {
          // 타입 안전하게 setValue 호출
          if (typeof clickedValue === 'string') {
            // string 타입 처리
            const stringSetValue = setValue as
              | Dispatch<SetStateAction<string>>
              | ((value: string) => void);
            stringSetValue(clickedValue);
          } else if (typeof clickedValue === 'number') {
            // number 타입 처리
            const numberSetValue = setValue as
              | Dispatch<SetStateAction<number>>
              | ((value: number) => void);
            numberSetValue(clickedValue);
          }
        }

        // 이전 방식 콜백 지원 (하위호환성)
        if (onChange) {
          onChange(clickedValue);
        }
      },
      [activeValue, setValue, onChange, processedItems, tabs, tabValues]
    );

    // 변형 클래스 생성
    const typeClass = styles['tabs-' + type];
    const alignClass = align !== '' ? styles[align] : '';

    // items 속성을 사용하는 경우
    if (processedItems && processedItems.length > 0) {
      const hasAnyContent = processedItems.some((item) => !!item.content);
      const onlyClass = !hasAnyContent ? styles['only-tab'] : '';

      return (
        <div
          className={cx(styles.tabs, typeClass, onlyClass, className)}
          ref={ref}
        >
          <div
            className={cx(
              styles['tabs-header'],
              alignClass,
              tabsClassName,
              isScrollable ? styles.scrollable : '',
              isDragging ? styles.dragging : '',
              canScrollLeft ? styles['scrollable-left'] : '',
              canScrollRight ? styles['scrollable-right'] : ''
            )}
          >
            <ul role="tablist" className={styles.tablist} ref={tablistRef}>
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
                    scrollSpy={scrollSpy}
                    spyOffset={spyOffset}
                    controls={panelId}
                  />
                );
              })}
            </ul>
          </div>
          {hasAnyContent && (
            <div className={cx(styles['tabs-content'], contentClassName)}>
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
        scrollSpy: scrollSpy, // 스크롤스파이 전달
        spyOffset: spyOffset, // spyOffset 전달
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
      <div className={cx(styles.tabs, typeClass, className)} ref={ref}>
        <div
          className={cx(
            styles['tabs-header'],
            alignClass,
            tabsClassName,
            isScrollable ? styles.scrollable : '',
            isDragging ? styles.dragging : '',
            canScrollLeft ? styles['scrollable-left'] : '',
            canScrollRight ? styles['scrollable-right'] : ''
          )}
        >
          <ul role="tablist" className={styles.tablist} ref={tablistRef}>
            {renderedTabs}
          </ul>
        </div>
        <div className={cx(styles['tabs-content'], contentClassName)}>
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
