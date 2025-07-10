// src/components/common/Datepicker.tsx
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useMemo,
  useCallback,
} from 'react';
import {
  Button,
  Input,
  Calendar,
  Swiper,
  SwiperSlide,
  Dropdown,
} from '@/components/common';
import type { SwiperRef } from '@/components/common/Swiper';
import type { DateRange } from '@/components/common/Calendar';
import styles from '@/assets/scss/components/datePicker.module.scss';
import cx from '@/utils/cx';

// 날짜 유틸리티 함수들
const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2))
    .replace('MM', month)
    .replace('M', String(date.getMonth() + 1))
    .replace('DD', day)
    .replace('D', String(date.getDate()));
};

const parseDate = (
  dateString: string,
  format: string = 'YYYY-MM-DD'
): Date | null => {
  if (!dateString) return null;

  try {
    if (format.includes('DD')) {
      const match = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        const [, year, month, day] = match;
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        return isNaN(date.getTime()) ? null : date;
      }
    } else if (format.includes('MM')) {
      const match = dateString.match(/(\d{4})-(\d{1,2})/);
      if (match) {
        const [, year, month] = match;
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return isNaN(date.getTime()) ? null : date;
      }
    } else {
      const match = dateString.match(/(\d{4})/);
      if (match) {
        const [, year] = match;
        const date = new Date(parseInt(year), 0, 1);
        return isNaN(date.getTime()) ? null : date;
      }
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

// 타입 정의
type DatepickerMode = 'date' | 'month' | 'year';
type PickerType = 'single' | 'range';
type DateValue = Date | null;
type RangeValue = [Date | null, Date | null];

interface BaseProps {
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  inputClassName?: string;
  popupClassName?: string;
  format?: string;
  allowClear?: boolean;
}

interface SingleDatepickerProps extends BaseProps {
  mode?: DatepickerMode;
  value?: DateValue;
  onChange?: (date: DateValue) => void;
  placeholder?: string;
}

interface RangeDatepickerProps extends BaseProps {
  mode?: DatepickerMode;
  value?: RangeValue;
  onChange?: (dates: RangeValue) => void;
  placeholder?: [string, string];
}

interface DatepickerMainProps extends BaseProps {
  mode?: DatepickerMode;
  type?: PickerType;
  value?: DateValue | RangeValue;
  onChange?: (value: DateValue | RangeValue) => void;
  placeholder?: string | [string, string];
}

// 년도 선택 컴포넌트
interface YearSelectorProps {
  currentYear: number;
  selectedYear?: number;
  onYearSelect: (year: number) => void;
  onCancel: () => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  currentYear,
  selectedYear,
  onYearSelect,
  onCancel,
}) => {
  const startYear = Math.floor(currentYear / 10) * 10;
  const [currentDecade, setCurrentDecade] = useState(startYear);

  const handlePrevDecade = () => {
    setCurrentDecade((prev) => prev - 10);
  };

  const handleNextDecade = () => {
    setCurrentDecade((prev) => prev + 10);
  };

  const displayYears = Array.from(
    { length: 12 },
    (_, i) => currentDecade - 1 + i
  );

  return (
    <div className={styles['year-selector']}>
      <div className={styles['year-header']}>
        <Button not className={styles['prev-btn']} onClick={handlePrevDecade}>
          &#8249;
        </Button>
        <span className={styles['year-range']}>
          {currentDecade} - {currentDecade + 9}
        </span>
        <Button not className={styles['next-btn']} onClick={handleNextDecade}>
          &#8250;
        </Button>
      </div>
      <div className={styles['year-grid']}>
        {displayYears.map((year) => (
          <button
            key={year}
            type="button"
            className={`${styles['year-item']} ${
              year === selectedYear ? styles.selected : ''
            } ${
              year < currentDecade || year > currentDecade + 9
                ? styles.outside
                : ''
            }`}
            onClick={() => onYearSelect(year)}
          >
            {year}
          </button>
        ))}
      </div>
      <div className={styles['year-footer']}>
        <Button size="sm" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
};

// 월 선택 컴포넌트
interface MonthSelectorProps {
  currentYear: number;
  selectedMonth?: number;
  onMonthSelect: (month: number) => void;
  onYearClick: () => void;
  onCancel: () => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentYear,
  selectedMonth,
  onMonthSelect,
  onYearClick,
  onCancel,
}) => {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  return (
    <div className={styles['month-selector']}>
      <div className={styles['month-header']}>
        <Button not className={styles['year-btn']} onClick={onYearClick}>
          {currentYear}년
        </Button>
      </div>
      <div className={styles['month-grid']}>
        {months.map((month, index) => (
          <button
            key={index}
            type="button"
            className={`${styles['month-item']} ${
              index === selectedMonth ? styles.selected : ''
            }`}
            onClick={() => onMonthSelect(index)}
          >
            {month}
          </button>
        ))}
      </div>
      <div className={styles['month-footer']}>
        <Button size="sm" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
};

// 캘린더 헤더 컴포넌트
interface CalendarHeaderProps {
  currentDate: Date;
  mode: DatepickerMode;
  onMonthClick: () => void;
  onYearClick: () => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onPrevYear?: () => void;
  onNextYear?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  mode,
  onMonthClick,
  onYearClick,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  return (
    <div className={styles['calendar-header']}>
      <div className={styles['header-title']}>
        {mode === 'date' && (
          <>
            {onPrevYear && (
              <Button not className={styles['prev-btn']} onClick={onPrevYear}>
                &#171;
              </Button>
            )}
            {onPrevMonth && (
              <Button not className={styles['prev-btn']} onClick={onPrevMonth}>
                &#8249;
              </Button>
            )}
            <Button not className={styles['year-btn']} onClick={onYearClick}>
              {year}년
            </Button>
            <Button not className={styles['month-btn']} onClick={onMonthClick}>
              {monthNames[month]}
            </Button>
            {onNextMonth && (
              <Button not className={styles['next-btn']} onClick={onNextMonth}>
                &#8250;
              </Button>
            )}
            {onNextYear && (
              <Button not className={styles['next-btn']} onClick={onNextYear}>
                &#187;
              </Button>
            )}
          </>
        )}
        {mode === 'month' && (
          <>
            {onPrevYear && (
              <Button not className={styles['prev-btn']} onClick={onPrevYear}>
                &#8249;
              </Button>
            )}
            <Button not className={styles['year-btn']} onClick={onYearClick}>
              {year}년
            </Button>
            {onNextYear && (
              <Button not className={styles['next-btn']} onClick={onNextYear}>
                &#8250;
              </Button>
            )}
          </>
        )}
        {mode === 'year' && (
          <span className={styles['year-range']}>
            {Math.floor(year / 10) * 10} - {Math.floor(year / 10) * 10 + 9}
          </span>
        )}
      </div>
    </div>
  );
};
// Swiper를 사용한 달력 슬라이더 컴포넌트 - 개선된 버전
interface CalendarSwiperProps {
  currentDate: Date;
  mode: DatepickerMode;
  type: PickerType;
  selectedDate?: DateValue;
  selectedRange?: RangeValue;
  onDateSelect: (date: Date) => void;
  onViewChange: (date: Date) => void;
  popupVisible: boolean;
  onSwiperReady?: (methods: {
    goToPrevMonth: () => void;
    goToNextMonth: () => void;
  }) => void;
}

const CalendarSwiper: React.FC<CalendarSwiperProps> = ({
  currentDate,
  type,
  selectedDate,
  selectedRange,
  onDateSelect,
  onViewChange,
  popupVisible,
  onSwiperReady,
}) => {
  const swiperRef = useRef<SwiperRef>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false); // 전환 중 상태 추가

  // 월 배열을 상태로 관리 (무한 스크롤을 위해)
  const [months, setMonths] = useState(() => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    return [prevMonth, currentDate, nextMonth];
  });

  // 외부에서 사용할 수 있는 메서드들
  const goToPrevMonth = useCallback(() => {
    if (swiperRef.current && currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      swiperRef.current.slideTo(currentIndex - 1, 300);
    }
  }, [currentIndex, isTransitioning]);

  const goToNextMonth = useCallback(() => {
    if (
      swiperRef.current &&
      currentIndex < months.length - 1 &&
      !isTransitioning
    ) {
      setIsTransitioning(true);
      swiperRef.current.slideTo(currentIndex + 1, 300);
    }
  }, [currentIndex, months.length, isTransitioning]);

  // 메서드들을 외부로 노출
  useEffect(() => {
    if (onSwiperReady) {
      onSwiperReady({ goToPrevMonth, goToNextMonth });
    }
  }, [onSwiperReady, goToPrevMonth, goToNextMonth]);

  // 팝업이 열릴 때 Swiper 업데이트
  useEffect(() => {
    if (popupVisible && swiperRef.current) {
      const timer = setTimeout(() => {
        swiperRef.current?.update?.();
        swiperRef.current?.slideTo?.(1, 0);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [popupVisible]);

  // currentDate가 변경될 때 처리 (개선된 버전)
  useEffect(() => {
    console.log('🔄 CalendarSwiper useEffect 실행됨:', {
      currentDate: currentDate.toISOString().split('T')[0],
      popupVisible,
      isTransitioning,
    });

    if (isTransitioning) {
      console.log('⚠️ 전환 중이므로 처리 건너뛰기');
      return;
    }

    // 현재 월 배열에 currentDate가 있는지 확인
    setMonths((prevMonths) => {
      const currentMonth = prevMonths.find(
        (month) =>
          month.getFullYear() === currentDate.getFullYear() &&
          month.getMonth() === currentDate.getMonth()
      );

      if (!currentMonth) {
        console.log('⚠️ 전체 월 배열 재생성 실행');
        // 전체 월 배열 재생성
        const prevMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        const nextMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        );

        // 새로운 배열로 설정
        const newMonths = [prevMonth, currentDate, nextMonth];

        // currentIndex를 1로 설정
        setCurrentIndex(1);

        if (swiperRef.current && popupVisible) {
          setTimeout(() => {
            swiperRef.current?.slideTo?.(1, 0);
          }, 50);
        }

        return newMonths;
      } else {
        // 기존 배열에서 currentDate의 인덱스 찾기
        const targetIndex = prevMonths.findIndex(
          (month) =>
            month.getFullYear() === currentDate.getFullYear() &&
            month.getMonth() === currentDate.getMonth()
        );

        if (targetIndex !== -1) {
          console.log('⚠️ currentIndex 변경:', {
            to: targetIndex,
          });

          // currentIndex 업데이트
          setCurrentIndex(targetIndex);

          if (swiperRef.current && popupVisible) {
            swiperRef.current?.slideTo?.(targetIndex, 300);
          }
        }

        // 배열은 그대로 유지
        return prevMonths;
      }
    });
  }, [currentDate, popupVisible, isTransitioning]);

  // 슬라이드 변경 시 - 단순히 인덱스 업데이트와 뷰 변경만 처리
  const handleSlideChange = (swiper: { activeIndex: number }) => {
    const index = swiper.activeIndex;
    console.log('📍 handleSlideChange:', {
      oldIndex: currentIndex,
      newIndex: index,
      monthsLength: months.length,
    });

    setCurrentIndex(index);

    // 뷰 변경 알림 (월 추가는 하지 않음)
    if (months[index]) {
      onViewChange(months[index]);
    }
  };

  // 슬라이드 전환 완료 후 - 새로운 월 추가 로직 처리
  const handleSlideChangeTransitionEnd = useCallback(
    (swiper: { activeIndex: number }) => {
      const index = swiper.activeIndex;
      console.log('✅ handleSlideChangeTransitionEnd:', {
        index,
        monthsLength: months.length,
        isTransitioning,
        currentMonth: months[index]?.toISOString().split('T')[0],
      });

      setIsTransitioning(false); // 전환 완료

      // 경계 인덱스에서 새로운 월 추가
      if (index === 0) {
        // 이전월로 이동 완료 - 앞에 월 추가
        console.log('🔙 이전월 추가 로직 실행 - 사용자는 현재 인덱스 0에 있음');
        const newPrevMonth = new Date(
          months[0].getFullYear(),
          months[0].getMonth() - 1,
          1
        );

        setMonths((prev) => {
          const newMonths = [newPrevMonth, ...prev];
          console.log(
            '🔙 새로운 월 배열:',
            newMonths.map((m) => m.toISOString().split('T')[0])
          );
          return newMonths;
        });

        // 사용자가 보고 있는 월은 이제 인덱스 1이 됨
        // 하지만 Swiper는 계속 현재 위치(물리적으로는 이제 인덱스 1)에 있어야 함
        setCurrentIndex(1);

        // Swiper의 내부 인덱스를 조정 (사용자에게는 보이지 않음)
        // 약간의 지연 후 실행하여 DOM 업데이트 완료 후 적용
        requestAnimationFrame(() => {
          if (swiperRef.current && swiperRef.current.swiper) {
            // Swiper 내부 activeIndex를 직접 업데이트
            swiperRef.current.swiper.activeIndex = 1;
            swiperRef.current.swiper.realIndex = 1;
            // 슬라이드를 이동시키지 않고 내부 상태만 업데이트
            swiperRef.current.swiper.update();
            console.log('🔙 Swiper 내부 인덱스 1로 조정 (이동 없음)');
          }
        });
      } else if (index === months.length - 1) {
        // 다음월로 이동 완료 - 뒤에 월 추가
        console.log('🔜 다음월 추가 로직 실행');
        const newNextMonth = new Date(
          months[months.length - 1].getFullYear(),
          months[months.length - 1].getMonth() + 1,
          1
        );

        setMonths((prev) => {
          const newMonths = [...prev, newNextMonth];
          console.log(
            '🔜 새로운 월 배열:',
            newMonths.map((m) => m.toISOString().split('T')[0])
          );
          return newMonths;
        });

        // 다음월의 경우 인덱스는 그대로 유지 (맨 뒤에 추가했으므로)
      }
    },
    [months, isTransitioning]
  );

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  const handleRangeChange = (range: DateRange) => {
    if (type === 'range') {
      onDateSelect(range.endDate || range.startDate!);
    }
  };

  // Range 값을 DateRange 형태로 변환
  const calendarRange: DateRange | undefined = useMemo(() => {
    if (type === 'range' && selectedRange) {
      return {
        startDate: selectedRange[0] || undefined,
        endDate: selectedRange[1] || undefined,
      };
    }
    return undefined;
  }, [type, selectedRange]);

  return (
    <div className={styles['calendar-swiper']}>
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        initialSlide={1}
        onSlideChange={handleSlideChange}
        onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd} // 새로 추가
        centeredSlides={true}
        allowTouchMove={true}
        autoHeight={true}
      >
        {months.map((monthDate) => (
          <SwiperSlide
            key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}
          >
            <Calendar
              value={monthDate}
              selectedDate={
                type === 'single' ? selectedDate || undefined : undefined
              }
              mode={type}
              range={calendarRange}
              onSelected={handleDateClick}
              onRangeChange={handleRangeChange}
              showAdjacentMonths={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
// 팝업 컴포넌트
interface DatepickerPopupProps {
  visible: boolean;
  mode: DatepickerMode;
  type: PickerType;
  currentDate: Date;
  selectedDate: DateValue;
  selectedRange: RangeValue;
  onDateSelect: (date: Date) => void;
}

const DatepickerPopup: React.FC<DatepickerPopupProps> = ({
  visible,
  mode,
  type,
  currentDate,
  selectedDate,
  selectedRange,
  onDateSelect,
}) => {
  const [viewDate, setViewDate] = useState(currentDate);
  const [viewMode, setViewMode] = useState<'calendar' | 'month' | 'year'>(
    'calendar'
  );

  useEffect(() => {
    if (visible) {
      setViewDate(selectedDate || new Date());
      setViewMode('calendar');
    }
  }, [visible, selectedDate]);

  const handleMonthClick = () => {
    if (mode === 'date') {
      setViewMode('month');
    }
  };

  const handleYearClick = () => {
    setViewMode('year');
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(viewDate.getFullYear(), month, 1);
    setViewDate(newDate);

    if (mode === 'month') {
      onDateSelect(newDate);
    } else {
      setViewMode('calendar');
    }
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, viewDate.getMonth(), 1);
    setViewDate(newDate);

    if (mode === 'year') {
      onDateSelect(newDate);
    } else if (mode === 'month') {
      setViewMode('calendar');
    } else {
      setViewMode('month');
    }
  };

  const handleCancel = () => {
    setViewMode('calendar');
  };

  const handleCalendarViewChange = useCallback((date: Date) => {
    setViewDate(date);
  }, []);

  const [swiperMethods, setSwiperMethods] = useState<{
    goToPrevMonth: () => void;
    goToNextMonth: () => void;
  } | null>(null);

  const handleSwiperReady = useCallback(
    (methods: { goToPrevMonth: () => void; goToNextMonth: () => void }) => {
      setSwiperMethods(methods);
    },
    []
  );

  // 월 이동 함수들 - Swiper 메서드 사용
  const handlePrevMonth = useCallback(() => {
    if (swiperMethods) {
      swiperMethods.goToPrevMonth();
    }
  }, [swiperMethods]);

  const handleNextMonth = useCallback(() => {
    if (swiperMethods) {
      swiperMethods.goToNextMonth();
    }
  }, [swiperMethods]);

  // 년도 이동 함수들
  const handlePrevYear = useCallback(() => {
    const prevYear = new Date(
      viewDate.getFullYear() - 1,
      viewDate.getMonth(),
      1
    );
    setViewDate(prevYear);
  }, [viewDate]);

  const handleNextYear = useCallback(() => {
    const nextYear = new Date(
      viewDate.getFullYear() + 1,
      viewDate.getMonth(),
      1
    );
    setViewDate(nextYear);
  }, [viewDate]);

  // 월/년 모드에서 직접 Calendar 사용
  const renderDirectCalendar = () => {
    if (mode === 'month') {
      const months = [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ];

      return (
        <div className={styles['month-grid']}>
          {months.map((month, index) => {
            const isSelected =
              type === 'single'
                ? selectedDate &&
                  selectedDate.getMonth() === index &&
                  selectedDate.getFullYear() === viewDate.getFullYear()
                : selectedRange &&
                  ((selectedRange[0] &&
                    selectedRange[0].getMonth() === index &&
                    selectedRange[0].getFullYear() ===
                      viewDate.getFullYear()) ||
                    (selectedRange[1] &&
                      selectedRange[1].getMonth() === index &&
                      selectedRange[1].getFullYear() ===
                        viewDate.getFullYear()));

            return (
              <button
                key={index}
                type="button"
                className={`${styles['month-item']} ${
                  isSelected ? styles.selected : ''
                }`}
                onClick={() => {
                  const selectedDate = new Date(
                    viewDate.getFullYear(),
                    index,
                    1
                  );
                  onDateSelect(selectedDate);
                }}
              >
                {month}
              </button>
            );
          })}
        </div>
      );
    }

    if (mode === 'year') {
      const currentYear = viewDate.getFullYear();
      const startYear = Math.floor(currentYear / 10) * 10;
      const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

      return (
        <div className={styles['year-grid']}>
          {years.map((year) => {
            const isSelected =
              type === 'single'
                ? selectedDate && selectedDate.getFullYear() === year
                : selectedRange &&
                  ((selectedRange[0] &&
                    selectedRange[0].getFullYear() === year) ||
                    (selectedRange[1] &&
                      selectedRange[1].getFullYear() === year));
            const isOutside = year < startYear || year > startYear + 9;

            return (
              <button
                key={year}
                type="button"
                className={`${styles['year-item']} ${
                  isSelected ? styles.selected : ''
                } ${isOutside ? styles.outside : ''}`}
                onClick={() => {
                  const selectedDate = new Date(year, 0, 1);
                  onDateSelect(selectedDate);
                }}
              >
                {year}
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles['popup-content']}>
      <CalendarHeader
        currentDate={viewDate}
        mode={mode}
        onMonthClick={handleMonthClick}
        onYearClick={handleYearClick}
        onPrevMonth={mode === 'date' ? handlePrevMonth : undefined}
        onNextMonth={mode === 'date' ? handleNextMonth : undefined}
        onPrevYear={handlePrevYear}
        onNextYear={handleNextYear}
      />

      {viewMode === 'calendar' && mode === 'date' && (
        <CalendarSwiper
          currentDate={viewDate}
          mode={mode}
          type={type}
          selectedDate={selectedDate}
          selectedRange={selectedRange}
          onDateSelect={onDateSelect}
          onViewChange={handleCalendarViewChange}
          onSwiperReady={handleSwiperReady}
          popupVisible={visible}
        />
      )}

      {viewMode === 'calendar' && mode !== 'date' && (
        <div className={styles['direct-calendar']}>
          {renderDirectCalendar()}
        </div>
      )}

      {viewMode === 'month' && (
        <MonthSelector
          currentYear={viewDate.getFullYear()}
          selectedMonth={selectedDate?.getMonth()}
          onMonthSelect={handleMonthSelect}
          onYearClick={handleYearClick}
          onCancel={handleCancel}
        />
      )}

      {viewMode === 'year' && (
        <YearSelector
          currentYear={viewDate.getFullYear()}
          selectedYear={selectedDate?.getFullYear()}
          onYearSelect={handleYearSelect}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

DatepickerPopup.displayName = 'DatepickerPopup';

// 메인 Datepicker 컴포넌트
const DatepickerMain = forwardRef<HTMLDivElement, DatepickerMainProps>(
  (
    {
      mode = 'date',
      type = 'single',
      value,
      onChange,
      placeholder,
      disabled = false,
      className = '',
      inputClassName = '',
      popupClassName = '',
      format,
      allowClear = true,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [rangeInputValues, setRangeInputValues] = useState(['', '']);
    const containerRef = useRef<HTMLDivElement>(null);

    // 기본 포맷 설정
    const defaultFormat = useMemo(() => {
      switch (mode) {
        case 'year':
          return 'YYYY';
        case 'month':
          return 'YYYY-MM';
        default:
          return 'YYYY-MM-DD';
      }
    }, [mode]);

    const dateFormat = format || defaultFormat;

    // 기본 플레이스홀더 설정
    const defaultPlaceholder = useMemo(() => {
      switch (mode) {
        case 'year':
          return type === 'range' ? ['시작 년도', '종료 년도'] : '년도 선택';
        case 'month':
          return type === 'range' ? ['시작 월', '종료 월'] : '월 선택';
        default:
          return type === 'range' ? ['시작일', '종료일'] : '날짜 선택';
      }
    }, [mode, type]);

    const finalPlaceholder = placeholder || defaultPlaceholder;

    // 값 변경 시 입력 필드 업데이트
    useEffect(() => {
      if (type === 'single') {
        const singleValue = value as DateValue;
        setInputValue(singleValue ? formatDate(singleValue, dateFormat) : '');
      } else {
        const rangeValue = value as RangeValue;
        setRangeInputValues([
          rangeValue?.[0] ? formatDate(rangeValue[0], dateFormat) : '',
          rangeValue?.[1] ? formatDate(rangeValue[1], dateFormat) : '',
        ]);
      }
    }, [value, dateFormat, type]);

    const handleInputChange = (newValue: string) => {
      if (type === 'single') {
        setInputValue(newValue);
        const parsedDate = parseDate(newValue, dateFormat);
        if (parsedDate) {
          onChange?.(parsedDate);
        } else if (!newValue) {
          onChange?.(null);
        }
      }
    };

    const handleRangeInputChange = (index: 0 | 1) => (newValue: string) => {
      const newValues = [...rangeInputValues];
      newValues[index] = newValue;
      setRangeInputValues(newValues);

      const parsedDate = parseDate(newValue, dateFormat);
      const currentRange = (value as RangeValue) || [null, null];
      const newRange: RangeValue = [...currentRange];

      if (parsedDate) {
        newRange[index] = parsedDate;
      } else if (!newValue) {
        newRange[index] = null;
      }

      onChange?.(newRange);
    };

    const handleDateSelect = (date: Date) => {
      if (type === 'single') {
        onChange?.(date);
        setOpen(false);
      } else {
        // Range 모드 처리는 Calendar 컴포넌트에서 처리됨
        const currentRange = (value as RangeValue) || [null, null];

        if (!currentRange[0] || (currentRange[0] && currentRange[1])) {
          onChange?.([date, null]);
        } else {
          const start = currentRange[0];
          const end = date;

          if (start.getTime() > end.getTime()) {
            onChange?.([end, start]);
          } else {
            onChange?.([start, end]);
          }
          setOpen(false);
        }
      }
    };

    const handleClear = () => {
      if (type === 'single') {
        onChange?.(null);
        setInputValue('');
      } else {
        onChange?.([null, null]);
        setRangeInputValues(['', '']);
      }
    };

    const selectedDate = type === 'single' ? (value as DateValue) : null;
    const selectedRange: RangeValue =
      type === 'range' ? (value as RangeValue) : [null, null];

    return (
      <div
        ref={(node) => {
          // ref를 처리하고 containerRef에도 할당
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          containerRef.current = node;
        }}
        className={`${styles.datepicker} ${styles[type]} ${className}`}
      >
        <Dropdown
          visible={open}
          onVisibleChange={setOpen}
          placement="auto"
          maxHeight="auto"
          autoAdjustOverflow={true}
          overlayClassName={cx('datepicker-dropdown', popupClassName)}
          trigger={
            type === 'single' ? (
              <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              >
                <Input
                  value={inputValue}
                  onValueChange={handleInputChange}
                  placeholder={finalPlaceholder as string}
                  disabled={disabled}
                  readOnly={true}
                  className={inputClassName}
                />
                <Button size="sm" className="primary" disabled={disabled}>
                  달력
                </Button>
              </div>
            ) : (
              <div className={styles['range-inputs']}>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <Input
                    value={rangeInputValues[0]}
                    onValueChange={handleRangeInputChange(0)}
                    placeholder={(finalPlaceholder as [string, string])[0]}
                    disabled={disabled}
                    readOnly={true}
                    className={inputClassName}
                  />
                </div>
                <span className={styles.separator}>~</span>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <Input
                    value={rangeInputValues[1]}
                    onValueChange={handleRangeInputChange(1)}
                    placeholder={(finalPlaceholder as [string, string])[1]}
                    disabled={disabled}
                    readOnly={true}
                    className={inputClassName}
                  />
                </div>
                <Button
                  size="sm"
                  className="primary"
                  disabled={disabled}
                  style={{ marginLeft: '0.5rem' }}
                >
                  달력
                </Button>
                {allowClear &&
                  (rangeInputValues[0] || rangeInputValues[1]) &&
                  !disabled && (
                    <button
                      type="button"
                      className={styles['range-clear-btn']}
                      onClick={handleClear}
                      aria-label="지우기"
                    >
                      ✕
                    </button>
                  )}
              </div>
            )
          }
        >
          <DatepickerPopup
            visible={open}
            mode={mode}
            type={type}
            currentDate={selectedDate || new Date()}
            selectedDate={selectedDate}
            selectedRange={selectedRange}
            onDateSelect={handleDateSelect}
          />
        </Dropdown>
      </div>
    );
  }
);

DatepickerMain.displayName = 'DatepickerMain';

// Datepicker 컴포넌트 (단일 날짜)
const Datepicker = forwardRef<HTMLDivElement, SingleDatepickerProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (value: DateValue | RangeValue) => {
      onChange?.(value as DateValue);
    };

    return (
      <DatepickerMain
        {...props}
        type="single"
        onChange={handleChange}
        ref={ref}
      />
    );
  }
);

Datepicker.displayName = 'Datepicker';

// Rangepicker 컴포넌트 (날짜 범위)
const Rangepicker = forwardRef<HTMLDivElement, RangeDatepickerProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (value: DateValue | RangeValue) => {
      onChange?.(value as RangeValue);
    };

    return (
      <DatepickerMain
        {...props}
        type="range"
        onChange={handleChange}
        ref={ref}
      />
    );
  }
);

Rangepicker.displayName = 'Rangepicker';

// Monthpicker 컴포넌트 (월 선택)
const Monthpicker = forwardRef<HTMLDivElement, SingleDatepickerProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (value: DateValue | RangeValue) => {
      onChange?.(value as DateValue);
    };

    return (
      <DatepickerMain
        {...props}
        mode="month"
        type="single"
        onChange={handleChange}
        ref={ref}
      />
    );
  }
);

Monthpicker.displayName = 'Monthpicker';

// Yearpicker 컴포넌트 (년도 선택)
const Yearpicker = forwardRef<HTMLDivElement, SingleDatepickerProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (value: DateValue | RangeValue) => {
      onChange?.(value as DateValue);
    };

    return (
      <DatepickerMain
        {...props}
        mode="year"
        type="single"
        onChange={handleChange}
        ref={ref}
      />
    );
  }
);

Yearpicker.displayName = 'Yearpicker';

// MonthRangepicker 컴포넌트 (월 범위 선택)
const MonthRangepicker = forwardRef<HTMLDivElement, RangeDatepickerProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (value: DateValue | RangeValue) => {
      onChange?.(value as RangeValue);
    };

    return (
      <DatepickerMain
        {...props}
        mode="month"
        type="range"
        onChange={handleChange}
        ref={ref}
      />
    );
  }
);

MonthRangepicker.displayName = 'MonthRangepicker';

// YearRangepicker 컴포넌트 (년도 범위 선택)
const YearRangepicker = forwardRef<HTMLDivElement, RangeDatepickerProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (value: DateValue | RangeValue) => {
      onChange?.(value as RangeValue);
    };

    return (
      <DatepickerMain
        {...props}
        mode="year"
        type="range"
        onChange={handleChange}
        ref={ref}
      />
    );
  }
);

YearRangepicker.displayName = 'YearRangepicker';

// Datepicker에 정적 속성으로 다른 컴포넌트들 추가
const DatepickerWithSubComponents = Object.assign(Datepicker, {
  Rangepicker,
  Monthpicker,
  Yearpicker,
  MonthRangepicker,
  YearRangepicker,
});

export {
  Rangepicker,
  Monthpicker,
  Yearpicker,
  MonthRangepicker,
  YearRangepicker,
};
export default DatepickerWithSubComponents;
