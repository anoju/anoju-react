// src/pages/guide/stickyWrap.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, StickyWrap } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const StickyWrapGuide = () => {
  usePageLayout({
    title: 'StickyWrap / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const guideStyles = {
    box: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
    } as React.CSSProperties,
    wrap: {
      height: '100vh',
      background:
        'linear-gradient(to bottom, rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.3))',
    } as React.CSSProperties,
  };

  const [fixedCount, setFixedCount] = useState(0);

  const handleFixedChange = (isFixed: boolean) => {
    setFixedCount((prev) => (isFixed ? prev + 1 : Math.max(0, prev - 1)));
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>StickyWrap Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { StickyWrap } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <p className={styles.txt}>
          스크롤 시 브라우저 상단에 닿으면 고정되는 기본적인 StickyWrap입니다.
        </p>

        <div style={guideStyles.wrap}>
          <StickyWrap innerClassName="inner">
            <div
              style={{
                ...guideStyles.box,
                height: '60px',
                backgroundColor: 'var(--primary-color)',
              }}
            >
              기본 StickyWrap - 상단에 고정됩니다
            </div>
          </StickyWrap>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<StickyWrap>
  고정시킬 컨텐츠
</StickyWrap>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>여러 개 스택킹</h2>
        <p className={styles.txt}>
          여러 개의 StickyWrap을 사용하면 첫 번째가 가장 위에 고정되고, 두
          번째는 첫 번째 아래에, 세 번째는 두 번째 아래에 차례대로 쌓입니다.
          (거꾸로 된 탑 모양)
        </p>
        <p className={styles.txt}>
          각 요소의 높이가 다르기 때문에 스택되는 모습을 명확하게 볼 수
          있습니다.
        </p>

        <div style={guideStyles.wrap}>
          <StickyWrap onChange={handleFixedChange} innerClassName="inner">
            <div
              style={{
                ...guideStyles.box,
                height: '60px',
                backgroundColor: '#ff6b6b',
              }}
            >
              첫 번째 StickyWrap (높이: 60px)
              <br />
              현재 고정된 요소 수: {fixedCount}
            </div>
          </StickyWrap>

          <StickyWrap
            onChange={handleFixedChange}
            innerClassName="inner"
            style={{ marginTop: '100px' }}
          >
            <div
              style={{
                ...guideStyles.box,
                height: '70px',
                backgroundColor: '#4ecdc4',
              }}
            >
              두 번째 StickyWrap (높이: 70px)
            </div>
          </StickyWrap>

          <StickyWrap
            onChange={handleFixedChange}
            innerClassName="inner"
            style={{ marginTop: '100px' }}
          >
            <div
              style={{
                ...guideStyles.box,
                height: '80px',
                backgroundColor: '#45b7d1',
              }}
            >
              세 번째 StickyWrap (높이: 80px)
            </div>
          </StickyWrap>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>hideScrolling 옵션</h2>
        <p className={styles.txt}>
          hideScrolling=true 옵션을 사용하면 아래로 스크롤할 때 숨겨지고, 위로
          스크롤할 때 다시 나타납니다.
        </p>

        <div style={guideStyles.wrap}>
          <StickyWrap hideScrolling innerClassName="inner">
            <div
              style={{
                ...guideStyles.box,
                height: '60px',
                backgroundColor: '#9b59b6',
              }}
            >
              Scrolling StickyWrap <br /> 스크롤 방향에 따라 숨겨집니다
            </div>
          </StickyWrap>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<StickyWrap hideScrolling>
  고정 시킬 컨텐츠
</StickyWrap>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props</h2>
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
                <td>children</td>
                <td>ReactNode</td>
                <td>필수</td>
                <td>고정할 컨텐츠</td>
              </tr>
              <tr>
                <td>hideScrolling</td>
                <td>boolean</td>
                <td>false</td>
                <td>스크롤 방향에 따른 숨김/표시 여부</td>
              </tr>
              <tr>
                <td>className</td>
                <td>string</td>
                <td>''</td>
                <td>추가 CSS 클래스명</td>
              </tr>
              <tr>
                <td>innerClassName</td>
                <td>string</td>
                <td>''</td>
                <td>추가 CSS 클래스명</td>
              </tr>
              <tr>
                <td>onChange</td>
                <td>function</td>
                <td>undefined</td>
                <td>고정 상태 변경 시 호출될 콜백</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default StickyWrapGuide;
