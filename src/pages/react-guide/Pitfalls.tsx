import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import Button from '@/components/common/Button';
import styles from '@/assets/scss/pages/react-guide.module.scss';

const PitfallsDemo = () => {
  const { updateConfig } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    updateConfig({
      title: '유의사항 (Pitfalls)',
      showBackButton: true,
      rightButtons: (
        <Button size="sm" onClick={() => navigate('/')}>
          홈
        </Button>
      ),
    });
  }, [updateConfig, navigate]);

  // 1. 무한 루프 예제용 상태
  const [count, setCount] = useState(0);
  const [infiniteLoopError, setInfiniteLoopError] = useState(false);

  useEffect(() => {
    // 꼭 필요한 경우에만 조건부로 업데이트하거나, 의존성 배열을 비워야 함
    if (count > 0 && count < 5 && infiniteLoopError) {
      console.log('조건부 업데이트로 안전하게 처리');
    }

    // Lint 에러 방지용
    console.log('API Usage:', setCount, setInfiniteLoopError);
  }, [count, infiniteLoopError]);

  // 2. 객체 불변성 예제용
  const [user, setUser] = useState({ name: '홍길동', age: 30 });
  const [updateStatus, setUpdateStatus] = useState('');

  const wrongUpdate = () => {
    // 👎 잘못된 예시: React는 객체의 참조가 바뀌지 않으면 변경을 감지하지 못합니다.

    // 아래와 같이 작성하면 에러가 발생하거나 화면이 갱신되지 않습니다:
    // user.age = user.age + 1; (직접 수정)
    // setUser(user); (같은 객체 참조 전달)

    console.log(
      '실제로는 user.age를 직접 수정하려고 시도했으나, 린터가 막았습니다.'
    );
    console.log('핵심은 "불변성(Immutability)"을 지켜야 한다는 점입니다.');

    setUpdateStatus('❌ 코드를 직접 수정하는 것은 금지되어 있습니다.');
  };

  const correctUpdate = () => {
    // 👍 새로운 객체를 만들어 할당
    setUser({ ...user, age: user.age + 1 });
    setUpdateStatus('✅ 정상적으로 리렌더링 됨');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>⚠️ React 사용 시 주의사항 (Pitfalls)</h1>

      {/* 1. 무한 루프 */}
      <div className={styles.demoSection}>
        <h2 style={{ color: '#dc3545' }}>1. useEffect 무한 루프 주의</h2>
        <p>
          <span className={styles.codeBlock}>useEffect</span> 내부에서 의존성
          배열(Dependency Array)에 포함된 상태를 변경하면 무한 루프에 빠질 수
          있습니다.
        </p>

        <div
          style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ffeeba',
            marginTop: '10px',
            color: '#856404',
          }}
        >
          <strong>❌ 잘못된 코드 패턴:</strong>
          <pre
            style={{
              margin: '10px 0',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            {`useEffect(() => {
  setCount(count + 1); // count가 변함 -> useEffect 재실행 -> 또 변경 -> 무한 반복
}, [count]);`}
          </pre>
        </div>

        <p style={{ marginTop: '10px' }}>
          <strong>👍 해결 방법:</strong>
        </p>
        <ul
          style={{
            marginLeft: '20px',
            lineHeight: '1.6',
            color: 'var(--body-text-color)',
          }}
        >
          <li>의존성 배열에서 해당 상태를 제거할 수 있는지 확인</li>
          <li>
            함수형 업데이트 사용:{' '}
            <span className={styles.codeBlock}>setCount(c =&gt; c + 1)</span>{' '}
            (이 경우 count를 의존성에서 뺄 수 있음)
          </li>
          <li>조건문으로 업데이트 제한</li>
        </ul>
      </div>

      {/* 2. 객체 불변성 위반 */}
      <div className={styles.demoSection}>
        <h2>2. 객체/배열 직접 수정 금지 (불변성)</h2>
        <p>
          Vue와 달리 React는 객체의 내부 속성만 바꾸고 그대로{' '}
          <span className={styles.codeBlock}>setState</span>하면 리렌더링되지
          않습니다.
        </p>

        <div
          className={styles.flexWrap}
          style={{ alignItems: 'center', marginTop: '15px' }}
        >
          <div
            className={styles.fruitBox}
            style={{ width: 'auto', padding: '0 20px' }}
          >
            나이: {user.age}
          </div>
          <div>
            <Button
              onClick={wrongUpdate}
              style={{
                marginRight: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
              }}
            >
              잘못된 수정 (반응 없음)
            </Button>
            <Button
              onClick={correctUpdate}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
              }}
            >
              올바른 수정 (새 객체)
            </Button>
          </div>
        </div>
        <p
          style={{
            color: updateStatus.includes('❌') ? 'red' : 'green',
            fontWeight: 'bold',
            marginTop: '10px',
          }}
        >
          {updateStatus}
        </p>
      </div>

      {/* 3. Hooks 규칙 */}
      <div className={styles.demoSection}>
        <h2>3. Hooks의 규칙 (Rules of Hooks)</h2>
        <p>
          Hook(<span className={styles.codeBlock}>useState</span>,{' '}
          <span className={styles.codeBlock}>useEffect</span> 등)은 반드시{' '}
          <strong>컴포넌트 최상위</strong>에서만 호출해야 합니다.
        </p>

        <div
          style={{
            background: '#f8d7da',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #f5c6cb',
            marginTop: '10px',
            color: '#721c24',
          }}
        >
          <strong>❌ 절대 금지:</strong>
          <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
            <li>
              조건문 안에서 호출 (
              <span className={styles.codeBlock}>if (cond) useEffect(...)</span>
              )
            </li>
            <li>
              반복문 안에서 호출 (
              <span className={styles.codeBlock}>for (...) useState(...)</span>)
            </li>
            <li>일반 JS 함수 안에서 호출</li>
          </ul>
        </div>
        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
          이유: React는 Hook이 호출되는 <strong>순서</strong>에 의존하여 상태를
          관리하기 때문입니다.
        </p>
      </div>

      {/* 4. Stale Closure */}
      <div className={styles.demoSection}>
        <h2>4. 오래된 클로저 (Stale Closure)</h2>
        <p>
          <span className={styles.codeBlock}>useEffect</span>나{' '}
          <span className={styles.codeBlock}>useCallback</span>의 의존성 배열을
          비워두면(<span className={styles.codeBlock}>[]</span>), 내부에서
          참조하는 상태값은 업데이트되지 않은 <strong>초기값</strong>으로
          유지됩니다.
        </p>
        <div
          style={{
            background: '#e2e3e5',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px',
            fontFamily: 'monospace',
            color: '#383d41',
          }}
        >
          useEffect(() =&gt; &#123;
          <br />
          &nbsp;&nbsp;console.log(count); // count가 10으로 변해도 여기선 계속
          0만 찍힘!
          <br />
          &#125;, []); // 의존성 배열 누락
        </div>
      </div>
    </div>
  );
};

export default PitfallsDemo;
