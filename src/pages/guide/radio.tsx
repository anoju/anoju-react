// src/pages/guide/radio.tsx
import { useState, useRef } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Radio, RadioHandle } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const RadioGuide = () => {
  usePageLayout({
    title: '라디오 버튼 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // Individual radio states
  const [selected, setSelected] = useState('option1');

  // Group radio states
  const [selectedValue, setSelectedValue] = useState<string | number>(
    'option1'
  );
  const [selectedFruit, setSelectedFruit] = useState<string | number>('apple');
  const [selectedColor, setSelectedColor] = useState<string | number>('blue');

  // 라디오 버튼에 대한 참조 생성
  const radioRef = useRef<RadioHandle>(null);
  const [selected2, setSelected2] = useState('option1');

  // 버튼 클릭 핸들러
  const handleFocus = () => {
    radioRef.current?.focus();
  };

  const handleBlur = () => {
    radioRef.current?.blur();
  };

  const handleIsChecked = () => {
    alert(
      '현재 선택 상태: ' +
        (radioRef.current?.isChecked() ? '선택됨' : '선택 안됨')
    );
  };

  const handleSelect = () => {
    radioRef.current?.select();
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Radio Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Radio } from '@/components/common';
// 또는 RadioGroup도 사용할 경우
import { Radio, RadioGroup } from '@/components/common';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <div className={styles.showcase}>
          <div className="check-wrap">
            <Radio
              value="option1"
              checked={selected === 'option1'}
              onChange={(e) => setSelected(e.target.checked ? 'option1' : '')}
            >
              라디오 옵션 1
            </Radio>

            <Radio
              value="option2"
              checked={selected === 'option2'}
              onChange={(e) => setSelected(e.target.checked ? 'option2' : '')}
            >
              라디오 옵션 2
            </Radio>

            <Radio
              value="option3"
              checked={selected === 'option3'}
              onChange={(e) => setSelected(e.target.checked ? 'option3' : '')}
              className="custom-radio"
              inputClassName="custom-input"
              iconClassName="custom-icon"
              labelClassName="custom-label"
            >
              커스텀 클래스 적용
            </Radio>

            <Radio value="option4" checked disabled>
              선택됨 + 비활성화
            </Radio>

            <Radio value="option5" disabled>
              비활성화
            </Radio>
          </div>
          <hr />
          <p className={styles.txt}>선택된 값: {selected}</p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태 정의
const [selected, setSelected] = useState('option1');

// 기본 라디오 버튼
<Radio
  value="option1"
  checked={selected === 'option1'}
  onChange={(e) => setSelected(e.target.checked ? 'option1' : '')}
>
  라디오 옵션 1
</Radio>

<Radio
  value="option2"
  checked={selected === 'option2'}
  onChange={(e) => setSelected(e.target.checked ? 'option2' : '')}
>
  라디오 옵션 2
</Radio>

// 커스텀 클래스 적용
<Radio
  value="option3"
  checked={selected === 'option3'}
  onChange={(e) => setSelected(e.target.checked ? 'option3' : '')}
  className="custom-radio"
  inputClassName="custom-input"
  iconClassName="custom-icon"
  labelClassName="custom-label"
>
  커스텀 클래스 적용
</Radio>

// 비활성화된 라디오 버튼
<Radio value="option4" checked disabled>
  선택됨 + 비활성화
</Radio>

<Radio value="option5" disabled>
  비활성화
</Radio>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Radio.Group 사용법</h2>
        <div className={styles.showcase}>
          <Radio.Group value={selectedValue} onChange={setSelectedValue}>
            <Radio value="option1">옵션 1</Radio>
            <Radio value="option2">옵션 2</Radio>
            <Radio value="option3">옵션 3</Radio>
            <Radio value="option4">옵션 4</Radio>
          </Radio.Group>
          <hr />
          <p className={styles.txt}>선택된 값: {selectedValue}</p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// State 정의
const [selectedValue, setSelectedValue] = useState<string | number>('option1');

// JSX
<Radio.Group value={selectedValue} onChange={setSelectedValue}>
  <Radio value="option1">옵션 1</Radio>
  <Radio value="option2">옵션 2</Radio>
  <Radio value="option3">옵션 3</Radio>
  <Radio value="option4">옵션 4</Radio>
</Radio.Group>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>options 배열 사용</h2>
        <div className={styles.showcase}>
          <h4 className={styles['sub-title']}>문자열 배열</h4>
          <Radio.Group
            options={['apple', 'orange', 'banana', 'grape']}
            value={selectedFruit}
            onChange={setSelectedFruit}
            className="grid"
          />
          <p className={styles.txt}>선택된 과일: {selectedFruit}</p>
          <hr />
          <h4 className={styles['sub-title']}>객체 배열 (value/label)</h4>
          <Radio.Group
            options={[
              { value: 'red', label: '빨간색' },
              { value: 'blue', label: '파란색' },
              { value: 'green', label: '초록색' },
              { value: 'yellow', label: '노란색', disabled: true },
            ]}
            value={selectedColor}
            onChange={setSelectedColor}
            className="grid"
          />
          <p className={styles.txt}>선택된 색상: {selectedColor}</p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태 정의
const [selectedFruit, setSelectedFruit] = useState<string | number>('apple');
const [selectedColor, setSelectedColor] = useState<string | number>('blue');

// 문자열 배열 사용
<Radio.Group
  options={['apple', 'orange', 'banana', 'grape']}
  value={selectedFruit}
  onChange={setSelectedFruit}
  className="grid"
/>

// 객체 배열 (value/label)
<Radio.Group
  options={[
    { value: 'red', label: '빨간색' },
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'yellow', label: '노란색', disabled: true },
  ]}
  value={selectedColor}
  onChange={setSelectedColor}
  className="grid"
/>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>name 속성</h2>
        <p className={styles.txt}>
          name 속성은 Radio.Group 내에서 자동으로 설정됩니다. 필요한 경우
          수동으로 지정할 수도 있습니다.
        </p>

        <div className={styles.showcase}>
          <Radio.Group
            value={selectedColor}
            onChange={setSelectedColor}
            name="color-group"
          >
            <Radio value="red">빨간색</Radio>
            <Radio value="blue">파란색</Radio>
            <Radio value="green">초록색</Radio>
          </Radio.Group>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Radio.Group value={selectedColor} onChange={setSelectedColor} name="color-group">
  <Radio value="red">빨간색</Radio>
  <Radio value="blue">파란색</Radio>
  <Radio value="green">초록색</Radio>
</Radio.Group>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>외부에서 메서드 호출하기</h2>
        <p className={styles.txt}>
          useRef와 ref 속성을 사용하여 라디오 버튼의 메서드를 직접 호출할 수
          있습니다.
        </p>
        <div className={styles.showcase}>
          <div>
            <Radio
              value="option1"
              checked={selected2 === 'option1'}
              onChange={(e) => setSelected2(e.target.checked ? 'option1' : '')}
            >
              일반 라디오 버튼
            </Radio>
          </div>
          <div>
            <Radio
              ref={radioRef}
              value="option2"
              checked={selected2 === 'option2'}
              onChange={(e) => setSelected2(e.target.checked ? 'option2' : '')}
            >
              메서드를 호출할 라디오 버튼
            </Radio>
          </div>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              gap: '5px',
              flexWrap: 'wrap',
            }}
          >
            <Button size="sm" onClick={handleFocus}>
              포커스
            </Button>
            <Button size="sm" onClick={handleBlur}>
              블러
            </Button>
            <Button size="sm" onClick={handleIsChecked}>
              상태 확인
            </Button>
            <Button size="sm" onClick={handleSelect}>
              선택하기
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 메서드 호출 예시 컴포넌트
import { useRef, useState } from 'react';
import { Radio, RadioHandle } from '@/components/common';

