import { Link, useLocation } from 'react-router-dom';
import styles from '@/assets/scss/pages/react-guide.module.scss';

const GuideTabs = () => {
  const location = useLocation();

  const tabs = [
    { path: '/react-guide', label: '🏠 홈' },
    { path: '/react-guide/lifecycle', label: '⚛️ 라이프사이클' },
    { path: '/react-guide/statemanagement', label: '💾 상태 관리' },
    { path: '/react-guide/lists', label: '📋 리스트' },
    { path: '/react-guide/advanced', label: '⚡ 심화' },
    { path: '/react-guide/pitfalls', label: '⚠️ 유의사항' },
  ];

  return (
    <nav className={styles.tabs}>
      {tabs.map((tab) => {
        // 정확히 일치하거나 (홈은 exact), 하위 경로 포함 여부 체크 (다른 탭들)
        // 하지만 현재 구조상 '/react-guide'가 다른 경로의 prefix이므로
        // 홈 탭은 정확히 일치할 때만 active
        const isHome = tab.path === '/react-guide';
        const isActive = isHome
          ? location.pathname === tab.path
          : location.pathname.startsWith(tab.path);

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default GuideTabs;
