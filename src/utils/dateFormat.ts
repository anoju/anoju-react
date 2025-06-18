// src/utils/dateFormat.ts
export const formatDate = (
  date: Date | undefined,
  format: string = 'YYYY-MM-DD'
): string => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY/MM/DD':
      return `${year}/${month}/${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'ko-KR':
      return date.toLocaleDateString('ko-KR');
    default:
      return `${year}-${month}-${day}`;
  }
};