const MyRadioWithRef = () => {
  // 라디오 버튼에 대한 참조 생성
  const radioRef = useRef<RadioHandle>(null);
  const [selected, setSelected] = useState('option1');
  
  // 버튼 클릭 핸들러
  const handleFocus = () => {
    radioRef.current?.focus();
  };
  
  const handleBlur = () => {
    radioRef.current?.blur();
  };
  
  const handleIsChecked = () => {
    alert('현재 선택 상태: ' + (radioRef.current?.isChecked() ? '선택됨' : '선택 안됨'));
  };
  
  const handleSelect = () => {
    radioRef.current?.select();
  };
  
  return (
    <div>
      <div>
        <Radio
          value="option1"
          checked={selected === 'option1'}
          onChange={(e) => setSelected(e.target.checked ? 'option1' : '')}
        >
          일반 라디오 버튼
        </Radio>
      </div>
      <div>
        <Radio
          ref={radioRef}
          value="option2"
          checked={selected === 'option2'}
          onChange={(e) => setSelected(e.target.checked ? 'option2' : '')}
        >
          메서드를 호출할 라디오 버튼
        </Radio>
      </div>
      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
        <button onClick={handleFocus}>포커스</button>
        <button onClick={handleBlur}>블러</button>
        <button onClick={handleIsChecked}>상태 확인</button>
        <button onClick={handleSelect}>선택하기</button>
      </div>
    </div>
  );
};
`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>사용 가능한 메서드</h2>
        <div className={styles.showcase}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>메서드</th>
                <th>설명</th>
                <th>사용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>focus()</td>
                <td>라디오 버튼에 포커스를 줍니다.</td>
                <td>
                  <code>radioRef.current?.focus()</code>
                </td>
              </tr>
              <tr>
                <td>blur()</td>
                <td>라디오 버튼에서 포커스를 제거합니다.</td>
                <td>
                  <code>radioRef.current?.blur()</code>
                </td>
              </tr>
              <tr>
                <td>isChecked()</td>
                <td>현재 선택 상태를 boolean 값으로 반환합니다.</td>
                <td>
                  <code>const isChecked = radioRef.current?.isChecked()</code>
                </td>
              </tr>
              <tr>
                <td>select()</td>
                <td>라디오 버튼을 선택합니다.</td>
                <td>
                  <code>radioRef.current?.select()</code>
                </td>
              </tr>
              <tr>
                <td>getRootElement()</td>
                <td>라디오 버튼 컴포넌트의 루트 DOM 요소를 반환합니다.</td>
                <td>
                  <code>
                    const rootElement = radioRef.current?.getRootElement()
                  </code>
                </td>
              </tr>
              <tr>
                <td>getInputElement()</td>
                <td>라디오 버튼의 input DOM 요소를 반환합니다.</td>
                <td>
                  <code>
                    const inputElement = radioRef.current?.getInputElement()
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>RadioGroup 메서드</h2>
        <p className={styles.txt}>
          Radio.Group 컴포넌트도 메서드를 제공합니다. 그룹 단위로 라디오 버튼을
          제어할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>메서드</th>
                <th>설명</th>
                <th>사용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>focus(index?: number)</td>
                <td>
                  지정된 인덱스의 라디오 버튼에 포커스를 줍니다. 인덱스를
                  지정하지 않으면 첫 번째 활성화된 라디오 버튼에 포커스를
                  줍니다.
                </td>
                <td>
                  <code>groupRef.current?.focus(1)</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default RadioGuide;
