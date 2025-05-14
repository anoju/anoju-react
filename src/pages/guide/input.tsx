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
  const [multiValues, setMultiValues] = useState(['값 1', '값 2', '값 3']);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    console.log(
      `handleInputChange called with index:`,
      index,
      `value:`,
      e.target.value
    );

    // 특수 값 -1은 전체 필드 초기화를 의미
    if (index === -1) {
      console.log('Special reset all fields case detected');
      // 마지막 필드는 disabled이미로 그대로 유지
      setMultiValues(['', '', multiValues[2]]);
      return;
    }

    if (index !== undefined) {
      // 기존 값을 긴 배열로 복사
      const newValues = [...multiValues];
      // 해당 인덱스의 값만 변경
      newValues[index] = e.target.value;
      console.log(`Updated values array:`, newValues);
      // 업데이트된 배열로 상태 갱신
      setMultiValues(newValues);
    }
  };

  // 값 직접 비우기 테스트
  const handleClearValues = () => {
    console.log('Directly clearing all values');
    setMultiValues(['', '', multiValues[2]]); // 세 번째 값은 disabled이미로 유지
  };

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
        <h2 className={styles['section-title']}>showReset 옵션</h2>
        <p className={styles.txt}>
          showReset 속성을 false로 설정하면 입력 내용 지우기 버튼이 표시되지
          않습니다.
        </p>

        <div className={styles.showcase}>
          <Input placeholder="지우기 버튼 없음" showReset={false} />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Input placeholder="지우기 버튼 없음" showReset={false} />`}
          language="jsx"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>
          다중 입력 필드 (Multiple Input Tags)
        </h2>
        <p className={styles.txt}>
          values 속성을 사용하여 하나의 Input 컴포넌트 내에 여러 개의 input
          태그를 생성할 수 있습니다. 각 input 태그의 속성은 inputFields 배열을
          통해 개별적으로 설정할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <Input
            values={multiValues}
            onChange={handleInputChange}
            inputFields={[
              { placeholder: '첫 번째 입력', className: 'input-first' },
              { placeholder: '두 번째 입력', align: 'center' },
              { placeholder: '세 번째 입력', disabled: true },
            ]}
            beforeEl={<span style={{ fontSize: '14px' }}>📝</span>}
            afterEl={<span style={{ fontSize: '14px' }}>✓</span>}
          />
          <p>
            <Button
              size="sm"
              onClick={handleClearValues}
              style={{ marginRight: '8px' }}
            >
              값 직접 초기화
            </Button>
            <Button
              size="sm"
              onClick={() => {
                console.log('Current multiValues:', multiValues);
              }}
            >
              현재 값 로그
            </Button>
          </p>
        </div>
        <div className={styles.txt}>입력된 값: {multiValues.join(', ')}</div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 다중 input 태그 사용
const [multiValues, setMultiValues] = useState(['값 1', '값 2', '값 3']);

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>, 
  index?: number
) => {
  if (index !== undefined) {
    const newValues = [...multiValues];
    newValues[index] = e.target.value;
    setMultiValues(newValues);
  }
};

<Input
  values={multiValues}
  onChange={handleInputChange}
  inputFields={[
    { placeholder: '첫 번째 입력', className: 'input-first' },
    { placeholder: '두 번째 입력', align: 'center' },
    { placeholder: '세 번째 입력', disabled: true },
  ]}
  beforeEl={<span style={{ fontSize: '14px' }}>📝</span>}
  afterEl={<span style={{ fontSize: '14px' }}>✓</span>}
/>`}
          language="jsx"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>다양한 타입의 input 태그</h2>
        <p className={styles.txt}>
          inputFields 배열을 통해 여러 종류의 input 태그를 하나의 컴포넌트에
          혼합하여 사용할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <Input
            values={['', '', '']}
            inputFields={[
              { type: 'text', placeholder: '텍스트 입력' },
              { type: 'password', placeholder: '비밀번호 입력' },
              { type: 'number', placeholder: '숫자 입력' },
            ]}
            showReset={true}
            showPassword={true}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Input
  values={['', '', '']}
  inputFields={[
    { type: 'text', placeholder: '텍스트 입력' },
    { type: 'password', placeholder: '비밀번호 입력' },
    { type: 'number', placeholder: '숫자 입력' },
  ]}
  showReset={true}
  showPassword={true}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>구분자(Separator) 사용</h2>
        <p className={styles.txt}>
          separator 속성을 사용하면 다중 입력 필드 사이에 구분자를 추가할 수
          있습니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>기본 텍스트 구분자</h3>
          <Input
            values={['', '', '']}
            separator="-"
            inputFields={[
              { placeholder: '천' },
              { placeholder: '백', align: 'center' },
              { placeholder: '일', align: 'right' },
            ]}
          />

          <h3 className={styles['sub-title']}>커스텀 요소 구분자</h3>
          <Input
            values={['010', '', '']}
            separator={<span style={{ color: '#888' }}>-</span>}
            inputFields={[
              { maxLength: 3, align: 'center' },
              { maxLength: 4, align: 'center' },
              { maxLength: 4, align: 'center' },
            ]}
          />

          <h3 className={styles['sub-title']}>크기가 다른 구분자</h3>
          <Input
            values={['010', '', '']}
            separator={
              <div
                style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: '#999',
                }}
              />
            }
            inputFields={[
              { maxLength: 3, align: 'center' },
              { maxLength: 4, align: 'center' },
              { maxLength: 4, align: 'center' },
            ]}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 기본 텍스트 구분자
