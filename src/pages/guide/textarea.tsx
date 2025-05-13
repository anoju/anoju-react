// src/pages/guide/textarea.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Textarea } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const TextareaGuide = () => {
  usePageLayout({
    title: '텍스트영역 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // 상태 관리
  const [basicValue, setBasicValue] = useState<string>('');
  const [autoSizeValue, setAutoSizeValue] = useState<string>('');
  const [counterValue, setCounterValue] = useState<string>('');

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Textarea 컴포넌트</h1>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Import</h2>
        <CodeHighlight
          code={`import { Textarea } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 텍스트 영역</h2>
        <p className={styles.txt}>
          가장 기본적인 텍스트 영역입니다. 사용자가 여러 줄의 텍스트를 입력할 수
          있습니다.
        </p>

        <div className={styles.showcase}>
          <Textarea
            placeholder="내용을 입력하세요"
            value={basicValue}
            onChange={(e) => setBasicValue(e.target.value)}
            rows={4}
          />
          <div className={styles.txt}>
            입력된 값: {basicValue ? basicValue : '(아직 입력 없음)'}
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [basicValue, setBasicValue] = useState<string>('');

<Textarea
  placeholder="내용을 입력하세요"
  value={basicValue}
  onChange={(e) => setBasicValue(e.target.value)}
  rows={4}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>자동 높이 조절 (autoSize)</h2>
        <p className={styles.txt}>
          autoSize 속성을 사용하면 텍스트 양에 따라 높이가 자동으로 조절됩니다.
          Boolean 값이나 minRows와 maxRows를 지정하는 객체를 전달할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>autoSize={`{true}`}</h3>
          <Textarea
            placeholder="내용을 입력하세요. 텍스트 양에 따라 높이가 조절됩니다."
            value={autoSizeValue}
            onChange={(e) => setAutoSizeValue(e.target.value)}
            autoSize
          />

          <h3 className={styles['sub-title']}>
            autoSize={`{{ minRows: 2, maxRows: 6 }}`}
          </h3>
          <Textarea
            placeholder="내용을 입력하세요. 최소 2줄, 최대 6줄까지 높이가 조절됩니다."
            value={autoSizeValue}
            onChange={(e) => setAutoSizeValue(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [autoSizeValue, setAutoSizeValue] = useState<string>('');

// 기본 자동 높이 조절
<Textarea
  placeholder="내용을 입력하세요. 텍스트 양에 따라 높이가 조절됩니다."
  value={autoSizeValue}
  onChange={(e) => setAutoSizeValue(e.target.value)}
  autoSize
/>

// 최소/최대 높이 지정
<Textarea
  placeholder="내용을 입력하세요. 최소 2줄, 최대 6줄까지 높이가 조절됩니다."
  value={autoSizeValue}
  onChange={(e) => setAutoSizeValue(e.target.value)}
  autoSize={{ minRows: 2, maxRows: 6 }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>글자 수 표시 (showCount)</h2>
        <p className={styles.txt}>
          showCount와 maxLength 속성을 함께 사용하면 텍스트 입력 시 글자 수를
          표시하고 제한할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <Textarea
            placeholder="최대 100자까지 입력 가능합니다."
            value={counterValue}
            onChange={(e) => setCounterValue(e.target.value)}
            maxLength={100}
            showCount
            rows={4}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [counterValue, setCounterValue] = useState<string>('');

<Textarea
  placeholder="최대 100자까지 입력 가능합니다."
  value={counterValue}
  onChange={(e) => setCounterValue(e.target.value)}
  maxLength={100}
  showCount
  rows={4}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>리사이즈 옵션 (resize)</h2>
        <p className={styles.txt}>
          resize 속성을 사용하여 사용자가 텍스트 영역의 크기를 조절할 수 있는
          방향을 지정할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>resize="none"</h3>
          <Textarea placeholder="크기 조절 불가능" rows={3} resize="none" />

          <h3 className={styles['sub-title']}>resize="horizontal"</h3>
          <Textarea
            placeholder="가로 방향으로만 크기 조절 가능"
            rows={3}
            resize="horizontal"
          />

          <h3 className={styles['sub-title']}>resize="vertical" (기본값)</h3>
          <Textarea
            placeholder="세로 방향으로만 크기 조절 가능"
            rows={3}
            resize="vertical"
          />

          <h3 className={styles['sub-title']}>resize="both"</h3>
          <Textarea
            placeholder="모든 방향으로 크기 조절 가능"
            rows={3}
            resize="both"
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Textarea
  placeholder="크기 조절 불가능"
  rows={3}
  resize="none"
/>

<Textarea
  placeholder="가로 방향으로만 크기 조절 가능"
  rows={3}
  resize="horizontal"
/>

<Textarea
  placeholder="세로 방향으로만 크기 조절 가능"
  rows={3}
  resize="vertical"
/>

<Textarea
  placeholder="모든 방향으로 크기 조절 가능"
  rows={3}
  resize="both"
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>비활성화 및 읽기 전용</h2>
        <p className={styles.txt}>
          disabled와 readOnly 속성을 사용하여 각각 비활성화 및 읽기 전용 상태를
          설정할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>disabled</h3>
          <Textarea
            placeholder="비활성화된 텍스트 영역"
            value="이 텍스트 영역은 비활성화되어 있어 편집할 수 없습니다."
            disabled
            rows={3}
          />

          <h3 className={styles['sub-title']}>readOnly</h3>
          <Textarea
            placeholder="읽기 전용 텍스트 영역"
            value="이 텍스트 영역은 읽기 전용이라 편집할 수 없지만, 선택 및 복사는 가능합니다."
            readOnly
            rows={3}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Textarea
  placeholder="비활성화된 텍스트 영역"
  value="이 텍스트 영역은 비활성화되어 있어 편집할 수 없습니다."
  disabled
  rows={3}
/>

<Textarea
  placeholder="읽기 전용 텍스트 영역"
  value="이 텍스트 영역은 읽기 전용이라 편집할 수 없지만, 선택 및 복사는 가능합니다."
  readOnly
  rows={3}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props 목록</h2>
        <div className={styles.showcase}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>속성</th>
                <th>타입</th>
                <th>기본값</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>value</td>
                <td>string</td>
                <td>-</td>
                <td>텍스트 영역의 값</td>
              </tr>
              <tr>
                <td>defaultValue</td>
                <td>string</td>
                <td>-</td>
                <td>초기 값</td>
              </tr>
              <tr>
                <td>placeholder</td>
                <td>string</td>
                <td>-</td>
                <td>텍스트 영역의 플레이스홀더</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>비활성화 여부</td>
              </tr>
              <tr>
                <td>readOnly</td>
                <td>boolean</td>
                <td>false</td>
                <td>읽기 전용 여부</td>
              </tr>
              <tr>
                <td>autoSize</td>
                <td>boolean | {'{ minRows?: number; maxRows?: number }'}</td>
                <td>false</td>
                <td>텍스트 양에 따라 높이 자동 조절</td>
              </tr>
              <tr>
                <td>maxLength</td>
                <td>number</td>
                <td>-</td>
                <td>최대 글자 수 제한</td>
              </tr>
              <tr>
                <td>showCount</td>
                <td>boolean</td>
                <td>false</td>
                <td>글자 수 표시 여부</td>
              </tr>
              <tr>
                <td>resize</td>
                <td>'none' | 'both' | 'horizontal' | 'vertical'</td>
                <td>'vertical'</td>
                <td>크기 조절 방향</td>
              </tr>
              <tr>
                <td>rows</td>
                <td>number</td>
                <td>-</td>
                <td>텍스트 영역의 행 수</td>
              </tr>
              <tr>
                <td>className</td>
                <td>string</td>
                <td>''</td>
                <td>컴포넌트에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>style</td>
                <td>CSSProperties</td>
                <td>-</td>
                <td>인라인 스타일</td>
              </tr>
              <tr>
                <td>onChange</td>
                <td>function</td>
                <td>-</td>
                <td>값 변경 시 호출되는 함수</td>
              </tr>
              <tr>
                <td>onFocus</td>
                <td>function</td>
                <td>-</td>
                <td>포커스 시 호출되는 함수</td>
              </tr>
              <tr>
                <td>onBlur</td>
                <td>function</td>
                <td>-</td>
                <td>포커스를 잃을 때 호출되는 함수</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TextareaGuide;
