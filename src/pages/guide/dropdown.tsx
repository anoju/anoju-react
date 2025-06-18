// src/pages/guide/textarea.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Dropdown } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const DropdownGuide = () => {
  usePageLayout({
    title: 'Dropdown / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const [visible, setVisible] = useState(false);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Textarea Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Dropdown } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        {/* // 기본 사용법 */}
        <Dropdown trigger={<Button>클릭하세요</Button>}>
          <div>
            <div>옵션 1</div>
            <div>옵션 2</div>
            <div>옵션 3</div>
          </div>
        </Dropdown>
        <br />
        <br />
        <br />
        {/* // 외부 상태 제어 */}
        노출 여부: {visible}
        <Dropdown
          trigger={<Button>제어되는 드롭다운</Button>}
          visible={visible}
          onVisibleChange={setVisible}
          placement="top"
          followScroll={true}
        >
          <div>내용...</div>
        </Dropdown>
        <br />
        <br />
        <br />
        {/* // Select와 같은 스타일로 사용 */}
        <Dropdown
          trigger={
            <div
              style={{
                border: '1px solid #d9d9d9',
                padding: '4px 11px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              선택하세요 ▼
            </div>
          }
          overlayClassName="custom-dropdown"
        >
          <div className="dropdown-item">옵션 1</div>
          <div className="dropdown-item">옵션 2</div>
          <div className="dropdown-item">옵션 3</div>
        </Dropdown>
      </section>
    </div>
  );
};

export default DropdownGuide;
