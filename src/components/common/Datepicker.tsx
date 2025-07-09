// src/components/common/Datepicker.tsx
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useMemo,
} from 'react';
import {
  Button,
  Input,
  Calendar,
  Swiper,
  SwiperSlide,
} from '@/components/common';
import type { SwiperRef } from '@/components/common/Swiper';
import type { DateRange } from '@/components/common/Calendar';
import styles from '@/assets/scss/components/datepicker.module.scss';

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
  placeholder?: string;
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

// Datepicker.tsx.part2 - 년도/월 선택 UI 컴포넌트들

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
});

DatepickerPopup.displayName = 'DatepickerPopup';

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
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  mode,
  onMonthClick,
  onYearClick,
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
            <Button not className={styles['year-btn']} onClick={onYearClick}>
              {year}년
            </Button>
            <Button not className={styles['month-btn']} onClick={onMonthClick}>
              {monthNames[month]}
            </Button>
          </>
        )}
        {mode === 'month' && (
          <Button not className={styles['year-btn']} onClick={onYearClick}>
            {year}년
          </Button>
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

// Swiper를 사용한 달력 슬라이더 컴포넌트
interface CalendarSwiperProps {
  currentDate: Date;
  mode: DatepickerMode;
  type: PickerType;
  selectedDate?: DateValue;
  selectedRange?: RangeValue;
  onDateSelect: (date: Date) => void;
  onViewChange: (date: Date) => void;
  popupVisible: boolean; // 팝업 표시 여부 추가
}

const CalendarSwiper: React.FC<CalendarSwiperProps> = ({
  currentDate,
  mode,
  type,
  selectedDate,
  selectedRange,
  onDateSelect,
  onViewChange,
  popupVisible,
}) => {
  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(1); // 중간 슬라이드부터 시작

  // 3개월 데이터 생성 (이전월, 현재월, 다음월)
  const months = useMemo(() => {
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
  }, [currentDate]);

  // 팝업이 열릴 때 Swiper 업데이트 (display:none 문제 해결)
  useEffect(() => {
    if (popupVisible && swiperRef.current) {
      // 팝업이 표시된 후 약간의 지연을 두고 Swiper 업데이트
      const timer = setTimeout(() => {
        swiperRef.current?.update?.();
        // 현재 월이 중간(인덱스 1)에 오도록 조정
        swiperRef.current?.slideTo?.(1, 0);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [popupVisible]);

  // currentDate가 변경될 때 중간 슬라이드로 이동
  useEffect(() => {
    if (swiperRef.current && popupVisible) {
      setActiveIndex(1);
      swiperRef.current?.slideTo?.(1, 300);
    }
  }, [currentDate, popupVisible]);

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);

    if (index === 0) {
      // 이전월로 이동
      const prevMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      onViewChange(prevMonth);
    } else if (index === 2) {
      // 다음월로 이동
      const nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
      onViewChange(nextMonth);
    }
  };

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
        centeredSlides={true}
        allowTouchMove={true}
      >
        {months.map((monthDate, index) => (
          <SwiperSlide
            key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}
          >
            <Calendar
              value={monthDate}
              selectedDate={type === 'single' ? selectedDate : undefined}
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

// Datepicker.tsx.part3 - 메인 Datepicker 컴포넌트

// 팝업 컴포넌트
interface DatepickerPopupProps {
  visible: boolean;
  mode: DatepickerMode;
  type: PickerType;
  currentDate: Date;
  selectedDate: DateValue;
  selectedRange: RangeValue;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  className?: string;
}

const DatepickerPopup = React.forwardRef<HTMLDivElement, DatepickerPopupProps>(({
  visible,
  mode,
  type,
  currentDate,
  selectedDate,
  selectedRange,
  onDateSelect,
  onClose,
  className = '',
}, ref) => {
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

  const handleCalendarViewChange = (date: Date) => {
    setViewDate(date);
  };

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

  if (!visible) return null;

  return (
    <div ref={ref} className={`${styles.popup} ${className}`}>
      <div className={styles['popup-content']}>
        <CalendarHeader
          currentDate={viewDate}
          mode={mode}
          onMonthClick={handleMonthClick}
          onYearClick={handleYearClick}
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
    </div>
  );
};

// 메인 Datepicker 컴포넌트
const DatepickerMain: React.FC<DatepickerMainProps> = ({
  mode = 'date',
  type = 'single',
  value,
  onChange,
  placeholder,
  disabled = false,
  size = 'md',
  className = '',
  inputClassName = '',
  popupClassName = '',
  format,
  allowClear = true,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [rangeInputValues, setRangeInputValues] = useState(['', '']);
  const popupRef = useRef<HTMLDivElement>(null);
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

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // 팝업 위치 조정
  useEffect(() => {
    if (open && popupRef.current && containerRef.current) {
      const container = containerRef.current;
      const popup = popupRef.current;
      const containerRect = container.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top = containerRect.bottom + 4;
      let left = containerRect.left;

      if (top + popupRect.height > viewportHeight - 10) {
        top = containerRect.top - popupRect.height - 4;
      }

      if (left + popupRect.width > viewportWidth - 10) {
        left = viewportWidth - popupRect.width - 10;
      }

      if (left < 10) {
        left = 10;
      }

      popup.style.position = 'fixed';
      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;
      popup.style.zIndex = '1000';
    }
  }, [open]);

  const handleInputClick = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

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
  const selectedRange = type === 'range' ? (value as RangeValue) : [null, null];

  return (
    <div
      ref={containerRef}
      className={`${styles.datepicker} ${styles[type]} ${className}`}
    >
      {type === 'single' ? (
        <Input
          value={inputValue}
          onValueChange={handleInputChange}
          placeholder={finalPlaceholder as string}
          disabled={disabled}
          readOnly={true}
          className={inputClassName}
        />
      ) : (
        <div className={styles['range-inputs']}>
          <Input
            value={rangeInputValues[0]}
            onValueChange={handleRangeInputChange(0)}
            placeholder={(finalPlaceholder as [string, string])[0]}
            disabled={disabled}
            readOnly={true}
            className={inputClassName}
          />
          <span className={styles.separator}>~</span>
          <Input
            value={rangeInputValues[1]}
            onValueChange={handleRangeInputChange(1)}
            placeholder={(finalPlaceholder as [string, string])[1]}
            disabled={disabled}
            readOnly={true}
            className={inputClassName}
          />
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
      )}

      <DatepickerPopup
        ref={popupRef}
        visible={open}
        mode={mode}
        type={type}
        currentDate={selectedDate || new Date()}
        selectedDate={selectedDate}
        selectedRange={selectedRange}
        onDateSelect={handleDateSelect}
        onClose={() => setOpen(false)}
        className={popupClassName}
      />
    </div>
  );
};

// Datepicker.tsx.part4 - Export 및 래퍼 컴포넌트들

// Datepicker 컴포넌트 (단일 날짜)
const Datepicker = forwardRef<HTMLDivElement, SingleDatepickerProps>(
  (props, ref) => {
    return <DatepickerMain {...props} type="single" ref={ref} />;
  }
);

Datepicker.displayName = 'Datepicker';

// Rangepicker 컴포넌트 (날짜 범위)
const Rangepicker = forwardRef<HTMLDivElement, RangeDatepickerProps>(
  (props, ref) => {
    return <DatepickerMain {...props} type="range" ref={ref} />;
  }
);

Rangepicker.displayName = 'Rangepicker';

// Monthpicker 컴포넌트 (월 선택)
const Monthpicker = forwardRef<HTMLDivElement, SingleDatepickerProps>(
  (props, ref) => {
    return <DatepickerMain {...props} mode="month" type="single" ref={ref} />;
  }
);

Monthpicker.displayName = 'Monthpicker';

// Yearpicker 컴포넌트 (년도 선택)
const Yearpicker = forwardRef<HTMLDivElement, SingleDatepickerProps>(
  (props, ref) => {
    return <DatepickerMain {...props} mode="year" type="single" ref={ref} />;
  }
);

Yearpicker.displayName = 'Yearpicker';

// MonthRangepicker 컴포넌트 (월 범위 선택)
const MonthRangepicker = forwardRef<HTMLDivElement, RangeDatepickerProps>(
  (props, ref) => {
    return <DatepickerMain {...props} mode="month" type="range" ref={ref} />;
  }
);

MonthRangepicker.displayName = 'MonthRangepicker';

// YearRangepicker 컴포넌트 (년도 범위 선택)
const YearRangepicker = forwardRef<HTMLDivElement, RangeDatepickerProps>(
  (props, ref) => {
    return <DatepickerMain {...props} mode="year" type="range" ref={ref} />;
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
