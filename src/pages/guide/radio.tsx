// src/pages/guide/radio.tsx
import { useState, useRef } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Radio, RadioHandle } from '@/components/common';
import type { RadioGroupHandle } from '@/components/common/Radio';
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

  // 라디오 그룹에 대한 참조 생성
  const radioGroupRef = useRef<RadioGroupHandle>(null);
  const [groupValue, setGroupValue] = useState('option1');

  // 버튼 클릭 핸들러 - 개별 라디오
  const handleFocus = () => {
    radioRef.current?.focus();
  };

  const handleBlur = () => {
    radioRef.current?.blur();
  };

  const handleIsChecked = () => {
    alert(
      '현재 선택 상태: ' +
        (radioRef.current?.getValue() ? '선택됨' : '선택 안됨')
    );
  };

  const handleSelect = () => {
    radioRef.current?.setValue();
  };

  // RadioGroup 메서드 핸들러
  const handleGetValue = () => {
    const value = radioGroupRef.current?.getValue();
    alert(`현재 선택된 값: ${value}`);
  };

  const handleSetValue = (value: string) => {
    radioGroupRef.current?.setValue(value);
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
          <Radio.Group value={selectedValue} setValue={setSelectedValue}>
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
<Radio.Group value={selectedValue} setValue={setSelectedValue}>
  <Radio value="option1">옵션 1</Radio>
  <Radio value="option2">옵션 2</Radio>
  <Radio value="option3">옵션 3</Radio>
  <Radio value="option4">옵션 4</Radio>
</Radio.Group>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>setValue 속성 사용</h2>
        <p className={styles.txt}>
          setValue 속성을 사용하면 상태 업데이트 함수를 직접 전달할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <Radio.Group value={selectedValue} setValue={setSelectedValue}>
            <Radio value="option1">옵션 1</Radio>
            <Radio value="option2">옵션 2</Radio>
            <Radio value="option3">옵션 3</Radio>
            <Radio value="option4">옵션 4</Radio>
          </Radio.Group>
          <hr />
          <p className={styles.txt}>선택된 값: {selectedValue}</p>
          <p className={styles.txt}>
            onChange와 setValue를 함께 사용할 수도 있습니다. 두 가지 모두
            지정하면 값이 변경될 때 둘 다 호출됩니다.
          </p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// State 정의
const [selectedValue, setSelectedValue] = useState<string | number>('option1');

// JSX - setValue 속성 사용
<Radio.Group value={selectedValue} setValue={setSelectedValue}>
  <Radio value="option1">옵션 1</Radio>
  <Radio value="option2">옵션 2</Radio>
  <Radio value="option3">옵션 3</Radio>
  <Radio value="option4">옵션 4</Radio>
</Radio.Group>

// onChange와 함께 사용 예시
<Radio.Group 
  value={selectedValue} 
  setValue={setSelectedValue}
  onChange={(value) => {
    // 값이 변경될 때 추가적인 로직 수행
    console.log('값이 변경됨:', value);
  }}
>
  <Radio value="option1">옵션 1</Radio>
  <Radio value="option2">옵션 2</Radio>
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
            setValue={setSelectedFruit}
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
            setValue={setSelectedColor}
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
  setValue={setSelectedFruit}
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
  setValue={setSelectedColor}
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
            setValue={setSelectedColor}
            name="color-group"
          >
            <Radio value="red">빨간색</Radio>
            <Radio value="blue">파란색</Radio>
            <Radio value="green">초록색</Radio>
          </Radio.Group>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Radio.Group value={selectedColor} setValue={setSelectedColor} name="color-group">
  <Radio value="red">빨간색</Radio>
  <Radio value="blue">파란색</Radio>
  <Radio value="green">초록색</Radio>
</Radio.Group>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>스타일 적용</h2>
        <h3 className={styles['sub-title']}>체크박스 우측배치</h3>
        <p className={styles.txt}>leftLabel 옵션 true</p>
        <div className={styles.showcase}>
          <Radio
            leftLabel
            value="option1"
            checked={selected === 'option1'}
            onChange={(e) => setSelected(e.target.checked ? 'option1' : '')}
          >
            라디오1
          </Radio>
          <Radio
            leftLabel
            value="option2"
            checked={selected === 'option2'}
            onChange={(e) => setSelected(e.target.checked ? 'option2' : '')}
          >
            라디오2
          </Radio>
          <br />
          <br />
          <Radio.Group
            leftLabel
            options={[
              { value: 'red', label: '빨간색' },
              { value: 'blue', label: '파란색' },
              { value: 'green', label: '초록색' },
              { value: 'yellow', label: '노란색', disabled: true },
            ]}
            value={selectedColor}
            setValue={setSelectedColor}
          />
        </div>
        <CodeHighlight
          code={`// 단독일때
<Radio leftLabel>라디오</Radio>

//그룹일때
<Radio.Group
  leftLabel
  options={[
    { value: 'red', label: '빨간색' },
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'yellow', label: '노란색', disabled: true },
  ]}
  value={selectedColor}
  setValue={setSelectedColor}
/>
`}
          language="typescript"
        />

        <br />

        <h3 className={styles['sub-title']}>체크박스모양</h3>
        <p className={styles.txt}>isCheckbox 옵션 true</p>
        <div className={styles.showcase}>
          <Radio
            isCheckbox
            value="option1"
            checked={selected === 'option1'}
            onChange={(e) => setSelected(e.target.checked ? 'option1' : '')}
          >
            라디오1
          </Radio>
          <Radio
            isCheckbox
            value="option2"
            checked={selected === 'option2'}
            onChange={(e) => setSelected(e.target.checked ? 'option2' : '')}
          >
            라디오2
          </Radio>
          <br />
          <br />
          <br />
          <Radio.Group
            isCheckbox
            options={[
              { value: 'red', label: '빨간색' },
              { value: 'blue', label: '파란색' },
              { value: 'green', label: '초록색' },
              { value: 'yellow', label: '노란색', disabled: true },
            ]}
            value={selectedColor}
            setValue={setSelectedColor}
          />
        </div>
        <CodeHighlight
          code={`// 단독일때
<Radio isCheckbox>라디오</Radio>

//그룹일때
<Radio.Group
  isCheckbox
  options={[
    { value: 'red', label: '빨간색' },
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'yellow', label: '노란색', disabled: true },
  ]}
  value={selectedColor}
  setValue={setSelectedColor}
/>
`}
          language="typescript"
        />

        <br />

        <h3 className={styles['sub-title']}>버튼형</h3>
        <p className={styles.txt}>
          isBtn 옵션 true (isSwitch 랑 같이 사용하지 말것)
        </p>
        <div className={styles.showcase}>
          <div className="check-wrap">
            <Radio
              isBtn
              value="option1"
              checked={selected === 'option1'}
              onChange={(e) => setSelected(e.target.checked ? 'option1' : '')}
            >
              라디오1
            </Radio>
            <Radio
              isBtn
              value="option2"
              checked={selected === 'option2'}
              onChange={(e) => setSelected(e.target.checked ? 'option2' : '')}
            >
              라디오2
            </Radio>
          </div>
          <br />
          <Radio.Group
            isBtn
            options={[
              { value: 'red', label: '빨간색' },
              { value: 'blue', label: '파란색' },
              { value: 'green', label: '초록색' },
              { value: 'yellow', label: '노란색', disabled: true },
            ]}
            value={selectedColor}
            setValue={setSelectedColor}
            className="grid"
          />
        </div>
        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 단독일때
<Radio isBtn>라디오1</Radio>

//그룹일때
<Radio.Group
  isBtn
  options={[
    { value: 'red', label: '빨간색' },
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'yellow', label: '노란색', disabled: true },
  ]}
  value={selectedColor}
  setValue={setSelectedColor}
  className="grid"
