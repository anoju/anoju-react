// src/pages/test/datepicker-test.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, CodeHighlight, Datepicker } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const DatepickerTest = () => {
  usePageLayout({
    title: 'Datepicker 테스트',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // 단일 날짜 선택 상태들
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [selectedYear, setSelectedYear] = useState<Date | null>(null);

  // 범위 선택 상태들
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [monthRange, setMonthRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [yearRange, setYearRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  // 다양한 설정 테스트
  const [customFormatDate, setCustomFormatDate] = useState<Date | null>(null);
  const [disabledDate, setDisabledDate] = useState<Date | null>(null);
  const [smallDate, setSmallDate] = useState<Date | null>(null);
  const [largeDate, setLargeDate] = useState<Date | null>(null);

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Datepicker 컴포넌트 테스트</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 Datepicker</h2>
        <p className={styles.txt}>
          날짜를 선택할 수 있는 기본 Datepicker입니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Datepicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="날짜를 선택하세요"
            />
            <p>
              선택된 날짜:{' '}
              {selectedDate ? selectedDate.toLocaleDateString('ko-KR') : '없음'}
            </p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [selectedDate, setSelectedDate] = useState<Date | null>(null);

<Datepicker
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="날짜를 선택하세요"
/>`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Rangepicker (날짜 범위)</h2>
        <p className={styles.txt}>
          시작일과 종료일을 선택할 수 있는 범위 선택기입니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Datepicker.Rangepicker
              value={dateRange}
              onChange={setDateRange}
              placeholder={['시작일', '종료일']}
            />
            <p>
              선택된 범위:{' '}
              {dateRange[0] && dateRange[1]
                ? `${dateRange[0].toLocaleDateString('ko-KR')} ~ ${dateRange[1].toLocaleDateString('ko-KR')}`
                : '없음'}
            </p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

<Datepicker.Rangepicker
  value={dateRange}
  onChange={setDateRange}
  placeholder={['시작일', '종료일']}
/>`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Monthpicker (월 선택)</h2>
        <p className={styles.txt}>
          년도와 월을 선택할 수 있는 Monthpicker입니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Datepicker.Monthpicker
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="월을 선택하세요"
            />
            <p>
              선택된 월:{' '}
              {selectedMonth
                ? selectedMonth.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                  })
                : '없음'}
            </p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

<Datepicker.Monthpicker
  value={selectedMonth}
  onChange={setSelectedMonth}
  placeholder="월을 선택하세요"
/>`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Yearpicker (년도 선택)</h2>
        <p className={styles.txt}>년도를 선택할 수 있는 Yearpicker입니다.</p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Datepicker.Yearpicker
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="년도를 선택하세요"
            />
            <p>
              선택된 년도:{' '}
              {selectedYear ? selectedYear.getFullYear() + '년' : '없음'}
            </p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [selectedYear, setSelectedYear] = useState<Date | null>(null);

<Datepicker.Yearpicker
  value={selectedYear}
  onChange={setSelectedYear}
  placeholder="년도를 선택하세요"
/>`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>MonthRangepicker (월 범위)</h2>
        <p className={styles.txt}>
          시작 월과 종료 월을 선택할 수 있는 범위 선택기입니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Datepicker.MonthRangepicker
              value={monthRange}
              onChange={setMonthRange}
              placeholder={['시작 월', '종료 월']}
            />
            <p>
              선택된 월 범위:{' '}
              {monthRange[0] && monthRange[1]
                ? `${monthRange[0].toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} ~ ${monthRange[1].toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}`
                : '없음'}
            </p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [monthRange, setMonthRange] = useState<[Date | null, Date | null]>([null, null]);

<Datepicker.MonthRangepicker
  value={monthRange}
  onChange={setMonthRange}
  placeholder={['시작 월', '종료 월']}
/>`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>YearRangepicker (년도 범위)</h2>
        <p className={styles.txt}>
          시작 년도와 종료 년도를 선택할 수 있는 범위 선택기입니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Datepicker.YearRangepicker
              value={yearRange}
              onChange={setYearRange}
              placeholder={['시작 년도', '종료 년도']}
            />
            <p>
              선택된 년도 범위:{' '}
              {yearRange[0] && yearRange[1]
                ? `${yearRange[0].getFullYear()}년 ~ ${yearRange[1].getFullYear()}년`
                : '없음'}
            </p>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [yearRange, setYearRange] = useState<[Date | null, Date | null]>([null, null]);

<Datepicker.YearRangepicker
  value={yearRange}
  onChange={setYearRange}
  placeholder={['시작 년도', '종료 년도']}
/>`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>다양한 설정 옵션</h2>
        <p className={styles.txt}>
          사이즈, 포맷, 비활성화 등 다양한 설정을 테스트할 수 있습니다.
        </p>

        <div className={styles.showcase}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {/* 커스텀 포맷 */}
            <div>
              <h4>커스텀 포맷 (YYYY/MM/DD)</h4>
              <Datepicker
                value={customFormatDate}
                onChange={setCustomFormatDate}
                placeholder="YYYY/MM/DD 형식"
                format="YYYY/MM/DD"
              />
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '1.4rem',
                  color: '#666',
                }}
              >
                선택된 날짜:{' '}
                {customFormatDate
                  ? customFormatDate.toLocaleDateString('ko-KR')
                  : '없음'}
              </p>
            </div>

            {/* 비활성화 */}
            <div>
              <h4>비활성화 상태</h4>
              <Datepicker
                value={disabledDate}
                onChange={setDisabledDate}
                placeholder="비활성화된 Datepicker"
                disabled={true}
              />
            </div>

            {/* 다양한 사이즈 */}
            <div>
              <h4>다양한 사이즈</h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Small 사이즈:
                  </label>
                  <Datepicker
                    value={smallDate}
                    onChange={setSmallDate}
                    placeholder="Small 사이즈"
                    size="sm"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Medium 사이즈 (기본):
                  </label>
                  <Datepicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    placeholder="Medium 사이즈 (기본)"
                    size="md"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Large 사이즈:
                  </label>
                  <Datepicker
                    value={largeDate}
                    onChange={setLargeDate}
                    placeholder="Large 사이즈"
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* 지우기 비허용 */}
            <div>
              <h4>지우기 비허용</h4>
              <Datepicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="지우기 버튼 없음"
                allowClear={false}
              />
            </div>
          </div>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 커스텀 포맷
