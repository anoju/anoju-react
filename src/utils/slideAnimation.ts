// src/utils/slideAnimation.ts
export interface SlideAnimationOptions {
  duration?: number; // 애니메이션 지속시간 (ms)
  easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut'; // 이징 함수
  onComplete?: () => void; // 애니메이션 완료 콜백
}

// 이징 함수들
const easingFunctions = {
  linear: (t: number) => t,
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
};

// 진행 중인 애니메이션 저장소
const activeAnimations = new WeakMap<HTMLElement, number>();

/**
 * 요소의 스타일 값을 가져오기 (숫자만)
 */
function getStyleValue(element: HTMLElement, property: string): number {
  const computed = window.getComputedStyle(element);
  const value = computed.getPropertyValue(property);
  return parseFloat(value) || 0;
}

/**
 * 요소의 모든 애니메이션 관련 스타일 측정
 */
function measureStyles(element: HTMLElement) {
  // 임시로 display: block, height: auto로 설정하여 자연스러운 크기 측정
  const originalDisplay = element.style.display;
  const originalHeight = element.style.height;
  const originalOverflow = element.style.overflow;
  const originalVisibility = element.style.visibility;
  const originalPosition = element.style.position;

  element.style.display = 'block';
  element.style.height = 'auto';
  element.style.overflow = 'visible';
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';

  const styles = {
    height: element.offsetHeight,
    paddingTop: getStyleValue(element, 'padding-top'),
    paddingBottom: getStyleValue(element, 'padding-bottom'),
    marginTop: getStyleValue(element, 'margin-top'),
    marginBottom: getStyleValue(element, 'margin-bottom'),
    borderTopWidth: getStyleValue(element, 'border-top-width'),
    borderBottomWidth: getStyleValue(element, 'border-bottom-width'),
  };

  // 원래 스타일 복원
  element.style.display = originalDisplay;
  element.style.height = originalHeight;
  element.style.overflow = originalOverflow;
  element.style.visibility = originalVisibility;
  element.style.position = originalPosition;

  return styles;
}

/**
 * 현재 요소의 애니메이션 관련 스타일 가져오기
 */
function getCurrentStyles(element: HTMLElement) {
  return {
    height: element.offsetHeight,
    paddingTop: getStyleValue(element, 'padding-top'),
    paddingBottom: getStyleValue(element, 'padding-bottom'),
    marginTop: getStyleValue(element, 'margin-top'),
    marginBottom: getStyleValue(element, 'margin-bottom'),
    borderTopWidth: getStyleValue(element, 'border-top-width'),
    borderBottomWidth: getStyleValue(element, 'border-bottom-width'),
  };
}

/**
 * 스타일 값들을 요소에 적용
 */
function applyStyles(element: HTMLElement, styles: Record<string, number>) {
  element.style.height = `${styles.height}px`;
  element.style.paddingTop = `${styles.paddingTop}px`;
  element.style.paddingBottom = `${styles.paddingBottom}px`;
  element.style.marginTop = `${styles.marginTop}px`;
  element.style.marginBottom = `${styles.marginBottom}px`;
  element.style.borderTopWidth = `${styles.borderTopWidth}px`;
  element.style.borderBottomWidth = `${styles.borderBottomWidth}px`;
  element.style.overflow = 'hidden';
}

/**
 * 애니메이션 관련 스타일 제거 (자연 상태로 복원)
 */
function clearStyles(element: HTMLElement) {
  element.style.height = '';
  element.style.paddingTop = '';
  element.style.paddingBottom = '';
  element.style.marginTop = '';
  element.style.marginBottom = '';
  element.style.borderTopWidth = '';
  element.style.borderBottomWidth = '';
  element.style.overflow = '';
}

/**
 * 두 스타일 객체 사이의 보간된 값 계산
 */
function interpolateStyles(
  startStyles: Record<string, number>,
  endStyles: Record<string, number>,
  progress: number
): Record<string, number> {
  const result: Record<string, number> = {};
  
  for (const key in startStyles) {
    const start = startStyles[key];
    const end = endStyles[key];
    result[key] = start + (end - start) * progress;
  }
  
  return result;
}

