// src/pages/index.tsx
import { useState, useEffect, useMemo } from 'react';
import reactLogo from '@/assets/images/react.svg';
import viteLogo from '/vite.svg';
import { Button } from '@/components/common';
import styles from '@/assets/scss/pages/home.module.scss';
import { useLayout } from '@/contexts/LayoutContext';

function Home() {
  const [count, setCount] = useState(0);
  const { updateConfig } = useLayout();

  // Memoize the layout config to prevent unnecessary re-renders
  const layoutConfig = useMemo(
    () => ({
      title: 'Vite + React',
      showBackButton: false,
      rightButtons: (
        <Button className="primary" to="/guide/button" size="sm">
          Guide
        </Button>
      ),
    }),
    []
  );

  useEffect(() => {
    // 홈 페이지에 맞는 레이아웃 설정
    updateConfig(layoutConfig);
  }, [updateConfig, layoutConfig]);

  return (
    <div className={styles.home}>
      <div>
        <Button href="https://vite.dev" target="_blank" not>
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </Button>
        <Button href="https://react.dev" target="_blank" not>
          <img
            src={reactLogo}
            className={`${styles.logo} ${styles.react}`}
            alt="React logo"
          />
        </Button>
      </div>
      <h1>Vite + React</h1>
      <div className={styles.card}>
        <Button
          anchor
          className={styles.btn}
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <br />
        <p>
          <Button to="/about" not className="btn-link">
            go to about
          </Button>
        </p>
        <p>
          <Button 
            to="/react-guide" 
            not 
            className="btn-link" 
            style={{ color: '#42b883', fontWeight: 'bold', marginTop: '10px', display: 'inline-block' }}
          >
            ⚛️ Vue 개발자를 위한 React 가이드
          </Button>
        </p>
      </div>
      <p className={styles.docs}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default Home;
