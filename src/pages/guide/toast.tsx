// src/pages/guide/toast.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight } from '@/components/common';
import { $toast } from '@/utils/toast';
import styles from '@/assets/scss/pages/guide.module.scss';

const ToastGuide = () => {
  usePageLayout({
    title: '토스트 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const [count, setCount] = useState(0);

  // 로딩 토스트 참조 저장용
  const [loadingToast, setLoadingToast] = useState<(() => void) | null>(null);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Toast Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { $toast } from '@/utils/toast';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <p className={styles.txt}>
          $toast 유틸리티를 사용하여 간편하게 토스트 메시지를 표시할 수
          있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Button
            size="sm"
            className="primary"
            onClick={() => $toast.success('성공 메시지입니다!')}
          >
            Success
          </Button>
          <Button
            size="sm"
            onClick={() => $toast.error('에러가 발생했습니다!')}
          >
            Error
          </Button>
          <Button
            size="sm"
            onClick={() => $toast.warning('주의가 필요합니다!')}
          >
            Warning
          </Button>
          <Button size="sm" onClick={() => $toast.info('정보를 확인하세요!')}>
            Info
          </Button>
          <Button size="sm" onClick={() => $toast.loading('로딩중입니다...')}>
            Loading
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 기본 사용법
$toast.success('성공 메시지입니다!');
$toast.error('에러가 발생했습니다!');
$toast.warning('주의가 필요합니다!');
$toast.info('정보를 확인하세요!');
$toast.loading('로딩중입니다...');`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>옵션과 함께 사용</h2>
        <p className={styles.txt}>
          두 번째 매개변수로 옵션을 전달하여 지속시간, 위치, 콜백 등을 설정할 수
          있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Button
            size="sm"
            className="primary"
            onClick={() =>
              $toast.success('5초 동안 표시됩니다', { duration: 5000 })
            }
          >
            5초 지속
          </Button>
          <Button
            size="sm"
            onClick={() =>
              $toast.info('하단에 표시됩니다', { position: 'bottom' })
            }
          >
            하단 위치
          </Button>
          <Button
            size="sm"
            onClick={() =>
              $toast.warning('자동으로 닫히지 않습니다', { duration: 0 })
            }
          >
            수동 닫기
          </Button>
          <Button
            size="sm"
            onClick={() =>
              $toast.success('닫힐 때 콜백이 실행됩니다', {
                onClose: () => {
                  setCount((prev) => prev + 1);
                  $toast.info(`카운트가 증가했습니다: ${count + 1}`);
                },
              })
            }
          >
            콜백 실행 (카운트: {count})
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 옵션과 함께 사용
$toast.success('5초 동안 표시됩니다', { duration: 5000 });
$toast.info('하단에 표시됩니다', { position: 'bottom' });
$toast.warning('자동으로 닫히지 않습니다', { duration: 0 });
$toast.success('닫힐 때 콜백이 실행됩니다', {
  onClose: () => {
    console.log('토스트가 닫혔습니다!');
  },
});`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>config 객체 사용법</h2>
        <p className={styles.txt}>
          $toast.config를 사용하여 옵션 객체로 토스트를 생성할 수 있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Button
            size="sm"
            className="primary"
            onClick={() =>
              $toast.config.success({
                content: '객체로 설정된 성공 메시지',
                duration: 3000,
                position: 'top',
              })
            }
          >
            Config Success
          </Button>
          <Button
            size="sm"
            onClick={() =>
              $toast.config.error({
                content: '하단에 표시되는 에러',
                position: 'bottom',
                duration: 4000,
              })
            }
          >
            Config Error
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// config 객체 사용법
$toast.config.success({
  content: '객체로 설정된 성공 메시지',
  duration: 3000,
  position: 'top',
});

$toast.config.error({
  content: '하단에 표시되는 에러',
  position: 'bottom',
  duration: 4000,
});`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>수동으로 토스트 닫기</h2>
        <p className={styles.txt}>
          토스트 함수는 닫기 함수를 반환하므로, 수동으로 토스트를 닫을 수
          있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Button
            size="sm"
            className="primary"
            onClick={() => {
              const close = $toast.loading(
                '처리중... 버튼을 클릭하면 닫힙니다',
                {
                  duration: 0,
                }
              );
              setLoadingToast(() => close);
            }}
          >
            로딩 시작
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (loadingToast) {
                loadingToast();
                setLoadingToast(null);
                $toast.success('작업이 완료되었습니다!');
              }
            }}
            disabled={!loadingToast}
          >
            로딩 완료
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 수동으로 토스트 닫기
const [closeFunction, setCloseFunction] = useState<(() => void) | null>(null);

// 토스트 생성 및 닫기 함수 저장
const handleStartLoading = () => {
  const close = $toast.loading('처리중...', { duration: 0 });
  setCloseFunction(() => close);
};

// 수동으로 토스트 닫기
const handleComplete = () => {
  if (closeFunction) {
    closeFunction();
    setCloseFunction(null);
    $toast.success('완료되었습니다!');
  }
};`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>중복 방지 (key 사용)</h2>
        <p className={styles.txt}>
          같은 key를 가진 토스트는 중복으로 표시되지 않습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Button
            size="sm"
            className="primary"
            onClick={() =>
              $toast.info('유니크한 메시지', { key: 'unique-message' })
            }
          >
            중복 방지 메시지
          </Button>
          <Button
            size="sm"
            onClick={() =>
              $toast.warning('저장중...', { key: 'saving', duration: 0 })
            }
          >
            저장 상태
          </Button>
          <Button
            size="sm"
            onClick={() => $toast.success('저장 완료!', { key: 'saving' })}
          >
            저장 완료
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 중복 방지
$toast.info('유니크한 메시지', { key: 'unique-message' });

// 같은 key로 상태 업데이트
$toast.warning('저장중...', { key: 'saving', duration: 0 });
$toast.success('저장 완료!', { key: 'saving' }); // 이전 토스트 대체`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>모든 토스트 제거</h2>
        <p className={styles.txt}>
          $toast.destroy()를 사용하여 모든 토스트를 제거하거나 위치별로 제거할
          수 있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Button
            size="sm"
            onClick={() => {
              $toast.success('상단 메시지 1', { position: 'top' });
              $toast.info('상단 메시지 2', { position: 'top' });
              $toast.warning('하단 메시지 1', { position: 'bottom' });
              $toast.error('하단 메시지 2', { position: 'bottom' });
            }}
          >
            여러 토스트 생성
          </Button>
          <Button size="sm" onClick={() => $toast.destroy('top')}>
            상단 토스트 제거
          </Button>
          <Button size="sm" onClick={() => $toast.destroy('bottom')}>
            하단 토스트 제거
          </Button>
          <Button size="sm" onClick={() => $toast.destroy()}>
            모든 토스트 제거
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 모든 토스트 제거
$toast.destroy(); // 모든 토스트 제거
$toast.destroy('top'); // 상단 토스트만 제거
$toast.destroy('bottom'); // 하단 토스트만 제거`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>복잡한 내용</h2>
        <p className={styles.txt}>
          토스트 내용으로 JSX 요소를 전달할 수 있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Button
            size="sm"
            className="primary"
            onClick={() =>
              $toast.success(
                <div>
                  <strong>성공!</strong>
                  <br />
                  <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                    작업이 완료되었습니다.
                  </span>
                </div>
              )
            }
          >
            복잡한 내용
          </Button>
          <Button
            size="sm"
            onClick={() =>
              $toast.info(
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                  }}
                >
                  <span>📧</span>
                  <div>
                    <div>새 메시지가 도착했습니다</div>
                    <div style={{ fontSize: '1.1rem', opacity: 0.7 }}>
                      홍길동님으로부터
                    </div>
                  </div>
                </div>,
                { duration: 5000 }
              )
            }
          >
            아이콘과 내용
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 복잡한 내용
$toast.success(
  <div>
    <strong>성공!</strong>
    <br />
    <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>
      작업이 완료되었습니다.
    </span>
  </div>
);

// 아이콘과 함께
$toast.info(
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
    <span>📧</span>
    <div>
      <div>새 메시지가 도착했습니다</div>
      <div style={{ fontSize: '1.1rem', opacity: 0.7 }}>
        홍길동님으로부터
      </div>
    </div>
  </div>,
  { duration: 5000 }
);`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>API 참조</h2>
        <div className={styles.showcase}>
          <h4 className={styles['sub-title']}>기본 함수들</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>함수</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>$toast.success(content, options?)</code>
                </td>
                <td>성공 토스트 표시</td>
              </tr>
              <tr>
                <td>
                  <code>$toast.error(content, options?)</code>
                </td>
                <td>에러 토스트 표시</td>
              </tr>
              <tr>
                <td>
                  <code>$toast.warning(content, options?)</code>
                </td>
                <td>경고 토스트 표시</td>
              </tr>
              <tr>
                <td>
                  <code>$toast.info(content, options?)</code>
                </td>
                <td>정보 토스트 표시</td>
              </tr>
              <tr>
                <td>
                  <code>$toast.loading(content, options?)</code>
                </td>
                <td>로딩 토스트 표시</td>
              </tr>
              <tr>
                <td>
                  <code>$toast.destroy(position?)</code>
                </td>
                <td>토스트 제거 (전체 또는 위치별)</td>
              </tr>
            </tbody>
          </table>

          <h4 className={styles['sub-title']}>옵션 (ToastOptions)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <td>
                  <code>duration</code>
                </td>
                <td>number</td>
                <td>3000</td>
                <td>지속 시간 (밀리초), 0이면 자동으로 닫히지 않음</td>
              </tr>
              <tr>
                <td>
                  <code>position</code>
                </td>
                <td>'top' | 'bottom'</td>
                <td>'top'</td>
                <td>표시 위치</td>
              </tr>
              <tr>
                <td>
                  <code>onClose</code>
                </td>
                <td>{'() => void'}</td>
                <td>undefined</td>
                <td>토스트가 닫힐 때 실행되는 콜백</td>
              </tr>
              <tr>
                <td>
                  <code>key</code>
                </td>
                <td>string</td>
                <td>undefined</td>
                <td>중복 방지를 위한 고유 키</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>사용 시 주의사항</h2>
        <div className={styles.showcase}>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>
              앱이 ToastProvider로 감싸져 있어야 $toast를 사용할 수 있습니다.
            </li>
            <li>
              로딩 토스트는 클릭해도 닫히지 않으며, 닫기 버튼도 표시되지
              않습니다.
            </li>
            <li>같은 key를 가진 토스트는 새로운 토스트로 대체됩니다.</li>
            <li>최대 10개까지의 토스트만 동시에 표시됩니다 (기본값).</li>
            <li>
              위치별로 토스트가 분리되어 관리되므로 상단/하단에 각각 쌓입니다.
            </li>
            <li>접근성을 위해 screen reader에 알림이 전달됩니다.</li>
            <li>모바일에서는 반응형으로 크기가 조정됩니다.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ToastGuide;
