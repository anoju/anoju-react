// src/pages/guide/loading.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight } from '@/components/common';
import { useLoading } from '@/hooks/useLoading';
import {
  showGlobalLoading,
  hideGlobalLoading,
  setGlobalLoading,
  getGlobalLoading,
  withLoading,
  wrapWithLoading,
  $loading,
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
  const { isLoading, showLoading, hideLoading, setLoading, getLoading } =
    useLoading();

  const [callbackMessage, setCallbackMessage] = useState('');

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

  // Promise와 함께 사용하는 예시
  const handleAsyncWithLoading = async () => {
    try {
      const result = await withLoading(simulateAsyncWork(3000), {
        text: '서버와 통신 중입니다...',
      });
      alert(result);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handleWrappedFunction = async () => {
    try {
      const result = await wrappedAsyncWork(2500);
      alert(result);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  // $loading API를 사용한 예시
  const handleAsyncWith$Loading = async () => {
    try {
      const result = await $loading.with(simulateAsyncWork(2000), {
        text: '$loading.with() 사용 중...',
      });
      alert(result);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const wrapped$LoadingFunction = $loading.wrap(simulateAsyncWork, {
    text: '$loading.wrap()으로 래핑된 함수',
  });

  const handleWrapped$LoadingFunction = async () => {
    try {
      const result = await wrapped$LoadingFunction(1500);
      alert(result);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  // 커스텀 아이콘 예시
  const CustomLoadingIcon = () => (
    <div style={{ fontSize: '40px', animation: 'spin 1s linear infinite' }}>
      🔄
    </div>
  );

  return (
    <div className="page-inner">
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <h1 className={styles.title}>Loading Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>변경 사항</h2>
        <p className={styles.txt}>
          이제 Loading 컴포넌트를 Provider 없이 사용할 수 있습니다! App.tsx에서
          &lt;Loading /&gt; 컴포넌트만 추가하면 됩니다.
        </p>
        <CodeHighlight
          code={`// App.tsx
import Loading from './components/common/Loading';

function App() {
  return (
    <div>
      {/* 다른 컴포넌트들... */}
      <Loading />
    </div>
  );
}`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`// Hook 사용
import { useLoading } from '@/hooks/useLoading';

// 전역 함수 사용
import { 
  showGlobalLoading, 
  hideGlobalLoading, 
  setGlobalLoading,
  getGlobalLoading,
  withLoading,
  wrapWithLoading,
  $loading
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
            <Button size="sm" className="primary" onClick={() => showLoading()}>
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
            >
              지연 표시 (2초)
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

            <Button
              size="sm"
              className="line"
              onClick={() => {
                const currentState = getLoading();
                alert(`현재 로딩 상태: ${currentState}`);
              }}
              style={{ zIndex: 10000 }}
            >
              상태 확인
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={handleAsyncWith$Loading}
            >
              $loading.with() (2초)
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={handleWrapped$LoadingFunction}
            >
              $loading.wrap() (1.5초)
            </Button>
          </div>

          <p className={styles.txt}>
            현재 로딩 상태: {isLoading ? '표시됨' : '숨김'}
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>$loading API (추천)</h2>
        <p className={styles.txt}>
          $loading 객체를 사용하여 더 간결하고 직관적인 API로 로딩을 제어할 수
          있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className="primary"
              onClick={() => $loading.show({ text: '$loading으로 표시' })}
            >
              $loading.show()
            </Button>

            <Button
              size="sm"
              className="secondary"
              onClick={() => $loading.hide()}
              style={{ zIndex: 10000 }}
            >
              $loading.hide()
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() => $loading.set(true, { text: '$loading으로 설정' })}
              style={{ zIndex: 10000 }}
            >
              $loading.set()
            </Button>

            <Button
              size="sm"
              className="line"
              onClick={() => {
                const state = $loading.get();
                alert(`$loading 상태: ${state}`);
              }}
              style={{ zIndex: 10000 }}
            >
              $loading.get()
            </Button>

            <Button
              size="sm"
              className="line"
              onClick={() => $loading.toggle({ text: '토글된 상태' })}
              style={{ zIndex: 10000 }}
            >
              $loading.toggle()
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`import { $loading } from '@/utils/loading';
// 또는
import $loading from '@/utils/loading';

// 기본 사용법
$loading.show(); // 기본 로딩 표시
$loading.show({ text: '커스텀 메시지' }); // 커스텀 메시지와 함께
$loading.hide(); // 로딩 숨기기

// 상태 제어
$loading.set(true, { text: '로딩 설정' }); // 상태 설정
$loading.toggle({ text: '토글 메시지' }); // 상태 토글

// 상태 확인
const isLoading = $loading.get(); // 현재 상태 가져오기

// Promise와 함께 사용
const result = await $loading.with(
  fetchData(),
  { text: '데이터 로딩 중...' }
);

// 함수 래핑
const wrappedFn = $loading.wrap(fetchData, {
  text: '처리 중...'
});`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>
          전역 함수를 사용한 로딩 제어 (레거시)
        </h2>
        <p className={styles.txt}>
          기존 전역 함수를 사용하여 어디서든 로딩 상태를 제어할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className="primary"
              onClick={() => showGlobalLoading({ text: '전역 함수로 표시' })}
            >
              전역 로딩 표시
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
                setGlobalLoading(true, { text: '전역 상태로 설정' })
              }
              style={{ zIndex: 10000 }}
            >
              전역 상태 설정
            </Button>

            <Button
              size="sm"
              className="line"
              onClick={() => {
                const state = getGlobalLoading();
                alert(`전역 로딩 상태: ${state}`);
              }}
              style={{ zIndex: 10000 }}
            >
              전역 상태 확인
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={handleWrapped$LoadingFunction}
            >
              $loading.wrap() (1.5초)
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>커스텀 아이콘</h2>
        <p className={styles.txt}>
          icon 속성을 사용하여 기본 스피너 대신 커스텀 아이콘을 사용할 수
          있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '커스텀 아이콘으로 표시',
                  icon: <CustomLoadingIcon />,
                })
              }
            >
              커스텀 아이콘
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '텍스트 아이콘 사용',
                  icon: <div style={{ fontSize: '30px' }}>⏳</div>,
                })
              }
            >
              텍스트 아이콘
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '아이콘 없이 표시',
                  icon: null,
                })
              }
            >
              아이콘 없음
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Body 스크롤 잠금</h2>
        <p className={styles.txt}>
          bodyLock 옵션을 true로 설정하면 로딩 중에 페이지 스크롤이
          비활성화됩니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '스크롤이 잠긴 상태입니다',
                  bodyLock: true,
                })
              }
            >
              Body Lock 활성화
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '스크롤이 가능한 상태입니다',
                  bodyLock: false,
                })
              }
            >
              Body Lock 비활성화
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>콜백 함수</h2>
        <p className={styles.txt}>
          onShow와 onHide 콜백 함수를 사용하여 로딩 표시/숨기기 후 추가 작업을
          수행할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '콜백 함수가 실행됩니다',
                  onShow: () => {
                    setCallbackMessage('로딩이 시작되었습니다!');
                    console.log('로딩 시작!');
                  },
                  onHide: () => {
                    setCallbackMessage('로딩이 종료되었습니다!');
                    console.log('로딩 종료!');
                  },
                })
              }
            >
              콜백 함수 테스트
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={() =>
                showLoading({
                  text: '3초 후 자동으로 숨겨집니다',
                  onShow: () => {
                    setCallbackMessage('로딩 시작 - 3초 후 자동 종료');
                    setTimeout(() => {
                      hideLoading();
                    }, 3000);
                  },
                  onHide: () => {
                    setCallbackMessage('자동으로 로딩이 종료되었습니다');
                  },
                })
              }
            >
              자동 종료 (3초)
            </Button>
          </div>

          {callbackMessage && (
            <div className={styles.txt} style={{ marginTop: '1rem' }}>
              콜백 메시지: {callbackMessage}
            </div>
          )}
        </div>
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
              onClick={handleAsyncWith$Loading}
            >
              $loading.with() (2초)
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={handleWrapped$LoadingFunction}
            >
              $loading.wrap() (1.5초)
            </Button>
            <Button
              size="sm"
              className="primary"
              onClick={handleAsyncWithLoading}
            >
              withLoading() (3초)
            </Button>

            <Button
              size="sm"
              className="primary"
              onClick={handleWrappedFunction}
            >
              wrapWithLoading() (2.5초)
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`import { $loading, withLoading, wrapWithLoading } from '@/utils/loading';

// $loading API 사용 (추천)
const handleFetchWith$Loading = async () => {
  try {
    const result = await $loading.with(
      fetchData(),
      { text: '데이터 로딩 중...' }
    );
    console.log(result);
  } catch (error) {
    console.error('에러:', error);
  }
};

// 함수 래핑
const wrapped$LoadingFn = $loading.wrap(fetchData, {
  text: '처리 중...',
});

// 기존 API (레거시)
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
});`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>설정 옵션</h2>
        <div className={styles.showcase}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>속성</th>
                <th>타입</th>
                <th>기본값</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>text</td>
                <td>string</td>
                <td>'로딩 중...'</td>
                <td>로딩 시 표시할 텍스트</td>
              </tr>
              <tr>
                <td>delay</td>
                <td>number</td>
                <td>0</td>
                <td>로딩 표시 지연 시간 (밀리초)</td>
              </tr>
              <tr>
                <td>icon</td>
                <td>ReactNode</td>
                <td>기본 스피너</td>
                <td>커스텀 로딩 아이콘 (null이면 아이콘 없음)</td>
              </tr>
              <tr>
                <td>bodyLock</td>
                <td>boolean</td>
                <td>false</td>
                <td>body 스크롤 잠금 여부</td>
              </tr>
              <tr>
                <td>onShow</td>
                <td>function</td>
                <td>undefined</td>
                <td>로딩 표시 후 실행할 함수</td>
              </tr>
              <tr>
                <td>onHide</td>
                <td>function</td>
                <td>undefined</td>
                <td>로딩 숨기기 후 실행할 함수</td>
              </tr>
            </tbody>
          </table>
          <h2 className={styles['section-title']}>장점</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>간단한 사용법:</strong> Provider 설정 불필요
            </li>
            <li>
              <strong>중복 방지:</strong> 내부 매니저가 자동으로 중복 로딩 방지
            </li>
            <li>
              <strong>호환성:</strong> 기존 API와 100% 호환
            </li>
            <li>
              <strong>전역 상태:</strong> 어디서든 접근 가능한 전역 상태
            </li>
            <li>
              <strong>자동 관리:</strong> 단일 인스턴스로 상태 자동 관리
            </li>
            <li>
              <strong>Fast Refresh:</strong> 컴포넌트와 유틸리티 분리로 개발
              환경 최적화
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default LoadingGuide;
