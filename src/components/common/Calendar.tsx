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
  onViewChange?: (date: Date) => void; // 표시 년월 변경시 콜백
  disabledDate?: (date: Date) => boolean; // 비활성화할 날짜 판별 함수
  showAdjacentMonths?: boolean; // 이전/다음달 날짜 표시 여부
  className?: string;
  cellRender?: (date: Date, info: CalendarCell) => React.ReactNode; // 커스텀 셀 렌더러
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

// 특정 년월의 달력 데이터 생성
const getMonthData = (
  year: number,
  month: number,
  selectedDate?: Date,
  disabledDate?: (date: Date) => boolean,
  showAdjacentMonths = false
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
      });
    } else {
      const cell: CalendarCell = {
        date: currentDate,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday: isToday(currentDate),
        isSelected: selectedDate ? isSameDay(currentDate, selectedDate) : false,
        isDisabled: disabledDate ? disabledDate(currentDate) : false,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isSunday: dayOfWeek === 0,
        isSaturday: dayOfWeek === 6,
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
      onViewChange,
      disabledDate,
      showAdjacentMonths = false,
      className = '',
      cellRender,
    },
    ref
  ) => {
    // 현재 표시할 년월 결정
    const currentDate = value || defaultValue || new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 달력 데이터 생성 (메모이제이션)
    const monthData = useMemo(
      () =>
        getMonthData(
          year,
          month,
          selectedDate,
          disabledDate,
          showAdjacentMonths
        ),
      [year, month, selectedDate, disabledDate, showAdjacentMonths]
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

        if (onChange) {
          onChange(cell.date);
        }
      },
      [onChange]
    );

    // 요일 헤더
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    const getAriaLabel = (cell: CalendarCell): string => {
      if (cell.day === 0) return '';

      const dateStr = formatDateToString(cell.date);
      const todayStr = cell.isToday ? '(오늘)' : '';
      const selectedStr = cell.isSelected ? '(선택됨)' : '';

      return `${dateStr}${todayStr}${selectedStr} 선택`;
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
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <td
                      key={`${weekIndex}-${dayIndex}`}
                      className={cellClasses}
                      data-date={formatDateToString(cell.date)}
                      aria-selected={cell.isSelected ? 'true' : undefined}
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
