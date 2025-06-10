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

        <div style={{ height: '200vh', padding: '20px 0' }}>
          <div style={{ marginBottom: '50px' }}>
            <p>위로 스크롤해보세요. 아래 박스가 상단에 고정됩니다.</p>
          </div>

          <StickyWrap>
            <div
              style={{
                padding: '20px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              기본 StickyWrap - 상단에 고정됩니다
            </div>
          </StickyWrap>

          <div style={{ marginTop: '50px' }}>
            <p>컨텐츠가 계속됩니다...</p>
            <p>스크롤을 더 내려보세요.</p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<StickyWrap>
  <div
    style={{
      padding: '20px',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderRadius: '8px',
      textAlign: 'center',
    }}
  >
    기본 StickyWrap - 상단에 고정됩니다
  </div>
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

        <div style={{ height: '200vh', padding: '20px 0' }}>
          <div style={{ marginBottom: '30px' }}>
            <p>아래 3개의 박스가 순서대로 쌓입니다.</p>
            <p>현재 고정된 요소 수: {fixedCount}</p>
          </div>

          <StickyWrap onChange={handleFixedChange}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              첫 번째 StickyWrap (높이: 60px)
              <br />
              현재 고정된 요소 수: {fixedCount}
            </div>
          </StickyWrap>

          <div style={{ marginBottom: '50px' }}>
            <p>중간 컨텐츠...</p>
          </div>

          <StickyWrap onChange={handleFixedChange}>
            <div
              style={{
                padding: '25px 15px', // 더 높게
                backgroundColor: '#4ecdc4',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              두 번째 StickyWrap (높이: 70px)
            </div>
          </StickyWrap>

          <div style={{ marginBottom: '50px' }}>
            <p>더 많은 컨텐츠...</p>
          </div>

          <StickyWrap onChange={handleFixedChange}>
            <div
              style={{
                padding: '30px 15px', // 가장 높게
                backgroundColor: '#45b7d1',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              세 번째 StickyWrap (높이: 80px)
            </div>
          </StickyWrap>

          <div style={{ marginTop: '100px' }}>
            <p>마지막 컨텐츠입니다.</p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [fixedCount, setFixedCount] = useState(0);

const handleFixedChange = (isFixed: boolean) => {
  setFixedCount(prev => isFixed ? prev + 1 : Math.max(0, prev - 1));
};

// 첫 번째 (높이: 60px)
<StickyWrap onChange={handleFixedChange}>
  <div style={{ 
    padding: '20px 15px', 
    backgroundColor: '#ff6b6b', 
    color: 'white',
    fontWeight: 'bold'
  }}>
    첫 번째 StickyWrap (높이: 60px)
  </div>
</StickyWrap>

// 두 번째 (높이: 70px)
<StickyWrap onChange={handleFixedChange}>
  <div style={{ 
    padding: '25px 15px', 
    backgroundColor: '#4ecdc4', 
    color: 'white',
    fontWeight: 'bold'
  }}>
    두 번째 StickyWrap (높이: 70px)
  </div>
</StickyWrap>

// 세 번째 (높이: 80px)
<StickyWrap onChange={handleFixedChange}>
  <div style={{ 
    padding: '30px 15px', 
    backgroundColor: '#45b7d1', 
    color: 'white',
    fontWeight: 'bold'
  }}>
    세 번째 StickyWrap (높이: 80px)
  </div>
</StickyWrap>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>scrolling 옵션</h2>
        <p className={styles.txt}>
          scrolling=true 옵션을 사용하면 아래로 스크롤할 때 숨겨지고, 위로
          스크롤할 때 다시 나타납니다.
        </p>

        <div style={{ height: '250vh', padding: '20px 0' }}>
          <div style={{ marginBottom: '50px' }}>
            <p>
              아래로 스크롤하면 숨겨지고, 위로 스크롤하면 다시 나타나는
              StickyWrap입니다.
            </p>
          </div>

          <StickyWrap hideScrolling>
            <div
              style={{
                padding: '20px',
                backgroundColor: '#9b59b6',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              Scrolling StickyWrap - 스크롤 방향에 따라 숨겨집니다
            </div>
          </StickyWrap>

          <div style={{ marginTop: '50px' }}>
            <p>계속 아래로 스크롤해보세요...</p>
            <p>그리고 다시 위로 스크롤해보세요.</p>
            <div style={{ height: '100vh' }}>
              <p>긴 컨텐츠 영역...</p>
            </div>
            <p>마지막 부분입니다.</p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<StickyWrap scrolling={true}>
  <div
    style={{
      padding: '20px',
      backgroundColor: '#9b59b6',
      color: 'white',
      borderRadius: '8px',
      textAlign: 'center',
    }}
  >
    Scrolling StickyWrap - 스크롤 방향에 따라 숨겨집니다
  </div>
</StickyWrap>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>복합 사용 예시</h2>
        <p className={styles.txt}>여러 옵션을 조합하여 사용하는 예시입니다.</p>

        <div style={{ height: '300vh', padding: '20px 0' }}>
          <div style={{ marginBottom: '50px' }}>
            <p>
              다양한 옵션을 조합한 StickyWrap들입니다. 스크롤하면서 동작을
              확인해보세요.
            </p>
          </div>

          {/* 기본 헤더 */}
          <StickyWrap>
            <div
              style={{
                padding: '16px 15px', // 64px 높이
                backgroundColor: '#2c3e50',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              고정 헤더 (기본) - 64px
            </div>
          </StickyWrap>

          <div style={{ marginTop: '30px', marginBottom: '50px' }}>
            <p>첫 번째 섹션 컨텐츠...</p>
          </div>

          {/* 네비게이션 */}
          <StickyWrap hideScrolling>
            <div
              style={{
                padding: '14px 15px', // 58px 높이
                backgroundColor: '#34495e',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              네비게이션 (scrolling=true) - 58px
            </div>
          </StickyWrap>

          <div style={{ marginTop: '30px', marginBottom: '100px' }}>
            <p>두 번째 섹션 컨텐츠...</p>
            <p>길어진 컨텐츠...</p>
          </div>

          {/* 서브 헤더 */}
          <StickyWrap>
            <div
              style={{
                padding: '18px 15px', // 66px 높이
                backgroundColor: '#e74c3c',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              서브 헤더 (offsetTop=10) - 66px
            </div>
          </StickyWrap>

          <div style={{ marginTop: '100px' }}>
            <p>마지막 섹션...</p>
            <div style={{ height: '150vh' }}>
              <p>매우 긴 컨텐츠 영역입니다.</p>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 기본 헤더 (높이: 64px)
<StickyWrap>
  <div style={{ 
    padding: '16px 15px', 
    backgroundColor: '#2c3e50', 
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px'
  }}>
    고정 헤더 (기본) - 64px
  </div>
</StickyWrap>

// 스크롤링 네비게이션 (높이: 58px)
<StickyWrap scrolling={true}>
  <div style={{ 
    padding: '14px 15px', 
    backgroundColor: '#34495e', 
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px'
  }}>
    네비게이션 (scrolling=true) - 58px
  </div>
</StickyWrap>

// 오프셋이 있는 서브 헤더 (높이: 66px)
<StickyWrap offsetTop={10}>
  <div style={{ 
    padding: '18px 15px', 
    backgroundColor: '#e74c3c', 
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px'
  }}>
    서브 헤더 (offsetTop=10) - 66px
  </div>
</StickyWrap>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props</h2>
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
                  children
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ReactNode
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  필수
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  고정할 컨텐츠
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  offsetTop
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  number
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  0
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  상단에서 몇 px 떨어진 위치에서 고정할지
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  scrolling
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  스크롤 방향에 따른 숨김/표시 여부
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  className
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ''
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  추가 CSS 클래스명
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  onChange
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  function
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  undefined
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  고정 상태 변경 시 호출될 콜백
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>주요 특징</h2>
        <div className={styles.showcase}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>스크롤 시 자동으로 position: fixed로 전환</li>
            <li>고정 시 원래 위치에 placeholder를 두어 레이아웃 유지</li>
            <li>
              여러 개 사용 시 첫 번째가 가장 위에, 다음 요소들이 아래로 차례대로
              쌓임 (거꾸로 된 탑 모양)
            </li>
            <li>scrolling 옵션으로 스크롤 방향에 따른 숨김/표시</li>
            <li>ResizeObserver로 크기 변화 자동 감지</li>
            <li>throttle을 이용한 성능 최적화</li>
            <li>TypeScript 완전 지원</li>
            <li>반응형 디자인 대응</li>
            <li>offsetTop 옵션으로 각 요소마다 다른 고정 위치 설정 가능</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>사용 예시</h2>
        <div className={styles.showcase}>
          <h4 className={styles['sub-title']}>기본 사용</h4>
          <CodeHighlight
            code={`import { StickyWrap } from '@/components/common';

function Header() {
  return (
    <StickyWrap>
      <header style={{ background: '#fff', padding: '20px' }}>
        <h1>사이트 헤더</h1>
      </header>
    </StickyWrap>
  );
}`}
            language="jsx"
          />

          <h4 className={styles['sub-title']}>상태 변경 감지</h4>
          <CodeHighlight
            code={`function NavigationBar() {
  const [isSticky, setIsSticky] = useState(false);
  
  return (
    <StickyWrap onChange={setIsSticky}>
      <nav style={{ 
        background: isSticky ? '#f8f9fa' : 'transparent',
        transition: 'background-color 0.3s'
      }}>
        네비게이션 메뉴
      </nav>
    </StickyWrap>
  );
}`}
            language="jsx"
          />

          <h4 className={styles['sub-title']}>스크롤링 네비게이션</h4>
          <CodeHighlight
            code={`function SmartNavigation() {
  return (
    <StickyWrap scrolling={true} offsetTop={60}>
      <nav style={{ background: '#007bff', color: 'white', padding: '10px' }}>
        <div>스마트 네비게이션 - 아래 스크롤 시 숨김</div>
      </nav>
    </StickyWrap>
  );
}`}
            language="jsx"
          />
        </div>
      </section>
    </div>
  );
};

export default StickyWrapGuide;