/**
 * jQuery slideDown과 같은 애니메이션
 */
export function slideDown(
  element: HTMLElement,
  options: SlideAnimationOptions = {}
): void {
  const { duration = 300, easing = 'easeOut', onComplete } = options;

  // 이미 진행 중인 애니메이션이 있으면 중단
  if (activeAnimations.has(element)) {
    cancelAnimationFrame(activeAnimations.get(element)!);
    activeAnimations.delete(element);
  }

  // 이미 표시중이면 완료 콜백만 호출
  if (element.style.display !== 'none' && element.offsetHeight > 0) {
    onComplete?.();
    return;
  }

  // 초기 상태 설정
  element.style.display = 'block';
  
  // 시작 스타일 (모든 값이 0)
  const startStyles = {
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  };

  // 최종 스타일 측정
  const endStyles = measureStyles(element);

  // 시작 스타일 적용
  applyStyles(element, startStyles);

  const startTime = performance.now();
  const easingFn = easingFunctions[easing];

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);

    // 현재 프레임의 스타일 계산 및 적용
    const currentStyles = interpolateStyles(startStyles, endStyles, easedProgress);
    applyStyles(element, currentStyles);

    if (progress < 1) {
      // 애니메이션 계속
      const animationId = requestAnimationFrame(animate);
      activeAnimations.set(element, animationId);
    } else {
      // 애니메이션 완료
      activeAnimations.delete(element);
      clearStyles(element); // 자연 상태로 복원
      onComplete?.();
    }
  }

  const animationId = requestAnimationFrame(animate);
  activeAnimations.set(element, animationId);
}

/**
 * jQuery slideUp과 같은 애니메이션
 */
export function slideUp(
  element: HTMLElement,
  options: SlideAnimationOptions = {}
): void {
  const { duration = 300, easing = 'easeOut', onComplete } = options;

  // 이미 진행 중인 애니메이션이 있으면 중단
  if (activeAnimations.has(element)) {
    cancelAnimationFrame(activeAnimations.get(element)!);
    activeAnimations.delete(element);
  }

  // 이미 숨겨져있으면 완료 콜백만 호출
  if (element.style.display === 'none' || element.offsetHeight === 0) {
    onComplete?.();
    return;
  }

  // 시작 스타일 (현재 상태)
  const startStyles = getCurrentStyles(element);

  // 최종 스타일 (모든 값이 0)
  const endStyles = {
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  };

  const startTime = performance.now();
  const easingFn = easingFunctions[easing];

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);

    // 현재 프레임의 스타일 계산 및 적용
    const currentStyles = interpolateStyles(startStyles, endStyles, easedProgress);
    applyStyles(element, currentStyles);

    if (progress < 1) {
      // 애니메이션 계속
      const animationId = requestAnimationFrame(animate);
      activeAnimations.set(element, animationId);
    } else {
      // 애니메이션 완료
      activeAnimations.delete(element);
      element.style.display = 'none';
      clearStyles(element); // 스타일 정리
      onComplete?.();
    }
  }

  const animationId = requestAnimationFrame(animate);
  activeAnimations.set(element, animationId);
}

/**
 * jQuery slideToggle과 같은 애니메이션
 */
export function slideToggle(
  element: HTMLElement,
  options: SlideAnimationOptions = {}
): boolean {
  const isVisible = element.style.display !== 'none' && element.offsetHeight > 0;
  
  if (isVisible) {
    slideUp(element, options);
    return false;
  } else {
    slideDown(element, options);
    return true;
  }
}

/**
 * 요소가 현재 보이는 상태인지 확인
 */
export function isVisible(element: HTMLElement): boolean {
  return element.style.display !== 'none' && element.offsetHeight > 0;
}

/**
 * 진행 중인 애니메이션 중단
 */
export function stopSlideAnimation(element: HTMLElement): void {
  if (activeAnimations.has(element)) {
    cancelAnimationFrame(activeAnimations.get(element)!);
    activeAnimations.delete(element);
  }
}
