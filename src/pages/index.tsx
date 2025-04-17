import { useState } from 'react';
import reactLogo from '@/assets/images/react.svg';
import viteLogo from '/vite.svg';
import { Button } from '@/components/common';
import styles from '@/assets/scss/pages/home.module.scss';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.home}>
      <div>
        <Button href="https://vite.dev" target="_blank">
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </Button>
        <Button href="https://react.dev" target="_blank">
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
        <Button to="/about">go to about</Button>
      </div>
      <p className={styles['read-the-docs']}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default Home;