/>
`}
          language="typescript"
        />

        <br />

        <h3 className={styles['sub-title']}>스위치</h3>
        <p className={styles.txt}>
          isSwitch 옵션 true (isBtn 이이랑 같이 사용하지 말것)
        </p>
        <div className={styles.showcase}>
          <div className="check-wrap">
            <Radio
              isSwitch
              value="option1"
              checked={selected === 'option1'}
              onChange={(e) => setSelected(e.target.checked ? 'option1' : '')}
            >
              radio1
            </Radio>
            <Radio
              isSwitch
              value="option2"
              checked={selected === 'option2'}
              onChange={(e) => setSelected(e.target.checked ? 'option2' : '')}
            >
              radio2
            </Radio>
          </div>
          <br />
          <Radio.Group
            isSwitch
            options={[
              { value: 'red', label: '빨간색' },
              { value: 'blue', label: '파란색' },
              { value: 'green', label: '초록색' },
              { value: 'yellow', label: '노란색', disabled: true },
            ]}
            value={selectedColor}
            setValue={setSelectedColor}
            className="grid"
          />
        </div>
        <CodeHighlight
          code={`// 단독일때
<Radio isSwitch>radio1</Radio>

//그룹일때
<Radio.Group
  isSwitch
  options={[
    { value: 'red', label: '빨간색' },
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'yellow', label: '노란색', disabled: true },
  ]}
  value={selectedColor}
  setValue={setSelectedColor}
  className="grid"
