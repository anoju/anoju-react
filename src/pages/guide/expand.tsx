// src/pages/guide/expand.tsx
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, ExpandPanel } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';
import { useState } from 'react';

const ExpandItemGuide = () => {
  usePageLayout({
    title: '확장아이템 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Expand Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { ExpandPanel } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>ExpandPanel</h2>
        <div className={styles.showcase}>
          <Button size="sm" className="line" onClick={() => setIsOpen(!isOpen)}>
            Toggle
          </Button>
          <ExpandPanel open={isOpen}>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
            <div>표시할 내용</div>
          </ExpandPanel>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [isOpen, setIsOpen] = useState(false);

<ExpandPanel open={isOpen}>
  <div>표시할 내용</div>
</ExpandPanel>`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default ExpandItemGuide;
