// src/pages/guide/button.tsx - 버튼 가이드 페이지
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const ButtonGuide = () => {
  const [clickCount, setClickCount] = useState(0);

  usePageLayout({
    title: '버튼 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Button Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Button } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 버튼</h2>
        <p className={styles.txt}>디자인 클래스는 className 속성으로 지정</p>
        <div className={styles.showcase + ' inline'}>
          <Button>Default Button</Button>
          <Button className="primary">Primary Button</Button>
          <Button className="secondary">Secondary Button</Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button>Default Button</Button>
<Button className="primary">Primary Button</Button>
<Button className="secondary">Secondary Button</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>인터랙션 효과</h2>
        <p className={styles.txt}>
          effect 속성을 사용하여 버튼 클릭 시 다양한 인터랙션 효과를 적용할 수
          있습니다. 기본값은 'ripple'입니다.
        </p>
        <div className={styles.showcase}>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '10px',
            }}
          >
            <Button className="primary" effect="ripple" onClick={handleClick}>
              리플 효과 (기본값)
            </Button>

            <Button className="primary" effect="pulse" onClick={handleClick}>
              펄스 효과
            </Button>

            <Button className="primary" effect="scale" onClick={handleClick}>
              스케일 효과
            </Button>

            <Button className="primary" effect="shadow" onClick={handleClick}>
              그림자 효과
            </Button>

            <Button className="primary" effect="rotate" onClick={handleClick}>
              회전 효과
            </Button>

            <Button className="primary" effect="shake" onClick={handleClick}>
              좌우 흔들림
            </Button>

            <Button className="primary" effect="jello" onClick={handleClick}>
              젤루 효과
            </Button>

            <Button className="primary" effect={false} onClick={handleClick}>
              효과 없음
            </Button>
          </div>
          <p className={styles.txt} style={{ marginTop: '10px' }}>
            클릭 횟수: {clickCount}
          </p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 기본 리플 효과 (effect="ripple"이 기본값)
<Button className="primary" effect="ripple">리플 효과 (기본값)</Button>

// 펄스 효과
<Button className="primary" effect="pulse">펄스 효과</Button>

// 스케일 효과
<Button className="primary" effect="scale">스케일 효과</Button>

// 그림자 효과
<Button className="primary" effect="shadow">그림자 효과</Button>

// 회전 효과
<Button className="primary" effect="rotate">회전 효과</Button>

// 좌우 흔들림 효과
<Button className="primary" effect="shake">좌우 흔들림</Button>

// 젤루 효과 (기하학적 변형)
<Button className="primary" effect="jello">젤루 효과</Button>

// 효과 없음
<Button className="primary" effect={false}>효과 없음</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>버튼 크기</h2>
        <p className={styles.txt}>
          size 속성을 사용하여 버튼의 크기를 지정할 수 있습니다. 사용 가능한
          크기: xs, sm, md(기본값), lg, xl
        </p>
        <div className={styles.showcase}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <Button className="primary" size="xs">
              Extra Small
            </Button>
            <Button className="primary" size="sm">
              Small
            </Button>
            <Button className="primary">Medium (기본값)</Button>
            <Button className="primary" size="lg">
              Large
            </Button>
            <Button className="primary" size="xl">
              Extra Large
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button>Medium (기본값)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>a태그 렌더링 필요시</h2>
        <p className={styles.txt}>anchor 속성사용</p>
        <div className={styles.showcase + ' inline'}>
          <Button anchor>Default Button</Button>
          <Button anchor className="primary">
            Primary Button
          </Button>
          <Button anchor className="secondary">
            Secondary Button
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button anchor>Default Button</Button>
<Button anchor className="primary">Primary Button</Button>
<Button anchor className="secondary">Secondary Button</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>
          버튼 모양 디자인을 안쓸때(다른 디자인을 입히고 싶을때)
        </h2>
        <p className={styles.txt}>not 속성 사용</p>
        <div className={styles.showcase + ' inline'}>
          <Button not>Not Button Design</Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button not>Not Button Design</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>링크 버튼</h2>
        <p className={styles.txt}>내부링크 시: to 속성사용</p>
        <div className={styles.showcase + ' inline'}>
          <Button className="primary" to="/">
            Home Link
          </Button>
          <Button className="primary" to="/about">
            About Link
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button to="/">Home Link</Button>
<Button to="/about">About Link</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>외부 링크 버튼</h2>
        <p className={styles.txt}>
          외부링크 시: href 속성사용 (target 속성은 상황에따라 _blank 사용)
        </p>
        <div className={styles.showcase + ' inline'}>
          <Button className="primary" href="https://naver.com" target="_blank">
            External Link
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button className="primary" href="https://naver.com" target="_blank">
  External Link
</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props 목록</h2>
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
                <td>-</td>
                <td>버튼 내용</td>
              </tr>
              <tr>
                <td>className</td>
                <td>string</td>
                <td>''</td>
                <td>추가 클래스명</td>
              </tr>
              <tr>
                <td>size</td>
                <td>'xs' | 'sm' | 'md' | 'lg' | 'xl'</td>
                <td>'md'</td>
                <td>버튼 크기</td>
              </tr>
              <tr>
                <td>effect</td>
                <td>
                  'ripple' | 'pulse' | 'scale' | 'shadow' | 'rotate' | 'shake' |
                  'jello' | false
                </td>
                <td>'ripple'</td>
                <td>인터랙션 효과 유형</td>
              </tr>
              <tr>
                <td>not</td>
                <td>boolean</td>
                <td>false</td>
                <td>기본 버튼 스타일 비활성화 여부</td>
              </tr>
              <tr>
                <td>to</td>
                <td>string</td>
                <td>-</td>
                <td>내부 링크 경로 (React Router Link 사용)</td>
              </tr>
              <tr>
                <td>anchor</td>
                <td>boolean</td>
                <td>false</td>
                <td>a 태그로 렌더링 여부</td>
              </tr>
              <tr>
                <td>href</td>
                <td>string</td>
                <td>'#'</td>
                <td>a 태그 href 속성</td>
              </tr>
              <tr>
                <td>target</td>
                <td>string</td>
                <td>-</td>
                <td>a 태그 target 속성 (href와 함께 사용)</td>
              </tr>
              <tr>
                <td>onClick</td>
                <td>function</td>
                <td>-</td>
                <td>클릭 이벤트 핸들러</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>버튼 비활성화 여부</td>
              </tr>
              <tr>
                <td>type</td>
                <td>'button' | 'submit' | 'reset'</td>
                <td>'button'</td>
                <td>버튼 타입 (button 태그에만 적용)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ButtonGuide;
