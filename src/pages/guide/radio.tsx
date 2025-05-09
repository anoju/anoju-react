// src/pages/guide/radio.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Radio } from '@/components/common';
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
  const [selectedFruit, setSelectedFruit] = useState<string>('apple');
  const [selectedColor, setSelectedColor] = useState<string>('blue');

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
const [selectedFruit, setSelectedFruit] = useState<string>('apple');
const [selectedColor, setSelectedColor] = useState<string>('blue');

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
    </div>
  );
};

export default RadioGuide;
