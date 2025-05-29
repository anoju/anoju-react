// src/pages/guide/expand.tsx
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  Button,
  CodeHighlight,
  ExpandPanel,
  ExpandItem,
  Expand,
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

  const [singleValue, setSingleValue] = useState<string>('1');
  const [multiValue, setMultiValue] = useState<string[]>(['1']);
  const [itemsValue, setItemsValue] = useState<string>('');
  const items = [
    {
      value: '1',
      title: '타이틀입니다 1',
      children: <p>내용입니다.1</p>,
    },
    {
      value: '2',
      title: '타이틀입니다 2',
      children: <p>내용입니다.2</p>,
    },
    {
      value: '3',
      title: '타이틀입니다 3',
      children: <p>내용입니다.3</p>,
    },
  ];

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
          <ExpandItem title="제목" open={isOpen2} setOpen={setIsOpen2}>
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
            open={isOpen3}
            setOpen={setIsOpen3}
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

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Expand</h2>
        <h3 className={styles['sub-title']}>import</h3>
        <CodeHighlight
          code={`import { Expand } from '@/components/common';`}
          language="jsx"
        />
        <div className={styles.showcase}>
          <Expand
            value={singleValue}
            onChange={(value) => setSingleValue(value as string)}
          >
            <Expand.Item value="1" title="첫 번째 아이템">
              <div>첫 번째 내용입니다.</div>
            </Expand.Item>
            <Expand.Item value="2" title="두 번째 아이템">
              <div>두 번째 내용입니다.</div>
            </Expand.Item>
            <Expand.Item value="3" title="세 번째 아이템">
              <div>세 번째 내용입니다.</div>
            </Expand.Item>
          </Expand>
          <br />
          <br />
          <br />
          <Expand
            value={multiValue}
            onChange={(value) => setMultiValue(value as string[])}
          >
            <Expand.Item value="1" title="다중 선택 1">
              <div>다중 선택 내용 1</div>
            </Expand.Item>
            <Expand.Item value="2" title="다중 선택 2">
              <div>다중 선택 내용 2</div>
            </Expand.Item>
          </Expand>
          <br />
          <br />
          <br />
          <Expand
            items={items}
            value={itemsValue}
            onChange={(value) => setItemsValue(value as string)}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [singleValue, setSingleValue] = useState<string>('1');
const [multiValue, setMultiValue] = useState<string[]>(['1']);
const [itemsValue, setItemsValue] = useState<string>('');
const items = [
  {
    value: '1',
    title: '타이틀입니다 1',
    children: <p>내용입니다.1</p>,
  },
  {
    value: '2',
    title: '타이틀입니다 2',
    children: <p>내용입니다.2</p>,
  },
  {
    value: '3',
    title: '타이틀입니다 3',
    children: <p>내용입니다.3</p>,
  },
];

// 단일형태태
<Expand value={singleValue} onChange={(value) => setSingleValue(value as string)}>
  <Expand.Item value="1" title="첫 번째 아이템">
    <div>첫 번째 내용입니다.</div>
  </Expand.Item>
  <Expand.Item value="2" title="두 번째 아이템">
    <div>두 번째 내용입니다.</div>
  </Expand.Item>
  <Expand.Item value="3" title="세 번째 아이템">
    <div>세 번째 내용입니다.</div>
  </Expand.Item>
</Expand>

// 다중 선택 형태
<Expand value={multiValue} onChange={(value) => setMultiValue(value as string[])}>
  <Expand.Item value="1" title="다중 선택 1">
    <div>다중 선택 내용 1</div>
  </Expand.Item>
  <Expand.Item value="2" title="다중 선택 2">
    <div>다중 선택 내용 2</div>
  </Expand.Item>
</Expand>

// items 방식
<Expand items={items} value={itemsValue} onChange={(value) => setItemsValue(value as string)} />`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default ExpandItemGuide;
