// src/pages/guide/expand.tsx
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  Button,
  CodeHighlight,
  ExpandPanel,
  ExpandItem,
} from '@/components/common';
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
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Expand Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>ExpandPanel</h2>
        <h3 className={styles['sub-title']}>import</h3>
        <CodeHighlight
          code={`import { ExpandPanel } from '@/components/common';`}
          language="jsx"
        />
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

      <section className={styles.section}>
        <h2 className={styles['section-title']}>ExpandItem</h2>
        <h3 className={styles['sub-title']}>import</h3>
        <CodeHighlight
          code={`import { ExpandItem } from '@/components/common';`}
          language="jsx"
        />
        <div className={styles.showcase}>
          <ExpandItem title="제목" value={isOpen2} setValue={setIsOpen2}>
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
          </ExpandItem>

          <ExpandItem
            title="제목제목제목"
            value={isOpen3}
            setValue={setIsOpen3}
            wrap={false}
          >
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
          </ExpandItem>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [isOpen, setIsOpen] = useState(false);

//버튼이 감싸는 형태
<ExpandItem title="제목" value={isOpen} setValue={setIsOpen}>
  <div>표시할 내용</div>
</ExpandItem>

//버튼이 따로 있는 형태(wrap 속성 false)
<ExpandItem title="제목" value={isOpen} setValue={setIsOpen} wrap={false}>
  <div>표시할 내용</div>
</ExpandItem>`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default ExpandItemGuide;
