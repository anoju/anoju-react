import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/common';
import styles from '@/assets/scss/pages/react-guide.module.scss';
import GuideTabs from './components/GuideTabs';

const ReactGuideIndex = () => {
  const { updateConfig } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    updateConfig({
      title: 'React 가이드',
      showBackButton: true,
      rightButtons: (
        <Button size="sm" onClick={() => navigate('/')}>
          홈
        </Button>
      ),
    });
  }, [updateConfig, navigate]);

  return (
    <div className={styles.container}>
      <GuideTabs />
      <header className={styles.header}>
        <h1 className={styles.title}>React 마이그레이션 가이드</h1>
        <p className={styles.description}>
          Vue 개발자를 위한 React 핵심 개념 및 실전 예제 모음입니다.
        </p>
      </header>

      <div className={styles.grid}>
        <Link to="/react-guide/lifecycle" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span role="img" aria-label="atom">
                ⚛️
              </span>{' '}
              라이프사이클
            </h2>
            <p className={styles.cardText}>
              Vue의 <span className={styles.codeBlock}>mounted</span>,{' '}
              <span className={styles.codeBlock}>updated</span>,{' '}
              <span className={styles.codeBlock}>unmounted</span>가 React의{' '}
              <span className={styles.codeBlock}>useEffect</span> 훅으로 어떻게
              대체되는지 알아봅니다.
            </p>
            <span className={styles.cardFooter}>예제 보기 &rarr;</span>
          </div>
        </Link>

        <Link to="/react-guide/statemanagement" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span role="img" aria-label="disk">
                💾
              </span>{' '}
              상태 관리 (State)
            </h2>
            <p className={styles.cardText}>
              Vue의 <span className={styles.codeBlock}>data</span>/
              <span className={styles.codeBlock}>ref</span>와 React의{' '}
              <span className={styles.codeBlock}>useState</span> 차이점, 그리고
              불변성(Immutability)의 중요성을 배웁니다.
            </p>
            <span className={`${styles.cardFooter} ${styles.success}`}>
              예제 보기 &rarr;
            </span>
          </div>
        </Link>

        <Link to="/react-guide/lists" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span role="img" aria-label="list">
                📋
              </span>{' '}
              리스트 & 조건부 렌더링
            </h2>
            <p className={styles.cardText}>
              <span className={styles.codeBlock}>v-for</span>와{' '}
              <span className={styles.codeBlock}>v-if</span> 대신 자바스크립트의{' '}
              <span className={styles.codeBlock}>map()</span> 함수와 삼항 연산자
              등을 사용하는 방법을 익힙니다.
            </p>
            <span className={`${styles.cardFooter} ${styles.danger}`}>
              예제 보기 &rarr;
            </span>
          </div>
        </Link>

        <Link to="/react-guide/pitfalls" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle} style={{ color: '#dc3545' }}>
              <span role="img" aria-label="warning">
                ⚠️
              </span>{' '}
              유의사항 (Pitfalls)
            </h2>
            <p className={styles.cardText}>
              <span className={styles.codeBlock}>useEffect</span> 무한 루프,
              객체 불변성 위반, Hooks 규칙 등 React 사용 시 흔히 겪는 실수들을
              알아봅니다.
            </p>
            <span className={styles.cardFooter} style={{ color: '#dc3545' }}>
              예제 보기 &rarr;
            </span>
          </div>
        </Link>

        <Link to="/react-guide/advanced" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle} style={{ color: '#6f42c1' }}>
              <span role="img" aria-label="lightning">
                ⚡
              </span>{' '}
              심화 (Computed, Events...)
            </h2>
            <p className={styles.cardText}>
              <span className={styles.codeBlock}>computed</span>,{' '}
              <span className={styles.codeBlock}>@click</span>,{' '}
              <span className={styles.codeBlock}>emit</span>,{' '}
              <span className={styles.codeBlock}>expose</span> 등 자주 쓰이는
              기능을 React 방식으로 비교합니다.
            </p>
            <span className={styles.cardFooter} style={{ color: '#6f42c1' }}>
              예제 보기 &rarr;
            </span>
          </div>
        </Link>
      </div>

      <div className={styles.tipBox}>
        <h3>💡 팁</h3>
        <p>
          각 페이지의 소스 코드를 열어보시면 주석으로 Vue와 React의 차이점이
          상세하게 설명되어 있습니다.
          <br />
          <span className={styles.codeBlock}>src/pages/react-guide/</span>{' '}
          폴더를 확인해주세요.
        </p>
      </div>
    </div>
  );
};

export default ReactGuideIndex;
