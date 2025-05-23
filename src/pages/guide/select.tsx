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
  const [statusValue, setStatusValue] = useState('default');
  const [externalValue, setExternalValue] = useState('2');
  const [open, setOpen] = useState<boolean>(false);

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
          <table>
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
                <td>(SelectOption | string | number)[]</td>
                <td>필수</td>
                <td>셀렉트 옵션 배열</td>
              </tr>
              <tr>
                <td>value</td>
                <td>string | number</td>
                <td>-</td>
                <td>현재 선택된 값</td>
              </tr>
              <tr>
                <td>defaultValue</td>
                <td>string | number</td>
                <td>-</td>
                <td>초기 선택값</td>
              </tr>
              <tr>
                <td>onChange</td>
                <td>{'(value: string | number) => void'}</td>
                <td>-</td>
                <td>선택값 변경 콜백</td>
              </tr>
              <tr>
                <td>placeholder</td>
                <td>string</td>
                <td>선택해주세요</td>
                <td>플레이스홀더 텍스트</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>boolean</td>
                <td>false</td>
                <td>비활성화 여부</td>
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
                <td>allowClear</td>
                <td>boolean</td>
                <td>false</td>
                <td>값 지우기 버튼 표시 여부</td>
              </tr>
              <tr>
                <td>size</td>
                <td>'small' | 'medium' | 'lg'</td>
                <td>medium</td>
                <td>셀렉트 크기</td>
              </tr>
              <tr>
                <td>loading</td>
                <td>boolean</td>
                <td>false</td>
                <td>로딩 상태 표시 여부</td>
              </tr>
              <tr>
                <td>status</td>
                <td>'error' | 'warning'</td>
                <td>-</td>
                <td>검증 상태</td>
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
                <td>onDropdownVisibleChange</td>
                <td>{'(open: boolean) => void'}</td>
                <td>-</td>
                <td>드롭다운 열림/닫힘 콜백</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SelectGuide;
