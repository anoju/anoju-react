// src/pages/guide/pull-to-refresh.tsx
import { useState, useRef } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, PullToRefresh } from '@/components/common';
import type { PullToRefreshRef, ProgressPayload } from '@/components/common';
import { $toast } from '@/utils/toast';
import styles from '@/assets/scss/pages/guide.module.scss';

const PullToRefreshGuide = () => {
  usePageLayout({
    title: 'Pull To Refresh / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const pullToRefreshRef = useRef<PullToRefreshRef>(null);

  const [refreshCount, setRefreshCount] = useState(0);
  const [items, setItems] = useState([
    '아이템 1',
    '아이템 2',
    '아이템 3',
    '아이템 4',
    '아이템 5',
  ]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRefresh = (close: () => void) => {
    setRefreshCount((prev) => prev + 1);
    $toast.success('새로고침 완료!');

    // 가상의 데이터 로드
    setTimeout(() => {
      const newItems = [
        `새 아이템 ${refreshCount + 1}-1`,
        `새 아이템 ${refreshCount + 1}-2`,
        `새 아이템 ${refreshCount + 1}-3`,
        ...items,
      ];
      setItems(newItems);
      close();
    }, 2000);
  };

  const handleProgress = (payload: ProgressPayload) => {
    setProgress(Math.round(payload.progress * 100));
  };

  const toggleDisabled = () => {
    const newDisabled = !isDisabled;
    setIsDisabled(newDisabled);
    pullToRefreshRef.current?.disabled(newDisabled);
    $toast.info(newDisabled ? 'Pull-to-Refresh 비활성화' : 'Pull-to-Refresh 활성화');
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>PullToRefresh Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { PullToRefresh } from '@/components/common';
import type { PullToRefreshRef } from '@/components/common';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <p className={styles.txt}>
          화면을 아래로 당겨서 새로고침하는 기능입니다. 모바일 환경에서 주로
          사용되며, 터치 제스처로 콘텐츠를 당겨서 데이터를 갱신할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <PullToRefresh
            ref={pullToRefreshRef}
            pullText="당겨서 새로고침"
            releaseText="놓아서 새로고침"
            refreshText="새로고침 중..."
            refreshTimeout={5000}
            onRefresh={handleRefresh}
            onProgress={handleProgress}
          >
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                }}
              >
                <strong>새로고침 횟수: {refreshCount}</strong>
                <br />
                <span style={{ fontSize: '14px', color: '#666' }}>
                  진행률: {progress}%
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '15px',
                      marginBottom: '10px',
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </PullToRefresh>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const handleRefresh = (close: () => void) => {
  // 데이터 로드 로직
  setTimeout(() => {
    // 데이터 업데이트
    close(); // 새로고침 완료
  }, 2000);
};

<PullToRefresh
  pullText="당겨서 새로고침"
  releaseText="놓아서 새로고침"
  refreshText="새로고침 중..."
  refreshTimeout={5000}
  onRefresh={handleRefresh}
>
  {/* 콘텐츠 */}
</PullToRefresh>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>컨트롤 기능</h2>
        <p className={styles.txt}>
          ref를 통해 Pull-to-Refresh 기능을 활성화/비활성화할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <Button onClick={toggleDisabled}>
            {isDisabled ? '활성화' : '비활성화'}
          </Button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            현재 상태: {isDisabled ? '비활성화됨' : '활성화됨'}
          </p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const pullToRefreshRef = useRef<PullToRefreshRef>(null);

const toggleDisabled = () => {
  pullToRefreshRef.current?.disabled(!isDisabled);
};

<PullToRefresh ref={pullToRefreshRef}>
  {/* 콘텐츠 */}
</PullToRefresh>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>이름</th>
              <th>타입</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>pullText</td>
              <td>string</td>
              <td>-</td>
              <td>당길 때 표시할 텍스트</td>
            </tr>
            <tr>
              <td>releaseText</td>
              <td>string</td>
              <td>-</td>
              <td>Release 가능할 때 표시할 텍스트</td>
            </tr>
            <tr>
              <td>refreshText</td>
              <td>string</td>
              <td>-</td>
              <td>새로고침 진행 중 표시할 텍스트</td>
            </tr>
            <tr>
              <td>refreshTimeout</td>
              <td>number</td>
              <td>5000</td>
              <td>자동 종료 타임아웃 (ms), 0이면 비활성화</td>
            </tr>
            <tr>
              <td>scrollElement</td>
              <td>string | HTMLElement</td>
              <td>window</td>
              <td>스크롤 대상 엘리먼트</td>
            </tr>
            <tr>
              <td>distThreshold</td>
              <td>number</td>
              <td>104</td>
              <td>Refresh 트리거 거리 (px)</td>
            </tr>
            <tr>
              <td>distMax</td>
              <td>number</td>
              <td>140</td>
              <td>최대 Pull 가능 거리 (px)</td>
            </tr>
            <tr>
              <td>scrollThreshold</td>
              <td>number</td>
              <td>20</td>
              <td>Pull 활성화 가능한 스크롤 임계값 (px)</td>
            </tr>
            <tr>
              <td>enableMouse</td>
              <td>boolean</td>
              <td>false</td>
              <td>마우스 이벤트 지원 활성화 (테스트용)</td>
            </tr>
            <tr>
              <td>onRefresh</td>
              <td>(close: () =&gt; void) =&gt; void</td>
              <td>-</td>
              <td>새로고침 이벤트 핸들러</td>
            </tr>
            <tr>
              <td>onProgress</td>
              <td>(payload: ProgressPayload) =&gt; void</td>
              <td>-</td>
              <td>진행률 변경 이벤트 핸들러</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Ref Methods</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>메서드</th>
              <th>파라미터</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>disabled</td>
              <td>(val: boolean) =&gt; void</td>
              <td>Pull-to-Refresh 기능 활성화/비활성화</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>사용 팁</h2>
        <ul className={styles.list}>
          <li>모바일 환경에서 최적화되어 있으며, 터치 제스처로 작동합니다.</li>
          <li>
            enableMouse를 true로 설정하면 데스크톱에서도 마우스 드래그로 테스트할
            수 있습니다.
          </li>
          <li>
            onRefresh 콜백에서 close 함수를 호출하여 새로고침을 종료해야 합니다.
          </li>
          <li>
            refreshTimeout을 설정하면 일정 시간 후 자동으로 새로고침이 종료됩니다.
          </li>
          <li>
            scrollThreshold를 통해 페이지 상단에서만 Pull-to-Refresh가 작동하도록
            제한할 수 있습니다.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default PullToRefreshGuide;
