// src/components/common/Calendar.tsx
import React, {
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import styles from '@/assets/scss/components/calendar.module.scss';

// 달력 셀 정보 인터페이스
interface CalendarCell {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isWeekend: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  // range 기능 추가
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isRangeHover: boolean;
}

// Range 값 타입
export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

// Calendar 컴포넌트 외부에서 사용할 수 있는 메서드
export interface CalendarRef {
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToPrevYear: () => void;
  goToNextYear: () => void;
  goToDate: (date: Date) => void;
  getCurrentDate: () => Date;
}

// Calendar 컴포넌트 Props
interface CalendarProps {
  value?: Date; // 현재 표시할 년월 기준이 되는 날짜
  selectedDate?: Date; // 선택된 날짜
  defaultValue?: Date; // 기본값
  onChange?: (date: Date) => void; // 날짜 선택시 콜백
  onSelected?: (date: Date) => void; // 날짜 선택시 추가 콜백
  onViewChange?: (date: Date) => void; // 표시 년월 변경시 콜백
  disabledDate?: (date: Date) => boolean; // 비활성화할 날짜 판별 함수
  showAdjacentMonths?: boolean; // 이전/다음달 날짜 표시 여부
  weekdays?: string[]; // 요일 헤더 배열
  className?: string;
  cellRender?: (date: Date, info: CalendarCell) => React.ReactNode; // 커스텀 셀 렌더러
  
  // Range 기능 추가
  mode?: 'single' | 'range'; // 선택 모드
  range?: DateRange; // 날짜 범위
  onRangeChange?: (range: DateRange) => void; // 날짜 범위 변경시 콜백
}

// 유틸리티 함수들
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Range 관련 유틸리티 함수들
const isDateInRange = (date: Date, startDate?: Date, endDate?: Date): boolean => {
  if (!startDate || !endDate) return false;
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return compareDate >= start && compareDate <= end;
};

const getHoverRange = (startDate: Date, hoverDate: Date): { start: Date; end: Date } => {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const hover = new Date(hoverDate.getFullYear(), hoverDate.getMonth(), hoverDate.getDate());
  
  if (start <= hover) {
    return { start, end: hover };
  } else {
    return { start: hover, end: start };
  }
};

// 특정 년월의 달력 데이터 생성
const getMonthData = (
  year: number,
  month: number,
  selectedDate?: Date,
  disabledDate?: (date: Date) => boolean,
  showAdjacentMonths = false,
  // Range 기능 추가
  mode: 'single' | 'range' = 'single',
  range?: DateRange,
  hoverDate?: Date
): CalendarCell[][] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 첫 번째 주의 시작일 (일요일부터 시작)
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  // 마지막 날이 포함된 주의 토요일까지만 계산
  const lastDayOfWeek = lastDay.getDay(); // 마지막 날의 요일 (0: 일요일, 6: 토요일)
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDayOfWeek)); // 해당 주의 토요일까지

  const weeks: CalendarCell[][] = [];
  let currentWeek: CalendarCell[] = [];

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();
    const isCurrentMonth = currentDate.getMonth() === month;

    // 이전/다음달 날짜를 표시하지 않는 옵션인 경우 빈 셀 생성
    if (!showAdjacentMonths && !isCurrentMonth) {
      currentWeek.push({
        date: currentDate,
        day: 0, // 빈 셀 표시
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: true,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isSunday: dayOfWeek === 0,
        isSaturday: dayOfWeek === 6,
        // Range 기능
        isRangeStart: false,
        isRangeEnd: false,
        isInRange: false,
        isRangeHover: false,
      });
    } else {
      // Range 관련 상태 계산
      let isRangeStart = false;
      let isRangeEnd = false;
      let isInRange = false;
      let isRangeHover = false;
      
      if (mode === 'range' && range) {
        isRangeStart = range.startDate ? isSameDay(currentDate, range.startDate) : false;
        isRangeEnd = range.endDate ? isSameDay(currentDate, range.endDate) : false;
        isInRange = isDateInRange(currentDate, range.startDate, range.endDate);
        
        // 호버 상태 계산
        if (range.startDate && !range.endDate && hoverDate) {
          const hoverRange = getHoverRange(range.startDate, hoverDate);
          isRangeHover = isDateInRange(currentDate, hoverRange.start, hoverRange.end);
        }
      }
      
      const cell: CalendarCell = {
        date: currentDate,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday: isToday(currentDate),
        isSelected: mode === 'single' && selectedDate ? isSameDay(currentDate, selectedDate) : false,
        isDisabled: disabledDate ? disabledDate(currentDate) : false,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isSunday: dayOfWeek === 0,
        isSaturday: dayOfWeek === 6,
        // Range 기능
        isRangeStart,
        isRangeEnd,
        isInRange,
        isRangeHover,
      };

      currentWeek.push(cell);
    }

    // 토요일이면 주 완성
    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
};

