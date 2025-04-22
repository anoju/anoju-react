// src/pages/guide/tabs.tsx
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

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Tabs Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 탭</h2>
        <p>Tab 및 TabPanel 컴포넌트를 직접 사용하는 방법입니다.</p>

        <div className={styles.showcase}>
          <Tabs>
            <Tab label="탭 1" />
            <Tab label="탭 2" />
            <Tab label="탭 3" disabled />
            <TabPanel>
              <p>탭 1 내용입니다. 기본으로 선택된 탭입니다.</p>
            </TabPanel>
            <TabPanel>
              <p>탭 2 내용입니다.</p>
            </TabPanel>
            <TabPanel>
              <p>
                탭 3 내용입니다. 비활성화된 탭이라 이 내용은 보이지 않습니다.
              </p>
            </TabPanel>
          </Tabs>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Tabs>
  <Tab label="탭 1" />
  <Tab label="탭 2" />
  <Tab label="탭 3" disabled />
  <TabPanel>
    <p>탭 1 내용입니다. 기본으로 선택된 탭입니다.</p>
  </TabPanel>
  <TabPanel>
    <p>탭 2 내용입니다.</p>
  </TabPanel>
  <TabPanel>
    <p>
      탭 3 내용입니다. 비활성화된 탭이라 이 내용은 보이지 않습니다.
    </p>
  </TabPanel>
</Tabs>`}
          language="jsx"
        />
        <CodeHighlight
          code={`<Tabs>
  <Tab id="tab1" label="탭 1" />
  <Tab id="tab2" label="탭 2" />
  <Tab id="tab3" label="탭 3" disabled />
  <TabPanel id="tab1">
    <p>탭 1 내용입니다. 기본으로 선택된 탭입니다.</p>
  </TabPanel>
  <TabPanel id="tab2">
    <p>탭 2 내용입니다.</p>
  </TabPanel>
  <TabPanel id="tab3">
    <p>탭 3 내용입니다. 비활성화된 탭이라 이 내용은 보이지 않습니다.</p>
  </TabPanel>
</Tabs>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>items 속성 사용</h2>
        <p>items 속성을 사용하여 탭을 구성하는 방법입니다.</p>

        <div className={styles.showcase}>
          <Tabs
            defaultTab={1}
            items={[
              {
                label: '아이템 1',
                content: <p>아이템 1의 내용입니다.</p>,
              },
              {
                label: '아이템 2',
                content: <p>아이템 2의 내용입니다.</p>,
              },
              {
                label: '아이템 3 (비활성화)',
                content: <p>아이템 3의 내용입니다.</p>,
                disabled: true,
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Tabs
  defaultTab={1}
  items={[
    {
      label: '아이템 1',
      content: <p>아이템 1의 내용입니다.</p>,
    },
    {
      label: '아이템 2',
      content: <p>아이템 2의 내용입니다.</p>,
    },
    {
      label: '아이템 3 (비활성화)',
      content: <p>아이템 3의 내용입니다.</p>,
      disabled: true,
    },
  ]}
/>`}
          language="jsx"
        />
        <CodeHighlight
          code={`<Tabs 
  defaultTab="item2"
  items={[
    { 
      id: 'item1', 
      label: '아이템 1', 
      content: <p>아이템 1의 내용입니다.</p> 
    },
    { 
      id: 'item2', 
      label: '아이템 2', 
      content: <p>아이템 2의 내용입니다.</p> 
    },
    { 
      id: 'item3', 
      label: '아이템 3 (비활성화)', 
      content: <p>아이템 3의 내용입니다.</p>,
      disabled: true 
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
                id: 'home',
                label: '홈',
                to: '/',
              },
              {
                id: 'about',
                label: '소개',
                to: '/about',
              },
              {
                id: 'guide',
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
      id: 'home', 
      label: '홈', 
      to: '/' 
    },
    { 
      id: 'about', 
      label: '소개', 
      to: '/about' 
    },
    { 
      id: 'guide', 
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
                id: 'tab1',
                label: '탭 1',
                content: <p>Outline 스타일의 탭 1 내용입니다.</p>,
              },
              {
                id: 'tab2',
                label: '탭 2',
                content: <p>Outline 스타일의 탭 2 내용입니다.</p>,
              },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>Underline 스타일</h3>
        <div className={styles.showcase}>
          <Tabs
            variant="underline"
            items={[
              {
                id: 'tab1',
                label: '탭 1',
                content: <p>Underline 스타일의 탭 1 내용입니다.</p>,
              },
              {
                id: 'tab2',
                label: '탭 2',
                content: <p>Underline 스타일의 탭 2 내용입니다.</p>,
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
                id: 'tab1',
                label: '탭 1',
                content: <p>Pills 스타일의 탭 1 내용입니다.</p>,
              },
              {
                id: 'tab2',
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
                id: 'tab1',
                label: '탭 1',
                content: <p>중앙 정렬된 탭 1 내용입니다.</p>,
              },
              {
                id: 'tab2',
                label: '탭 2',
                content: <p>중앙 정렬된 탭 2 내용입니다.</p>,
              },
              {
                id: 'tab3',
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
                id: 'tab1',
                label: '탭 1',
                content: <p>전체 너비 탭 1 내용입니다.</p>,
              },
              {
                id: 'tab2',
                label: '탭 2',
                content: <p>전체 너비 탭 2 내용입니다.</p>,
              },
              {
                id: 'tab3',
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
    { id: 'tab1', label: '탭 1', content: <p>Outline 스타일의 탭 1 내용입니다.</p> },
    { id: 'tab2', label: '탭 2', content: <p>Outline 스타일의 탭 2 내용입니다.</p> },
  ]}
/>

// Underline 스타일
<Tabs 
  variant="underline"
  items={[
    { id: 'tab1', label: '탭 1', content: <p>Underline 스타일의 탭 1 내용입니다.</p> },
    { id: 'tab2', label: '탭 2', content: <p>Underline 스타일의 탭 2 내용입니다.</p> },
  ]}
/>

// Pills 스타일
<Tabs 
  variant="pills"
  items={[
    { id: 'tab1', label: '탭 1', content: <p>Pills 스타일의 탭 1 내용입니다.</p> },
    { id: 'tab2', label: '탭 2', content: <p>Pills 스타일의 탭 2 내용입니다.</p> },
  ]}
/>

// 중앙 정렬
<Tabs 
  alignment="center"
  items={[
    { id: 'tab1', label: '탭 1', content: <p>중앙 정렬된 탭 1 내용입니다.</p> },
    { id: 'tab2', label: '탭 2', content: <p>중앙 정렬된 탭 2 내용입니다.</p> },
    { id: 'tab3', label: '탭 3', content: <p>중앙 정렬된 탭 3 내용입니다.</p> },
  ]}
/>

// 전체 너비
<Tabs 
  alignment="full"
  items={[
    { id: 'tab1', label: '탭 1', content: <p>전체 너비 탭 1 내용입니다.</p> },
    { id: 'tab2', label: '탭 2', content: <p>전체 너비 탭 2 내용입니다.</p> },
    { id: 'tab3', label: '탭 3', content: <p>전체 너비 탭 3 내용입니다.</p> },
  ]}
/>`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default TabsGuide;
