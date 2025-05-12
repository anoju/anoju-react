// src/pages/guide/input.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Input } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const InputGuide = () => {
  usePageLayout({
    title: '입력 필드 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // 상태 관리
  const [textValue, setTextValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [numberValue, setNumberValue] = useState<string>('');

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Input 컴포넌트</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Import</h2>
        <CodeHighlight
          code={`import { Input } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 입력 필드</h2>
        <p className={styles.txt}>
          가장 기본적인 입력 필드입니다. 기본적으로 입력 내용 지우기 버튼을
          제공합니다.
        </p>

        <div className={styles.showcase}>
          <Input
            placeholder="기본 입력 필드"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <div className={styles.txt}>입력된 값: {textValue}</div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [textValue, setTextValue] = useState<string>('');

<Input
  placeholder="기본 입력 필드"
  value={textValue}
  onChange={(e) => setTextValue(e.target.value)}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>비밀번호 입력 필드</h2>
        <p className={styles.txt}>
          비밀번호 입력 시 showPassword 옵션을 통해 비밀번호 표시/숨김 토글
          버튼을 제공합니다.
        </p>

        <div className={styles.showcase}>
          <Input
            type="password"
            placeholder="비밀번호 입력"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            showPassword
          />
          <div className={styles.txt}>
            비밀번호 길이: {passwordValue.length}
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [passwordValue, setPasswordValue] = useState<string>('');

<Input
  type="password"
  placeholder="비밀번호 입력"
  value={passwordValue}
  onChange={(e) => setPasswordValue(e.target.value)}
  showPassword
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>숫자 전용 입력 필드</h2>
        <p className={styles.txt}>
          onlyNumber 옵션을 사용하여 숫자만 입력 가능한 필드를 만들 수 있습니다.
          addComma 옵션을 함께 사용하면 자동으로 천 단위 콤마가 추가됩니다.
        </p>

        <div className={styles.showcase}>
          <Input
            placeholder="숫자만 입력 가능"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            onlyNumber
            addComma
          />
          <div className={styles.txt}>
            입력된 값(표시): {numberValue}
            <br />
            실제 값(콤마 제거): {numberValue.replace(/,/g, '')}
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [numberValue, setNumberValue] = useState<string>('');

<Input
  placeholder="숫자만 입력 가능"
  value={numberValue}
  onChange={(e) => setNumberValue(e.target.value)}
  onlyNumber
  addComma
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>BeforeEl 및 AfterEl 활용</h2>
        <p className={styles.txt}>
          beforeEl과 afterEl 속성을 사용하여 입력 필드 앞뒤에 요소를 추가할 수
          있습니다.
        </p>

        <div className={styles.showcase}>
          <Input
            placeholder="금액을 입력하세요"
            beforeEl={<span style={{ fontSize: '14px' }}>￦</span>}
            afterEl={<span style={{ fontSize: '14px' }}>원</span>}
            onlyNumber
            addComma
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Input
  placeholder="금액을 입력하세요"
  beforeEl={<span style={{ fontSize: '14px' }}>￦</span>}
  afterEl={<span style={{ fontSize: '14px' }}>원</span>}
  onlyNumber
  addComma
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>정렬 옵션</h2>
        <p className={styles.txt}>
          align 속성을 사용하여 입력 텍스트의 정렬을 설정할 수 있습니다. (left,
          center, right)
        </p>

        <div
          className={styles.showcase}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <Input placeholder="왼쪽 정렬 (기본값)" align="left" />
          <Input placeholder="가운데 정렬" align="center" />
          <Input placeholder="오른쪽 정렬" align="right" />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Input placeholder="왼쪽 정렬 (기본값)" align="left" />
<Input placeholder="가운데 정렬" align="center" />
<Input placeholder="오른쪽 정렬" align="right" />`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>비활성화 및 읽기 전용</h2>
        <p className={styles.txt}>
          disabled와 readOnly 속성을 사용하여 각각 비활성화 및 읽기 전용 상태를
          설정할 수 있습니다.
        </p>

        <div
          className={styles.showcase}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <Input
            placeholder="비활성화 상태"
            disabled
            value="비활성화된 입력 필드"
          />
          <Input
            placeholder="읽기 전용 상태"
            readOnly
            value="읽기 전용 입력 필드"
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Input placeholder="비활성화 상태" disabled value="비활성화된 입력 필드" />
<Input placeholder="읽기 전용 상태" readOnly value="읽기 전용 입력 필드" />`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>isReset 옵션</h2>
        <p className={styles.txt}>
          isReset 속성을 false로 설정하면 입력 내용 지우기 버튼이 표시되지
          않습니다.
        </p>

        <div className={styles.showcase}>
          <Input placeholder="지우기 버튼 없음" isReset={false} />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Input placeholder="지우기 버튼 없음" isReset={false} />`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props 목록</h2>
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
                  value
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string | number
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  입력 필드의 값
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  defaultValue
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string | number
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  초기 값
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  placeholder
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  입력 필드의 플레이스홀더
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  type
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  'text'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  입력 필드의 타입
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  disabled
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  비활성화 여부
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  readOnly
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  읽기 전용 여부
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  isReset
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  true
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  입력값 초기화 버튼 표시 여부
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  showPassword
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  비밀번호 표시/숨김 버튼 표시 여부
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  beforeEl
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ReactNode
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  입력 필드 앞에 표시될 요소
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  afterEl
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ReactNode
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  입력 필드 뒤에 표시될 요소
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  onlyNumber
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  숫자만 입력 가능 여부
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  addComma
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  천 단위 콤마 추가 여부(onlyNumber가 true일 때만 적용)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  align
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  'left' | 'center' | 'right'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  'left'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  텍스트 정렬 방향
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
                  ''
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  컴포넌트에 적용할 추가 클래스명
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  wrapperClassName
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ''
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  래퍼 요소에 적용할 추가 클래스명
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  inputClassName
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  string
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ''
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  input 요소에 적용할 추가 클래스명
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  onChange
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  function
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  값 변경 시 호출되는 함수
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  onFocus
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  function
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  포커스 시 호출되는 함수
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  onBlur
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  function
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  포커스를 잃을 때 호출되는 함수
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InputGuide;
