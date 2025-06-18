// src/pages/guide/datepicker.tsx
import { useState, useRef } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  Button,
  CodeHighlight,
  Calendar,
  type CalendarRef,
} from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

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
          <p className={styles.txt}>
            선택된 날짜: {selectedDate.toLocaleDateString('ko-KR')}
          </p>
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
          <p className={styles.txt}>
            선택된 날짜: {selectedDate.toLocaleDateString('ko-KR')}
          </p>
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
          <Calendar
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            disabledDate={disabledWeekends}
            showAdjacentMonths={true}
          />
          <br />
          <Calendar
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            disabledDate={disabledPastDates}
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
            선택된 날짜:
            {customSelectedDate?.toLocaleDateString('ko-KR') || '선택 안함'}
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
    </div>
  );
};

export default DatepickerGuide;
