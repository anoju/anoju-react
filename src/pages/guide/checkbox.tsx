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
  const [selectedValues, setSelectedValues] = useState<
    (string | number | boolean)[]
  >(['option1', 'option3']);
  const [selectedFruits, setSelectedFruits] = useState<
    (string | number | boolean)[]
  >(['apple', 'banana']);
  const [selectedColors, setSelectedColors] = useState<
    (string | number | boolean)[]
  >(['red']);

  const [booleanValues, setBooleanValues] = useState<
    (string | number | boolean)[]
  >([false, true, false]);

  // 체크박스에 대한 참조 생성
  const checkboxRef = useRef<CheckboxHandle>(null);

  // 버튼 클릭 핸들러
  const handleFocus = () => {
    checkboxRef.current?.focus();
  };

  const handleBlur = () => {
    checkboxRef.current?.blur();
  };

  const handleGetValue = () => {
    alert(
      '현재 체크 상태: ' +
        (checkboxRef.current?.getValue() ? '체크됨' : '체크 안됨')
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
        <h2 className={styles['section-title']}>defaultChecked 속성</h2>
        <p className={styles.txt}>
          defaultChecked 속성을 사용하여 체크박스의 초기 체크 상태를 설정할 수
          있습니다. 이는 uncontrolled 컴포넌트로 동작하며, 내부적으로 상태를
          관리합니다.
        </p>
        <div className="check-wrap">
          <Checkbox defaultChecked>기본적으로 체크된 상태</Checkbox>
          <Checkbox defaultChecked={false}>
            기본적으로 체크되지 않은 상태
          </Checkbox>
          <Checkbox>defaultChecked가 없는 경우 (기본값: false)</Checkbox>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Checkbox defaultChecked>기본적으로 체크된 상태</Checkbox>
<Checkbox defaultChecked={false}>기본적으로 체크되지 않은 상태</Checkbox>
<Checkbox>defaultChecked가 없는 경우 (기본값: false)</Checkbox>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Checkbox.Group 사용법</h2>
        <div className={styles.showcase}>
          <Checkbox.Group value={selectedValues} setValue={setSelectedValues}>
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
const [selectedValues, setSelectedValues] = useState<(string | number | boolean)[]>(['option1', 'option3']);

// JSX
<Checkbox.Group
  value={selectedValues}
  setValue={setSelectedValues}
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
        <h2 className={styles['section-title']}>
          Checkbox.Group defaultValue 속성
        </h2>
        <p className={styles.txt}>
          Checkbox.Group에서 defaultValue 속성을 사용하여 초기 선택된 값들을
          설정할 수 있습니다. 이는 uncontrolled 컴포넌트로 동작하며, 내부적으로
          상태를 관리합니다.
        </p>

        <div className={styles.showcase}>
          <h4 className={styles['sub-title']}>문자열 배열로 기본값 설정</h4>
          <Checkbox.Group
            options={['apple', 'orange', 'banana', 'grape']}
            defaultValue={['apple', 'banana']}
            className="grid"
          />

          <h4 className={styles['sub-title']}>객체 배열로 기본값 설정</h4>
          <Checkbox.Group
            options={[
              { value: 'red', label: '빨간색' },
              { value: 'blue', label: '파란색' },
              { value: 'green', label: '초록색' },
              { value: 'yellow', label: '노란색' },
            ]}
            defaultValue={['red', 'green']}
            className="grid"
          />

          <h4 className={styles['sub-title']}>Boolean 배열로 기본값 설정</h4>
          <Checkbox.Group defaultValue={[false, true, true]}>
            <Checkbox>체크박스 1</Checkbox>
            <Checkbox>체크박스 2 (기본 선택)</Checkbox>
            <Checkbox>체크박스 3 (기본 선택)</Checkbox>
          </Checkbox.Group>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 문자열 배열로 기본값 설정
<Checkbox.Group
  options={['apple', 'orange', 'banana', 'grape']}
  defaultValue={['apple', 'banana']}
/>

// 객체 배열로 기본값 설정
<Checkbox.Group
  options={[
    { value: 'red', label: '빨간색' },
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'yellow', label: '노란색' },
  ]}
  defaultValue={['red', 'green']}
/>

// Boolean 배열로 기본값 설정
<Checkbox.Group defaultValue={[false, true, true]}>
  <Checkbox>체크박스 1</Checkbox>
  <Checkbox>체크박스 2 (기본 선택)</Checkbox>
  <Checkbox>체크박스 3 (기본 선택)</Checkbox>
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
            value={selectedFruits}
            setValue={setSelectedFruits}
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
            value={selectedColors}
            setValue={setSelectedColors}
            className="grid"
          />
          <p className={styles.txt}>선택된 색상: {selectedColors.join(', ')}</p>

          <hr />
          <h4 className={styles['sub-title']}>
            Value 속성 없는 그룹 (Boolean 배열)
          </h4>
          <Checkbox.Group value={booleanValues} setValue={setBooleanValues}>
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
  value={selectedFruits}
  setValue={setSelectedFruits}
/>

// 객체 배열 (value/label)
<Checkbox.Group
  options={[
    { value: 'red', label: '빨간색' },
    { value: 'blue', label: '파란색' },
    { value: 'green', label: '초록색' },
    { value: 'yellow', label: '노란색' }
  ]}
  value={selectedColors}
  setValue={setSelectedColors}
/>

// Boolean 배열 상태 정의
const [booleanValues, setBooleanValues] = useState<(string | number | boolean)[]>([false, true, false]);

// Value 속성 없는 그룹 (Boolean 배열 모드)
<Checkbox.Group value={booleanValues} setValue={setBooleanValues}>
  <Checkbox>체크박스 1</Checkbox>
  <Checkbox>체크박스 2</Checkbox>
  <Checkbox>체크박스 3</Checkbox>
</Checkbox.Group>`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>
          Status 속성 (유효성 검사 피드백)
        </h2>
        <p className={styles.txt}>
          status 속성을 사용하여 입력 필드의 유효성 검사 상태를 시각적으로
          표시할 수 있습니다. error는 빨간색, warning은 주황색으로 테두리가
          변경됩니다.
        </p>

        <div className={styles.showcase + ' inline'}>
          <Checkbox>정상 상태 (기본)</Checkbox>
          <Checkbox status="success">성공 상태</Checkbox>
          <Checkbox status="error">에러 상태</Checkbox>
          <Checkbox status="warning">경고 상태</Checkbox>
          <Checkbox isBtn>정상 상태 (기본)</Checkbox>
          <Checkbox isBtn status="success">
            성공 상태
          </Checkbox>
          <Checkbox isBtn status="error">
            에러 상태
          </Checkbox>
          <Checkbox isBtn status="warning">
            경고 상태
          </Checkbox>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Checkbox>정상 상태 (기본)</Checkbox>
<Checkbox status="success">성공 상태</Checkbox>
<Checkbox status="error">에러 상태</Checkbox>
<Checkbox status="warning">경고 상태</Checkbox>`}
          language="jsx"
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
            value={selectedFruits}
            setValue={setSelectedFruits}
          />
        </div>
        <CodeHighlight
          code={`// 단독일때
<Checkbox leftLabel>체크박스</Checkbox>

//그룹일때
<Checkbox.Group
  leftLabel
  options={['apple', 'orange', 'banana', 'grape']}
  value={selectedFruits}
  setValue={setSelectedFruits}
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
            value={selectedFruits}
            setValue={setSelectedFruits}
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
  value={selectedFruits}
  setValue={setSelectedFruits}
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
            value={selectedFruits}
            setValue={setSelectedFruits}
          />
        </div>
        <CodeHighlight
          code={`// 단독일때
<Checkbox isSwitch>체크박스</Checkbox>

//그룹일때
<Checkbox.Group
  isSwitch
  options={['apple', 'orange', 'banana', 'grape']}
  value={selectedFruits}
  setValue={setSelectedFruits}
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
            <Button className="line" size="sm" onClick={handleGetValue}>
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
  
  const handleGetValue = () => {
    alert('현재 체크 상태: ' + (checkboxRef.current?.getValue() ? '체크됨' : '체크 안됨'));
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
        <button onClick={handleGetValue}>상태 확인</button>
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
        <h2 className={styles['section-title']}>Checkbox Props</h2>
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
                <td>체크박스의 값 (Group에서 사용)</td>
              </tr>
              <tr>
                <td>checked</td>
                <td>boolean</td>
                <td>-</td>
                <td>체크 상태 (controlled 컴포넌트용)</td>
              </tr>
              <tr>
                <td>defaultChecked</td>
                <td>boolean</td>
                <td>false</td>
                <td>초기 체크 상태 (uncontrolled 컴포넌트용)</td>
              </tr>
              <tr>
                <td>indeterminate</td>
                <td>boolean</td>
                <td>false</td>
                <td>불확실한 상태 (부분 선택 표시)</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>비활성화 여부</td>
              </tr>
              <tr>
                <td>children</td>
                <td>ReactNode</td>
                <td>-</td>
                <td>라벨 텍스트 또는 컨텐츠</td>
              </tr>
              <tr>
                <td>className</td>
                <td>string</td>
                <td>''</td>
                <td>컴포넌트에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>inputClassName</td>
                <td>string</td>
                <td>''</td>
                <td>input 요소에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>iconClassName</td>
                <td>string</td>
                <td>''</td>
                <td>아이콘 요소에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>labelClassName</td>
                <td>string</td>
                <td>''</td>
                <td>라벨 요소에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>onChange</td>
                <td>function</td>
                <td>-</td>
                <td>체크 상태 변경 시 호출되는 함수</td>
              </tr>
              <tr>
                <td>setValue</td>
                <td>function</td>
                <td>-</td>
                <td>체크 상태를 직접 설정하는 함수</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Checkbox.Group Props</h2>
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
                <td>options</td>
                <td>Array</td>
                <td>-</td>
                <td>체크박스 옵션 배열 (문자열 배열 또는 객체 배열)</td>
              </tr>
              <tr>
                <td>value</td>
                <td>T[]</td>
                <td>-</td>
                <td>선택된 값들 (controlled 컴포넌트용)</td>
              </tr>
              <tr>
                <td>defaultValue</td>
                <td>T[]</td>
                <td>[]</td>
                <td>초기 선택된 값들 (uncontrolled 컴포넌트용)</td>
              </tr>
              <tr>
                <td>onChange</td>
                <td>function</td>
                <td>-</td>
                <td>선택된 값들이 변경될 때 호출되는 함수</td>
              </tr>
              <tr>
                <td>setValue</td>
                <td>function</td>
                <td>-</td>
                <td>선택된 값들을 직접 설정하는 함수</td>
              </tr>
              <tr>
                <td>name</td>
                <td>string</td>
                <td>-</td>
                <td>그룹 내 모든 체크박스의 name 속성</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>그룹 내 모든 체크박스 비활성화 여부</td>
              </tr>
              <tr>
                <td>className</td>
                <td>string</td>
                <td>''</td>
                <td>그룹 컨테이너에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>inputClassName</td>
                <td>string</td>
                <td>''</td>
                <td>그룹 내 모든 input 요소에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>iconClassName</td>
                <td>string</td>
                <td>''</td>
                <td>그룹 내 모든 아이콘 요소에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>labelClassName</td>
                <td>string</td>
                <td>''</td>
                <td>그룹 내 모든 라벨 요소에 적용할 추가 클래스명</td>
              </tr>
              <tr>
                <td>children</td>
                <td>ReactNode</td>
                <td>-</td>
                <td>Checkbox 컴포넌트들 (options 대신 사용)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Checkbox 메서드</h2>
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
                <td>getValue()</td>
                <td>현재 체크 상태를 boolean 값으로 반환합니다.</td>
                <td>
                  <code>const getValue = checkboxRef.current?.getValue()</code>
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
                  <code>const value = groupRef.current?.getValue()</code>
                </td>
              </tr>
              <tr>
                <td>setValue(value: CheckboxValue[])</td>
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
