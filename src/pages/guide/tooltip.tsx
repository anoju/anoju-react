// src/pages/guide/tooltip.tsx
import { useState, useRef } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight } from '@/components/common';
import Tooltip from '@/components/common/Tooltip';
import styles from '@/assets/scss/pages/guide.module.scss';

const TooltipGuide = () => {
  usePageLayout({
    title: '툴팁 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const [count, setCount] = useState(0);
  const [showBodyTooltip, setShowBodyTooltip] = useState(false);
  const targetButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Tooltip Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import Tooltip from '@/components/common/Tooltip';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <p className={styles.txt}>
          기본적인 툴팁 컴포넌트 사용 방법입니다. PC에서는 마우스 호버,
          모바일에서는 터치로 툴팁이 표시됩니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Tooltip>
            기본 툴팁 내용입니다. 호버하거나 터치하여 확인하세요.
          </Tooltip>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Tooltip>
  기본 툴팁 내용입니다. 호버하거나 터치하여 확인하세요.
</Tooltip>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>커스텀 헤더</h2>
        <p className={styles.txt}>
          기본 아이콘 대신 커스텀 헤더를 사용할 수 있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Tooltip
            head={
              <Button size="sm" className="primary">
                도움말
              </Button>
            }
          >
            커스텀 헤더를 사용한 툴팁입니다.
          </Tooltip>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Tooltip 
  head={<Button size="sm" className="primary">도움말</Button>}
>
  커스텀 헤더를 사용한 툴팁입니다.
</Tooltip>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>모바일 모드</h2>
        <p className={styles.txt}>
          isMobile 속성을 이용해 클릭 모드로 동작시킬 수 있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Tooltip isMobile={true}>
            클릭해서 열고 닫는 툴팁입니다. 외부 영역을 클릭하면 닫힙니다.
          </Tooltip>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Tooltip isMobile={true}>
  클릭해서 열고 닫는 툴팁입니다. 외부 영역을 클릭하면 닫힙니다.
</Tooltip>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>최대 너비 지정</h2>
        <p className={styles.txt}>
          maxWidth 속성으로 툴팁의 최대 너비를 지정할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Tooltip maxWidth={200}>
              최대 너비가 200px인 툴팁입니다. 내용이 길어지면 이 너비를 초과하지
              않습니다.
            </Tooltip>

            <Tooltip maxWidth={400}>
              최대 너비가 400px인 툴팁입니다. 많은 내용을 표시할 때 유용합니다.
              더 많은 텍스트를 추가해도 지정된 너비를 초과하지 않습니다.
            </Tooltip>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Tooltip maxWidth={200}>
  최대 너비가 200px인 툴팁입니다. 내용이 길어지면 이 너비를 초과하지 않습니다.
</Tooltip>

<Tooltip maxWidth={400}>
  최대 너비가 400px인 툴팁입니다. 많은 내용을 표시할 때 유용합니다.
  더 많은 텍스트를 추가해도 지정된 너비를 초과하지 않습니다.
</Tooltip>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>헤더 없는 툴팁</h2>
        <p className={styles.txt}>
          head={'{false}'} 속성을 이용해 헤더 없이 외부에서 제어할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              size="sm"
              className="primary"
              ref={targetButtonRef}
              onClick={() => setShowBodyTooltip(!showBodyTooltip)}
            >
              {showBodyTooltip ? '툴팁 숨기기' : '툴팁 표시'}
            </Button>

            <span>← 이 버튼을 클릭하세요</span>

            <Tooltip
              head={false}
              bodyShow={showBodyTooltip}
              setBodyShow={setShowBodyTooltip}
              showTarget={targetButtonRef.current}
            >
              <div>
                <p>외부에서 제어되는 툴팁입니다.</p>
                <p>버튼을 다시 클릭하면 사라집니다.</p>
                <Button
                  size="xs"
                  className="primary"
                  onClick={() => setCount((prev) => prev + 1)}
                >
                  카운트: {count}
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태와 참조 생성
const [showBodyTooltip, setShowBodyTooltip] = useState(false);
const [count, setCount] = useState(0);
const targetButtonRef = useRef<HTMLButtonElement>(null);

// 컴포넌트 사용
<Button 
  size="sm" 
  className="primary"
  ref={targetButtonRef}
  onClick={() => setShowBodyTooltip(!showBodyTooltip)}
>
  {showBodyTooltip ? '툴팁 숨기기' : '툴팁 표시'}
</Button>

<Tooltip 
  head={false}
  bodyShow={showBodyTooltip}
  showTarget={targetButtonRef.current}
>
  <div>
    <p>외부에서 제어되는 툴팁입니다.</p>
    <p>버튼을 다시 클릭하면 사라집니다.</p>
    <Button 
      size="xs" 
      className="primary"
      onClick={() => setCount(prev => prev + 1)}
    >
      카운트: {count}
    </Button>
  </div>
</Tooltip>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>복잡한 내용</h2>
        <p className={styles.txt}>
          복잡한 UI 요소를 포함한 내용을 표시할 수 있습니다.
        </p>
        <div className={styles.showcase + ' inline'}>
          <Tooltip maxWidth={400}>
            <div>
              <h4>복잡한 내용의 툴팁</h4>
              <p>여러 줄의 텍스트와 컴포넌트를 포함할 수 있습니다.</p>
              <p>툴팁 내부의 버튼을 클릭해도 툴팁이 닫히지 않습니다.</p>
              <Button
                size="xs"
                className="primary"
                onClick={() => setCount((prev) => prev + 1)}
              >
                카운트: {count}
              </Button>
            </div>
          </Tooltip>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [count, setCount] = useState(0);

<Tooltip maxWidth={400}>
  <div>
    <h4>복잡한 내용의 툴팁</h4>
    <p>여러 줄의 텍스트와 컴포넌트를 포함할 수 있습니다.</p>
    <p>툴팁 내부의 버튼을 클릭해도 툴팁이 닫히지 않습니다.</p>
    <Button 
      size="xs" 
      className="primary"
      onClick={() => setCount(prev => prev + 1)}
    >
      카운트: {count}
    </Button>
  </div>
</Tooltip>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props</h2>
        <div className={styles.showcase}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  속성
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  타입
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  기본값
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  설명
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  children
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ReactNode
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  필수
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  툴팁에 표시할 내용
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  head
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ReactNode | boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  true
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  툴팁 헤더 (true: 기본 아이콘, false: 헤더 없음, ReactNode:
                  커스텀 헤더)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  className
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  '자세한 내용 확인'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  기본 버튼 사용 시 접근성을 위한 aria-label
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  isMobile
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  모바일 모드 활성화 (클릭으로 동작)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  bodyShow
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  외부에서 툴팁 바디 표시 여부 제어
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  setBodyShow
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  function
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  undefined
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  툴팁이 닫힐 때 외부 상태를 업데이트하는 콜백 함수
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  showTarget
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  HTMLElement | null
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  null
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  툴팁이 표시될 기준 요소 (head가 false일 때 사용)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>동작 방식</h2>
        <div className={styles.showcase}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>기본 위치: 헤더 또는 showTarget 요소의 하단에 표시됩니다.</li>
            <li>
              공간 부족 시: 화면 하단에 공간이 부족하면 자동으로 상단에
              표시됩니다.
            </li>
            <li>
              PC 모드(isMobile=false): 마우스 호버 시 표시, 마우스 아웃 시 숨김
            </li>
            <li>
              모바일 모드(isMobile=true): 클릭 시 표시, 외부 클릭 또는 닫기 버튼
              클릭 시 숨김
            </li>
            <li>
              최대 너비: maxWidth 속성으로 제한, 기본값은 화면 너비에 맞춤
            </li>
            <li>
              자동 조정: 윈도우 경계, 스크롤, 리사이즈에 맞춰 위치 자동 조정
            </li>
            <li>툴팁 내부 클릭: 내부 버튼 등을 클릭해도 툴팁이 닫히지 않음</li>
            <li>
              외부 제어: head=false, bodyShow, setBodyShow, showTarget 옵션으로
              외부에서 툴팁 제어 가능
            </li>
            <li>
              마우스 동작 개선: 툴팁 헤더에서 바디로 마우스가 자연스럽게 이동
              가능
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>전체 코드 예시</h2>
        <div className={styles.showcase}>
          <p>최종 개선된 Tooltip 컴포넌트 사용 예시입니다.</p>
          <pre
            style={{
              background: '#f6f8fa',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
            }}
          >
            <code>{`import { useState, useRef } from 'react';
import Tooltip from '@/components/common/Tooltip';
import { Button } from '@/components/common';

function MyComponent() {
  // 외부 제어용 상태와 참조
  const [showTooltip, setShowTooltip] = useState(false);
  const [count, setCount] = useState(0);
  const targetRef = useRef(null);

  return (
    <div>
      {/* 기본 사용법 */}
      <Tooltip>
        기본 툴팁 내용입니다.
      </Tooltip>
      
      {/* 커스텀 헤더 */}
      <Tooltip head={<Button size="sm">도움말</Button>}>
        커스텀 헤더를 사용한 툴팁입니다.
      </Tooltip>
      
      {/* 모바일 모드 (클릭으로 동작) */}
      <Tooltip isMobile={true}>
        클릭해서 열고 닫는 툴팁입니다.
      </Tooltip>
      
      {/* 최대 너비 제한 */}
      <Tooltip maxWidth={300}>
        최대 너비가 300px로 제한된 툴팁입니다.
      </Tooltip>
      
      {/* 헤더 없는 툴팁 (외부 제어) */}
      <Button 
        ref={targetRef}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        툴팁 토글
      </Button>
      
      <Tooltip
        head={false}
        bodyShow={showTooltip}
        setBodyShow={setShowTooltip}
        showTarget={targetRef.current}
      >
        <div>
          <p>외부에서 제어되는 툴팁입니다.</p>
          <Button 
            onClick={() => setCount(prev => prev + 1)}
          >
            카운트: {count}
          </Button>
        </div>
      </Tooltip>
    </div>
  );
}`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
};

export default TooltipGuide;
