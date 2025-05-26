// src/pages/guide/loading.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight } from '@/components/common';
import { useLoading } from '@/hooks';
import {
  showGlobalLoading,
  hideGlobalLoading,
  setGlobalLoading,
  withLoading,
  wrapWithLoading,
} from '@/utils/loading';
import styles from '@/assets/scss/pages/guide.module.scss';

const LoadingGuide = () => {
  usePageLayout({
    title: '로딩 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // Hook을 사용한 로딩 제어
  const { isLoading, showLoading, hideLoading, setLoading } = useLoading();

  const [simulateLoading, setSimulateLoading] = useState(false);

  // 비동기 작업 시뮬레이션
  const simulateAsyncWork = async (
    duration: number = 2000
  ): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('작업이 완료되었습니다!');
      }, duration);
    });
  };

  // 래핑된 비동기 함수 예시
  const wrappedAsyncWork = wrapWithLoading(simulateAsyncWork, {
    text: '데이터를 처리하고 있습니다...',
  });

  const handleAsyncWithLoading = async () => {
    try {
      setSimulateLoading(true);
      const result = await withLoading(simulateAsyncWork(3000), {
        text: '서버와 통신 중입니다...',
      });
      alert(result);
    } catch (error) {
      console.error('에러 발생:', error);
    } finally {
      setSimulateLoading(false);
    }
  };

  const handleWrappedFunction = async () => {
    try {
      setSimulateLoading(true);
      const result = await wrappedAsyncWork(2500);
      alert(result);
    } catch (error) {
      console.error('에러 발생:', error);
    } finally {
      setSimulateLoading(false);
    }
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Loading Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`// Hook 사용
import { useLoading } from '@/hooks';

// 전역 함수 사용
import { 
  showGlobalLoading, 
  hideGlobalLoading, 
  setGlobalLoading,
  withLoading,
  wrapWithLoading 
} from '@/utils/loading';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Hook을 사용한 로딩 제어</h2>
        <p className={styles.txt}>
          useLoading 훅을 사용하여 컴포넌트 내에서 로딩 상태를 제어할 수
          있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className="primary"
              onClick={() => showLoading()}
              disabled={simulateLoading}
            >
              기본 로딩 표시
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '커스텀 메시지와 함께 로딩 중...',
                })
              }
              disabled={simulateLoading}
            >
              커스텀 메시지
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '2초 후 표시됩니다',
                  delay: 2000,
                })
              }
              disabled={simulateLoading}
            >
              지연 표시 (2초)
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '스피너 없이 표시',
                  spinning: false,
                })
              }
              disabled={simulateLoading}
            >
              스피너 없음
            </Button>

            <Button
              size="sm"
              className="secondary"
              onClick={() => hideLoading()}
              style={{ zIndex: 10000 }}
            >
              로딩 숨기기
            </Button>

            <Button
              size="sm"
              className={isLoading ? 'secondary' : 'primary'}
              onClick={() => setLoading(!isLoading)}
              style={{ zIndex: 10000 }}
            >
              로딩 토글
            </Button>
          </div>

          <p className={styles.txt}>
            현재 로딩 상태: {isLoading ? '표시됨' : '숨김'}
          </p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// Hook 사용 예시
import { useLoading } from '@/hooks';

const { isLoading, showLoading, hideLoading, setLoading } = useLoading();

// 기본 로딩 표시
const handleShowLoading = () => {
  showLoading();
};

// 커스텀 설정으로 로딩 표시
const handleCustomLoading = () => {
  showLoading({
    text: '커스텀 메시지와 함께 로딩 중...',
    delay: 1000, // 1초 후 표시
    spinning: true, // 스피너 표시 여부
  });
};

// 로딩 숨기기
const handleHideLoading = () => {
  hideLoading();
};

// 로딩 상태 토글
const handleToggleLoading = () => {
  setLoading(!isLoading);
};`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>
          전역 함수를 사용한 로딩 제어
        </h2>
        <p className={styles.txt}>
          전역 함수를 사용하여 어디서든 로딩 상태를 제어할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className="primary"
              onClick={() => showGlobalLoading()}
              disabled={simulateLoading}
            >
              전역 로딩 표시
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showGlobalLoading({
                  text: '전역 함수로 표시되는 로딩',
                })
              }
              disabled={simulateLoading}
            >
              전역 커스텀 메시지
            </Button>

            <Button
              size="sm"
              className="secondary"
              onClick={() => hideGlobalLoading()}
              style={{ zIndex: 10000 }}
            >
              전역 로딩 숨기기
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                setGlobalLoading(true, {
                  text: '전역 상태로 설정된 로딩',
                })
              }
              style={{ zIndex: 10000 }}
              disabled={simulateLoading}
            >
              전역 상태 설정
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`import { 
  showGlobalLoading, 
  hideGlobalLoading, 
  setGlobalLoading 
} from '@/utils/loading';

// 전역 로딩 표시
const handleGlobalShow = () => {
  showGlobalLoading({
    text: '전역 함수로 표시되는 로딩',
  });
};

// 전역 로딩 숨기기
const handleGlobalHide = () => {
  hideGlobalLoading();
};

// 전역 로딩 상태 설정
const handleGlobalSet = () => {
  setGlobalLoading(true, {
    text: '전역 상태로 설정된 로딩',
  });
};`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Promise와 함께 사용하기</h2>
        <p className={styles.txt}>
          비동기 작업과 함께 로딩을 자동으로 관리하는 헬퍼 함수들을 제공합니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className="primary"
              onClick={handleAsyncWithLoading}
              disabled={simulateLoading}
            >
              withLoading 사용 (3초)
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={handleWrappedFunction}
              disabled={simulateLoading}
            >
              wrapWithLoading 사용 (2.5초)
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={async () => {
                setSimulateLoading(true);
                try {
                  // API 호출 시뮬레이션
                  await withLoading(
                    fetch('/api/data').then(() => {
                      // 실제로는 존재하지 않는 API이므로 에러가 발생하지만
                      // 로딩은 정상적으로 동작함을 보여주기 위한 예시
                      return new Promise((resolve) => {
                        setTimeout(() => resolve('API 응답'), 2000);
                      });
                    }),
                    { text: 'API 데이터를 가져오는 중...' }
                  );
                  alert('API 데이터 로드 완료!');
                } catch (error) {
                  console.error('API 에러:', error);
                  alert('API 에러 발생 (시뮬레이션)');
                } finally {
                  setSimulateLoading(false);
                }
              }}
              disabled={simulateLoading}
            >
              API 호출 시뮬레이션
            </Button>
          </div>

          <p className={styles.txt}>
            시뮬레이션 상태: {simulateLoading ? '실행 중' : '대기 중'}
          </p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`import { withLoading, wrapWithLoading } from '@/utils/loading';

// 비동기 작업 함수
const fetchData = async (): Promise<string> => {
  const response = await fetch('/api/data');
  return response.json();
};

// withLoading 사용 - Promise를 래핑
const handleFetchWithLoading = async () => {
  try {
    const result = await withLoading(
      fetchData(),
      { text: '데이터를 가져오는 중...' }
    );
    console.log(result);
  } catch (error) {
    console.error('에러:', error);
  }
};

// wrapWithLoading 사용 - 함수를 래핑
const wrappedFetchData = wrapWithLoading(fetchData, {
  text: '데이터 처리 중...',
});

const handleWrappedFetch = async () => {
  try {
    const result = await wrappedFetchData();
    console.log(result);
  } catch (error) {
    console.error('에러:', error);
  }
};`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>실제 사용 예시</h2>
        <p className={styles.txt}>
          실제 프로젝트에서 자주 사용되는 패턴들을 보여드립니다.
        </p>

        <h3 className={styles['sub-title']}>1. API 호출 시</h3>
        <CodeHighlight
          code={`// API 서비스 함수
const apiService = {
  // withLoading을 사용한 방법
  async getUserData(userId: string) {
    return withLoading(
      fetch(\`/api/users/\${userId}\`).then(res => res.json()),
      { text: '사용자 정보를 가져오는 중...' }
    );
  },

  // wrapWithLoading을 사용한 방법
  updateUser: wrapWithLoading(
    async (userId: string, data: UserData) => {
      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },
    { text: '사용자 정보를 업데이트하는 중...' }
  ),
};

// 컴포넌트에서 사용
const UserProfile = () => {
  const handleSave = async () => {
    try {
      await apiService.updateUser(userId, userData);
      alert('저장 완료!');
    } catch (error) {
      alert('저장 실패');
    }
  };

  return (
    <Button onClick={handleSave}>저장</Button>
  );
};`}
          language="typescript"
        />

        <h3 className={styles['sub-title']}>2. 폼 제출 시</h3>
        <CodeHighlight
          code={`const ContactForm = () => {
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async (formData: FormData) => {
    try {
      showLoading({ text: '메시지를 전송하는 중...' });
      
      await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      
      alert('메시지가 전송되었습니다!');
    } catch (error) {
      alert('전송 실패');
    } finally {
      hideLoading();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드들 */}
      <Button type="submit">전송</Button>
    </form>
  );
};`}
          language="typescript"
        />

        <h3 className={styles['sub-title']}>3. 페이지 전환 시</h3>
        <CodeHighlight
          code={`import { useNavigate } from 'react-router-dom';
import { showGlobalLoading, hideGlobalLoading } from '@/utils/loading';

const Navigation = () => {
  const navigate = useNavigate();

  const handleNavigate = async (path: string) => {
    showGlobalLoading({ text: '페이지를 로드하는 중...' });
    
    // 페이지 데이터 미리 로드
    try {
      await preloadPageData(path);
      navigate(path);
    } catch (error) {
      alert('페이지 로드 실패');
    } finally {
      hideGlobalLoading();
    }
  };

  return (
    <nav>
      <Button onClick={() => handleNavigate('/dashboard')}>
        대시보드
      </Button>
      <Button onClick={() => handleNavigate('/profile')}>
        프로필
      </Button>
    </nav>
  );
};`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>설정 옵션</h2>
        <div className={styles.showcase}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  속성
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  타입
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  기본값
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  설명
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  text
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  '로딩 중...'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  로딩 시 표시할 텍스트
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  delay
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  number
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  0
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  로딩 표시 지연 시간 (밀리초)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  spinning
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  true
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  스피너 표시 여부
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>사용 방법 요약</h2>
        <div className={styles.showcase}>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>
              <strong>Hook 방식</strong>: 컴포넌트 내에서 로딩 상태를 관리할 때
              사용
            </li>
            <li>
              <strong>전역 함수 방식</strong>: 유틸리티 함수나 서비스 레이어에서
              사용
            </li>
            <li>
              <strong>withLoading</strong>: 기존 Promise를 로딩과 함께 실행
            </li>
            <li>
              <strong>wrapWithLoading</strong>: 함수를 미리 래핑하여 재사용
            </li>
            <li>
              <strong>설정 옵션</strong>: text, delay, spinning으로 커스터마이징
            </li>
            <li>
              <strong>자동 관리</strong>: try-finally 블록 없이 자동으로 로딩
              상태 관리
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default LoadingGuide;
