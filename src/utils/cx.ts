/**
 * 클래스명을 조합하는 유틸리티 함수
 *
 * @param args 문자열, 조건부 값, 또는 클래스명-불리언 쌍의 객체
 * @returns 공백으로 구분된 클래스명 문자열
 */
type ClassValue =
  | string
  | Record<string, boolean | undefined>
  | null
  | undefined
  | false
  | 0;

export function cx(...args: ClassValue[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return;

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object') {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(' ');
}

export default cx;
