import React from 'react';
import { Link } from 'react-router-dom';
import styles from '@/assets/scss/pages/react-guide.module.scss';

const ReactGuideIndex = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          React 마이그레이션 가이드
        </h1>
        <p className={styles.description}>
          Vue 개발자를 위한 React 핵심 개념 및 실전 예제 모음입니다.
        </p>
      </header>

      <div className={styles.grid}>
        <Link to="/react-guide/lifecycle" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span role="img" aria-label="atom">⚛️</span> 라이프사이클
            </h2>
            <p className={styles.cardText}>
              Vue의 <span className={styles.codeBlock}>mounted</span>, <span className={styles.codeBlock}>updated</span>, <span className={styles.codeBlock}>unmounted</span>가
              React의 <span className={styles.codeBlock}>useEffect</span> 훅으로 어떻게 대체되는지 알아봅니다.
            </p>
            <span className={styles.cardFooter}>예제 보기 &rarr;</span>
          </div>
        </Link>
        
        <Link to="/react-guide/statemanagement" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span role="img" aria-label="disk">💾</span> 상태 관리 (State)
            </h2>
            <p className={styles.cardText}>
              Vue의 <span className={styles.codeBlock}>data</span>/<span className={styles.codeBlock}>ref</span>와 React의 <span className={styles.codeBlock}>useState</span> 차이점, 
              그리고 불변성(Immutability)의 중요성을 배웁니다.
            </p>
            <span className={`${styles.cardFooter} ${styles.success}`}>예제 보기 &rarr;</span>
          </div>
        </Link>

        <Link to="/react-guide/lists" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span role="img" aria-label="list">📋</span> 리스트 & 조건부 렌더링
            </h2>
            <p className={styles.cardText}>
              <span className={styles.codeBlock}>v-for</span>와 <span className={styles.codeBlock}>v-if</span> 대신 자바스크립트의 <span className={styles.codeBlock}>map()</span> 함수와 
              삼항 연산자 등을 사용하는 방법을 익힙니다.
            </p>
            <span className={`${styles.cardFooter} ${styles.danger}`}>예제 보기 &rarr;</span>
          </div>
        </Link>
      </div>
      
      <div className={styles.tipBox}>
        <h3>💡 팁</h3>
        <p>
          각 페이지의 소스 코드를 열어보시면 주석으로 Vue와 React의 차이점이 상세하게 설명되어 있습니다.
          <br />
          <span className={styles.codeBlock}>src/pages/react-guide/</span> 폴더를 확인해주세요.
        </p>
      </div>
    </div>
  );
};

export default ReactGuideIndex;
