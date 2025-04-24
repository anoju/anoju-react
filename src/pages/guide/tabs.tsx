// src/pages/guide/tabs.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  Button,
  CodeHighlight,
  Tabs,
  Tab,
  TabPanel,
} from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const TabsGuide = () => {
  usePageLayout({
    title: '탭 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // 탭 값 상태 관리 예시
  const [activeTab, setActiveTab] = useState('tab2');
  const [itemsTab, setItemsTab] = useState(1);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Tabs Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 탭</h2>
        <p>Tab 및 TabPanel 컴포넌트를 직접 사용하는 방법입니다.</p>

        <div className={styles.showcase}>
          <Tabs>
            <Tab label="탭 1" value="tab1" />
            <Tab label="탭 2" value="tab2" />
            <Tab label="탭 3" value="tab3" disabled />
            <TabPanel value="tab1">
              <p>탭 1 내용입니다. 기본으로 선택된 탭입니다.</p>
            </TabPanel>
            <TabPanel value="tab2">
              <p>탭 2 내용입니다.</p>
            </TabPanel>
            <TabPanel value="tab3">
              <p>
                탭 3 내용입니다. 비활성화된 탭이라 이 내용은 보이지 않습니다.
              </p>
            </TabPanel>
          </Tabs>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Tabs>
  <Tab label="탭 1" value="tab1" />
  <Tab label="탭 2" value="tab2" />
  <Tab label="탭 3" value="tab3" disabled />
  <TabPanel value="tab1">
    <p>탭 1 내용입니다. 기본으로 선택된 탭입니다.</p>
  </TabPanel>
  <TabPanel value="tab2">
    <p>탭 2 내용입니다.</p>
  </TabPanel>
  <TabPanel value="tab3">
    <p>
      탭 3 내용입니다. 비활성화된 탭이라 이 내용은 보이지 않습니다.
    </p>
  </TabPanel>
</Tabs>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>외부 상태 관리</h2>
        <p>
          value와 setValue를 사용하여 탭 상태를 외부에서 제어하는 방법입니다.
        </p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button size="sm" onClick={() => setActiveTab('tab1')}>
              탭 1 활성화
            </Button>
            <Button size="sm" onClick={() => setActiveTab('tab2')}>
              탭 2 활성화
            </Button>
            <Button size="sm" onClick={() => setActiveTab('tab3')} disabled>
              탭 3 활성화
            </Button>
            <div>현재 값: {activeTab}</div>
          </div>

          <Tabs value={activeTab} setValue={setActiveTab}>
            <Tab label="탭 1" value="tab1" />
            <Tab label="탭 2" value="tab2" />
            <Tab label="탭 3" value="tab3" disabled />
            <TabPanel value="tab1">
              <p>탭 1 내용입니다.</p>
            </TabPanel>
            <TabPanel value="tab2">
              <p>탭 2 내용입니다.</p>
            </TabPanel>
            <TabPanel value="tab3">
              <p>
                탭 3 내용입니다. 비활성화된 탭이라 이 내용은 보이지 않습니다.
              </p>
            </TabPanel>
          </Tabs>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 컴포넌트 상단에 상태 추가
const [activeTab, setActiveTab] = useState('tab2');

// JSX에서 사용
<Tabs value={activeTab} setValue={setActiveTab}>
  <Tab label="탭 1" value="tab1" />
  <Tab label="탭 2" value="tab2" />
  <Tab label="탭 3" value="tab3" disabled />
  <TabPanel value="tab1">
    <p>탭 1 내용입니다.</p>
  </TabPanel>
  <TabPanel value="tab2">
    <p>탭 2 내용입니다.</p>
  </TabPanel>
  <TabPanel value="tab3">
    <p>탭 3 내용입니다. 비활성화된 탭이라 이 내용은 보이지 않습니다.</p>
  </TabPanel>
</Tabs>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>items 속성과 외부 상태 관리</h2>
        <p>items 속성을 사용하면서 외부에서 탭 상태를 제어하는 방법입니다.</p>

        <div className={styles.showcase}>
          <div className={styles['control-buttons']}>
            <Button size="sm" onClick={() => setItemsTab(0)}>
              아이템 1 활성화
            </Button>
            <Button size="sm" onClick={() => setItemsTab(1)}>
              아이템 2 활성화
            </Button>
            <Button size="sm" onClick={() => setItemsTab(2)} disabled>
              아이템 3 활성화
            </Button>
            <div>현재 값: {itemsTab}</div>
          </div>

          <Tabs
            value={itemsTab}
            setValue={setItemsTab}
            items={[
              {
                value: 0,
                label: '아이템 1',
                content: <p>아이템 1의 내용입니다.</p>,
              },
              {
                value: 1,
                label: '아이템 2',
                content: <p>아이템 2의 내용입니다.</p>,
              },
              {
                value: 2,
                label: '아이템 3 (비활성화)',
                content: <p>아이템 3의 내용입니다.</p>,
                disabled: true,
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 컴포넌트 상단에 상태 추가
const [itemsTab, setItemsTab] = useState(1);

// JSX에서 사용
<Tabs
  value={itemsTab}
  setValue={setItemsTab}
  items={[
    {
      value: 0,
      label: '아이템 1',
      content: <p>아이템 1의 내용입니다.</p>,
    },
    {
      value: 1,
      label: '아이템 2',
      content: <p>아이템 2의 내용입니다.</p>,
    },
    {
      value: 2,
      label: '아이템 3 (비활성화)',
      content: <p>아이템 3의 내용입니다.</p>,
      disabled: true,
    },
  ]}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>페이지 이동 기능</h2>
        <p>
          to 속성을 사용하여 다른 페이지로 이동하는 탭을 구현할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <Tabs
            items={[
              {
                value: 'home',
                label: '홈',
                to: '/',
              },
              {
                value: 'about',
                label: '소개',
                to: '/about',
              },
              {
                value: 'guide',
                label: '가이드',
                to: '/guide/button',
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Tabs 
  items={[
    { 
      value: 'home',
      label: '홈', 
      to: '/' 
    },
    { 
      value: 'about',
      label: '소개', 
      to: '/about' 
    },
    { 
      value: 'guide',
      label: '가이드', 
      to: '/guide/button' 
    }
  ]}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>스타일 변형</h2>
        <p>
          variant와 alignment 속성으로 다양한 스타일 변형을 적용할 수 있습니다.
        </p>

        <h3 className={styles['sub-title']}>Outline 스타일</h3>
        <div className={styles.showcase}>
          <Tabs
            variant="outline"
            items={[
              {
                value: 'tab1',
                label: '탭 1',
                content: <p>Outline 스타일의 탭 1 내용입니다.</p>,
              },
              {
                value: 'tab2',
                label: '탭 2',
                content: <p>Outline 스타일의 탭 2 내용입니다.</p>,
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>Pills 스타일</h3>
        <div className={styles.showcase}>
          <Tabs
            variant="pills"
            items={[
              {
                value: 'tab1',
                label: '탭 1',
                content: <p>Pills 스타일의 탭 1 내용입니다.</p>,
              },
              {
                value: 'tab2',
                label: '탭 2',
                content: <p>Pills 스타일의 탭 2 내용입니다.</p>,
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>정렬 방식 - 중앙 정렬</h3>
        <div className={styles.showcase}>
          <Tabs
            alignment="center"
            items={[
              {
                value: 'tab1',
                label: '탭 1',
                content: <p>중앙 정렬된 탭 1 내용입니다.</p>,
              },
              {
                value: 'tab2',
                label: '탭 2',
                content: <p>중앙 정렬된 탭 2 내용입니다.</p>,
              },
              {
                value: 'tab3',
                label: '탭 3',
                content: <p>중앙 정렬된 탭 3 내용입니다.</p>,
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>정렬 방식 - 전체 너비</h3>
        <div className={styles.showcase}>
          <Tabs
            alignment="full"
            items={[
              {
                value: 'tab1',
                label: '탭 1',
                content: <p>전체 너비 탭 1 내용입니다.</p>,
              },
              {
                value: 'tab2',
                label: '탭 2',
                content: <p>전체 너비 탭 2 내용입니다.</p>,
              },
              {
                value: 'tab3',
                label: '탭 3',
                content: <p>전체 너비 탭 3 내용입니다.</p>,
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// Outline 스타일
<Tabs 
  variant="outline"
  items={[
    { value: 'tab1', label: '탭 1', content: <p>Outline 스타일의 탭 1 내용입니다.</p> },
    { value: 'tab2', label: '탭 2', content: <p>Outline 스타일의 탭 2 내용입니다.</p> },
  ]}
/>

// Pills 스타일
<Tabs 
  variant="pills"
  items={[
    { value: 'tab1', label: '탭 1', content: <p>Pills 스타일의 탭 1 내용입니다.</p> },
    { value: 'tab2', label: '탭 2', content: <p>Pills 스타일의 탭 2 내용입니다.</p> },
  ]}
/>

// 중앙 정렬
<Tabs 
  alignment="center"
  items={[
    { value: 'tab1', label: '탭 1', content: <p>중앙 정렬된 탭 1 내용입니다.</p> },
    { value: 'tab2', label: '탭 2', content: <p>중앙 정렬된 탭 2 내용입니다.</p> },
    { value: 'tab3', label: '탭 3', content: <p>중앙 정렬된 탭 3 내용입니다.</p> },
  ]}
/>

// 전체 너비
<Tabs 
  alignment="full"
  items={[
    { value: 'tab1', label: '탭 1', content: <p>전체 너비 탭 1 내용입니다.</p> },
    { value: 'tab2', label: '탭 2', content: <p>전체 너비 탭 2 내용입니다.</p> },
    { value: 'tab3', label: '탭 3', content: <p>전체 너비 탭 3 내용입니다.</p> },
  ]}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>상태관리 종합 활용 예시</h2>
        <p>useState를 통한 상태 관리 예시입니다.</p>

        <CodeHighlight
          code={`import { useState } from 'react';
import { Tabs } from '@/components/common';

const MyComponent = () => {
  // 문자열 값을 갖는 탭 상태
  const [stringTab, setStringTab] = useState('tab2');
  
  // 숫자 값을 갖는 탭 상태
  const [numberTab, setNumberTab] = useState(1);
  
  return (
    <>
      {/* 문자열 값을 사용하는 탭 */}
      <Tabs
        value={stringTab}
        setValue={setStringTab}
        items={[
          { value: 'tab1', label: '탭 1', content: <p>탭 1 내용</p> },
          { value: 'tab2', label: '탭 2', content: <p>탭 2 내용</p> },
          { value: 'tab3', label: '탭 3', content: <p>탭 3 내용</p> },
        ]}
      />
      
      {/* 숫자 값을 사용하는 탭 */}
      <Tabs
        value={numberTab}
        setValue={setNumberTab}
        items={[
          { value: 0, label: '첫 번째', content: <p>첫 번째 내용</p> },
          { value: 1, label: '두 번째', content: <p>두 번째 내용</p> },
          { value: 2, label: '세 번째', content: <p>세 번째 내용</p> },
        ]}
      />
      
      {/* 버튼으로 탭 제어 */}
      <div>
        <button onClick={() => setStringTab('tab1')}>탭 1 선택</button>
        <button onClick={() => setStringTab('tab2')}>탭 2 선택</button>
        <button onClick={() => setStringTab('tab3')}>탭 3 선택</button>
      </div>
      
      <div>
        <button onClick={() => setNumberTab(0)}>첫 번째 선택</button>
        <button onClick={() => setNumberTab(1)}>두 번째 선택</button>
        <button onClick={() => setNumberTab(2)}>세 번째 선택</button>
      </div>
    </>
  );
};

export default MyComponent;`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>하위 호환성 지원</h2>
        <p>기존의 activeTab과 defaultTab 속성도 여전히 지원됩니다.</p>

        <div className={styles.showcase}>
          <Tabs
            defaultTab="tab2"
            items={[
              {
                id: 'tab1',
                label: '탭 1',
                content: <p>탭 1 내용입니다.</p>,
              },
              {
                id: 'tab2',
                label: '탭 2',
                content: <p>탭 2 내용입니다.</p>,
              },
              {
                id: 'tab3',
                label: '탭 3',
                content: <p>탭 3 내용입니다.</p>,
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 기존 방식 사용 예시
<Tabs
  defaultTab="tab2"
  items={[
    {
      id: 'tab1',
      label: '탭 1',
      content: <p>탭 1 내용입니다.</p>,
    },
    {
      id: 'tab2',
      label: '탭 2',
      content: <p>탭 2 내용입니다.</p>,
    },
    {
      id: 'tab3',
      label: '탭 3',
      content: <p>탭 3 내용입니다.</p>,
    },
  ]}
/>`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default TabsGuide;