// Calendar 컴포넌트
const Calendar = forwardRef<CalendarRef, CalendarProps>(
  (
    {
      value,
      selectedDate,
      defaultValue,
      onChange,
      onSelected,
      onViewChange,
      disabledDate,
      showAdjacentMonths = false,
      weekdays = ['일', '월', '화', '수', '목', '금', '토'],
      className = '',
      cellRender,
      // Range 기능
      mode = 'single',
      range,
      onRangeChange,
    },
    ref
  ) => {
    // 현재 표시할 년월 결정
    const currentDate = value || defaultValue || new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Range 모드에서 호버 상태 관리
    const [hoverDate, setHoverDate] = React.useState<Date | undefined>(undefined);

    // 달력 데이터 생성 (메모이제이션)
    const monthData = useMemo(
      () =>
        getMonthData(
          year,
          month,
          selectedDate,
          disabledDate,
          showAdjacentMonths,
          mode,
          range,
          hoverDate
        ),
      [year, month, selectedDate, disabledDate, showAdjacentMonths, mode, range, hoverDate]
    );

    // 외부에서 사용할 메서드 정의
    const createNewDate = useCallback(
      (targetYear: number, targetMonth: number) => {
        const newDate = new Date(targetYear, targetMonth, 1);
        if (onViewChange) {
          onViewChange(newDate);
        }
        return newDate;
      },
      [onViewChange]
    );

    useImperativeHandle(
      ref,
      () => ({
        goToPrevMonth: () => {
          createNewDate(
            month === 0 ? year - 1 : year,
            month === 0 ? 11 : month - 1
          );
        },
        goToNextMonth: () => {
          createNewDate(
            month === 11 ? year + 1 : year,
            month === 11 ? 0 : month + 1
          );
        },
        goToPrevYear: () => {
          createNewDate(year - 1, month);
        },
        goToNextYear: () => {
          createNewDate(year + 1, month);
        },
        goToDate: (date: Date) => {
          createNewDate(date.getFullYear(), date.getMonth());
        },
        getCurrentDate: () => {
          return new Date(year, month, 1);
        },
      }),
      [year, month, createNewDate]
    );

    // 날짜 클릭 핸들러
    const handleDateClick = useCallback(
      (cell: CalendarCell) => {
        if (cell.isDisabled || cell.day === 0) return;

        if (mode === 'single') {
          // Single 모드: 기존 로직
          if (onChange) {
            onChange(cell.date);
          }
          
          if (onSelected) {
            onSelected(cell.date);
          }
        } else if (mode === 'range') {
          // Range 모드: 날짜 범위 선택 로직
          if (!range?.startDate || (range.startDate && range.endDate)) {
            // 시작 날짜 선택 또는 범위 리셋
            const newRange = { startDate: cell.date, endDate: undefined };
            if (onRangeChange) {
              onRangeChange(newRange);
            }
          } else if (range.startDate && !range.endDate) {
            // 끝 날짜 선택
            const startDate = range.startDate;
            const endDate = cell.date;
            
            // 날짜 순서 정렬
            const sortedRange = startDate <= endDate 
              ? { startDate, endDate }
              : { startDate: endDate, endDate: startDate };
            
            if (onRangeChange) {
              onRangeChange(sortedRange);
            }
            
            // 호버 상태 초기화
            setHoverDate(undefined);
          }
          
          if (onSelected) {
            onSelected(cell.date);
          }
        }
      },
      [onChange, onSelected, mode, range, onRangeChange]
    );

    // Range 모드에서 호버 핸들러
    const handleCellHover = useCallback(
      (cell: CalendarCell) => {
        if (mode === 'range' && range?.startDate && !range.endDate && !cell.isDisabled && cell.day > 0) {
          setHoverDate(cell.date);
        }
      },
      [mode, range]
    );

    const handleCellLeave = useCallback(() => {
      if (mode === 'range') {
        setHoverDate(undefined);
      }
    }, [mode]);

    const getAriaLabel = (cell: CalendarCell): string => {
      if (cell.day === 0) return '';

      const dateStr = formatDateToString(cell.date);
      const todayStr = cell.isToday ? '(오늘)' : '';
      const selectedStr = cell.isSelected ? '(현재 선택됨)' : '';
      
      // Range 모드에서의 추가 정보
      let rangeStr = '';
      if (mode === 'range') {
        if (cell.isRangeStart) rangeStr += '(범위 시작)';
        if (cell.isRangeEnd) rangeStr += '(범위 끝)';
        if (cell.isInRange && !cell.isRangeStart && !cell.isRangeEnd) rangeStr += '(범위 내)';
      }

      return `${dateStr}${todayStr}${selectedStr}${rangeStr} 선택`;
    };

    return (
      <div className={`${styles.calendar} ${className}`}>
        <table className={styles['calendar-table']}>
          {/* 요일 헤더 */}
          <thead className={styles['calendar-header']}>
            <tr>
              {weekdays.map((day, index) => (
                <th
                  key={day}
                  className={`${styles['calendar-header-cell']} ${
                    index === 0
                      ? styles.sunday
                      : index === 6
                        ? styles.saturday
                        : ''
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* 달력 바디 */}
          <tbody className={styles['calendar-body']}>
            {monthData.map((week, weekIndex) => (
              <tr key={weekIndex} className={styles['calendar-row']}>
                {week.map((cell, dayIndex) => {
                  // 셀 클래스명 생성
                  const cellClasses = [
                    styles['calendar-cell'],
                    cell.isToday && styles.today,
                    cell.isSelected && styles.selected,
                    cell.isDisabled && styles.disabled,
                    cell.isWeekend && styles.weekend,
                    cell.isSunday && styles.sunday,
                    cell.isSaturday && styles.saturday,
                    cell.isCurrentMonth
                      ? styles['current-month']
                      : styles['adjacent-month'],
                    cell.day === 0 && styles.empty, // 빈 셀
                    // Range 기능 관련 클래스
                    cell.isRangeStart && styles['range-start'],
                    cell.isRangeEnd && styles['range-end'],
                    cell.isInRange && styles['in-range'],
                    cell.isRangeHover && styles['range-hover'],
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <td
                      key={`${weekIndex}-${dayIndex}`}
                      className={cellClasses}
                      data-date={formatDateToString(cell.date)}
                      aria-selected={cell.isSelected ? 'true' : undefined}
                      onMouseEnter={() => handleCellHover(cell)}
                      onMouseLeave={handleCellLeave}
                    >
                      <button
                        type="button"
                        className={styles['calendar-cell-btn']}
                        onClick={() => handleDateClick(cell)}
                        disabled={cell.isDisabled || cell.day === 0}
                        aria-label={getAriaLabel(cell)}
                      >
                        {cellRender
                          ? cellRender(cell.date, cell)
                          : cell.day > 0
                            ? cell.day
                            : ''}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export default Calendar;
