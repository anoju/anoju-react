// src/pages/guide/button.tsx - 버튼 가이드 페이지
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const ButtonGuide = () => {
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
        <div className={styles.showcase}>
          <Button>Default Button</Button>
          <Button className="primary">Primary Button</Button>
          <Button className="secondary">Secondary Button</Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 디자인 클래스는 className 속성으로 지정
<Button>Default Button</Button>
<Button className="primary">Primary Button</Button>
<Button className="secondary">Secondary Button</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>a태그 렌더링 필요시</h2>
        <div className={styles.showcase}>
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
          code={`//anchor 속성사용
<Button anchor>Default Button</Button>
<Button anchor className="primary">Primary Button</Button>
<Button anchor className="secondary">Secondary Button</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>
          버튼 모양 디자인을 안쓸때(다른 디자인을 입히고 싶을때)
        </h2>
        <div className={styles.showcase}>
          <Button not>Not Button</Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`//not 속성사용
<Button not>Not Button</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>링크 버튼</h2>
        <div className={styles.showcase}>
          <Button className="primary" to="/">
            Home Link
          </Button>
          <Button className="primary" to="/about">
            About Link
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 내부링크 시: to 속성사용
<Button to="/">Home Link</Button>
<Button to="/about">About Link</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>외부 링크 버튼</h2>
        <div className={styles.showcase}>
          <Button className="primary" href="https://naver.com" target="_blank">
            External Link
          </Button>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 외부링크 시: href 속성사용 (target 속성은 상황에따라 _blank 사용)
<Button className="primary" href="https://naver.com" target="_blank">
  External Link
</Button>`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default ButtonGuide;
