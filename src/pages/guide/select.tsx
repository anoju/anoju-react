// src/pages/guide/select.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Select } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const SelectGuide = () => {
  usePageLayout({
    title: '셀렉트 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // 상태 관리
  const [basicValue, setBasicValue] = useState('apple');
  const [sizeValue, setSizeValue] = useState('medium');
  const [statusValue, setStatusValue] = useState('');
  const [externalValue, setExternalValue] = useState('2');
  const [open, setOpen] = useState<boolean>(false);
  const [selectedColors, setSelectedColors] = useState(['red', 'blue']);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Select Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Select } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <p className={styles.txt}>
          기본적인 Select 컴포넌트 사용 방법입니다. option은 단순한
          문자열/숫자나 {'{value, label}'} 형태의 객체를 제공할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>문자열 옵션</h3>
              <Select
                options={['apple', 'banana', 'orange', 'pear', 'grape']}
                value={basicValue}
                onChange={setBasicValue}
                placeholder="과일을 선택하세요"
              />
              <p className={styles.txt}>선택된 값: {basicValue}</p>
            </div>

            <div>
              <h3 className={styles['sub-title']}>객체 옵션</h3>
              <Select
                options={[
                  { value: 'apple', label: '사과 🍎' },
                  { value: 'banana', label: '바나나 🍌' },
                  { value: 'orange', label: '오렌지 🍊' },
                  { value: 'pear', label: '배 🍐' },
                  { value: 'grape', label: '포도 🍇' },
                ]}
                value={basicValue}
                onChange={setBasicValue}
                placeholder="과일을 선택하세요"
              />
              <p className={styles.txt}>선택된 값: {basicValue}</p>
            </div>

            <div>
              <h3 className={styles['sub-title']}>비활성화된 항목</h3>
              <Select
                options={[
                  { value: 'apple', label: '사과 🍎' },
                  { value: 'banana', label: '바나나 🍌', disabled: true },
                  { value: 'orange', label: '오렌지 🍊' },
                  { value: 'pear', label: '배 🍐', disabled: true },
                  { value: 'grape', label: '포도 🍇' },
                ]}
                defaultValue="orange"
                placeholder="과일을 선택하세요"
              />
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태 정의
const [basicValue, setBasicValue] = useState<string>('apple');

// 문자열 옵션 사용
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  value={basicValue}
  onChange={setBasicValue}
  placeholder="과일을 선택하세요"
/>

// 객체 옵션 사용
<Select
  options={[
    { value: 'apple', label: '사과 🍎' },
    { value: 'banana', label: '바나나 🍌' },
    { value: 'orange', label: '오렌지 🍊' },
    { value: 'pear', label: '배 🍐' },
    { value: 'grape', label: '포도 🍇' },
  ]}
  value={basicValue}
  onChange={setBasicValue}
  placeholder="과일을 선택하세요"
/>

// 비활성화된 항목이 있는 셀렉트
<Select
  options={[
    { value: 'apple', label: '사과 🍎' },
    { value: 'banana', label: '바나나 🍌', disabled: true },
    { value: 'orange', label: '오렌지 🍊' },
    { value: 'pear', label: '배 🍐', disabled: true },
    { value: 'grape', label: '포도 🍇' },
  ]}
  defaultValue="orange"
  placeholder="과일을 선택하세요"
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>크기 조절</h2>
        <p className={styles.txt}>
          size 속성을 통해 크기를 조절할 수 있습니다. 'small', 'medium', 'lg' 세
          가지 옵션이 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>크기 옵션</h3>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  margin: '10px 0',
                  alignItems: 'center',
                }}
              >
                <Select
                  options={[
                    { value: 'xs', label: '더작게' },
                    { value: 'sm', label: '작게' },
                    { value: '', label: '기본' },
                    { value: 'lg', label: '크게' },
                    { value: 'xl', label: '더크게' },
                  ]}
                  value={sizeValue}
                  onChange={setSizeValue}
                  size={sizeValue as 'xs' | 'sm' | '' | 'lg' | 'xl'}
                  placeholder="크기를 선택하세요"
                />

                <Button
                  className={sizeValue === 'xs' ? 'primary' : 'line'}
                  onClick={() => setSizeValue('xs')}
                  size={sizeValue as 'xs' | 'sm' | '' | 'lg' | 'xl'}
                >
                  xs
                </Button>
                <Button
                  className={sizeValue === 'sm' ? 'primary' : 'line'}
                  onClick={() => setSizeValue('sm')}
                  size={sizeValue as 'xs' | 'sm' | '' | 'lg' | 'xl'}
                >
                  sm
                </Button>
                <Button
                  className={sizeValue === '' ? 'primary' : 'line'}
                  onClick={() => setSizeValue('')}
                  size={sizeValue as 'xs' | 'sm' | '' | 'lg' | 'xl'}
                >
                  기본
                </Button>
                <Button
                  className={sizeValue === 'lg' ? 'primary' : 'line'}
                  onClick={() => setSizeValue('lg')}
                  size={sizeValue as 'xs' | 'sm' | '' | 'lg' | 'xl'}
                >
                  lg
                </Button>
                <Button
                  className={sizeValue === 'xl' ? 'primary' : 'line'}
                  onClick={() => setSizeValue('xl')}
                  size={sizeValue as 'xs' | 'sm' | '' | 'lg' | 'xl'}
                >
                  xl
                </Button>
              </div>

              <div
                style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
              >
                <Select
                  options={['apple', 'banana', 'orange', 'pear', 'grape']}
                  defaultValue="apple"
                  size="xs"
                  style={{ width: '100px' }}
                />

                <Select
                  options={['apple', 'banana', 'orange', 'pear', 'grape']}
                  defaultValue="apple"
                  size="sm"
                  style={{ width: '100px' }}
                />

                <Select
                  options={['apple', 'banana', 'orange', 'pear', 'grape']}
                  defaultValue="banana"
                  style={{ width: '100px' }}
                />

                <Select
                  options={['apple', 'banana', 'orange', 'pear', 'grape']}
                  defaultValue="orange"
                  size="lg"
                  style={{ width: '100px' }}
                />

                <Select
                  options={['apple', 'banana', 'orange', 'pear', 'grape']}
                  defaultValue="orange"
                  size="xl"
                  style={{ width: '100px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// xs
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="apple"
  size="xs"
  style={{ width: '100px' }}
/>

// sm
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="apple"
  size="sm"
  style={{ width: '100px' }}
/>

// lg
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="orange"
  size="lg"
  style={{ width: '100px' }}
/>

// xl
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="orange"
  size="xl"
  style={{ width: '100px' }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>옵션 그룹</h2>
        <p className={styles.txt}>
          options 속성에 그룹화된 옵션을 제공하여 카테고리별로 정리할 수
          있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>옵션 그룹 사용</h3>
              <Select
                options={[
                  {
                    label: '과일',
                    key: 'fruits',
                    options: [
                      { value: 'apple', label: '사과 🍎' },
                      { value: 'banana', label: '바나나 🍌' },
                      { value: 'orange', label: '오렌지 🍊' },
                    ],
                  },
                  {
                    label: '채소',
                    key: 'vegetables',
                    options: [
                      { value: 'carrot', label: '당근 🥕' },
                      { value: 'tomato', label: '토마토 🍅' },
                      { value: 'cucumber', label: '오이 🥒' },
                    ],
                  },
                  {
                    label: '기타',
                    key: 'others',
                    options: [
                      { value: 'bread', label: '빵 🍞' },
                      { value: 'cake', label: '케이크 🍰' },
                    ],
                  },
                ]}
                defaultValue="apple"
                style={{ width: '250px' }}
              />
            </div>

            <div>
              <h3 className={styles['sub-title']}>비활성화된 그룹</h3>
              <Select
                options={[
                  {
                    label: '과일',
                    key: 'fruits',
                    options: [
                      { value: 'apple', label: '사과 🍎' },
                      { value: 'banana', label: '바나나 🍌' },
                      { value: 'orange', label: '오렌지 🍊' },
                    ],
                  },
                  {
                    label: '채소 (비활성화)',
                    key: 'vegetables',
                    disabled: true, // 그룹 전체 비활성화
                    options: [
                      { value: 'carrot', label: '당근 🥕' },
                      { value: 'tomato', label: '토마토 🍅' },
                      { value: 'cucumber', label: '오이 🥒' },
                    ],
                  },
                  {
                    label: '기타',
                    key: 'others',
                    options: [
                      { value: 'bread', label: '빵 🍞' },
                      { value: 'cake', label: '케이크 🍰' },
                    ],
                  },
                ]}
                defaultValue="apple"
                style={{ width: '250px' }}
              />
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 옵션 그룹 사용
<Select
  options={[
    {
      label: '과일',
      key: 'fruits',
      options: [
        { value: 'apple', label: '사과 🍎' },
        { value: 'banana', label: '바나나 🍌' },
        { value: 'orange', label: '오렌지 🍊' },
      ],
    },
    {
      label: '채소',
      key: 'vegetables',
      options: [
        { value: 'carrot', label: '당근 🥕' },
        { value: 'tomato', label: '토마토 🍅' },
        { value: 'cucumber', label: '오이 🥒' },
      ],
    },
    {
      label: '기타',
      key: 'others',
      options: [
        { value: 'bread', label: '빵 🍞' },
        { value: 'cake', label: '케이크 🍰' },
      ],
    },
  ]}
  defaultValue="apple"
  style={{ width: '250px' }}
/>

// 비활성화된 그룹
<Select
  options={[
    {
      label: '과일',
      key: 'fruits',
      options: [
        { value: 'apple', label: '사과 🍎' },
        { value: 'banana', label: '바나나 🍌' },
        { value: 'orange', label: '오렌지 🍊' },
      ],
    },
    {
      label: '채소 (비활성화)',
      key: 'vegetables',
      disabled: true, // 그룹 전체 비활성화
      options: [
        { value: 'carrot', label: '당근 🥕' },
        { value: 'tomato', label: '토마토 🍅' },
        { value: 'cucumber', label: '오이 🥒' },
      ],
    },
    {
      label: '기타',
      key: 'others',
      options: [
        { value: 'bread', label: '빵 🍞' },
        { value: 'cake', label: '케이크 🍰' },
      ],
    },
  ]}
  defaultValue="apple"
  style={{ width: '250px' }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>다중 선택</h2>
        <p className={styles.txt}>
          mode="multiple" 속성을 사용하여 여러 옵션을 선택할 수 있는 다중 선택
          모드를 활성화할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>기본 다중 선택</h3>
              <Select
                mode="multiple"
                options={[
                  { value: 'apple', label: '사과 🍎' },
                  { value: 'banana', label: '바나나 🍌' },
                  { value: 'orange', label: '오렌지 🍊' },
                  { value: 'grape', label: '포도 🍇' },
                  { value: 'peach', label: '복숭아 🍑' },
                ]}
                defaultValue={['apple', 'banana']}
                placeholder="과일을 선택하세요"
                style={{ width: '300px' }}
              />
            </div>

            <div>
              <h3 className={styles['sub-title']}>검색이 포함된 다중 선택</h3>
              <Select
                mode="multiple"
                showSearch={true}
                options={[
                  { value: 'react', label: 'React ⚛️' },
                  { value: 'vue', label: 'Vue 💚' },
                  { value: 'angular', label: 'Angular 🔴' },
                  { value: 'svelte', label: 'Svelte 🧡' },
                  { value: 'ember', label: 'Ember 🔥' },
                  { value: 'backbone', label: 'Backbone 🦴' },
                  { value: 'jquery', label: 'jQuery 💙' },
                  { value: 'node', label: 'Node.js 🟢' },
                ]}
                placeholder="프레임워크 검색 및 선택"
                style={{ width: '300px' }}
              />
            </div>

            <div>
              <h3 className={styles['sub-title']}>구분자 변경</h3>
              <Select
                mode="multiple"
                options={[
                  { value: 'dog', label: '강아지 🐶' },
                  { value: 'cat', label: '고양이 🐱' },
                  { value: 'rabbit', label: '토끼 🐰' },
                  { value: 'hamster', label: '햄스터 🐹' },
                ]}
                defaultValue={['dog', 'cat']}
                placeholder="동물을 선택하세요"
                separator=" | " // 기본값은 ", "
                style={{ width: '300px' }}
              />
              <p className={styles.txt}>
                separator 속성으로 선택된 항목 사이의 구분자를 변경할 수
                있습니다.
              </p>
            </div>

            <div>
              <h3 className={styles['sub-title']}>최대 선택 개수 제한</h3>
              <div>
                <Select
                  mode="multiple"
                  options={[
                    { value: '월', label: '월요일' },
                    { value: '화', label: '화요일' },
                    { value: '수', label: '수요일' },
                    { value: '목', label: '목요일' },
                    { value: '금', label: '금요일' },
                    { value: '토', label: '토요일' },
                    { value: '일', label: '일요일' },
                  ]}
                  defaultValue={['월', '수', '금']}
                  placeholder="요일을 선택하세요"
                  maxCount={3} // 최대 3개까지만 선택 가능
                  style={{ width: '300px' }}
                />
                <p className={styles.txt}>
                  maxCount={3} 속성으로 최대 3개까지만 선택할 수 있습니다.
                </p>
              </div>
            </div>

            <div>
              <h3 className={styles['sub-title']}>외부 상태 제어</h3>
              <div>
                {/* 상태 관리 코드를 추가 */}
                <Select
                  mode="multiple"
                  options={[
                    { value: 'red', label: '빨강 🔴' },
                    { value: 'orange', label: '주황 🟠' },
                    { value: 'yellow', label: '노랑 🟡' },
                    { value: 'green', label: '초록 🟢' },
                    { value: 'blue', label: '파랑 🔵' },
                    { value: 'purple', label: '보라 🟣' },
                  ]}
                  value={selectedColors} // 상태에서 값을 가져옴
                  onChange={(values) => {
                    console.log('선택된 색상:', values);
                    // 실제 사용시 상태 업데이트 함수 호출
                    setSelectedColors(values);
                  }}
                  placeholder="색상을 선택하세요"
                  style={{ width: '300px' }}
                />
                <div style={{ marginTop: '10px' }}>
                  <Button
                    className="line"
                    size="sm"
                    onClick={() => {
                      console.log('모두 선택 버튼 클릭');
                      // 실제 사용시 상태 업데이트 함수 호출
                      setSelectedColors([
                        'red',
                        'orange',
                        'yellow',
                        'green',
                        'blue',
                        'purple',
                      ]);
                    }}
                  >
                    모두 선택
                  </Button>
                  <Button
                    className="line"
                    size="sm"
                    onClick={() => {
                      console.log('선택 초기화 버튼 클릭');
                      // 실제 사용시 상태 업데이트 함수 호출
                      setSelectedColors([]);
                    }}
                    style={{ marginLeft: '8px' }}
                  >
                    선택 초기화
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태 관리 설정
import { useState } from 'react';
const [selectedColors, setSelectedColors] = useState(['red', 'blue']);

// 기본 다중 선택
<Select
  mode="multiple"
  options={[
    { value: 'apple', label: '사과 🍎' },
    { value: 'banana', label: '바나나 🍌' },
    { value: 'orange', label: '오렌지 🍊' },
    { value: 'grape', label: '포도 🍇' },
    { value: 'peach', label: '복숭아 🍑' },
  ]}
  defaultValue={['apple', 'banana']}
  placeholder="과일을 선택하세요"
  style={{ width: '300px' }}
/>

// 검색이 포함된 다중 선택
<Select
  mode="multiple"
  showSearch={true}
  options={[
    { value: 'react', label: 'React ⚛️' },
    { value: 'vue', label: 'Vue 💚' },
    { value: 'angular', label: 'Angular 🔴' },
    { value: 'svelte', label: 'Svelte 🧡' },
    // ... 다른 옵션들
  ]}
  placeholder="프레임워크 검색 및 선택"
  style={{ width: '300px' }}
/>

// 구분자 변경
<Select
  mode="multiple"
  options={[
    { value: 'dog', label: '강아지 🐶' },
    { value: 'cat', label: '고양이 🐱' },
    { value: 'rabbit', label: '토끼 🐰' },
    { value: 'hamster', label: '햄스터 🐹' },
  ]}
  defaultValue={['dog', 'cat']}
  placeholder="동물을 선택하세요"
  separator=" | " // 기본값은 ", "
  style={{ width: '300px' }}
/>

// 최대 선택 개수 제한
<Select
  mode="multiple"
  options={[
    { value: '월', label: '월요일' },
    { value: '화', label: '화요일' },
    { value: '수', label: '수요일' },
    { value: '목', label: '목요일' },
    { value: '금', label: '금요일' },
    { value: '토', label: '토요일' },
    { value: '일', label: '일요일' },
  ]}
  defaultValue={['월', '수', '금']}
  placeholder="요일을 선택하세요"
  maxCount={3} // 최대 3개까지만 선택 가능
  style={{ width: '300px' }}
/>

// 외부 상태 제어
<Select
  mode="multiple"
  options={[
    { value: 'red', label: '빨강 🔴' },
    { value: 'orange', label: '주황 🟠' },
    { value: 'yellow', label: '노랑 🟡' },
    { value: 'green', label: '초록 🟢' },
    { value: 'blue', label: '파랑 🔵' },
    { value: 'purple', label: '보라 🟣' },
  ]}
  value={selectedColors}
  onChange={(values) => {
    console.log('선택된 색상:', values);
    setSelectedColors(values);
  }}
  placeholder="색상을 선택하세요"
  style={{ width: '300px' }}
/>

// 외부 버튼으로 제어
<div style={{ marginTop: '10px' }}>
  <Button
    className="line"
    size="sm"
    onClick={() => {
      setSelectedColors(['red', 'orange', 'yellow', 'green', 'blue', 'purple']);
    }}
  >
    모두 선택
  </Button>
  <Button
    className="line"
    size="sm"
    onClick={() => {
      setSelectedColors([]);
    }}
    style={{ marginLeft: '8px' }}
  >
    선택 초기화
  </Button>
</div>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>검색 기능</h2>
        <p className={styles.txt}>
          showSearch 속성을 true로 설정하여 옵션을 검색할 수 있는 기능을 추가할
          수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>기본 검색</h3>
              <Select
                options={[
                  { value: 'apple', label: '사과 (Apple) 🍎' },
                  { value: 'banana', label: '바나나 (Banana) 🍌' },
                  { value: 'orange', label: '오렌지 (Orange) 🍊' },
                  { value: 'grape', label: '포도 (Grape) 🍇' },
                  { value: 'strawberry', label: '딸기 (Strawberry) 🍓' },
                  { value: 'pineapple', label: '파인애플 (Pineapple) 🍍' },
                  { value: 'watermelon', label: '수박 (Watermelon) 🍉' },
                  { value: 'peach', label: '복숭아 (Peach) 🍑' },
                  { value: 'cherry', label: '체리 (Cherry) 🍒' },
                  { value: 'mango', label: '망고 (Mango) 🥭' },
                ]}
                showSearch={true}
                placeholder="과일을 검색하세요"
                style={{ width: '250px' }}
              />
              <p className={styles.txt}>
                드롭다운을 열고 검색 입력창에 텍스트를 입력해보세요.
              </p>
            </div>

            <div>
              <h3 className={styles['sub-title']}>옵션 그룹과 함께 검색</h3>
              <Select
                options={[
                  {
                    label: '과일',
                    key: 'fruits',
                    options: [
                      { value: 'apple', label: '사과 (Apple) 🍎' },
                      { value: 'banana', label: '바나나 (Banana) 🍌' },
                      { value: 'orange', label: '오렌지 (Orange) 🍊' },
                    ],
                  },
                  {
                    label: '채소',
                    key: 'vegetables',
                    options: [
                      { value: 'carrot', label: '당근 (Carrot) 🥕' },
                      { value: 'tomato', label: '토마토 (Tomato) 🍅' },
                      { value: 'cucumber', label: '오이 (Cucumber) 🥒' },
                    ],
                  },
                ]}
                showSearch={true}
                placeholder="식품을 검색하세요"
                style={{ width: '250px' }}
              />
            </div>

            <div>
              <h3 className={styles['sub-title']}>검색 이벤트 처리</h3>
              <Select
                options={[
                  { value: 'apple', label: '사과 (Apple) 🍎' },
                  { value: 'banana', label: '바나나 (Banana) 🍌' },
                  { value: 'orange', label: '오렌지 (Orange) 🍊' },
                  { value: 'grape', label: '포도 (Grape) 🍇' },
                ]}
                showSearch={true}
                onSearch={(value) => {
                  console.log('검색어:', value);
                  // 필요시 외부 API 호출 등의 추가 작업 가능
                }}
                placeholder="검색 이벤트 발생"
                style={{ width: '250px' }}
              />
              <p className={styles.txt}>
                콘솔에서 검색 이벤트를 확인할 수 있습니다. (개발자 도구 F12)
              </p>
            </div>

            <div>
              <h3 className={styles['sub-title']}>사용자 지정 검색 속성</h3>
              <Select
                options={[
                  {
                    value: 'apple',
                    label: '사과 🍎',
                    searchText: 'apple fruit red',
                  },
                  {
                    value: 'banana',
                    label: '바나나 🍌',
                    searchText: 'banana fruit yellow',
                  },
                  {
                    value: 'orange',
                    label: '오렌지 🍊',
                    searchText: 'orange fruit citrus',
                  },
                  {
                    value: 'grape',
                    label: '포도 🍇',
                    searchText: 'grape fruit purple wine',
                  },
                ]}
                showSearch={true}
                optionFilterProp="searchText" // label 대신 searchText 속성으로 검색
                placeholder="검색어: apple, yellow, citrus, wine"
                style={{ width: '320px' }}
              />
              <p className={styles.txt}>
                optionFilterProp 속성을 사용하여 검색할 속성을 지정할 수
                있습니다.
              </p>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 기본 검색
<Select
  options={[
    { value: 'apple', label: '사과 (Apple) 🍎' },
    { value: 'banana', label: '바나나 (Banana) 🍌' },
    { value: 'orange', label: '오렌지 (Orange) 🍊' },
    { value: 'grape', label: '포도 (Grape) 🍇' },
    // ... 더 많은 옵션들
  ]}
  showSearch={true}
  placeholder="과일을 검색하세요"
  style={{ width: '250px' }}
/>

// 옵션 그룹과 함께 검색
<Select
  options={[
    {
      label: '과일',
      key: 'fruits',
      options: [
        { value: 'apple', label: '사과 (Apple) 🍎' },
        { value: 'banana', label: '바나나 (Banana) 🍌' },
        { value: 'orange', label: '오렌지 (Orange) 🍊' },
      ],
    },
    {
      label: '채소',
      key: 'vegetables',
      options: [
        { value: 'carrot', label: '당근 (Carrot) 🥕' },
        { value: 'tomato', label: '토마토 (Tomato) 🍅' },
        { value: 'cucumber', label: '오이 (Cucumber) 🥒' },
      ],
    },
  ]}
  showSearch={true}
  placeholder="식품을 검색하세요"
  style={{ width: '250px' }}
/>

// 검색 이벤트 처리
<Select
  options={[
    { value: 'apple', label: '사과 (Apple) 🍎' },
    { value: 'banana', label: '바나나 (Banana) 🍌' },
    { value: 'orange', label: '오렌지 (Orange) 🍊' },
    { value: 'grape', label: '포도 (Grape) 🍇' },
  ]}
  showSearch={true}
  onSearch={(value) => {
    console.log('검색어:', value);
    // 필요시 외부 API 호출 등의 추가 작업 가능
  }}
  placeholder="검색 이벤트 발생"
  style={{ width: '250px' }}
/>

// 사용자 지정 검색 속성
<Select
  options={[
    { value: 'apple', label: '사과 🍎', searchText: 'apple fruit red' },
    { value: 'banana', label: '바나나 🍌', searchText: 'banana fruit yellow' },
    { value: 'orange', label: '오렌지 🍊', searchText: 'orange fruit citrus' },
    { value: 'grape', label: '포도 🍇', searchText: 'grape fruit purple wine' },
  ]}
  showSearch={true}
  optionFilterProp="searchText" // label 대신 searchText 속성으로 검색
  placeholder="검색어: apple, yellow, citrus, wine"
  style={{ width: '320px' }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>스크롤 드롭다운</h2>
        <p className={styles.txt}>
          scrollDropdown 속성을 사용하여 페이지 스크롤 시 드롭다운의 동작을
          제어할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>
                스크롤 시 드롭다운 위치 유지
              </h3>
              <Select
                options={[
                  { value: 'option1', label: '옵션 1' },
                  { value: 'option2', label: '옵션 2' },
                  { value: 'option3', label: '옵션 3' },
                  { value: 'option4', label: '옵션 4' },
                  { value: 'option5', label: '옵션 5' },
                ]}
                defaultValue="option1"
                scrollDropdown={true}
                style={{ width: '250px' }}
              />
              <p className={styles.txt}>
                scrollDropdown=true로 설정하면 페이지 스크롤 시 드롭다운의
                위치가 조정됩니다.
              </p>
            </div>

            <div>
              <h3 className={styles['sub-title']}>
                스크롤 시 드롭다운 닫기(디폴트)
              </h3>
              <Select
                options={[
                  { value: 'option1', label: '옵션 1' },
                  { value: 'option2', label: '옵션 2' },
                  { value: 'option3', label: '옵션 3' },
                  { value: 'option4', label: '옵션 4' },
                  { value: 'option5', label: '옵션 5' },
                ]}
                defaultValue="option2"
                scrollDropdown={false}
                style={{ width: '250px' }}
              />
              <p className={styles.txt}>
                scrollDropdown=false로 설정하면 페이지 스크롤 시 드롭다운이
                닫힙니다. (기본값)
              </p>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 스크롤 시 드롭다운 위치 유지
<Select
  options={[
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3' },
    { value: 'option4', label: '옵션 4' },
    { value: 'option5', label: '옵션 5' },
  ]}
  defaultValue="option1"
  scrollDropdown={true}
  style={{ width: '250px' }}
/>

// 스크롤 시 드롭다운 닫기 (기본값)
<Select
  options={[
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3' },
    { value: 'option4', label: '옵션 4' },
    { value: 'option5', label: '옵션 5' },
  ]}
  defaultValue="option2"
  scrollDropdown={false}
  style={{ width: '250px' }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>성공 상태</h2>
        <p className={styles.txt}>
          status="success" 속성을 사용하여 성공 상태를 표시할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>성공 상태 추가</h3>
              <div
                style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}
              >
                <Button
                  className={statusValue === '' ? 'primary' : 'line'}
                  onClick={() => setStatusValue('')}
                  size="sm"
                >
                  기본
                </Button>
                <Button
                  className={statusValue === 'error' ? 'primary' : 'line'}
                  onClick={() => setStatusValue('error')}
                  size="sm"
                >
                  오류
                </Button>
                <Button
                  className={statusValue === 'warning' ? 'primary' : 'line'}
                  onClick={() => setStatusValue('warning')}
                  size="sm"
                >
                  경고
                </Button>
                <Button
                  className={statusValue === 'success' ? 'primary' : 'line'}
                  onClick={() => setStatusValue('success')}
                  size="sm"
                >
                  성공
                </Button>
              </div>

              <div
                style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
              >
                <Select
                  options={['apple', 'banana', 'orange', 'pear', 'grape']}
                  defaultValue="apple"
                  status={
                    statusValue === 'default'
                      ? undefined
                      : (statusValue as 'error' | 'warning' | 'success')
                  }
                  style={{ width: '250px' }}
                />
              </div>
              <p className={styles.txt}>
                현재 상태: <strong>{statusValue}</strong>
              </p>
            </div>

            <div>
              <h3 className={styles['sub-title']}>단일 상태 예제</h3>
              <div
                style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
              >
                <Select
                  options={[
                    { value: 'phone', label: '전화번호 인증됨 ✓' },
                    { value: 'email', label: '이메일 인증됨 ✓' },
                    { value: 'kakao', label: '카카오 인증됨 ✓' },
                  ]}
                  defaultValue="phone"
                  status="success"
                  style={{ width: '250px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태 관리
const [statusValue, setStatusValue] = useState<string>('default');

// 상태 변경 버튼
<Button
  className={statusValue === '' ? 'primary' : 'line'}
  onClick={() => setStatusValue('')}
  size="sm"
>
  기본
</Button>
<Button
  className={statusValue === 'error' ? 'primary' : 'line'}
  onClick={() => setStatusValue('error')}
  size="sm"
>
  오류
</Button>
<Button
  className={statusValue === 'warning' ? 'primary' : 'line'}
  onClick={() => setStatusValue('warning')}
  size="sm"
>
  경고
</Button>
<Button
  className={statusValue === 'success' ? 'primary' : 'line'}
  onClick={() => setStatusValue('success')}
  size="sm"
>
  성공
</Button>

// 상태 적용 Select
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="apple"
  status={
    statusValue === 'default'
      ? undefined
      : (statusValue as 'error' | 'warning' | 'success')
  }
  style={{ width: '250px' }}
/>

// 성공 상태 예제
<Select
  options={[
    { value: 'phone', label: '전화번호 인증됨 ✓' },
    { value: 'email', label: '이메일 인증됨 ✓' },
    { value: 'kakao', label: '카카오 인증됨 ✓' },
  ]}
  defaultValue="phone"
  status="success"
  style={{ width: '250px' }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>추가 기능</h2>
        <p className={styles.txt}>
          Select 컴포넌트의 다양한 추가 기능을 확인하세요.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>값 지우기 (allowClear)</h3>
              <Select
                options={['apple', 'banana', 'orange', 'pear', 'grape']}
                defaultValue="apple"
                allowClear={true}
                style={{ width: '250px' }}
              />
            </div>

            <div>
              <h3 className={styles['sub-title']}>로딩 상태</h3>
              <Select
                options={['apple', 'banana', 'orange', 'pear', 'grape']}
                defaultValue="apple"
                loading={true}
                style={{ width: '250px' }}
              />
            </div>

            <div>
              <h3 className={styles['sub-title']}>비활성화 상태</h3>
              <Select
                options={['apple', 'banana', 'orange', 'pear', 'grape']}
                defaultValue="apple"
                disabled={true}
                style={{ width: '250px' }}
              />
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 값 지우기 기능
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="apple"
  allowClear={true}
  style={{ width: '250px' }}
/>

// 로딩 상태
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="apple"
  loading={true}
  style={{ width: '250px' }}
/>

// 비활성화 상태
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="apple"
  disabled={true}
  style={{ width: '250px' }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>검증 상태</h2>
        <p className={styles.txt}>
          status 속성을 통해 error, warning 등의 상태를 표시할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>상태 설정</h3>
              <div
                style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}
              >
                <Select
                  options={[
                    { value: 'default', label: '기본' },
                    { value: 'error', label: '오류' },
                    { value: 'warning', label: '경고' },
                  ]}
                  value={statusValue}
                  onChange={setStatusValue}
                  placeholder="상태를 선택하세요"
                />

                <Button onClick={() => setStatusValue('default')} size="sm">
                  기본
                </Button>
                <Button onClick={() => setStatusValue('error')} size="sm">
                  오류
                </Button>
                <Button onClick={() => setStatusValue('warning')} size="sm">
                  경고
                </Button>
              </div>

              <div
                style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
              >
                <Select
                  options={['apple', 'banana', 'orange', 'pear', 'grape']}
                  defaultValue="apple"
                  status={
                    statusValue === 'default'
                      ? undefined
                      : (statusValue as 'error' | 'warning')
                  }
                  style={{ width: '250px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태 관리
const [statusValue, setStatusValue] = useState<string>('default');

// 오류 상태의 Select
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="apple"
  status="error"
  style={{ width: '250px' }}
/>

// 경고 상태의 Select
<Select
  options={['apple', 'banana', 'orange', 'pear', 'grape']}
  defaultValue="apple"
  status="warning"
  style={{ width: '250px' }}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>외부 제어</h2>
        <p className={styles.txt}>
          value, open 등의 속성을 통해 셀렉트를 외부에서 제어할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div>
              <h3 className={styles['sub-title']}>외부에서 값 제어</h3>
              <div
                style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}
              >
                <Select
                  options={[
                    { value: '1', label: '옵션 1' },
                    { value: '2', label: '옵션 2' },
                    { value: '3', label: '옵션 3' },
                    { value: '4', label: '옵션 4' },
                    { value: '5', label: '옵션 5' },
                  ]}
                  value={externalValue}
                  onChange={setExternalValue}
                  style={{ width: '200px' }}
                />

                <Button onClick={() => setExternalValue('1')} size="sm">
                  옵션 1
                </Button>
                <Button onClick={() => setExternalValue('3')} size="sm">
                  옵션 3
                </Button>
                <Button onClick={() => setExternalValue('5')} size="sm">
                  옵션 5
                </Button>
              </div>
            </div>

            <div>
              <h3 className={styles['sub-title']}>외부에서 열기/닫기 제어</h3>
              <div
                style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}
              >
                <Select
                  options={[
                    { value: '1', label: '옵션 1' },
                    { value: '2', label: '옵션 2' },
                    { value: '3', label: '옵션 3' },
                  ]}
                  defaultValue="1"
                  open={open}
                  onDropdownVisibleChange={setOpen}
                  style={{ width: '200px' }}
                />

                <Button onClick={() => setOpen(!open)} size="sm">
                  {open ? '드롭다운 닫기' : '드롭다운 열기'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 상태 관리
const [externalValue, setExternalValue] = useState<string>('2');
const [open, setOpen] = useState<boolean>(false);

// 외부에서 값 제어
<Select
  options={[
    { value: '1', label: '옵션 1' },
    { value: '2', label: '옵션 2' },
    { value: '3', label: '옵션 3' },
    { value: '4', label: '옵션 4' },
    { value: '5', label: '옵션 5' },
  ]}
  value={externalValue}
  onChange={setExternalValue}
  style={{ width: '200px' }}
/>

// 외부에서 열기/닫기 제어
<Select
  options={[
    { value: '1', label: '옵션 1' },
    { value: '2', label: '옵션 2' },
    { value: '3', label: '옵션 3' },
  ]}
  defaultValue="1"
  open={open}
  onDropdownVisibleChange={setOpen}
  style={{ width: '200px' }}
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
                <td>options</td>
                <td>(SelectOption | SelectOptionGroup | string | number)[]</td>
                <td>필수</td>
                <td>셀렉트 옵션 배열</td>
              </tr>
              <tr>
                <td>optionFilterProp</td>
                <td>string</td>
                <td>'label'</td>
                <td>검색 시 필터링할 속성</td>
              </tr>
              <tr>
                <td>optionLabelProp</td>
                <td>string</td>
                <td>'label'</td>
                <td>표시될 레이블 속성</td>
              </tr>
              <tr>
                <td>value</td>
                <td>string | number | string[] | number[]</td>
                <td>-</td>
                <td>현재 선택된 값</td>
              </tr>
              <tr>
                <td>defaultValue</td>
                <td>string | number | string[] | number[]</td>
                <td>-</td>
                <td>초기 선택값</td>
              </tr>
              <tr>
                <td>onChange</td>
                <td>function</td>
                <td>-</td>
                <td>선택값 변경 콜백</td>
              </tr>
              <tr>
                <td>placeholder</td>
                <td>string</td>
                <td>'선택해주세요'</td>
                <td>플레이스홀더 텍스트</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>비활성화 여부</td>
              </tr>
              <tr>
                <td>loading</td>
                <td>boolean</td>
                <td>false</td>
                <td>로딩 상태 표시 여부</td>
              </tr>
              <tr>
                <td>status</td>
                <td>'error' | 'warning' | 'success'</td>
                <td>-</td>
                <td>검증 상태</td>
              </tr>
              <tr>
                <td>className</td>
                <td>string</td>
                <td>-</td>
                <td>셀렉트 컨테이너 클래스명</td>
              </tr>
              <tr>
                <td>style</td>
                <td>CSSProperties</td>
                <td>-</td>
                <td>셀렉트 컨테이너 인라인 스타일</td>
              </tr>
              <tr>
                <td>dropdownClassName</td>
                <td>string</td>
                <td>-</td>
                <td>드롭다운 클래스명</td>
              </tr>
              <tr>
                <td>dropdownStyle</td>
                <td>CSSProperties</td>
                <td>-</td>
                <td>드롭다운 인라인 스타일</td>
              </tr>
              <tr>
                <td>allowClear</td>
                <td>boolean</td>
                <td>false</td>
                <td>값 지우기 버튼 표시 여부</td>
              </tr>
              <tr>
                <td>size</td>
                <td>'small' | 'medium' | 'large'</td>
                <td>'medium'</td>
                <td>셀렉트 크기</td>
              </tr>
              <tr>
                <td>showSearch</td>
                <td>boolean</td>
                <td>false</td>
                <td>검색 기능 활성화 여부</td>
              </tr>
              <tr>
                <td>open</td>
                <td>boolean</td>
                <td>-</td>
                <td>드롭다운 열림 여부</td>
              </tr>
              <tr>
                <td>defaultOpen</td>
                <td>boolean</td>
                <td>false</td>
                <td>초기 드롭다운 열림 여부</td>
              </tr>
              <tr>
                <td>scrollDropdown</td>
                <td>boolean</td>
                <td>false</td>
                <td>스크롤 시 드롭다운 위치 조정 여부</td>
              </tr>
              <tr>
                <td>mode</td>
                <td>'multiple'</td>
                <td>-</td>
                <td>다중 선택 모드 활성화</td>
              </tr>
              <tr>
                <td>separator</td>
                <td>string</td>
                <td>', '</td>
                <td>다중 선택 시 구분자</td>
              </tr>
              <tr>
                <td>maxCount</td>
                <td>number</td>
                <td>-</td>
                <td>최대 선택 가능 개수</td>
              </tr>
              <tr>
                <td>onDropdownVisibleChange</td>
                <td>{'(open: boolean) => void'}</td>
                <td>-</td>
                <td>드롭다운 열림/닫힘 콜백</td>
              </tr>
              <tr>
                <td>onSearch</td>
                <td>{'(value: string) => void'}</td>
                <td>-</td>
                <td>검색어 변경 콜백</td>
              </tr>
              <tr>
                <td>onClear</td>
                <td>{'() => void'}</td>
                <td>-</td>
                <td>값 지우기 콜백</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>SelectHandle 메서드</h2>
        <p className={styles.txt}>
          useRef로 Select 컴포넌트에 접근할 때 사용할 수 있는 메서드입니다.
        </p>
        <div className={styles.showcase}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>메서드</th>
                <th>타입</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>focus</td>
                <td>{'() => void'}</td>
                <td>Select 컴포넌트에 포커스를 줍니다.</td>
              </tr>
              <tr>
                <td>blur</td>
                <td>{'() => void'}</td>
                <td>Select 컴포넌트에서 포커스를 제거합니다.</td>
              </tr>
              <tr>
                <td>getValue</td>
                <td>
                  {'() => string | number | string[] | number[] | undefined'}
                </td>
                <td>
                  현재 선택된 값을 반환합니다. 다중 선택 모드에서는 배열을
                  반환합니다.
                </td>
              </tr>
              <tr>
                <td>setValue</td>
                <td>
                  {
                    '(value: string | number | string[] | number[] | undefined) => void'
                  }
                </td>
                <td>
                  새로운 값을 설정합니다. 다중 선택 모드에서는 배열을
                  사용합니다.
                </td>
              </tr>
              <tr>
                <td>getRootElement</td>
                <td>{'() => HTMLElement | null'}</td>
                <td>Select 컴포넌트의 루트 요소를 반환합니다.</td>
              </tr>
              <tr>
                <td>openDropdown</td>
                <td>{'() => void'}</td>
                <td>드롭다운을 엽니다.</td>
              </tr>
              <tr>
                <td>closeDropdown</td>
                <td>{'() => void'}</td>
                <td>드롭다운을 닫습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className={styles['sub-title']}>사용 예시</h3>
        <CodeHighlight
          code={`import { useRef } from 'react';
import { Select, SelectHandle } from '@/components/common';

const MyComponent = () => {
  // Select 컴포넌트에 접근하기 위한 Ref 생성
  const selectRef = useRef<SelectHandle>(null);

  // 메서드 사용 예시
  const handleClick = () => {
    // 현재 값 가져오기
    const currentValue = selectRef.current?.getValue();
    console.log('현재 값:', currentValue);

    // 새로운 값 설정
    selectRef.current?.setValue('newValue');

    // 드롭다운 열기
    selectRef.current?.openDropdown();
  };

  return (
    <div>
      <Select
        ref={selectRef}
        options={[
          { value: 'option1', label: '옵션 1' },
          { value: 'option2', label: '옵션 2' },
          { value: 'option3', label: '옵션 3' },
        ]}
        defaultValue="option1"
      />
      <button onClick={handleClick}>메서드 사용</button>
    </div>
  );
};`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default SelectGuide;
