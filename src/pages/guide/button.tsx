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
        <h2 className={styles['section-title']}>기본 버튼</h2>
        <div className={styles.showcase}>
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
          code={`<Button anchor>Default Button</Button>
<Button anchor className="primary">Primary Button</Button>
<Button anchor className="secondary">Secondary Button</Button>`}
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
          code={`<Button to="/">Home Link</Button>
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
          code={`<Button className="primary" href="https://naver.com" target="_blank">
  External Link
</Button>`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default ButtonGuide;
