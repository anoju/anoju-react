// src/utils/dateFormat.ts

/**
 * 날짜를 원하는 포맷으로 변환합니다.
 * @param date 변환할 Date 객체
 * @param format 포맷 문자열 (기본값: 'YYYY-MM-DD')
 * @returns 변환된 날짜 문자열
 */
export const formatDate = (
  date: Date | null | undefined,
  format: string = 'YYYY-MM-DD'
): string => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // ko-KR 등 로케일 형식 처리
  if (format === 'ko-KR') {
    return date.toLocaleDateString('ko-KR');
  }

  // 패턴 치환 방식
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
};

/**
 * 문자열을 Date 객체로 변환합니다.
 * @param dateString 날짜 문자열
 * @param format 포맷 문자열 (기본값: 'YYYY-MM-DD')
 * @returns Date 객체 또는 null
 */
export const parseDate = (
  dateString: string,
  format: string = 'YYYY-MM-DD'
): Date | null => {
  if (!dateString) return null;

  try {
    // YYYY-MM-DD 형식 기본 지원
    if (format === 'YYYY-MM-DD') {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        if (year && month && day) {
          return new Date(year, month - 1, day);
        }
      }
    }
    // 추가적인 포맷 파싱 로직이 필요하면 여기에 작성

    return null;
  } catch {
    return null;
  }
};
