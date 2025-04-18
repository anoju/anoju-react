// src/pages/guide/button.tsx - 버튼 가이드 페이지
import { Button, CodeHighlight } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const ButtonGuide = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Button Component</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>기본 버튼</h2>
        <div className={styles.showcase}>
          <Button>Default Button</Button>
          <Button className="primary">Primary Button</Button>
          <Button className="secondary">Secondary Button</Button>
        </div>

        <h3 className={styles.subtitle}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button>Default Button</Button>
<Button className="primary">Primary Button</Button>
<Button className="secondary">Secondary Button</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>a태그 렌더링 필요시</h2>
        <div className={styles.showcase}>
          <Button anchor>Default Button</Button>
          <Button anchor className="primary">
            Primary Button
          </Button>
          <Button anchor className="secondary">
            Secondary Button
          </Button>
        </div>

        <h3 className={styles.subtitle}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button anchor>Default Button</Button>
<Button anchor className="primary">Primary Button</Button>
<Button anchor className="secondary">Secondary Button</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>링크 버튼</h2>
        <div className={styles.showcase}>
          <Button className="primary" to="/">
            Home Link
          </Button>
          <Button className="primary" to="/about">
            About Link
          </Button>
        </div>

        <h3 className={styles.subtitle}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Button to="/">Home Link</Button>
<Button to="/about">About Link</Button>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>외부 링크 버튼</h2>
        <div className={styles.showcase}>
          <Button className="primary" href="https://naver.com" target="_blank">
            External Link
          </Button>
        </div>

        <h3 className={styles.subtitle}>참조 소스코드</h3>
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
