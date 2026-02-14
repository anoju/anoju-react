import { useState, useEffect } from 'react';
import styles from '@/assets/scss/pages/react-guide.module.scss';
import { Sticky } from '@/components/common';

/**
 * React 라이프사이클 가이드 페이지
 * 
 * Vue의 라이프사이클 훅(mounted, updated, unmounted)이 React에서 어떻게 구현되는지 보여줍니다.
 * 
 * 대응표:
 * - mounted -> useEffect(fn, [])
 * - updated -> useEffect(fn, [dep])
 * - unmounted -> useEffect(() => cleanup, [])
 */
const LifecycleDemo = () => {
  // 상태 관리 (Vue의 data() 또는 ref())
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // 로그 추가 헬퍼 함수
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  /**
   * 1. 마운트 시점 (Vue: onMounted)
   * 의존성 배열이 빈 배열([])이면 컴포넌트가 처음 나타날 때 딱 한 번 실행됩니다.
   */
  useEffect(() => {
    addLog('🟢 컴포넌트가 마운트되었습니다. (Vue: onMounted)');

    // API 호출 등을 여기서 수행합니다.
    
    // 이 useEffect의 return 함수는 언마운트 시 실행됩니다.
    return () => {
      // 3. 언마운트 시점 (Vue: onUnmounted)
      // 컴포넌트가 사라지기 직전에 정리 작업을 수행합니다.
      console.log('🔴 컴포넌트가 언마운트되었습니다. (Vue: onUnmounted)');
      // 주의: 이 로그는 컴포넌트가 사라진 후의 콘솔이나 상위 컴포넌트에서 확인 가능합니다.
      // alert('컴포넌트가 언마운트(제거)됩니다!'); 
    };
  }, []);

  /**
   * 2. 업데이트 시점 (Vue: watch + onUpdated)
   * 의존성 배열에 변수([count])를 넣으면 해당 값이 변할 때마다 실행됩니다.
   */
  useEffect(() => {
    if (count > 0) {
      addLog(`🟡 count 값이 ${count}(으)로 변경되었습니다. (Vue: watch)`);
    }
  }, [count]); // count가 바뀔 때만 실행

  /**
   * 4. 매 렌더링마다 실행 (Vue: onUpdated)
   * 의존성 배열을 생략하면 모든 렌더링마다 실행됩니다. (성능 주의!)
   */
  useEffect(() => {
    // console.log('매 렌더링마다 실행됩니다.');
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>React 라이프사이클 (useEffect) 데모</h1>
      
      <div className={styles.demoSection}>
        <h2>카운터: {count}</h2>
        <button 
          onClick={() => setCount(prev => prev + 1)}
          className={styles.button}
        >
          증가시키기 (Update 트리거)
        </button>
        <p>
          버튼을 누르면 'Update' 라이프사이클이 동작하여 로그가 추가됩니다.
        </p>
      </div>

      <div className={styles.logArea}>
        <h3>라이프사이클 로그</h3>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              {log}
            </li>
          ))}
        </ul>
        {logs.length === 0 && <p className={styles.emptyState}>로그가 없습니다.</p>}
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
