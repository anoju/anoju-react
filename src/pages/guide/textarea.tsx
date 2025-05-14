// src/pages/guide/textarea.tsx
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Textarea } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';
import { useState } from 'react';

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

  // 텍스트 값 상태
  const [value, setValue] = useState('');
  const [autoSizeValue, setAutoSizeValue] = useState('');
  const [countValue, setCountValue] = useState('');

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Textarea Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Textarea } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 텍스트영역</h2>
        <p className={styles.txt}>
          기본적인 Textarea 컴포넌트로, 사용자 입력을 위한 여러 줄의 텍스트
          필드를 제공합니다.
        </p>
        <div className={styles.showcase}>
          <Textarea
            placeholder="기본 텍스트영역"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [value, setValue] = useState('');

<Textarea
  placeholder="기본 텍스트영역"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>자동 높이 조절</h2>
        <p className={styles.txt}>
          autoSize 속성을 사용하면 내용에 따라 텍스트영역의 높이가 자동으로
          조절됩니다.
        </p>
        <div className={styles.showcase}>
          <Textarea
            placeholder="내용을 입력하면 높이가 자동으로 조절됩니다."
            value={autoSizeValue}
            onChange={(e) => setAutoSizeValue(e.target.value)}
            autoSize
          />
          <br />
          <br />
          <Textarea
            placeholder="최소 3줄, 최대 6줄로 제한된 자동 높이 조절"
            value={autoSizeValue}
            onChange={(e) => setAutoSizeValue(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [autoSizeValue, setAutoSizeValue] = useState('');

// 기본 자동 높이 조절
<Textarea
  placeholder="내용을 입력하면 높이가 자동으로 조절됩니다."
  value={autoSizeValue}
  onChange={(e) => setAutoSizeValue(e.target.value)}
  autoSize
/>

// 최소/최대 행 제한이 있는 자동 높이 조절
<Textarea
  placeholder="최소 3줄, 최대 6줄로 제한된 자동 높이 조절"
  value={autoSizeValue}
  onChange={(e) => setAutoSizeValue(e.target.value)}
  autoSize={{ minRows: 3, maxRows: 6 }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>글자 수 표시</h2>
        <p className={styles.txt}>
          maxLength와 showCount 속성을 함께 사용하여 글자 수 제한과 현재 글자
          수를 표시할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <Textarea
            placeholder="최대 100자까지 입력 가능합니다."
            value={countValue}
            onChange={(e) => setCountValue(e.target.value)}
            maxLength={100}
            showCount
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [countValue, setCountValue] = useState('');

<Textarea
  placeholder="최대 100자까지 입력 가능합니다."
  value={countValue}
  onChange={(e) => setCountValue(e.target.value)}
  maxLength={100}
  showCount
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>리사이즈 옵션</h2>
        <p className={styles.txt}>
          resize 속성으로 사용자가 텍스트영역의 크기를 조절할 수 있는 방향을
          제어할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>resize: none</strong>
            <Textarea placeholder="크기 조절 불가" resize="none" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>resize: both</strong>
            <Textarea
              placeholder="가로, 세로 모두 크기 조절 가능"
              resize="both"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>resize: horizontal</strong>
            <Textarea
              placeholder="가로 방향만 크기 조절 가능"
              resize="horizontal"
            />
          </div>
          <div>
            <strong>resize: vertical (기본값)</strong>
            <Textarea placeholder="세로 방향만 크기 조절 가능" />
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 크기 조절 불가
<Textarea
  placeholder="크기 조절 불가"
  resize="none"
/>

// 가로, 세로 모두 크기 조절 가능
<Textarea
  placeholder="가로, 세로 모두 크기 조절 가능"
  resize="both"
/>

// 가로 방향만 크기 조절 가능
<Textarea
  placeholder="가로 방향만 크기 조절 가능"
  resize="horizontal"
/>

// 세로 방향만 크기 조절 가능 (기본값)
<Textarea
  placeholder="세로 방향만 크기 조절 가능"
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>상태 변형</h2>
        <p className={styles.txt}>disabled, readOnly 상태 옵션을 제공합니다.</p>
        <div className={styles.showcase}>
          <div style={{ marginBottom: '1rem' }}>
            <Textarea
              placeholder="비활성화된 텍스트영역"
              disabled
              value="사용자가 편집할 수 없는 비활성화 상태입니다."
            />
          </div>
          <div>
            <Textarea
              placeholder="읽기 전용 텍스트영역"
              readOnly
              value="사용자가 읽을 수만 있고 편집할 수 없는 상태입니다."
            />
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 비활성화 상태
<Textarea
  placeholder="비활성화된 텍스트영역"
  disabled
  value="사용자가 편집할 수 없는 비활성화 상태입니다."
/>

// 읽기 전용 상태
<Textarea
  placeholder="읽기 전용 텍스트영역"
  readOnly
  value="사용자가 읽을 수만 있고 편집할 수 없는 상태입니다."
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props</h2>
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
                <td>텍스트영역의 값 (제어 컴포넌트로 사용할 때)</td>
              </tr>
              <tr>
                <td>defaultValue</td>
                <td>string</td>
                <td>-</td>
                <td>텍스트영역의 초기 값 (비제어 컴포넌트로 사용할 때)</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>텍스트영역을 비활성화 상태로 만듭니다</td>
              </tr>
              <tr>
                <td>readOnly</td>
                <td>boolean</td>
                <td>false</td>
                <td>텍스트영역을 읽기 전용 상태로 만듭니다</td>
              </tr>
              <tr>
                <td>autoSize</td>
                <td>boolean | {'{ minRows?: number, maxRows?: number }'}</td>
                <td>false</td>
                <td>내용에 따라 텍스트영역의 높이를 자동으로 조절합니다</td>
              </tr>
              <tr>
                <td>maxLength</td>
                <td>number</td>
                <td>-</td>
                <td>입력 가능한 최대 문자 수</td>
              </tr>
              <tr>
                <td>showCount</td>
                <td>boolean</td>
                <td>false</td>
                <td>현재 글자 수와 최대 글자 수 표시 여부</td>
              </tr>
              <tr>
                <td>resize</td>
                <td>'none' | 'both' | 'horizontal' | 'vertical'</td>
                <td>'vertical'</td>
                <td>텍스트영역의 크기 조절 방향</td>
              </tr>
              <tr>
                <td>onChange</td>
                <td>{'(e: ChangeEvent) => void'}</td>
                <td>-</td>
                <td>텍스트영역의 값이 변경될 때 호출되는 콜백 함수</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TextareaGuide;
