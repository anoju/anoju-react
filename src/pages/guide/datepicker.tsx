// src/pages/guide/datepicker.tsx
import { useState, useRef } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  Button,
  Select,
  CodeHighlight,
  Calendar,
  type CalendarRef,
  type DateRange,
} from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';
import { formatDate } from '@/utils/dateFormat';

const DatepickerGuide = () => {
  usePageLayout({
    title: 'Datepicker /  컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [customSelectedDate, setCustomSelectedDate] = useState<
    Date | undefined
  >(undefined);

  // Calendar ref
  const calendarRef = useRef<CalendarRef>(null);

  // 특정 날짜 비활성화 함수 (주말 비활성화 예시)
  const disabledWeekends = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 주말 비활성화
  };

  // 과거 날짜 비활성화 함수
  const disabledPastDates = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // 미래 날짜 비활성화 함수
  const disabledFutureDates = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // 외부 버튼으로 달력 제어
  const handlePrevMonth = () => {
    calendarRef.current?.goToPrevMonth();
  };

  const handleNextMonth = () => {
    calendarRef.current?.goToNextMonth();
  };

  const handlePrevYear = () => {
    calendarRef.current?.goToPrevYear();
  };

  const handleNextYear = () => {
    calendarRef.current?.goToNextYear();
  };

  const handleGoToToday = () => {
    const today = new Date();
    calendarRef.current?.goToDate(today);
    setViewDate(today);
  };

  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(12);
  const [selectedDate2, setSelectedDate2] = useState<Date>(new Date());
  const viewDate2 = new Date(currentYear, currentMonth - 1, 1);

  const [dateRange, setDateRange] = useState<DateRange>({});

  const [dateRange2, setDateRange2] = useState<DateRange>({
    startDate: new Date(2024, 11, 10), // 2024년 12월 10일
    endDate: new Date(2024, 11, 15), // 2024년 12월 15일
  });

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Calendar Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Calendar } from '@/components/common';`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 Calendar</h2>
        <div className={styles.showcase}>
          <p className={styles.txt}>선택된 날짜: {formatDate(selectedDate)}</p>
          <Calendar
            value={selectedDate}
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [selectedDate, setSelectedDate] = useState<Date>(new Date());

<Calendar
  value={selectedDate}
  selectedDate={selectedDate}
  onChange={setSelectedDate}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>이전/다음달 보임</h2>
        <div className={styles.showcase}>
          <p className={styles.txt}>선택된 날짜: {formatDate(selectedDate)}</p>
          <Calendar
            value={selectedDate}
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            showAdjacentMonths
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [selectedDate, setSelectedDate] = useState<Date>(new Date());

<Calendar
  value={selectedDate}
  selectedDate={selectedDate}
  onChange={setSelectedDate}
  showAdjacentMonths
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>비활성화</h2>
        <div className={styles.showcase}>
          <p className={styles.txt}>주말 비활성화</p>
          <Calendar
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            disabledDate={disabledWeekends}
            showAdjacentMonths={true}
          />
          <br />
          <p className={styles.txt}>과거 날짜 비활성화</p>
          <Calendar
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            disabledDate={disabledPastDates}
            showAdjacentMonths={true}
          />
          <br />
          <p className={styles.txt}>미래 날짜 비활성화</p>
          <Calendar
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            disabledDate={disabledFutureDates}
            showAdjacentMonths={true}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [selectedDate, setSelectedDate] = useState<Date>(new Date());

// 주말 비활성화
<Calendar
  selectedDate={selectedDate}
  onChange={setSelectedDate}
  disabledDate={disabledWeekends}
  showAdjacentMonths={true}
/>

// 과거 날짜 비활성화
<Calendar
  selectedDate={selectedDate}
  onChange={setSelectedDate}
  disabledDate={disabledPastDates}
  showAdjacentMonths={true}
/>

// 미래 날짜 비활성화
<Calendar
  selectedDate={selectedDate}
  onChange={setSelectedDate}
  disabledDate={disabledFutureDates}
  showAdjacentMonths={true}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>특정 월 세팅</h2>
        <div className={styles.showcase}>
          <p className={styles.txt}>선택된 날짜: {formatDate(selectedDate)}</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <Select
              value={currentYear}
              onChange={setCurrentYear}
              options={Array.from({ length: 10 }, (_, i) => 2020 + i).map(
                (year) => ({
                  value: year,
                  label: `${year}년`,
                })
              )}
            />

            <Select
              value={currentMonth}
              onChange={setCurrentMonth}
              options={Array.from({ length: 12 }, (_, i) => i + 1).map(
                (month) => ({
                  value: month,
                  label: `${month}월`,
                })
              )}
            />
          </div>

          <Calendar
            value={viewDate2}
            selectedDate={selectedDate2}
            onChange={setSelectedDate2}
            showAdjacentMonths={true}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [selectedDate, setSelectedDate] = useState<Date>(new Date());

<Calendar
  value={selectedDate}
  selectedDate={selectedDate}
  onChange={setSelectedDate}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>외부제어</h2>
        <div className={styles.showcase}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <Button size="sm" className="line" onClick={handlePrevYear}>
              이전 년
            </Button>
            <Button size="sm" className="line" onClick={handlePrevMonth}>
              이전 달
            </Button>
            <Button size="sm" className="primary" onClick={handleGoToToday}>
              오늘
            </Button>
            <Button size="sm" className="line" onClick={handleNextMonth}>
              다음 달
            </Button>
            <Button size="sm" className="line" onClick={handleNextYear}>
              다음 년
            </Button>
          </div>
          <p className={styles.txt}>
            표시 년월: {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
          </p>
          <p className={styles.txt}>
            선택된 날짜:{formatDate(customSelectedDate) || '선택 안함'}
          </p>
          <Calendar
            ref={calendarRef}
            value={viewDate}
            selectedDate={customSelectedDate}
            onChange={setCustomSelectedDate}
            onViewChange={setViewDate}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`// 외부제어
const handlePrevMonth = () => {
  calendarRef.current?.goToPrevMonth();
};

const handleNextMonth = () => {
  calendarRef.current?.goToNextMonth();
};

const handlePrevYear = () => {
  calendarRef.current?.goToPrevYear();
};

const handleNextYear = () => {
  calendarRef.current?.goToNextYear();
};

const handleGoToToday = () => {
  const today = new Date();
  calendarRef.current?.goToDate(today);
  setViewDate(today);
};

<Button size="sm" className="line" onClick={handlePrevYear}>
  이전 년
</Button>
<Button size="sm" className="line" onClick={handlePrevMonth}>
  이전 달
</Button>
<Button size="sm" className="primary" onClick={handleGoToToday}>
  오늘
</Button>
<Button size="sm" className="line" onClick={handleNextMonth}>
  다음 달
</Button>
<Button size="sm" className="line" onClick={handleNextYear}>
  다음 년
</Button>

<Calendar
  ref={calendarRef}
  value={viewDate}
  selectedDate={customSelectedDate}
  onChange={setCustomSelectedDate}
  onViewChange={setViewDate}
/>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>range</h2>
        <div className={styles.showcase}>
          <p className={styles.txt}>
            시작 날짜: {formatDate(dateRange.startDate) || '선택 안함'}
          </p>
          <p className={styles.txt}>
            끝 날짜: {formatDate(dateRange.endDate) || '선택 안함'}
          </p>
          <Calendar
            mode="range"
            range={dateRange}
            onRangeChange={setDateRange}
            showAdjacentMonths={true}
          />

          <br />

          <p className={styles.txt}>
            시작 날짜: {formatDate(dateRange2.startDate) || '선택 안함'}
          </p>
          <p className={styles.txt}>
            끝 날짜: {formatDate(dateRange2.endDate) || '선택 안함'}
          </p>
          <Calendar
            mode="range"
            value={new Date(2024, 11, 1)}
            range={dateRange2}
            onRangeChange={setDateRange2}
            showAdjacentMonths={true}
          />
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [dateRange, setDateRange] = useState<DateRange>({});

<Calendar
  mode="range"
  range={dateRange}
  onRangeChange={setDateRange}
  showAdjacentMonths={true}
/>`}
          language="jsx"
        />
      </section>
    </div>
  );
};

export default DatepickerGuide;
