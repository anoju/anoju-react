// src/pages/guide/expand.tsx
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Expand } from '@/components/common';
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
  const [itemsValue2, setItemsValue2] = useState<string>('');
  const items = [
    {
      value: '1',
      title: '타이틀입니다 1',
      children: '내용입니다.1',
    },
    {
      value: '2',
      title: '타이틀입니다 2',
      children: <p>내용입니다.2</p>,
    },
    {
      value: '3',
      title: '타이틀입니다 3',
      children: (
        <>
          <p>내용입니다.3</p>
          <p>내용입니다.3</p>
          <p>내용입니다.3</p>
        </>
      ),
    },
  ];

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Expand Component</h1>

      <h3 className={styles['sub-title']}>import</h3>
      <CodeHighlight
        code={`import { Expand } from '@/components/common';`}
        language="jsx"
      />

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Expand.Panel</h2>
        <p className={styles.txt}>
          아코디언 슬라이딩 인터렉션만 필요한 경우 사용
        </p>
        <div className={styles.showcase}>
          <Button size="sm" className="line" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '접기' : '펼치기'}
          </Button>
          <Expand.Panel open={isOpen}>
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
          </Expand.Panel>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [isOpen, setIsOpen] = useState(false);

<Expand.Panel open={isOpen}>
  표시할 내용
</Expand.Panel>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Expand.Item</h2>
        <p className={styles.txt}>단일 아코디언 UI</p>
        <div className={styles.showcase}>
          <Expand.Item title="제목" open={isOpen2} setOpen={setIsOpen2}>
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
          </Expand.Item>

          <Expand.Item
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
          </Expand.Item>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [isOpen, setIsOpen] = useState(false);

//버튼이 감싸는 형태
<Expand.Item title="제목" value={isOpen} setValue={setIsOpen}>
  표시할 내용
</Expand.Item>

//버튼이 따로 있는 형태(wrap 속성 false)
<Expand.Item title="제목" value={isOpen} setValue={setIsOpen} wrap={false}>
  표시할 내용
</Expand.Item>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Expand</h2>
        <h3 className={styles['sub-title']}>기본</h3>
        <div className={styles.showcase}>
          <Expand
            value={singleValue}
            onChange={(value) => setSingleValue(value as string)}
          >
            <Expand.Item value="1" title="첫 번째 아이템">
              <div>첫 번째 내용입니다.</div>
              <div>첫 번째 내용입니다.</div>
              <div>첫 번째 내용입니다.</div>
            </Expand.Item>
            <Expand.Item value="2" title="두 번째 아이템">
              <div>두 번째 내용입니다.</div>
              <div>두 번째 내용입니다.</div>
              <div>두 번째 내용입니다.</div>
            </Expand.Item>
            <Expand.Item value="3" title="세 번째 아이템">
              <div>세 번째 내용입니다.</div>
              <div>세 번째 내용입니다.</div>
              <div>세 번째 내용입니다.</div>
            </Expand.Item>
          </Expand>
        </div>
        <h3 className={styles['sub-title']}>다중 열림</h3>
        <div className={styles.showcase}>
          <Expand
            value={multiValue}
            onChange={(value) => setMultiValue(value as string[])}
          >
            <Expand.Item value="1" title="다중 선택 1">
              <div>다중 선택 내용 1</div>
              <div>다중 선택 내용 1</div>
              <div>다중 선택 내용 1</div>
            </Expand.Item>
            <Expand.Item value="2" title="다중 선택 2">
              <div>다중 선택 내용 2</div>
              <div>다중 선택 내용 2</div>
              <div>다중 선택 내용 2</div>
            </Expand.Item>
          </Expand>
        </div>
        <h3 className={styles['sub-title']}>items 방식</h3>
        <div className={styles.showcase}>
          <Expand
            items={items}
            value={itemsValue}
            onChange={(value) => setItemsValue(value as string)}
          />
          <br />
          <Expand
            items={items}
            itemsWrap={false}
            value={itemsValue2}
            onChange={(value) => setItemsValue2(value as string)}
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
    children: '내용입니다.1',
  },
  {
    value: '2',
    title: '타이틀입니다 2',
    children: <p>내용입니다.2</p>,
  },
  {
    value: '3',
    title: '타이틀입니다 3',
    children: (
      <>
        <p>내용입니다.3</p>
        <p>내용입니다.3</p>
        <p>내용입니다.3</p>
      </>
    ),,
  },
];

// 단일형태태
<Expand value={singleValue} onChange={(value) => setSingleValue(value as string)}>
  <Expand.Item value="1" title="첫 번째 아이템">
    첫 번째 내용입니다.
  </Expand.Item>
  <Expand.Item value="2" title="두 번째 아이템">
    두 번째 내용입니다.
  </Expand.Item>
  <Expand.Item value="3" title="세 번째 아이템">
    세 번째 내용입니다.
  </Expand.Item>
</Expand>

// 다중 선택 형태
<Expand value={multiValue} onChange={(value) => setMultiValue(value as string[])}>
  <Expand.Item value="1" title="다중 선택 1">
    다중 선택 내용 1
  </Expand.Item>
  <Expand.Item value="2" title="다중 선택 2">
    다중 선택 내용 2
  </Expand.Item>
</Expand>

// items 방식
<Expand
  items={items}
  value={itemsValue}
  onChange={(value) => setItemsValue(value as string)}
/>
<Expand
  items={items}
  itemsWrap={false}
  value={itemsValue}
  onChange={(value) => setItemsValue(value as string)}
/>`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default ExpandItemGuide;
