// src/components/common/DatePicker.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Button, Popup, Calendar, Select } from '@/components/common';
import styles from '@/assets/scss/components/datePicker.module.scss';

// 월 정보 생성
const createMonthInfo = (year: number, month: number) => ({
  year,
  month,
  date: new Date(year, month, 1),
});

// DatePicker 컴포넌트 외부에서 사용할 수 있는 메서드
export interface DatePickerRef {
  open: () => void;
  close: () => void;
  setValue: (date: Date | null) => void;
  getValue: () => Date | null;
}

// DatePicker Props
export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  visible?: boolean;
  onChange?: (date: Date | null) => void;
  onVisibleChange?: (visible: boolean) => void;
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  showToday?: boolean;
  allowClear?: boolean;
  className?: string;
  popupClassName?: string;
}

// 월 정보 인터페이스
interface MonthInfo {
  year: number;
  month: number;
  date: Date;
}

// DatePicker Swiper 컴포넌트
interface DatePickerSwiperProps {
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onViewChange: (date: Date) => void;
  disabledDate?: (date: Date) => boolean;
}

const DatePickerSwiper: React.FC<DatePickerSwiperProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onViewChange,
  disabledDate,
}) => {
  const swiperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1); // 중간 슬라이드부터 시작
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchMove, setTouchMove] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  // 현재 표시할 3개월 정보 (이전달, 현재달, 다음달)
  const [months, setMonths] = useState<MonthInfo[]>(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return [
      createMonthInfo(
        month === 0 ? year - 1 : year,
        month === 0 ? 11 : month - 1
      ),
      createMonthInfo(year, month),
      createMonthInfo(
        month === 11 ? year + 1 : year,
        month === 11 ? 0 : month + 1
      ),
    ];
  });

  // currentDate가 변경될 때 months 업데이트
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    setMonths([
      createMonthInfo(
        month === 0 ? year - 1 : year,
        month === 0 ? 11 : month - 1
      ),
      createMonthInfo(year, month),
      createMonthInfo(
        month === 11 ? year + 1 : year,
        month === 11 ? 0 : month + 1
      ),
    ]);
  }, [currentDate]);

  // 슬라이드 위치 업데이트
  const updateSlidePosition = useCallback(
    (index: number, animate: boolean = true) => {
      if (!swiperRef.current) return;

      if (animate) {
        setIsTransitioning(true);
        swiperRef.current.style.transition = 'transform 0.3s ease-out';
      } else {
        swiperRef.current.style.transition = 'none';
      }

      swiperRef.current.style.transform = `translateX(-${index * 100}%)`;

      if (animate) {
        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    []
  );

  // 이전달로 이동
  const goToPrevMonth = useCallback(() => {
    if (isTransitioning) return;

    setCurrentIndex(0);
    updateSlidePosition(0);

    setTimeout(() => {
      const prevMonth = months[0];
      const newPrevMonth = createMonthInfo(
        prevMonth.month === 0 ? prevMonth.year - 1 : prevMonth.year,
        prevMonth.month === 0 ? 11 : prevMonth.month - 1
      );

      setMonths([newPrevMonth, months[0], months[1]]);
      setCurrentIndex(1);
      updateSlidePosition(1, false);
      onViewChange(months[0].date);
    }, 300);
  }, [months, isTransitioning, updateSlidePosition, onViewChange]);

  // 다음달로 이동
  const goToNextMonth = useCallback(() => {
    if (isTransitioning) return;

    setCurrentIndex(2);
    updateSlidePosition(2);

    setTimeout(() => {
      const nextMonth = months[2];
      const newNextMonth = createMonthInfo(
        nextMonth.month === 11 ? nextMonth.year + 1 : nextMonth.year,
        nextMonth.month === 11 ? 0 : nextMonth.month + 1
      );

      setMonths([months[1], months[2], newNextMonth]);
      setCurrentIndex(1);
      updateSlidePosition(1, false);
      onViewChange(months[2].date);
    }, 300);
  }, [months, isTransitioning, updateSlidePosition, onViewChange]);

  // 터치 이벤트 처리
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isTransitioning) return;

      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
      setIsDragging(true);
    },
    [isTransitioning]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart || !isDragging || isTransitioning) return;

      const touch = e.touches[0];
      setTouchMove({ x: touch.clientX, y: touch.clientY });

      const deltaX = touch.clientX - touchStart.x;
      const deltaY = Math.abs(touch.clientY - touchStart.y);

      // 세로 스크롤이 더 크면 터치 무시
      if (deltaY > Math.abs(deltaX)) {
        setIsDragging(false);
        return;
      }

      // 가로 스크롤 방지
      e.preventDefault();

      if (swiperRef.current) {
        const currentTransform = -currentIndex * 100;
        const dragPercent =
          (deltaX / (containerRef.current?.offsetWidth || 1)) * 100;
        swiperRef.current.style.transition = 'none';
        swiperRef.current.style.transform = `translateX(${currentTransform + dragPercent}%)`;
      }
    },
    [touchStart, isDragging, currentIndex, isTransitioning]
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchMove || !isDragging) {
      setTouchStart(null);
      setTouchMove(null);
      setIsDragging(false);
      return;
    }

    const deltaX = touchMove.x - touchStart.x;
    const threshold = 50; // 최소 드래그 거리

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // 오른쪽으로 드래그 (이전달)
        goToPrevMonth();
      } else {
        // 왼쪽으로 드래그 (다음달)
        goToNextMonth();
      }
    } else {
      // 원래 위치로 복원
      updateSlidePosition(currentIndex);
    }

    setTouchStart(null);
    setTouchMove(null);
    setIsDragging(false);
  }, [
    touchStart,
    touchMove,
    isDragging,
    goToPrevMonth,
    goToNextMonth,
    updateSlidePosition,
    currentIndex,
  ]);

  // 마우스 이벤트 (데스크톱)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isTransitioning) return;

      setTouchStart({ x: e.clientX, y: e.clientY });
      setIsDragging(true);
    },
    [isTransitioning]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!touchStart || !isDragging || isTransitioning) return;

      setTouchMove({ x: e.clientX, y: e.clientY });

      const deltaX = e.clientX - touchStart.x;

      if (swiperRef.current) {
        const currentTransform = -currentIndex * 100;
        const dragPercent =
          (deltaX / (containerRef.current?.offsetWidth || 1)) * 100;
        swiperRef.current.style.transition = 'none';
        swiperRef.current.style.transform = `translateX(${currentTransform + dragPercent}%)`;
      }
    },
    [touchStart, isDragging, currentIndex, isTransitioning]
  );

  const handleMouseUp = useCallback(() => {
    handleTouchEnd();
  }, [handleTouchEnd]);

  // 초기 위치 설정
  useEffect(() => {
    updateSlidePosition(1, false);
  }, [updateSlidePosition]);

  return (
    <div
      ref={containerRef}
      className={styles['datepicker-swiper-container']}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={isDragging ? handleMouseUp : undefined}
      onMouseLeave={isDragging ? handleMouseUp : undefined}
    >
      <div ref={swiperRef} className={styles['datepicker-swiper']}>
        {months.map((monthInfo, index) => (
          <div
            key={`${monthInfo.year}-${monthInfo.month}`}
            className={styles['datepicker-slide']}
          >
            <Calendar
              value={monthInfo.date}
              selectedDate={
                index === currentIndex ? (selectedDate ?? undefined) : undefined
              }
              onChange={onDateSelect}
              disabledDate={disabledDate}
              showAdjacentMonths={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// DatePicker 헤더 컴포넌트
interface DatePickerHeaderProps {
  currentDate: Date;
  onPrevYear: () => void;
  onNextYear: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const DatePickerHeader: React.FC<DatePickerHeaderProps> = ({
  currentDate,
  onPrevYear,
  onNextYear,
  onPrevMonth,
  onNextMonth,
  onYearChange,
  onMonthChange,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 년도 옵션 생성 (현재 년도 기준 ±10년)
  const yearOptions = Array.from({ length: 21 }, (_, i) => {
    const yearValue = year - 10 + i;
    return {
      value: yearValue,
      label: `${yearValue}년`,
    };
  });

  // 월 옵션 생성
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: `${i + 1}월`,
  }));

  return (
    <div className={styles['datepicker-header']}>
      <div className={styles['datepicker-nav']}>
        <Button
          not
          className={styles['nav-btn']}
          onClick={onPrevYear}
          aria-label="이전 년도"
        >
          ≪
        </Button>
        <Button
          not
          className={styles['nav-btn']}
          onClick={onPrevMonth}
          aria-label="이전 달"
        >
          ‹
        </Button>
      </div>

      <div className={styles['datepicker-selectors']}>
        <Select
          value={year}
          onChange={onYearChange}
          options={yearOptions}
          className={styles['year-select']}
        />
        <Select
          value={month}
          onChange={onMonthChange}
          options={monthOptions}
          className={styles['month-select']}
        />
      </div>

      <div className={styles['datepicker-nav']}>
        <Button
          not
          className={styles['nav-btn']}
          onClick={onNextMonth}
          aria-label="다음 달"
        >
          ›
        </Button>
        <Button
          not
          className={styles['nav-btn']}
          onClick={onNextYear}
          aria-label="다음 년도"
        >
          ≫
        </Button>
      </div>
    </div>
  );
};

// 메인 DatePicker 컴포넌트
const DatePicker = forwardRef<DatePickerRef, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      visible = false,
      onChange,
      onVisibleChange,
      disabledDate,
      showToday = true,
      className = '',
      popupClassName = '',
    },
    ref
  ) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      value || defaultValue || null
    );
    const [currentViewDate, setCurrentViewDate] = useState<Date>(
      value || defaultValue || new Date()
    );

    // 외부 value가 변경될 때 내부 상태 업데이트
    useEffect(() => {
      if (value !== undefined) {
        setSelectedDate(value);
        if (value) {
          setCurrentViewDate(value);
        }
      }
    }, [value]);

    // 외부에서 사용할 메서드 정의
    useImperativeHandle(ref, () => ({
      open: () => {
        if (onVisibleChange) {
          onVisibleChange(true);
        }
      },
      close: () => {
        if (onVisibleChange) {
          onVisibleChange(false);
        }
      },
      setValue: (date: Date | null) => {
        setSelectedDate(date);
        if (date) {
          setCurrentViewDate(date);
        }
      },
      getValue: () => selectedDate,
    }));

    // 날짜 선택 핸들러
    const handleDateSelect = useCallback(
      (date: Date) => {
        setSelectedDate(date);
        if (onChange) {
          onChange(date);
        }
        // 날짜 선택 후 팝업 닫기
        if (onVisibleChange) {
          onVisibleChange(false);
        }
      },
      [onChange, onVisibleChange]
    );

    // 년도 변경 핸들러
    const handleYearChange = useCallback(
      (year: number) => {
        const newDate = new Date(year, currentViewDate.getMonth(), 1);
        setCurrentViewDate(newDate);
      },
      [currentViewDate]
    );

    // 월 변경 핸들러
    const handleMonthChange = useCallback(
      (month: number) => {
        const newDate = new Date(currentViewDate.getFullYear(), month, 1);
        setCurrentViewDate(newDate);
      },
      [currentViewDate]
    );

    // 이전/다음 년도 이동
    const handlePrevYear = useCallback(() => {
      const newDate = new Date(
        currentViewDate.getFullYear() - 1,
        currentViewDate.getMonth(),
        1
      );
      setCurrentViewDate(newDate);
    }, [currentViewDate]);

    const handleNextYear = useCallback(() => {
      const newDate = new Date(
        currentViewDate.getFullYear() + 1,
        currentViewDate.getMonth(),
        1
      );
      setCurrentViewDate(newDate);
    }, [currentViewDate]);

    // 이전/다음 월 이동
    const handlePrevMonth = useCallback(() => {
      const year = currentViewDate.getFullYear();
      const month = currentViewDate.getMonth();
      const newDate = new Date(
        month === 0 ? year - 1 : year,
        month === 0 ? 11 : month - 1,
        1
      );
      setCurrentViewDate(newDate);
    }, [currentViewDate]);

    const handleNextMonth = useCallback(() => {
      const year = currentViewDate.getFullYear();
      const month = currentViewDate.getMonth();
      const newDate = new Date(
        month === 11 ? year + 1 : year,
        month === 11 ? 0 : month + 1,
        1
      );
      setCurrentViewDate(newDate);
    }, [currentViewDate]);

    // 오늘 버튼 핸들러
    const handleTodayClick = useCallback(() => {
      const today = new Date();
      setCurrentViewDate(today);
      handleDateSelect(today);
    }, [handleDateSelect]);

    // 취소 버튼 핸들러
    const handleCancel = useCallback(() => {
      if (onVisibleChange) {
        onVisibleChange(false);
      }
    }, [onVisibleChange]);

    // 팝업 닫기 핸들러
    const handleClose = useCallback(() => {
      if (onVisibleChange) {
        onVisibleChange(false);
      }
    }, [onVisibleChange]);

    return (
      <Popup
        visible={visible}
        onClose={handleClose}
        type="modal"
        title="날짜 선택"
        width={400}
        className={`${styles['datepicker-popup']} ${popupClassName}`}
        footer={
          <div className={styles['datepicker-footer']}>
            {showToday && (
              <Button size="sm" onClick={handleTodayClick}>
                오늘
              </Button>
            )}
            <div className={styles['footer-buttons']}>
              <Button size="sm" className="line" onClick={handleCancel}>
                취소
              </Button>
            </div>
          </div>
        }
      >
        <div className={`${styles['datepicker-container']} ${className}`}>
          <DatePickerHeader
            currentDate={currentViewDate}
            onPrevYear={handlePrevYear}
            onNextYear={handleNextYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onYearChange={handleYearChange}
            onMonthChange={handleMonthChange}
          />
          <DatePickerSwiper
            currentDate={currentViewDate}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onViewChange={setCurrentViewDate}
            disabledDate={disabledDate}
          />
        </div>
      </Popup>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
