import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/common';
import styles from '@/assets/scss/pages/react-guide.module.scss';

const TypesGuideIndex = () => {
  const { updateConfig } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    updateConfig({
      title: 'TypeScript 가이드',
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
      <header className={styles.header}>
        <h1 className={styles.title}>TypeScript 실전 가이드</h1>
        <p className={styles.description}>
          JavaScript/React 개발자를 위한 점진적 TypeScript 학습 가이드입니다.
        </p>
      </header>

      <div className={styles.grid}>
        <Link to="/types-guide/beginner" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span role="img" aria-label="seedling">
                🌱
              </span>{' '}
              초급 (Beginner)
            </h2>
            <p className={styles.cardText}>
              기본 타입, <span className={styles.codeBlock}>Type Alias</span>와{' '}
              <span className={styles.codeBlock}>Interface</span>의 차이, 리터럴
              타입 등 TypeScript의 기본기를 다집니다.
            </p>
            <span className={styles.cardFooter}>시작하기 &rarr;</span>
          </div>
        </Link>

        <Link to="/types-guide/intermediate" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span role="img" aria-label="toolbox">
                🧰
              </span>{' '}
              중급 (Intermediate)
            </h2>
            <p className={styles.cardText}>
              유니온(<span className={styles.codeBlock}>|</span>), 인터섹션(
              <span className={styles.codeBlock}>&</span>), 타입 가드, 그리고
              제네릭(<span className={styles.codeBlock}>{'<T>'}</span>) 등 중급
              활용법을 배웁니다.
            </p>
            <span className={`${styles.cardFooter} ${styles.success}`}>
              자세히 보기 &rarr;
            </span>
          </div>
        </Link>

        <Link to="/types-guide/advanced" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle} style={{ color: '#dc3545' }}>
              <span role="img" aria-label="rocket">
                🚀
              </span>{' '}
              고급 (Advanced)
            </h2>
            <p className={styles.cardText}>
              유틸리티 타입, 조건부 타입(
              <span className={styles.codeBlock}>infer</span>), 맵드 타입 등
              동적이고 복잡한 타이핑 기법을 다룹니다.
            </p>
            <span className={styles.cardFooter} style={{ color: '#dc3545' }}>
              도전하기 &rarr;
            </span>
          </div>
        </Link>

        <Link to="/types-guide/reacttypes" className={styles.cardLink}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle} style={{ color: '#6f42c1' }}>
              <span role="img" aria-label="react">
                ⚛️
              </span>{' '}
              React 실무 (ReactTypes)
            </h2>
            <p className={styles.cardText}>
              Props, Hooks, Event 등 실무에서 React 컴포넌트를 정의할 때 자주
              만나는 타이핑 패턴과 모범 사례를 제공합니다.
            </p>
            <span className={styles.cardFooter} style={{ color: '#6f42c1' }}>
              실무 적용하기 &rarr;
            </span>
          </div>
        </Link>
      </div>

      <div className={styles.tipBox}>
        <h3>💡 팁</h3>
        <p>
          모든 예제 코드는 타입 에러가 발생하지 않도록 정확하게 작성되어
          있습니다.
          <br />
          <span className={styles.codeBlock}>src/pages/types-guide/</span>{' '}
          폴더의 소스코드를 참고하며 학습해 보세요.
        </p>
      </div>
    </div>
  );
};

export default TypesGuideIndex;
