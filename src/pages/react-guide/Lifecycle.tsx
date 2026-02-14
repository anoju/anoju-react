import { useState, useEffect } from 'react';
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
   * 1. 마운트 시점 (Vue: onMounted)
   */
  useEffect(() => {
    addLog('🟢 컴포넌트가 마운트되었습니다. (Vue: onMounted)');

    return () => {
      console.log('🔴 컴포넌트가 언마운트되었습니다. (Vue: onUnmounted)');
    };
  }, []);

  /**
   * 2. 업데이트 시점 (Vue: watch + onUpdated)
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
        <h3>Vue 개발자를 위한 요약</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vue Lifecycle</th>
                <th>React Hook</th>
                <th>핵심 포인트</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>onMounted</td>
                <td>useEffect(fn, [])</td>
                <td>의존성 배열을 빈 배열([])로 설정</td>
              </tr>
              <tr>
                <td>watch / onUpdated</td>
                <td>useEffect(fn, [value])</td>
                <td>감시할 변수를 배열에 추가</td>
              </tr>
              <tr>
                <td>onUnmounted</td>
                <td>useEffect return fn</td>
                <td>useEffect 내부에서 함수를 리턴</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LifecycleDemo;
