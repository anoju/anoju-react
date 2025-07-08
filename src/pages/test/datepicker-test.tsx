// src/pages/test/datepicker-test.tsx
import { useState } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import { Button, Input, DatePicker } from '@/components/common';
import styles from '@/assets/scss/pages/guide.module.scss';

const DatePickerTest = () => {
  usePageLayout({
    title: 'DatePicker 테스트',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  // Input with DatePicker 테스트
  const [selectedDate1, setSelectedDate1] = useState<string>('');
  const [selectedDate2, setSelectedDate2] = useState<string>('2024-12-25');
  const [selectedDate3, setSelectedDate3] = useState<string>('');

  // DatePicker 컴포넌트 직접 사용 테스트
  const [datepickerVisible, setDatepickerVisible] = useState(false);
  const [standaloneDate, setStandaloneDate] = useState<Date | null>(null);

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date | null) => {
    console.log('날짜 변경:', date);
  };

  // 비활성화할 날짜 (주말)
  const disableWeekends = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 일요일(0), 토요일(6) 비활성화
  };

  // 과거 날짜 비활성화
  const disablePastDates = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>DatePicker 테스트 페이지</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Input with DatePicker</h2>
        
        <div className={styles.showcase}>
          <h3>기본 DatePicker Input</h3>
          <Input
            datepicker
            placeholder="날짜를 선택하세요"
            value={selectedDate1}
            onChange={(e) => setSelectedDate1(e.target.value)}
            onDateChange={handleDateChange}
          />
          <p>선택된 날짜: {selectedDate1 || '없음'}</p>
        </div>

        <div className={styles.showcase}>
          <h3>기본값이 있는 DatePicker Input</h3>
          <Input
            datepicker
            placeholder="날짜를 선택하세요"
            value={selectedDate2}
            onChange={(e) => setSelectedDate2(e.target.value)}
            onDateChange={handleDateChange}
          />
          <p>선택된 날짜: {selectedDate2}</p>
        </div>

        <div className={styles.showcase}>
          <h3>주말 비활성화 DatePicker Input</h3>
          <Input
            datepicker
            placeholder="주말 제외 날짜 선택"
            value={selectedDate3}
            onChange={(e) => setSelectedDate3(e.target.value)}
            onDateChange={handleDateChange}
            disabledDate={disableWeekends}
          />
          <p>선택된 날짜: {selectedDate3 || '없음'}</p>
        </div>

        <div className={styles.showcase}>
          <h3>과거 날짜 비활성화 DatePicker Input</h3>
          <Input
            datepicker
            placeholder="오늘 이후 날짜만 선택"
            disabledDate={disablePastDates}
            onDateChange={handleDateChange}
          />
        </div>

        <div className={styles.showcase}>
          <h3>커스텀 날짜 포맷 (YYYY/MM/DD)</h3>
          <Input
            datepicker
            dateFormat="YYYY/MM/DD"
            placeholder="YYYY/MM/DD 형식"
            onDateChange={handleDateChange}
          />
        </div>

        <div className={styles.showcase}>
          <h3>비활성화된 DatePicker Input</h3>
          <Input
            datepicker
            placeholder="비활성화된 상태"
            disabled
            value="2024-12-01"
          />
        </div>

        <div className={styles.showcase}>
          <h3>읽기 전용 DatePicker Input</h3>
          <Input
            datepicker
            placeholder="읽기 전용 상태"
            readOnly
            value="2024-12-01"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>독립 DatePicker 컴포넌트</h2>
        
        <div className={styles.showcase}>
          <Button 
            className="primary" 
            onClick={() => setDatepickerVisible(true)}
          >
            DatePicker 팝업 열기
          </Button>
          
          <p>선택된 날짜: {standaloneDate ? standaloneDate.toLocaleDateString('ko-KR') : '없음'}</p>

          <DatePicker
            visible={datepickerVisible}
            value={standaloneDate}
            onChange={setStandaloneDate}
            onVisibleChange={setDatepickerVisible}
            format="YYYY-MM-DD"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>테스트 결과</h2>
        <div className={styles.showcase}>
          <h4>기능 확인 사항:</h4>
          <ul>
            <li>✅ Input 클릭 시 DatePicker 팝업 열기</li>
            <li>✅ 날짜 선택 시 Input 값 업데이트</li>
            <li>✅ 날짜 선택 후 팝업 자동 닫기</li>
            <li>✅ 스와이프로 월 이동 (터치/마우스)</li>
            <li>✅ 상단 네비게이션 버튼으로 월/년 이동</li>
            <li>✅ Select로 년/월 직접 선택</li>
            <li>✅ 비활성화 날짜 처리</li>
            <li>✅ 다양한 날짜 포맷 지원</li>
            <li>✅ 오늘 버튼</li>
            <li>✅ 취소 버튼</li>
          </ul>
          
          <h4>스와이프 기능:</h4>
          <ul>
            <li>좌우 드래그/스와이프로 이전달/다음달 이동</li>
            <li>터치 및 마우스 모두 지원</li>
            <li>애니메이션과 함께 부드러운 전환</li>
            <li>세로 스크롤 방해하지 않음</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default DatePickerTest;