/>
`}
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
    alert('현재 선택 상태: ' + (radioRef.current?.getValue() ? '선택됨' : '선택 안됨'));
  };
  
  const handleSelect = () => {
    radioRef.current?.setValue();
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
                <td>getValue()</td>
                <td>현재 선택 상태를 boolean 값으로 반환합니다.</td>
                <td>
                  <code>const isChecked = radioRef.current?.getValue()</code>
                </td>
              </tr>
              <tr>
                <td>setValue()</td>
                <td>라디오 버튼을 선택합니다.</td>
                <td>
                  <code>radioRef.current?.setValue()</code>
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
          <Radio.Group
            ref={radioGroupRef}
            value={groupValue}
            setValue={setGroupValue}
            options={[
              { value: 'option1', label: '옵션 1' },
              { value: 'option2', label: '옵션 2' },
              { value: 'option3', label: '옵션 3' },
            ]}
          />
          <div style={{ marginTop: '10px' }}>
            <p className={styles.txt}>선택된 값: {groupValue}</p>
          </div>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              gap: '5px',
              flexWrap: 'wrap',
            }}
          >
            <Button size="sm" onClick={handleGetValue}>
              현재 값 가져오기 (getValue)
            </Button>
            <Button size="sm" onClick={() => handleSetValue('option2')}>
              '옵션 2'로 설정 (setValue)
            </Button>
            <Button size="sm" onClick={() => handleSetValue('option3')}>
              '옵션 3'으로 설정 (setValue)
            </Button>
          </div>

          <h3 className={styles['sub-title']}>참조 소스코드</h3>
          <CodeHighlight
            code={`// RadioGroupHandle 타입 가져오기
import { useRef, useState } from 'react';
import { Radio } from '@/components/common';
import type { RadioGroupHandle } from '@/components/common/Radio';

// 참조 및 상태 생성
const radioGroupRef = useRef<RadioGroupHandle>(null);
const [groupValue, setGroupValue] = useState('option1');

// 메서드 호출 함수
const handleGetValue = () => {
  const value = radioGroupRef.current?.getValue();
  alert(\`현재 선택된 값: \${value}\`);
};

const handleSetValue = (value: string) => {
  radioGroupRef.current?.setValue(value);
};

// JSX 렌더링 - setValue 사용
<Radio.Group
  ref={radioGroupRef}
  value={groupValue}
  setValue={setGroupValue} // onChange 대신 useState의 setter 함수를 직접 전달
  options={[
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3' },
  ]}
/>

<div>
  <button onClick={handleGetValue}>
    현재 값 가져오기 (getValue)
  </button>
  <button onClick={() => handleSetValue('option2')}>
    '옵션 2'로 설정 (setValue)
  </button>
</div>`}
            language="typescript"
          />

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
              <tr>
                <td>getValue()</td>
                <td>현재 선택된 라디오 버튼의 값을 가져옵니다.</td>
                <td>
                  <code>const value = groupRef.current?.getValue()</code>
                </td>
              </tr>
              <tr>
                <td>setValue(value: string | number)</td>
                <td>
                  특정 값을 가진 라디오 버튼을 프로그래밍 방식으로 선택합니다.
                  onChange 콜백이 있는 경우 해당 함수도 호출됩니다.
                </td>
                <td>
                  <code>groupRef.current?.setValue('option2')</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>getValue/setValue 활용 예제</h2>
        <p className={styles.txt}>
          RadioGroup의 getValue와 setValue 메서드는 다양한 상황에서 유용하게
          활용할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <h3 className={styles['sub-title']}>폼 초기화</h3>
          <CodeHighlight
            code={`// 여러 개의 RadioGroup을 가진 양식을 초기화하는 예제
function resetForm() {
  fruitRadioRef.current?.setValue('apple');
  colorRadioRef.current?.setValue('red');
  sizeRadioRef.current?.setValue('medium');
}`}
            language="typescript"
          />

          <h3 className={styles['sub-title']}>변경 전에 현재 값 저장</h3>
          <CodeHighlight
            code={`// 값을 변경하기 전에 현재 값을 저장하고, 필요할 때 복원하는 예제
function handleTemporaryChange() {
  // 현재 값 저장
  const previousValue = radioGroupRef.current?.getValue();
  
  // 새 값으로 변경
  radioGroupRef.current?.setValue('option3');
  
  // 5초 후 이전 값으로 복원
  setTimeout(() => {
    if (previousValue) {
      radioGroupRef.current?.setValue(previousValue);
    }
  }, 5000);
}`}
            language="typescript"
          />

          <h3 className={styles['sub-title']}>조건부 라디오 버튼 선택</h3>
          <CodeHighlight
            code={`// 조건에 따라 특정 라디오 버튼 선택
function selectBasedOnCondition(userRole: string) {
  if (userRole === 'admin') {
    roleRadioRef.current?.setValue('fullAccess');
  } else if (userRole === 'editor') {
    roleRadioRef.current?.setValue('editAccess');
  } else {
    roleRadioRef.current?.setValue('readAccess');
  }
}`}
            language="typescript"
          />

          <h3 className={styles['sub-title']}>값 검증</h3>
          <CodeHighlight
            code={`// 폼 제출 전 라디오 값 검증
function validateForm() {
  const selectedOption = radioGroupRef.current?.getValue();
  
  if (!selectedOption) {
    alert('선택해야 합니다!');
    return false;
  }
  
  // 특정 값에 따른 추가 검증
  if (selectedOption === 'custom' && customOptionTextRef.current?.value === '') {
    alert('커스텀 옵션을 설명해주세요!');
    return false;
  }
  
  return true;
}`}
            language="typescript"
          />
        </div>
      </section>
    </div>
  );
};

export default RadioGuide;
