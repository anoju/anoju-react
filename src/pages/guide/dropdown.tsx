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
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <div className={styles.showcase}>
          <Dropdown
            trigger={
              <Button size="sm" className="line">
                클릭하세요
              </Button>
            }
            destroyPopupOnHide
          >
            <ul>
              <li>옵션 1</li>
              <li>옵션 2</li>
              <li>옵션 3</li>
            </ul>
          </Dropdown>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Dropdown trigger={<Button size="sm" className="line">클릭하세요</Button>}>
  내용...
</Dropdown>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>위치(placement)</h2>
        <div className={styles.showcase}>
          <Dropdown
            trigger={
              <Button size="sm" className="line">
                기본은 auto
              </Button>
            }
            placement="auto"
          >
            <ul>
              <li>옵션 1</li>
              <li>옵션 2</li>
              <li>옵션 3</li>
            </ul>
          </Dropdown>
          <Dropdown
            trigger={
              <Button size="sm" className="line">
                위로만 뜹니다.
              </Button>
            }
            placement="top"
          >
            <ul>
              <li>옵션 1</li>
              <li>옵션 2</li>
              <li>옵션 3</li>
            </ul>
          </Dropdown>
          <Dropdown
            trigger={
              <Button size="sm" className="line">
                아래로만 뜹니다.
              </Button>
            }
            placement="bottom"
          >
            <ul>
              <li>옵션 1</li>
              <li>옵션 2</li>
              <li>옵션 3</li>
            </ul>
          </Dropdown>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Dropdown trigger={<Button size="sm" className="line">기본은 auto</Button>} placement="auto">
  내용....
</Dropdown>

<Dropdown trigger={<Button size="sm" className="line">위로만 뜹니다.</Button>} placement="top">
  내용....
</Dropdown>

<Dropdown
  trigger={<Button size="sm" className="line">아래로만 뜹니다.</Button>}
  placement="bottom"
>
  내용....
</Dropdown>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>작동 타입(triggerType)</h2>
        <div className={styles.showcase}>
          <Dropdown
            trigger={
              <Button size="sm" className="line">
                호버하세요
              </Button>
            }
            triggerType="hover"
            mouseEnterDelay={200}
            mouseLeaveDelay={300}
          >
            <div>호버시 나타납니다</div>
            <div>호버시 나타납니다</div>
            <div>호버시 나타납니다</div>
          </Dropdown>
          <Dropdown
            trigger={<input placeholder="포커스하세요" />}
            triggerType="focus"
          >
            <div>포커스시 나타납니다</div>
            <div>포커스시 나타납니다</div>
            <div>포커스시 나타납니다</div>
          </Dropdown>
          <Dropdown
            trigger={
              <Button size="sm" className="line">
                우클릭하세요
              </Button>
            }
            triggerType="contextMenu"
          >
            <div>컨텍스트 메뉴</div>
            <div>컨텍스트 메뉴</div>
            <div>컨텍스트 메뉴</div>
          </Dropdown>

          <Dropdown
            trigger={
              <Button size="sm" className="line">
                클릭 또는 호버
              </Button>
            }
            triggerType={['click', 'hover']}
          >
            <div>클릭하거나 호버하면 나타납니다</div>
            <div>클릭하거나 호버하면 나타납니다</div>
            <div>클릭하거나 호버하면 나타납니다</div>
          </Dropdown>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Dropdown
  trigger={
    <Button size="sm" className="line">
      호버하세요
    </Button>
  }
  triggerType="hover"
  mouseEnterDelay={200}
  mouseLeaveDelay={300}
>
  <div>호버시 나타납니다</div>
  <div>호버시 나타납니다</div>
  <div>호버시 나타납니다</div>
</Dropdown>
<Dropdown
  trigger={<input placeholder="포커스하세요" />}
  triggerType="focus"
>
  <div>포커스시 나타납니다</div>
  <div>포커스시 나타납니다</div>
  <div>포커스시 나타납니다</div>
</Dropdown>
<Dropdown
  trigger={
    <Button size="sm" className="line">
      우클릭하세요
    </Button>
  }
  triggerType="contextMenu"
>
  <div>컨텍스트 메뉴</div>
  <div>컨텍스트 메뉴</div>
  <div>컨텍스트 메뉴</div>
</Dropdown>

<Dropdown
  trigger={
    <Button size="sm" className="line">
      클릭 또는 호버
    </Button>
  }
  triggerType={['click', 'hover']}
>
  <div>클릭하거나 호버하면 나타납니다</div>
  <div>클릭하거나 호버하면 나타납니다</div>
  <div>클릭하거나 호버하면 나타납니다</div>
</Dropdown>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
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