<Input
  values={['', '', '']}
  separator="-"
  inputFields={[
    { placeholder: '천' },
    { placeholder: '백', align: 'center' },
    { placeholder: '일', align: 'right' },
  ]}
/>

// 커스텀 요소 구분자
<Input
  values={['010', '', '']}
  separator={<span style={{ color: '#888' }}>-</span>}
  inputFields={[
    { maxLength: 3, align: 'center' },
    { maxLength: 4, align: 'center' },
    { maxLength: 4, align: 'center' },
  ]}
/>

// 크기가 다른 구분자
<Input
  values={['010', '', '']}
  separator={
    <div
      style={{
        width: '24px',
        height: '2px',
        backgroundColor: '#999',
      }}
    />
  }
  inputFields={[
    { maxLength: 3, align: 'center' },
    { maxLength: 4, align: 'center' },
    { maxLength: 4, align: 'center' },
  ]}
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
                <td>string | number</td>
                <td>-</td>
                <td>입력 필드의 값</td>
              </tr>
              <tr>
                <td>defaultValue</td>
                <td>string | number</td>
                <td>-</td>
                <td>초기 값</td>
              </tr>
              <tr>
                <td>placeholder</td>
                <td>string</td>
                <td>-</td>
                <td>입력 필드의 플레이스홀더</td>
              </tr>
              <tr>
                <td>type</td>
                <td>string</td>
                <td>'text'</td>
                <td>입력 필드의 타입</td>
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
                <td>showReset</td>
                <td>boolean</td>
                <td>true</td>
                <td>입력값 초기화 버튼 표시 여부</td>
              </tr>
              <tr>
                <td>showPassword</td>
                <td>boolean</td>
                <td>false</td>
                <td>비밀번호 표시/숨김 버튼 표시 여부</td>
              </tr>
              <tr>
                <td>beforeEl</td>
                <td>ReactNode</td>
                <td>-</td>
                <td>입력 필드 앞에 표시될 요소</td>
              </tr>
              <tr>
                <td>afterEl</td>
                <td>ReactNode</td>
                <td>-</td>
                <td>입력 필드 뒤에 표시될 요소</td>
              </tr>
              <tr>
                <td>onlyNumber</td>
                <td>boolean</td>
                <td>false</td>
                <td>숫자만 입력 가능 여부</td>
              </tr>
              <tr>
                <td>addComma</td>
                <td>boolean</td>
                <td>false</td>
                <td>천 단위 콤마 추가 여부(onlyNumber가 true일 때만 적용)</td>
              </tr>
              <tr>
                <td>align</td>
                <td>'left' | 'center' | 'right'</td>
                <td>'left'</td>
                <td>텍스트 정렬 방향</td>
              </tr>
              <tr>
                <td>className</td>
                <td>string</td>
                <td>''</td>
                <td>컴포넌트에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>wrapperClassName</td>
                <td>string</td>
                <td>''</td>
                <td>래퍼 요소에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>inputClassName</td>
                <td>string</td>
                <td>''</td>
                <td>input 요소에 적용할 추가 클래스명</td>
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
              <tr>
                <td>values</td>
                <td>(string | number)[]</td>
                <td>-</td>
                <td>다중 input 태그를 위한 값 배열</td>
              </tr>
              <tr>
                <td>inputFields</td>
                <td>InputFieldProps[]</td>
                <td>[]</td>
                <td>다중 input 태그의 개별 속성 설정</td>
              </tr>
              <tr>
                <td>separator</td>
                <td>ReactNode</td>
                <td>-</td>
                <td>다중 입력 필드 사이에 표시할 구분자</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InputGuide;
