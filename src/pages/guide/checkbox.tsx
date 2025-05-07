// src/pages/guide/checkbox.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Checkbox } from '@/components/common';
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

  // Individual checkbox states
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(true);

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
            <Checkbox
              value="checkbox1"
              checked={isChecked1}
              onChange={(e) => setIsChecked1(e.target.checked)}
            >
              기본 체크박스
            </Checkbox>

            <Checkbox
              value="checkbox2"
              checked={isChecked2}
              onChange={(e) => setIsChecked2(e.target.checked)}
              className="custom-checkbox"
              inputClassName="custom-input"
              iconClassName="custom-icon"
              labelClassName="custom-label"
            >
              커스텀 클래스 적용하고 싶을때
            </Checkbox>

            <Checkbox value="checkbox3" checked={true} disabled={true}>
              checked+disabled
            </Checkbox>

            <Checkbox value="checkbox4" checked={false} disabled={true}>
              disabled
            </Checkbox>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 기본 체크박스
<Checkbox
  value="checkbox1"
  checked={isChecked1}
  onChange={(e) => setIsChecked1(e.target.checked)}
>
  기본 체크박스
</Checkbox>

// 커스텀 클래스 적용하고 싶을때
<Checkbox
  value="checkbox2"
  checked={isChecked2}
  onChange={(e) => setIsChecked2(e.target.checked)}
  className="custom-checkbox"
  inputClassName="custom-input"
  iconClassName="custom-icon"
  labelClassName="custom-label"
>
  커스텀 클래스 적용하고 싶을때
</Checkbox>

// 비활성화된 체크박스
<Checkbox value="checkbox3" checked={true} disabled={true}>
  checked+disabled
</Checkbox>

<Checkbox value="checkbox4" checked={false} disabled={true}>
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
/>`}
          language="typescript"
        />
      </section>
    </div>
  );
};

export default CheckboxGuide;