<Datepicker
  value={customFormatDate}
  onChange={setCustomFormatDate}
  placeholder="YYYY/MM/DD 형식"
  format="YYYY/MM/DD"
/>

// 비활성화
<Datepicker
  value={disabledDate}
  onChange={setDisabledDate}
  placeholder="비활성화된 Datepicker"
  disabled={true}
/>

// 사이즈 설정
<Datepicker size="sm" />  // 작은 사이즈
<Datepicker size="md" />  // 중간 사이즈 (기본값)
<Datepicker size="lg" />  // 큰 사이즈

// 지우기 비허용
<Datepicker
  value={selectedDate}
  onChange={setSelectedDate}
  allowClear={false}
/>`}
          language="tsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>상태 초기화</h2>
        <p className={styles.txt}>모든 선택된 날짜를 초기화합니다.</p>

        <div className={styles.showcase}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              className="primary"
              onClick={() => {
                setSelectedDate(null);
                setSelectedMonth(null);
                setSelectedYear(null);
                setDateRange([null, null]);
                setMonthRange([null, null]);
                setYearRange([null, null]);
                setCustomFormatDate(null);
                setDisabledDate(null);
                setSmallDate(null);
                setLargeDate(null);
              }}
            >
              모든 날짜 초기화
            </Button>

            <Button
              className="secondary"
              onClick={() => {
                const now = new Date();
                setSelectedDate(now);
                setSelectedMonth(now);
                setSelectedYear(now);
                const nextMonth = new Date(
                  now.getFullYear(),
                  now.getMonth() + 1,
                  now.getDate()
                );
                setDateRange([now, nextMonth]);
                setMonthRange([now, nextMonth]);
                const nextYear = new Date(
                  now.getFullYear() + 1,
                  now.getMonth(),
                  now.getDate()
                );
                setYearRange([now, nextYear]);
                setCustomFormatDate(now);
                setSmallDate(now);
                setLargeDate(now);
              }}
            >
              샘플 날짜 설정
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DatepickerTest;
