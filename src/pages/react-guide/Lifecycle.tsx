import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import Button from '@/components/common/Button';
import styles from '@/assets/scss/pages/react-guide.module.scss';

/**
 * React 라이프사이클 가이드 페이지
 */
const LifecycleDemo = () => {
  const { updateConfig } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    updateConfig({
      title: '라이프사이클 (useEffect)',
      showBackButton: true,
      rightButtons: (
        <Button size="sm" onClick={() => navigate('/')}>
          홈
        </Button>
      ),
    });
  }, [updateConfig, navigate]);

  // 상태 관리 (Vue의 data() 또는 ref())
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // 로그 추가 헬퍼 함수
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  /**
   * 0. 생성 단계 (Vue: beforeCreate, created)
   * React 함수형 컴포넌트에서는 함수 본문이 실행되는 것 자체가 생성 단계입니다.
   * useState, useRef 등 훅을 호출하여 초기화를 진행합니다.
   */

  /**
   * 1. 마운트 전 (Vue: beforeMount)
   * useLayoutEffect는 브라우저가 화면을 그리기(paint) 전에 동기적으로 실행됩니다.
   * DOM 레이아웃을 측정하거나 깜빡임 없이 DOM을 수정할 때 사용합니다.
   */
  useLayoutEffect(() => {
    // console.log('DOM이 그려지기 직전 (Vue: beforeMount와 유사)');
  }, []);

  /**
   * 2. 마운트 후 (Vue: mounted)
   * useEffect는 렌더링이 화면에 반영된 후 비동기적으로 실행됩니다.
   * API 호출, 이벤트 리스너 등록 등에 적합합니다.
   */
  useEffect(() => {
    addLog('🟢 컴포넌트가 마운트되었습니다. (Vue: onMounted)');

    return () => {
      console.log('🔴 컴포넌트가 언마운트되었습니다. (Vue: onUnmounted)');
    };
  }, []);

  /**
   * 3. 감시 및 업데이트 (Vue: watch, onUpdated)
   * 의존성 배열에 값을 넣으면 해당 값이 변경될 때만 실행됩니다. (Vue의 watch와 유사)
   * 의존성 배열을 생략하면 모든 렌더링마다 실행됩니다. (Vue의 onUpdated와 유사하지만 주의 필요)
   */
  useEffect(() => {
    if (count > 0) {
      addLog(`🟡 count 값이 ${count}(으)로 변경되었습니다. (Vue: watch)`);
    }
  }, [count]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>React 라이프사이클 (useEffect) 데모</h1>

      <div className={styles.demoSection}>
        <h2>카운터: {count}</h2>
        <Button onClick={() => setCount((prev) => prev + 1)}>
          증가시키기 (Update 트리거)
        </Button>
        <p>버튼을 누르면 'Update' 라이프사이클이 동작하여 로그가 추가됩니다.</p>
      </div>

      <div className={styles.logArea}>
        <h3>라이프사이클 로그</h3>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
        {logs.length === 0 && (
          <p className={styles.emptyState}>로그가 없습니다.</p>
        )}
      </div>

      <div className={styles.tipBox}>
        <h3>Vue 개발자를 위한 상세 매핑 테이블</h3>
        <p>
          React에는 Vue의 모든 라이프사이클이 1:1로 존재하지 않으며, 주로{' '}
          <strong>useEffect</strong> 하나로 통합하여 처리합니다.
        </p>
        <div className={styles.tableContainer} style={{ marginTop: '10px' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vue Lifecycle</th>
                <th>React Hook / Logic</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>beforeCreate / created</td>
                <td>함수 본문 (Function Body)</td>
                <td>컴포넌트 함수가 실행되는 시점</td>
              </tr>
              <tr>
                <td>beforeMount</td>
                <td>useLayoutEffect(..., [])</td>
                <td>DOM이 그려지기 직전 (동기 실행)</td>
              </tr>
              <tr>
                <td>mounted</td>
                <td>useEffect(..., [])</td>
                <td>DOM이 그려진 후 (비동기 실행)</td>
              </tr>
              <tr>
                <td>
                  <strong>watch / updated</strong>
                </td>
                <td>
                  <strong>useEffect(..., [deps])</strong>
                </td>
                <td>
                  <strong>특정 값(deps)이 변경될 때만 실행</strong>
                </td>
              </tr>
              <tr>
                <td>beforeUnmount</td>
                <td>useEffect cleanup function</td>
                <td>컴포넌트가 사라지기 직전</td>
              </tr>
              <tr>
                <td>unmounted</td>
                <td>(없음)</td>
                <td>cleanup 함수 실행 시점과 거의 동일</td>
              </tr>
              <tr>
                <td>errorCaptured</td>
                <td>Error Boundary</td>
                <td>별도의 컴포넌트로 에러 포착 (함수형 훅 없음)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LifecycleDemo;
