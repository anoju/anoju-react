// src/pages/guide/page-transition.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, PageTransition } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const PageTransitionGuide = () => {
  usePageLayout({
    title: '페이지 전환 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const [demoContent, setDemoContent] = useState(1);
  const [transitionType, setTransitionType] = useState<
    'fade' | 'slide-right' | 'slide-left' | 'slide-up' | 'slide-down'
  >('fade');

  const handleContentChange = () => {
    setDemoContent((prev) => (prev % 3) + 1);
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>PageTransition Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>소개</h2>
        <p className={styles.txt}>
          페이지 전환 시 부드러운 애니메이션 효과를 제공하는 가벼운
          컴포넌트입니다. CSS Transition과 React Hook을 조합하여 구현되었습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { PageTransition } from '@/components/common';`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <p className={styles.txt}>
          현재 MainLayout에서 자동으로 적용되고 있습니다. 페이지를 이동해보세요!
        </p>
        <CodeHighlight
          code={`// MainLayout.tsx에서 사용 예시
<main className={styles.container}>
  <PageTransition transitionType="fade" duration={300}>
    {children}
  </PageTransition>
</main>`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>전환 효과 미리보기</h2>
        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button
              size="sm"
              className={transitionType === 'fade' ? 'primary' : 'line'}
              onClick={() => setTransitionType('fade')}
            >
              Fade
            </Button>
            <Button
              size="sm"
              className={transitionType === 'slide-right' ? 'primary' : 'line'}
              onClick={() => setTransitionType('slide-right')}
            >
              Slide Right
            </Button>
            <Button
              size="sm"
              className={transitionType === 'slide-left' ? 'primary' : 'line'}
              onClick={() => setTransitionType('slide-left')}
            >
              Slide Left
            </Button>
            <Button
              size="sm"
              className={transitionType === 'slide-up' ? 'primary' : 'line'}
              onClick={() => setTransitionType('slide-up')}
            >
              Slide Up
            </Button>
            <Button
              size="sm"
              className={transitionType === 'slide-down' ? 'primary' : 'line'}
              onClick={() => setTransitionType('slide-down')}
            >
              Slide Down
            </Button>
          </div>
          <hr />
          <Button size="sm" className="primary" onClick={handleContentChange}>
            내용 변경 ({demoContent}/3)
          </Button>
          <div
            style={{
              height: '200px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginTop: '1rem',
              overflow: 'hidden',
            }}
          >
            <PageTransition transitionType={transitionType} duration={400}>
              <div
                style={{
                  padding: '2rem',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  backgroundColor:
                    demoContent === 1
                      ? '#f0f9ff'
                      : demoContent === 2
                        ? '#fef0f0'
                        : '#f0fff0',
                }}
              >
                {demoContent === 1 && '첫 번째 내용 🎉'}
                {demoContent === 2 && '두 번째 내용 🚀'}
                {demoContent === 3 && '세 번째 내용 ✨'}
              </div>
            </PageTransition>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [transitionType, setTransitionType] = useState<
  'fade' | 'slide-right' | 'slide-left' | 'slide-up' | 'slide-down'
>('fade');

<PageTransition transitionType={transitionType} duration={400}>
  <div>
    {/* 동적으로 변경되는 내용 */}
    {content}
  </div>
</PageTransition>`}
          language="tsx"
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
                  전환 효과를 적용할 내용
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  transitionType
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  'fade' | 'slide-right' | 'slide-left' | 'slide-up' |
                  'slide-down'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  'fade'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  전환 애니메이션 타입
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  duration
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  number
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  300
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  애니메이션 지속 시간 (ms)
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
                  추가 CSS 클래스
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>특징</h2>
        <div className={styles.showcase}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              🪶 <strong>가벼움</strong>: 추가 라이브러리 없이 CSS + React
              Hook만 사용
            </li>
            <li>
              🎨 <strong>다양한 효과</strong>: fade, slide 등 5가지 전환 효과
              제공
            </li>
            <li>
              ⚡ <strong>성능 최적화</strong>: CSS transition을 활용한 GPU 가속
            </li>
            <li>
              ♿ <strong>접근성</strong>: prefers-reduced-motion 지원
            </li>
            <li>
              🔧 <strong>커스터마이징</strong>: duration과 transitionType 조정
              가능
            </li>
            <li>
              📱 <strong>반응형</strong>: 모든 화면 크기에서 부드럽게 동작
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>사용 예시</h2>
        <CodeHighlight
          code={`// 기본 사용법
<PageTransition>
  <YourComponent />
</PageTransition>

// 슬라이드 효과 사용
<PageTransition transitionType="slide-right" duration={500}>
  <YourComponent />
</PageTransition>

// 커스텀 클래스 추가
<PageTransition 
  transitionType="fade" 
  duration={400}
  className="custom-transition"
>
  <YourComponent />
</PageTransition>`}
          language="tsx"
        />
      </section>
    </div>
  );
};

export default PageTransitionGuide;
