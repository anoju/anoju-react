// src/pages/guide/checkbox.tsx
import { useState, useRef } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  Button,
  CodeHighlight,
  Checkbox,
  CheckboxHandle,
} from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const CheckboxGuide = () => {
  usePageLayout({
    title: '체크박스 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // Group checkbox states
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([
    'option1',
    'option3',
  ]);
  const [selectedFruits, setSelectedFruits] = useState<string[]>([
    'apple',
    'banana',
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>(['red']);

  const [booleanValues, setBooleanValues] = useState<boolean[]>([
    false,
    true,
    false,
  ]);

  // 체크박스에 대한 참조 생성
  const checkboxRef = useRef<CheckboxHandle>(null);

  // 버튼 클릭 핸들러
  const handleFocus = () => {
    checkboxRef.current?.focus();
  };

  const handleBlur = () => {
    checkboxRef.current?.blur();
  };

  const handleIsChecked = () => {
    alert(
      '현재 체크 상태: ' +
        (checkboxRef.current?.isChecked() ? '체크됨' : '체크 안됨')
    );
  };

  const handleSetValue = (value: boolean) => {
    checkboxRef.current?.setValue(value);
  };

  const handleToggle = () => {
    checkboxRef.current?.toggle();
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Checkbox Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Checkbox } from '@/components/common';
// 또는 CheckboxGroup도 사용할 경우
import { Checkbox, CheckboxGroup } from '@/components/common';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <div className={styles.showcase}>
          <div className="check-wrap">
            <Checkbox>기본 체크박스</Checkbox>

            <Checkbox />

            <Checkbox
              className="custom-checkbox"
              inputClassName="custom-input"
              iconClassName="custom-icon"
              labelClassName="custom-label"
            >
              커스텀 클래스 적용하고 싶을때
            </Checkbox>

            <Checkbox checked={true} disabled={true}>
              checked+disabled
            </Checkbox>

            <Checkbox checked={false} disabled={true}>
              disabled
            </Checkbox>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 기본 체크박스
<Checkbox>기본 체크박스</Checkbox>

// 체크박스만 사용시
<Checkbox />

// 커스텀 클래스 적용하고 싶을때
<Checkbox
  className="custom-checkbox"
  inputClassName="custom-input"
  iconClassName="custom-icon"
  labelClassName="custom-label"
>
  커스텀 클래스 적용하고 싶을때
</Checkbox>

// 비활성화된 체크박스
<Checkbox checked={true} disabled={true}>
  checked+disabled
</Checkbox>

<Checkbox checked={false} disabled={true}>
  disabled
</Checkbox>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Checkbox.Group 사용법</h2>
        <div className={styles.showcase}>
          <Checkbox.Group values={selectedValues} onChange={setSelectedValues}>
            <Checkbox value="option1">옵션 1</Checkbox>
            <Checkbox value="option2">옵션 2</Checkbox>
            <Checkbox value="option3">옵션 3</Checkbox>
            <Checkbox value="option4">옵션 4</Checkbox>
          </Checkbox.Group>
          <hr />
          <p className={styles.txt}>선택된 값: {selectedValues.join(', ')}</p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// State 정의
const [selectedValues, setSelectedValues] = useState<(string | number)[]>(['option1', 'option3']);

// JSX
<Checkbox.Group
  values={selectedValues}
  onChange={setSelectedValues}
>
  <Checkbox value="option1">옵션 1</Checkbox>
  <Checkbox value="option2">옵션 2</Checkbox>
  <Checkbox value="option3">옵션 3</Checkbox>
  <Checkbox value="option4">옵션 4</Checkbox>
</Checkbox.Group>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>options 배열 사용</h2>
        <div className={styles.showcase}>
          <h4 className={styles['sub-title']}>문자열 배열</h4>
          <Checkbox.Group
            options={['apple', 'orange', 'banana', 'grape']}
            values={selectedFruits}
            onChange={setSelectedFruits}
            className="grid"
          />
          <p className={styles.txt}>선택된 과일: {selectedFruits.join(', ')}</p>
          <hr />
          <h4 className={styles['sub-title']}>객체 배열 (value/label)</h4>
          <Checkbox.Group
            options={[
              { value: 'red', label: '빨간색' },
              { value: 'blue', label: '파란색' },
              { value: 'green', label: '초록색' },
              { value: 'yellow', label: '노란색' },
            ]}
            values={selectedColors}
            onChange={setSelectedColors}
            className="grid"
          />
          <p className={styles.txt}>선택된 색상: {selectedColors.join(', ')}</p>

          <hr />
          <h4 className={styles['sub-title']}>
            Value 속성 없는 그룹 (Boolean 배열)
          </h4>
          <Checkbox.Group values={booleanValues} onChange={setBooleanValues}>
            <Checkbox>체크박스 1</Checkbox>
            <Checkbox>체크박스 2</Checkbox>
            <Checkbox>체크박스 3</Checkbox>
          </Checkbox.Group>
          <p className={styles.txt}>
            Boolean 배열 상태:
            {booleanValues.map((v) => (v ? 'true' : 'false')).join(', ')}
          </p>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 문자열 배열
<Checkbox.Group
  options={['apple', 'orange', 'banana', 'grape']}
  values={selectedFruits}
  onChange={setSelectedFruits}
/>

// 객체 배열 (value/label)
<Checkbox.Group
  options={[
    { value: 'red', label: '빨간색' },
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'yellow', label: '노란색' }
  ]}
  values={selectedColors}
  onChange={setSelectedColors}
/>

// Boolean 배열 상태 정의
const [booleanValues, setBooleanValues] = useState<boolean[]>([false, true, false]);

// Value 속성 없는 그룹 (Boolean 배열 모드)
<Checkbox.Group values={booleanValues} onChange={setBooleanValues}>
  <Checkbox>체크박스 1</Checkbox>
  <Checkbox>체크박스 2</Checkbox>
  <Checkbox>체크박스 3</Checkbox>
</Checkbox.Group>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>스타일 적용</h2>
        <h3 className={styles['sub-title']}>체크박스 우측배치</h3>
        <p className={styles.txt}>leftLabel 옵션 true</p>
        <div className={styles.showcase}>
          <Checkbox leftLabel>체크박스</Checkbox>
          <br />
          <br />
          <Checkbox.Group
            leftLabel
            options={['apple', 'orange', 'banana', 'grape']}
            values={selectedFruits}
            onChange={setSelectedFruits}
          />
        </div>
        <CodeHighlight
          code={`// 단독일때
<Checkbox leftLabel>체크박스</Checkbox>

//그룹일때
<Checkbox.Group
  leftLabel
  options={['apple', 'orange', 'banana', 'grape']}
  values={selectedFruits}
  onChange={setSelectedFruits}
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
          <Checkbox isBtn>체크박스</Checkbox>
          <br />
          <br />
          <Checkbox.Group
            className="grid"
            isBtn
            options={['apple', 'orange', 'banana', 'grape']}
            values={selectedFruits}
            onChange={setSelectedFruits}
          />
        </div>
        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 단독일때
<Checkbox isBtn>체크박스</Checkbox>

//그룹일때
<Checkbox.Group
  isBtn
  options={['apple', 'orange', 'banana', 'grape']}
  values={selectedFruits}
  onChange={setSelectedFruits}
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
          <Checkbox isSwitch>체크박스</Checkbox>
          <br />
          <br />
          <Checkbox.Group
            isSwitch
            options={['apple', 'orange', 'banana', 'grape']}
            values={selectedFruits}
            onChange={setSelectedFruits}
          />
        </div>
        <CodeHighlight
          code={`// 단독일때
<Checkbox isSwitch>체크박스</Checkbox>

//그룹일때
<Checkbox.Group
  isSwitch
  options={['apple', 'orange', 'banana', 'grape']}
  values={selectedFruits}
  onChange={setSelectedFruits}
/>
`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>외부에서 메서드 호출하기</h2>
        <p className={styles.txt}>
          useRef와 ref 속성을 사용하여 체크박스의 메서드를 직접 호출할 수
          있습니다.
        </p>
        <div className={styles.showcase}>
          <Checkbox ref={checkboxRef}>메서드를 호출할 체크박스</Checkbox>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              gap: '5px',
              flexWrap: 'wrap',
            }}
          >
            <Button className="line" size="sm" onClick={handleFocus}>
              포커스
            </Button>
            <Button className="line" size="sm" onClick={handleBlur}>
              블러
            </Button>
            <Button className="line" size="sm" onClick={handleIsChecked}>
              상태 확인
            </Button>
            <Button
              className="line"
              size="sm"
              onClick={() => handleSetValue(true)}
            >
              체크하기
            </Button>
            <Button
              className="line"
              size="sm"
              onClick={() => handleSetValue(false)}
            >
              체크 해제
            </Button>
            <Button className="line" size="sm" onClick={handleToggle}>
              토글
            </Button>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 메서드 호출 예시 컴포넌트
import { useRef } from 'react';
import { Checkbox, CheckboxHandle } from '@/components/common';

const MyCheckboxWithRef = () => {
  // 체크박스에 대한 참조 생성
  const checkboxRef = useRef<CheckboxHandle>(null);
  
  // 버튼 클릭 핸들러
  const handleFocus = () => {
    checkboxRef.current?.focus();
  };
  
  const handleBlur = () => {
    checkboxRef.current?.blur();
  };
  
  const handleIsChecked = () => {
    alert('현재 체크 상태: ' + (checkboxRef.current?.isChecked() ? '체크됨' : '체크 안됨'));
  };
  
  const handleSetValue = (value: boolean) => {
    checkboxRef.current?.setValue(value);
  };
  
  const handleToggle = () => {
    checkboxRef.current?.toggle();
  };
  
  return (
    <div>
      <Checkbox ref={checkboxRef}>메서드를 호출할 체크박스</Checkbox>
      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
        <button onClick={handleFocus}>포커스</button>
        <button onClick={handleBlur}>블러</button>
        <button onClick={handleIsChecked}>상태 확인</button>
        <button onClick={() => handleSetValue(true)}>체크하기</button>
        <button onClick={() => handleSetValue(false)}>체크 해제</button>
        <button onClick={handleToggle}>토글</button>
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
                <td>체크박스에 포커스를 줍니다.</td>
                <td>
                  <code>checkboxRef.current?.focus()</code>
                </td>
              </tr>
              <tr>
                <td>blur()</td>
                <td>체크박스에서 포커스를 제거합니다.</td>
                <td>
                  <code>checkboxRef.current?.blur()</code>
                </td>
              </tr>
              <tr>
                <td>isChecked()</td>
                <td>현재 체크 상태를 boolean 값으로 반환합니다.</td>
                <td>
                  <code>
                    const isChecked = checkboxRef.current?.isChecked()
                  </code>
                </td>
              </tr>
              <tr>
                <td>setValue(checked: boolean)</td>
                <td>체크 상태를 설정합니다.</td>
                <td>
                  <code>checkboxRef.current?.setValue(true)</code>
                </td>
              </tr>
              <tr>
                <td>toggle()</td>
                <td>현재 체크 상태를 반대로 전환합니다.</td>
                <td>
                  <code>checkboxRef.current?.toggle()</code>
                </td>
              </tr>
              <tr>
                <td>getRootElement()</td>
                <td>체크박스 컴포넌트의 루트 DOM 요소를 반환합니다.</td>
                <td>
                  <code>
                    const rootElement = checkboxRef.current?.getRootElement()
                  </code>
                </td>
              </tr>
              <tr>
                <td>getInputElement()</td>
                <td>체크박스의 input DOM 요소를 반환합니다.</td>
                <td>
                  <code>
                    const inputElement = checkboxRef.current?.getInputElement()
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>CheckboxGroup 메서드</h2>
        <p className={styles.txt}>
          Checkbox.Group 컴포넌트도 메서드를 제공합니다. 그룹 단위로 모든
          체크박스를 제어할 수 있습니다.
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
                  지정된 인덱스의 체크박스에 포커스를 줍니다. 인덱스를 지정하지
                  않으면 첫 번째 활성화된 체크박스에 포커스를 줍니다.
                </td>
                <td>
                  <code>groupRef.current?.focus(1)</code>
                </td>
              </tr>
              <tr>
                <td>blur(index?: number)</td>
                <td>
                  지정된 인덱스의 체크박스에서 포커스를 제거합니다. 인덱스를
                  지정하지 않으면 현재 포커스된 체크박스에서 포커스를
                  제거합니다.
                </td>
                <td>
                  <code>groupRef.current?.blur()</code>
                </td>
              </tr>
              <tr>
                <td>getValue()</td>
                <td>현재 선택된 모든 값의 배열을 반환합니다.</td>
                <td>
                  <code>const values = groupRef.current?.getValue()</code>
                </td>
              </tr>
              <tr>
                <td>setValue(values: CheckboxValue[])</td>
                <td>체크박스 그룹의 값을 설정합니다.</td>
                <td>
                  <code>
                    groupRef.current?.setValue(['option1', 'option3'])
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CheckboxGuide;
